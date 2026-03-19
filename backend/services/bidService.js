const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculateNextMinimumBid, calculateBidIncrement } = require('../utils/priceCalculator');
const notificationService = require('./notificationService');

/**
 * Create new bid
 */
const createBid = async ({ userId, auctionId, amount }) => {
  try {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      // Get auction with lock
      const auction = await tx.auction.findFirst({
        where: { id: auctionId },
        include: {
          seller: { select: { id: true, username: true } },
          bids: {
            orderBy: { amount: 'desc' },
            take: 1,
            include: { user: { select: { id: true, username: true } } }
          }
        }
      });

      if (!auction) {
        return { success: false, message: 'المزاد غير موجود' };
      }

      // Check if auction is active
      const now = new Date();
      if (auction.status !== 'ACTIVE') {
        return { success: false, message: 'المزاد غير نشط' };
      }

      if (now < new Date(auction.startTime)) {
        return { success: false, message: 'لم يبدأ المزاد بعد' };
      }

      if (now > new Date(auction.endTime)) {
        return { success: false, message: 'انتهى وقت المزاد' };
      }

      // Check if user is the seller
      if (auction.sellerId === userId) {
        return { success: false, message: 'لا يمكن للبائع المشاركة في مزاده' };
      }

      // Calculate minimum bid required
      const currentHighestBid = auction.bids[0];
      const minimumBid = calculateNextMinimumBid({
        currentPrice: auction.currentPrice || auction.startingPrice,
        minimumIncrement: auction.minimumIncrement,
        currentHighestBid: currentHighestBid?.amount || 0
      });

      if (amount < minimumBid) {
        return {
          success: false,
          message: `الحد الأدنى للمزايدة هو ${minimumBid} ريال`
        };
      }

      // Check if user already has the highest bid
      if (currentHighestBid && currentHighestBid.userId === userId) {
        return { success: false, message: 'لديك أعلى مزايدة حالياً' };
      }

      // Create the bid
      const bid = await tx.bid.create({
        data: {
          userId,
          auctionId,
          amount,
          timestamp: new Date(),
          isActive: true
        },
        include: {
          user: {
            select: { id: true, username: true, avatar: true }
          }
        }
      });

      // Update auction current price and bid count
      const updatedAuction = await tx.auction.update({
        where: { id: auctionId },
        data: {
          currentPrice: amount,
          bidCount: { increment: 1 },
          lastBidTime: new Date()
        },
        include: {
          seller: { select: { id: true, username: true } },
          bids: {
            orderBy: { amount: 'desc' },
            take: 5,
            include: { user: { select: { id: true, username: true, avatar: true } } }
          }
        }
      });

      // Create bid timeline event
      await tx.bidTimelineEvent.create({
        data: {
          auctionId,
          bidId: bid.id,
          userId,
          amount,
          timestamp: new Date(),
          eventType: 'BID_PLACED'
        }
      });

      // Send notifications to outbid users
      if (currentHighestBid && currentHighestBid.userId !== userId) {
        await notificationService.createNotification({
          userId: currentHighestBid.userId,
          type: 'BID_OUTBID',
          title: 'تم تجاوز مزايدتك',
          message: `تم تجاوز مزايدتك في مزاد "${auction.title}"`,
          data: {
            auctionId: auction.id,
            oldBidAmount: currentHighestBid.amount,
            newBidAmount: amount
          }
        });
      }

      // Send notification to seller
      await notificationService.createNotification({
        userId: auction.sellerId,
        type: 'NEW_BID',
        title: 'مزايدة جديدة',
        message: `مزايدة جديدة بقيمة ${amount} ريال في مزاد "${auction.title}"`,
        data: {
          auctionId: auction.id,
          bidAmount: amount,
          bidderUsername: bid.user.username
        }
      });

      return {
        success: true,
        bid,
        auction: updatedAuction
      };
    });
  } catch (error) {
    console.error('Error creating bid:', error);
    throw error;
  }
};

/**
 * Get bids for auction
 */
