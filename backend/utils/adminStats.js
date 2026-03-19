const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AdminStats {
  // Overall platform statistics
  async getOverallStats() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [counts, recentCounts] = await Promise.all([
      this.getCounts(),
      this.getRecentCounts(yesterday)
    ]);

    // Calculate growth rates
    const previousCounts = await this.getCountsBeforeDate(yesterday);
    
    return {
      ...counts,
      growth: {
        users: this.calculateGrowthRate(counts.users, previousCounts.users),
        auctions: this.calculateGrowthRate(counts.auctions, previousCounts.auctions),
        bids: this.calculateGrowthRate(counts.bids, previousCounts.bids),
        revenue: this.calculateGrowthRate(counts.revenue, previousCounts.revenue)
      },
      recent: recentCounts
    };
  }

  async getCounts() {
    const [users, auctions, bids, comments, reports, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.auction.count(),
      prisma.bid.count(),
      prisma.comment.count(),
      prisma.report.count(),
      this.getTotalRevenue()
    ]);

    return {
      users,
      auctions,
      bids,
      comments,
      reports,
      revenue
    };
  }

  async getRecentCounts(since) {
    const [users, auctions, bids, comments, reports] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: since } } }),
      prisma.auction.count({ where: { createdAt: { gte: since } } }),
      prisma.bid.count({ where: { createdAt: { gte: since } } }),
      prisma.comment.count({ where: { createdAt: { gte: since } } }),
      prisma.report.count({ where: { createdAt: { gte: since } } })
    ]);

    return {
      users,
      auctions,
      bids,
      comments,
      reports
    };
  }

  async getCountsBeforeDate(date) {
    const [users, auctions, bids, revenue] = await Promise.all([
      prisma.user.count({ where: { createdAt: { lt: date } } }),
      prisma.auction.count({ where: { createdAt: { lt: date } } }),
      prisma.bid.count({ where: { createdAt: { lt: date } } }),
      this.getTotalRevenue(date)
    ]);

    return {
      users,
      auctions,
      bids,
      revenue
    };
  }

  // Recent activity statistics
  async getRecentStats() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [activeUsers, activeAuctions, recentBids, pendingReports] = await Promise.all([
      this.getActiveUsers(last24Hours),
      this.getActiveAuctions(),
      prisma.bid.count({ where: { createdAt: { gte: last24Hours } } }),
      prisma.report.count({ where: { status: 'pending' } })
    ]);

    return {
      activeUsers,
      activeAuctions,
      recentBids,
      pendingReports,
      systemHealth: await this.getSystemHealth()
    };
  }

  // Chart data generators
  async getUserRegistrationChart(since) {
    const registrations = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: since }
      },
      _count: true
    });

    // Group by day
    const chartData = this.groupByDay(registrations, since, '_count');
    
    return {
      labels: chartData.map(item => item.date),
      data: chartData.map(item => item.value)
    };
  }

  async getAuctionActivityChart(since) {
    const [created, completed] = await Promise.all([
      prisma.auction.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: since } },
        _count: true
      }),
      prisma.auction.groupBy({
        by: ['endTime'],
        where: {
          status: 'completed',
          endTime: { gte: since }
        },
        _count: true
      })
    ]);

    const createdData = this.groupByDay(created, since, '_count');
    const completedData = this.groupByDay(completed, since, '_count');

    return {
      labels: createdData.map(item => item.date),
      datasets: [
        {
          label: 'مزادات جديدة',
          data: createdData.map(item => item.value)
        },
        {
          label: 'مزادات مكتملة',
          data: completedData.map(item => item.value)
        }
      ]
    };
  }

  async getBidVolumeChart(since) {
    const bids = await prisma.bid.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: since },
        status: 'active'
      },
      _count: true,
      _sum: {
        amount: true
      }
    });

    const chartData = this.groupByDay(bids, since, '_count', '_sum.amount');
    
    return {
      labels: chartData.map(item => item.date),
      datasets: [
        {
          label: 'عدد المزايدات',
          data: chartData.map(item => item.count)
        },
        {
          label: 'قيمة المزايدات',
          data: chartData.map(item => item.sum)
        }
      ]
    };
  }

  async getRevenueChart(since) {
    // This would typically come from a transactions or orders table
    // For now, we'll estimate based on completed auctions
    const completedAuctions = await prisma.auction.findMany({
      where: {
        status: 'completed',
        endTime: { gte: since },
        currentPrice: { gt: 0 }
      },
      select: {
        endTime: true,
        currentPrice: true
      }
    });

    // Assume 5% commission rate
    const revenueData = completedAuctions.map(auction => ({
      createdAt: auction.endTime,
      revenue: auction.currentPrice * 0.05
    }));

    const chartData = this.groupByDay(revenueData, since, 'revenue');
    
    return {
      labels: chartData.map(item => item.date),
      data: chartData.map(item => item.value)
    };
  }

  // Top performers
  async getTopAuctions(limit = 10) {
    return await prisma.auction.findMany({
      take: limit,
      orderBy: [
        { currentPrice: 'desc' },
        { views: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        currentPrice: true,
        startingPrice: true,
        status: true,
        seller: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            bids: true,
            views: true,
            likes: true
          }
        }
      }
    });
  }

  async getTopSellers(limit = 10) {
    const sellers = await prisma.user.findMany({
      where: {
        role: { in: ['seller'] },
        auctions: {
          some: {}
        }
      },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        auctions: {
          select: {
            currentPrice: true,
            status: true
          }
        },
        _count: {
          select: {
            auctions: true
          }
        }
      }
    });

    return sellers.map(seller => {
      const totalRevenue = seller.auctions
        .filter(auction => auction.status === 'completed')
        .reduce((sum, auction) => sum + (auction.currentPrice || 0), 0);
      
      const activeAuctions = seller.auctions.filter(auction => auction.status === 'active').length;
      const completedAuctions = seller.auctions.filter(auction => auction.status === 'completed').length;
      
      return {
        id: seller.id,
        name: `${seller.firstName} ${seller.lastName}`,
        email: seller.email,
        totalAuctions: seller._count.auctions,
        activeAuctions,
        completedAuctions,
        totalRevenue
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getTopBidders(limit = 10) {
    const bidders = await prisma.user.findMany({
      where: {
        bids: {
          some: {
            status: 'active'
          }
        }
      },
      take: limit * 2, // Get more to filter and sort
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bids: {
          where: {
            status: 'active'
          },
          select: {
            amount: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            bids: true
          }
        }
      }
    });

    return bidders.map(bidder => {
      const totalBidAmount = bidder.bids.reduce((sum, bid) => sum + bid.amount, 0);
      const averageBid = bidder.bids.length > 0 ? totalBidAmount / bidder.bids.length : 0;
      const recentBids = bidder.bids.filter(bid => 
        bid.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      
      return {
        id: bidder.id,
        name: `${bidder.firstName} ${bidder.lastName}`,
        email: bidder.email,
        totalBids: bidder._count.bids,
        activeBids: bidder.bids.length,
        totalBidAmount,
        averageBid,
        recentBids
      };
    })
    .sort((a, b) => b.totalBidAmount - a.totalBidAmount)
    .slice(0, limit);
  }

  // User-specific statistics
  async getUserStats(userId) {
    const [auctions, bids, comments, reports, followers] = await Promise.all([
      prisma.auction.count({ where: { sellerId: userId } }),
      prisma.bid.count({ where: { userId } }),
      prisma.comment.count({ where: { userId } }),
      prisma.report.count({ where: { reportedBy: userId } }),
      prisma.follow.count({ where: { followedId: userId } })
    ]);

    const [auctionStats, bidStats] = await Promise.all([
      this.getUserAuctionStats(userId),
      this.getUserBidStats(userId)
    ]);

    return {
      counts: {
        auctions,
        bids,
        comments,
        reports,
        followers
      },
      auctions: auctionStats,
      bidding: bidStats
    };
  }

  async getUserAuctionStats(userId) {
    const auctions = await prisma.auction.findMany({
      where: { sellerId: userId },
      select: {
        status: true,
        currentPrice: true,
        startingPrice: true
      }
    });

    const statusCounts = auctions.reduce((acc, auction) => {
      acc[auction.status] = (acc[auction.status] || 0) + 1;
      return acc;
    }, {});

    const totalRevenue = auctions
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.currentPrice || 0), 0);

    const averagePrice = auctions.length > 0 
      ? auctions.reduce((sum, a) => sum + (a.currentPrice || a.startingPrice), 0) / auctions.length 
      : 0;

    return {
      byStatus: statusCounts,
      totalRevenue,
      averagePrice,
      total: auctions.length
    };
  }

  async getUserBidStats(userId) {
    const bids = await prisma.bid.findMany({
      where: { userId },
      select: {
        amount: true,
        status: true,
        auction: {
          select: {
            status: true,
            currentPrice: true
          }
        }
      }
    });

    const statusCounts = bids.reduce((acc, bid) => {
      acc[bid.status] = (acc[bid.status] || 0) + 1;
      return acc;
    }, {});

    const totalBidAmount = bids.reduce((sum, bid) => sum + bid.amount, 0);
    const averageBid = bids.length > 0 ? totalBidAmount / bids.length : 0;
    
    const winningBids = bids.filter(bid => 
      bid.auction.status === 'completed' && bid.status === 'winning'
    ).length;

    return {
      byStatus: statusCounts,
      totalAmount: totalBidAmount,
      averageAmount: averageBid,
      wins: winningBids,
      total: bids.length
    };
  }

  // System health metrics
  async getSystemHealth() {
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const [recentActivity, errorReports, activeAuctions, pendingReports] = await Promise.all([
      this.getRecentActivity(last5Minutes),
      this.getErrorReports(lastHour),
      this.getActiveAuctions(),
      prisma.report.count({ where: { status: 'pending' } })
    ]);

    return {
      status: this.determineSystemStatus(recentActivity, errorReports, pendingReports),
      metrics: {
        recentActivity,
        errors: errorReports,
        activeAuctions,
        pendingReports
      }
    };
  }

  // Helper methods
  async getActiveUsers(since) {
    return await prisma.user.count({
      where: {
        lastActiveAt: { gte: since }
      }
    });
  }

  async getActiveAuctions() {
    return await prisma.auction.count({
      where: {
        status: 'active',
        endTime: { gt: new Date() }
      }
    });
  }

  async getTotalRevenue(before = null) {
    const where = {
      status: 'completed',
      currentPrice: { gt: 0 }
    };

    if (before) {
      where.endTime = { lt: before };
    }

    const result = await prisma.auction.aggregate({
      where,
      _sum: {
        currentPrice: true
      }
    });

    // Assume 5% commission rate
    return (result._sum.currentPrice || 0) * 0.05;
  }

  async getRecentActivity(since) {
    const [bids, comments, registrations] = await Promise.all([
      prisma.bid.count({ where: { createdAt: { gte: since } } }),
      prisma.comment.count({ where: { createdAt: { gte: since } } }),
      prisma.user.count({ where: { createdAt: { gte: since } } })
    ]);

    return bids + comments + registrations;
  }

  async getErrorReports(since) {
    // This would typically come from error logging
    // For now, return critical reports as proxy for system errors
    return await prisma.report.count({
      where: {
        priority: 'urgent',
        createdAt: { gte: since }
      }
    });
  }

  calculateGrowthRate(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  determineSystemStatus(activity, errors, pendingReports) {
    if (errors > 5) return 'critical';
    if (errors > 2 || pendingReports > 20) return 'warning';
    if (activity > 10) return 'excellent';
    return 'good';
  }

  groupByDay(data, since, countField, sumField = null) {
    const days = Math.ceil((new Date() - since) / (1000 * 60 * 60 * 24));
    const result = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = data.filter(item => {
        const itemDate = new Date(item.createdAt || item.endTime);
        return itemDate.toISOString().split('T')[0] === dateStr;
      });

      const value = dayData.reduce((sum, item) => {
        if (typeof countField === 'string' && countField.includes('.')) {
          const keys = countField.split('.');
          let val = item;
          for (const key of keys) {
            val = val?.[key];
          }
          return sum + (val || 0);
        }
        return sum + (item[countField] || 0);
      }, 0);

      const resultItem = {
        date: dateStr,
        value
      };

      if (sumField) {
        const sumValue = dayData.reduce((sum, item) => {
          if (sumField.includes('.')) {
            const keys = sumField.split('.');
            let val = item;
            for (const key of keys) {
              val = val?.[key];
            }
            return sum + (val || 0);
          }
          return sum + (item[sumField] || 0);
        }, 0);
        
        resultItem.count = value;
        resultItem.sum = sumValue;
      }

      result.push(resultItem);
    }

    return result;
  }

  // Category and location statistics
  async getCategoryStats() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: {
            auctions: true
          }
        }
      },
      orderBy: {
        auctions: {
          _count: 'desc'
        }
      }
    });
  }

  async getLocationStats() {
    const locationData = await prisma.profile.groupBy({
      by: ['city'],
      _count: true,
      where: {
        city: {
          not: null
        }
      },
      orderBy: {
        _count: {
          city: 'desc'
        }
      },
      take: 10
    });

    return locationData.map(item => ({
      city: item.city,
      users: item._count
    }));
  }

  // Platform performance metrics
  async getPerformanceMetrics() {
    const now = new Date();
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const [conversion, engagement, retention] = await Promise.all([
      this.getConversionRate(lastMonth),
      this.getEngagementRate(lastMonth),
      this.getRetentionRate(lastMonth)
    ]);

    return {
      conversion,
      engagement,
      retention
    };
  }

  async getConversionRate(since) {
    const [visitors, bidders] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: since } } }),
      prisma.user.count({
        where: {
          createdAt: { gte: since },
          bids: {
            some: {}
          }
        }
      })
    ]);

    return visitors > 0 ? Math.round((bidders / visitors) * 100) : 0;
  }

  async getEngagementRate(since) {
    const [totalUsers, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          OR: [
            { bids: { some: { createdAt: { gte: since } } } },
            { comments: { some: { createdAt: { gte: since } } } },
            { auctions: { some: { createdAt: { gte: since } } } }
          ]
        }
      })
    ]);

    return totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  }

  async getRetentionRate(since) {
    const newUsers = await prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { id: true }
    });

    if (newUsers.length === 0) return 0;

    const activeNewUsers = await prisma.user.count({
      where: {
        id: { in: newUsers.map(u => u.id) },
        lastActiveAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    });

    return Math.round((activeNewUsers / newUsers.length) * 100);
  }
}

module.exports = new AdminStats();