const getAuctionBids = async ({ auctionId, page = 1, limit = 20, sort = 'desc' }) => {
  try {
    const skip = (page - 1) * limit;
    const orderBy = sort === 'asc' ? { amount: 'asc' } : { amount: 'desc' };

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where: {
          auctionId,
          isActive: true
        },
        include: {
          user: {
            select: { id: true, username: true, avatar: true }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.bid.count({
        where: {
          auctionId,
          isActive: true
        }
      })
    ]);

    return {
      bids,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching auction bids:', error);
    throw error;
  }
};

/**
 * Get user bids
 */
const getUserBids = async ({ userId, page = 1, limit = 20, status = 'all' }) => {
  try {
    const skip = (page - 1) * limit;
    let whereClause = { userId, isActive: true };

    if (status === 'winning') {
      // Get bids where user has highest bid in active auctions
      const winningBids = await prisma.$queryRaw`
        SELECT DISTINCT ON (b.auction_id) b.*
        FROM bids b
        JOIN auctions a ON b.auction_id = a.id
        WHERE b.user_id = ${userId}
          AND b.is_active = true
          AND a.status = 'ACTIVE'
        ORDER BY b.auction_id, b.amount DESC
      `;
      
      const winningBidIds = winningBids.map(bid => bid.id);
      whereClause = {
        id: { in: winningBidIds },
        isActive: true
      };
    } else if (status === 'lost') {
      whereClause = {
        userId,
        isActive: true,
        auction: {
          status: 'COMPLETED',
          winnerId: { not: userId }
        }
      };
    }

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where: whereClause,
        include: {
          auction: {
            select: {
              id: true,
              title: true,
              currentPrice: true,
              status: true,
              endTime: true,
              winnerId: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit
      }),
      prisma.bid.count({
        where: whereClause
      })
    ]);

    return {
      bids,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching user bids:', error);
    throw error;
  }
};

/**
 * Get bid statistics
 */
const getBidStatistics = async (auctionId) => {
  try {
    const stats = await prisma.bid.groupBy({
      by: ['auctionId'],
      where: {
        auctionId,
        isActive: true
      },
      _count: true,
      _avg: { amount: true },
      _min: { amount: true },
      _max: { amount: true }
    });

    if (!stats.length) {
      return {
        totalBids: 0,
        averageBid: 0,
        minimumBid: 0,
        maximumBid: 0,
        uniqueBidders: 0
      };
    }

    const uniqueBidders = await prisma.bid.groupBy({
      by: ['userId'],
      where: {
        auctionId,
        isActive: true
      }
    });

    return {
      totalBids: stats[0]._count,
      averageBid: parseFloat(stats[0]._avg.amount || 0),
      minimumBid: parseFloat(stats[0]._min.amount || 0),
      maximumBid: parseFloat(stats[0]._max.amount || 0),
      uniqueBidders: uniqueBidders.length
    };
  } catch (error) {
    console.error('Error fetching bid statistics:', error);
    throw error;
  }
};

/**
 * Get auction current state
 */
const getAuctionCurrentState = async (auctionId) => {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
          include: {
            user: { select: { id: true, username: true, avatar: true } }
          }
        },
        _count: {
          select: { bids: true }
        }
      }
    });

    if (!auction) {
      return null;
    }

    const now = new Date();
    const timeRemaining = auction.endTime > now ? auction.endTime - now : 0;
    const timeElapsed = now - auction.startTime;
    const totalDuration = auction.endTime - auction.startTime;
    const progress = Math.max(0, Math.min(100, (timeElapsed / totalDuration) * 100));

    return {
      auctionId: auction.id,
      currentPrice: auction.currentPrice || auction.startingPrice,
      highestBid: auction.bids[0] || null,
      bidCount: auction._count.bids,
      timeRemaining,
      progress,
      status: auction.status,
      minimumNextBid: calculateNextMinimumBid({
        currentPrice: auction.currentPrice || auction.startingPrice,
        minimumIncrement: auction.minimumIncrement,
        currentHighestBid: auction.bids[0]?.amount || 0
      })
    };
  } catch (error) {
    console.error('Error fetching auction current state:', error);
    throw error;
  }
};

/**
 * Cancel bid (admin function)
 */
const cancelBid = async ({ bidId, adminId, reason }) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Get bid details
      const bid = await tx.bid.findUnique({
        where: { id: bidId },
        include: {
          auction: true,
          user: { select: { id: true, username: true } }
        }
      });

      if (!bid) {
        return { success: false, message: 'المزايدة غير موجودة' };
      }

      if (!bid.isActive) {
        return { success: false, message: 'المزايدة ملغية مسبقاً' };
      }

      // Cancel the bid
      await tx.bid.update({
        where: { id: bidId },
        data: {
          isActive: false,
          cancelledAt: new Date(),
          cancelledBy: adminId,
          cancellationReason: reason
        }
      });

      // Find new highest bid
      const newHighestBid = await tx.bid.findFirst({
        where: {
          auctionId: bid.auctionId,
          isActive: true
        },
        orderBy: { amount: 'desc' }
      });

      const newCurrentPrice = newHighestBid ? newHighestBid.amount : bid.auction.startingPrice;

      // Update auction current price
      await tx.auction.update({
        where: { id: bid.auctionId },
        data: {
          currentPrice: newCurrentPrice,
          bidCount: { decrement: 1 }
        }
      });

      // Create timeline event
      await tx.bidTimelineEvent.create({
        data: {
          auctionId: bid.auctionId,
          bidId: bid.id,
          userId: bid.userId,
          amount: bid.amount,
          timestamp: new Date(),
          eventType: 'BID_CANCELLED'
        }
      });

      // Notify user about cancellation
      await notificationService.createNotification({
        userId: bid.userId,
        type: 'BID_CANCELLED',
        title: 'تم إلغاء مزايدتك',
        message: `تم إلغاء مزايدتك في مزاد "${bid.auction.title}"`,
        data: {
          auctionId: bid.auctionId,
          bidAmount: bid.amount,
          reason
        }
      });

      return {
        success: true,
        bid,
        newCurrentPrice
      };
    });
  } catch (error) {
    console.error('Error cancelling bid:', error);
    throw error;
  }
};

/**
 * Get highest bidders
 */
const getHighestBidders = async ({ auctionId, limit = 10 }) => {
  try {
    const bidders = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.username,
        u.avatar,
        MAX(b.amount) as highest_bid,
        COUNT(b.id) as bid_count,
        MAX(b.timestamp) as last_bid_time
      FROM users u
      JOIN bids b ON u.id = b.user_id
      WHERE b.auction_id = ${auctionId} AND b.is_active = true
      GROUP BY u.id, u.username, u.avatar
      ORDER BY MAX(b.amount) DESC
      LIMIT ${limit}
    `;

    return bidders.map(bidder => ({
      ...bidder,
      highest_bid: parseFloat(bidder.highest_bid),
      bid_count: parseInt(bidder.bid_count)
    }));
  } catch (error) {
    console.error('Error fetching highest bidders:', error);
    throw error;
  }
};

/**
 * Get bid timeline for synchronization
 */
const getBidTimeline = async ({ auctionId, startTime = null, endTime = null }) => {
  try {
    let whereClause = {
      auctionId,
      eventType: 'BID_PLACED'
    };

    if (startTime || endTime) {
      whereClause.timestamp = {};
      if (startTime) whereClause.timestamp.gte = startTime;
      if (endTime) whereClause.timestamp.lte = endTime;
    }

    const events = await prisma.bidTimelineEvent.findMany({
      where: whereClause,
      include: {
        bid: {
          include: {
            user: { select: { id: true, username: true, avatar: true } }
          }
        }
      },
      orderBy: { timestamp: 'asc' }
    });

    return events.map(event => ({
      id: event.id,
      timestamp: event.timestamp,
      amount: event.amount,
      user: event.bid.user,
      eventType: event.eventType
    }));
  } catch (error) {
    console.error('Error fetching bid timeline:', error);
    throw error;
  }
};

module.exports = {
  createBid,
  getAuctionBids,
  getUserBids,
  getBidStatistics,
  getAuctionCurrentState,
  cancelBid,
  getHighestBidders,
  getBidTimeline
};