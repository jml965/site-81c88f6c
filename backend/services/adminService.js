const { PrismaClient } = require('@prisma/client');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/errors');
const adminStats = require('../utils/adminStats');
const { logActivity } = require('../utils/activityLogger');
const { Parser } = require('json2csv');

const prisma = new PrismaClient();

class AdminService {
  async getDashboardStats() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [stats, recentStats] = await Promise.all([
      adminStats.getOverallStats(),
      adminStats.getRecentStats()
    ]);

    return {
      overview: stats,
      recent: recentStats,
      charts: {
        userRegistrations: await adminStats.getUserRegistrationChart(lastMonth),
        auctionActivity: await adminStats.getAuctionActivityChart(lastWeek),
        bidVolume: await adminStats.getBidVolumeChart(lastWeek),
        revenue: await adminStats.getRevenueChart(lastMonth)
      },
      topPerformers: {
        auctions: await adminStats.getTopAuctions(),
        sellers: await adminStats.getTopSellers(),
        bidders: await adminStats.getTopBidders()
      }
    };
  }

  async getAllUsers(filters) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          profile: true,
          _count: {
            select: {
              auctions: true,
              bids: true,
              comments: true,
              reports: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        auctions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: { select: { bids: true } }
          }
        },
        bids: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            auction: { select: { title: true, id: true } }
          }
        },
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            auction: { select: { title: true, id: true } }
          }
        },
        reports: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            auctions: true,
            bids: true,
            comments: true,
            reports: true,
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundError('المستخدم غير موجود');
    }

    // Get user statistics
    const stats = await adminStats.getUserStats(userId);
    
    return { ...user, stats };
  }

  async updateUserStatus(userId, status, reason, adminId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundError('المستخدم غير موجود');
    }

    if (user.status === status) {
      throw new ConflictError('المستخدم يملك نفس الحالة المطلوبة');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        statusUpdatedAt: new Date(),
        statusReason: reason
      },
      include: {
        profile: true
      }
    });

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'update_user_status',
      targetType: 'user',
      targetId: userId,
      details: {
        previousStatus: user.status,
        newStatus: status,
        reason
      }
    });

    // Send notification to user if status changed to suspended or banned
    if (['suspended', 'banned'].includes(status)) {
      await this.createNotification(userId, {
        type: 'account_status',
        title: status === 'suspended' ? 'تم تعليق حسابك' : 'تم حظر حسابك',
        message: reason || `تم ${status === 'suspended' ? 'تعليق' : 'حظر'} حسابك من قبل الإدارة`,
        data: { status, reason }
      });
    }

    return updatedUser;
  }

  async updateUserRole(userId, role, adminId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundError('المستخدم غير موجود');
    }

    if (user.role === role) {
      throw new ConflictError('المستخدم يملك نفس الدور المطلوب');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        roleUpdatedAt: new Date()
      },
      include: {
        profile: true
      }
    });

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'update_user_role',
      targetType: 'user',
      targetId: userId,
      details: {
        previousRole: user.role,
        newRole: role
      }
    });

    return updatedUser;
  }

  async getAllAuctions(filters) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      category,
      seller,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.categoryId = category;
    }

    if (seller) {
      where.sellerId = seller;
    }

    const [auctions, total] = await Promise.all([
      prisma.auction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              nameAr: true
            }
          },
          media: {
            where: { type: 'image' },
            take: 1
          },
          _count: {
            select: {
              bids: true,
              comments: true,
              views: true,
              likes: true
            }
          }
        }
      }),
      prisma.auction.count({ where })
    ]);

    return {
      auctions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateAuctionStatus(auctionId, status, reason, adminId) {
    const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
    
    if (!auction) {
      throw new NotFoundError('المزاد غير موجود');
    }

    if (auction.status === status) {
      throw new ConflictError('المزاد يملك نفس الحالة المطلوبة');
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['approved', 'rejected'],
      'approved': ['suspended'],
      'active': ['suspended', 'cancelled'],
      'suspended': ['approved', 'rejected'],
      'rejected': ['pending'],
      'cancelled': [],
      'completed': []
    };

    if (!validTransitions[auction.status]?.includes(status)) {
      throw new ValidationError(`لا يمكن تغيير حالة المزاد من ${auction.status} إلى ${status}`);
    }

    const updatedAuction = await prisma.auction.update({
      where: { id: auctionId },
      data: {
        status,
        statusUpdatedAt: new Date(),
        statusReason: reason
      },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'update_auction_status',
      targetType: 'auction',
      targetId: auctionId,
      details: {
        previousStatus: auction.status,
        newStatus: status,
        reason
      }
    });

    // Notify seller
    await this.createNotification(auction.sellerId, {
      type: 'auction_status',
      title: `تم تحديث حالة المزاد: ${auction.title}`,
      message: reason || `تم تغيير حالة المزاد إلى ${status}`,
      data: { auctionId, status, reason }
    });

    return updatedAuction;
  }

  async deleteAuction(auctionId, reason, adminId) {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: true
      }
    });
    
    if (!auction) {
      throw new NotFoundError('المزاد غير موجود');
    }

    if (auction.status === 'active' && auction.bids.length > 0) {
      throw new ValidationError('لا يمكن حذف مزاد نشط يحتوي على مزايدات');
    }

    // Soft delete
    await prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: 'deleted',
        deletedAt: new Date(),
        deleteReason: reason
      }
    });

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'delete_auction',
      targetType: 'auction',
      targetId: auctionId,
      details: { reason }
    });

    // Notify seller
    await this.createNotification(auction.sellerId, {
      type: 'auction_deleted',
      title: `تم حذف المزاد: ${auction.title}`,
      message: reason || 'تم حذف المزاد من قبل الإدارة',
      data: { auctionId, reason }
    });
  }

  async getAllBids(filters) {
    const {
      page = 1,
      limit = 10,
      auctionId,
      userId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (auctionId) {
      where.auctionId = auctionId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          auction: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      }),
      prisma.bid.count({ where })
    ]);

    return {
      bids,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async cancelBid(bidId, reason, adminId) {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        auction: true,
        user: true
      }
    });
    
    if (!bid) {
      throw new NotFoundError('المزايدة غير موجودة');
    }

    if (bid.status === 'cancelled') {
      throw new ConflictError('المزايدة ملغية مسبقاً');
    }

    if (bid.auction.status === 'completed') {
      throw new ValidationError('لا يمكن إلغاء مزايدة في مزاد مكتمل');
    }

    const updatedBid = await prisma.bid.update({
      where: { id: bidId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: reason
      }
    });

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'cancel_bid',
      targetType: 'bid',
      targetId: bidId,
      details: { reason, amount: bid.amount }
    });

    // Notify user
    await this.createNotification(bid.userId, {
      type: 'bid_cancelled',
      title: 'تم إلغاء مزايدتك',
      message: `تم إلغاء مزايدتك على "${bid.auction.title}" من قبل الإدارة`,
      data: { bidId, auctionId: bid.auctionId, reason }
    });

    return updatedBid;
  }

  async getAllComments(filters) {
    const {
      page = 1,
      limit = 10,
      auctionId,
      userId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (auctionId) {
      where.auctionId = auctionId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          auction: {
            select: {
              id: true,
              title: true
            }
          },
          _count: {
            select: {
              likes: true,
              reports: true
            }
          }
        }
      }),
      prisma.comment.count({ where })
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateCommentStatus(commentId, status, reason, adminId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: true,
        auction: { select: { title: true } }
      }
    });
    
    if (!comment) {
      throw new NotFoundError('التعليق غير موجود');
    }

    if (comment.status === status) {
      throw new ConflictError('التعليق يملك نفس الحالة المطلوبة');
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        status,
        statusUpdatedAt: new Date(),
        statusReason: reason
      }
    });

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'update_comment_status',
      targetType: 'comment',
      targetId: commentId,
      details: {
        previousStatus: comment.status,
        newStatus: status,
        reason
      }
    });

    // Notify user if comment was hidden or deleted
    if (['hidden', 'deleted'].includes(status)) {
      await this.createNotification(comment.userId, {
        type: 'comment_status',
        title: 'تم تحديث تعليقك',
        message: reason || `تم ${status === 'hidden' ? 'إخفاء' : 'حذف'} تعليقك من قبل الإدارة`,
        data: { commentId, status, reason }
      });
    }

    return updatedComment;
  }

  async getSystemSettings() {
    const settings = await prisma.systemSetting.findMany();
    
    // Convert array to object for easier access
    return settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        type: setting.type,
        updatedAt: setting.updatedAt
      };
      return acc;
    }, {});
  }

  async updateSystemSettings(settings, adminId) {
    const updates = [];
    
    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        prisma.systemSetting.upsert({
          where: { key },
          update: { 
            value: JSON.stringify(value),
            updatedAt: new Date()
          },
          create: {
            key,
            value: JSON.stringify(value),
            type: typeof value
          }
        })
      );
    }

    await Promise.all(updates);

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'update_system_settings',
      targetType: 'system',
      details: { updatedKeys: Object.keys(settings) }
    });

    return this.getSystemSettings();
  }

  async getActivityLogs(filters) {
    const {
      page = 1,
      limit = 10,
      action,
      userId,
      targetType,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (action) {
      where.action = { contains: action, mode: 'insensitive' };
    }

    if (userId) {
      where.userId = userId;
    }

    if (targetType) {
      where.targetType = targetType;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.activityLog.count({ where })
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async bulkUpdateUsers({ userIds, action, status, role, reason, adminId }) {
    const results = { updated: 0, failed: 0, errors: [] };

    for (const userId of userIds) {
      try {
        if (action === 'updateStatus' && status) {
          await this.updateUserStatus(userId, status, reason, adminId);
        } else if (action === 'updateRole' && role) {
          await this.updateUserRole(userId, role, adminId);
        } else if (action === 'delete') {
          await prisma.user.update({
            where: { id: userId },
            data: {
              status: 'deleted',
              deletedAt: new Date(),
              deleteReason: reason
            }
          });
        }
        results.updated++;
      } catch (error) {
        results.failed++;
        results.errors.push({ userId, error: error.message });
      }
    }

    return results;
  }

  async bulkUpdateAuctions({ auctionIds, action, status, reason, adminId }) {
    const results = { updated: 0, failed: 0, errors: [] };

    for (const auctionId of auctionIds) {
      try {
        if (action === 'updateStatus' && status) {
          await this.updateAuctionStatus(auctionId, status, reason, adminId);
        } else if (action === 'delete') {
          await this.deleteAuction(auctionId, reason, adminId);
        }
        results.updated++;
      } catch (error) {
        results.failed++;
        results.errors.push({ auctionId, error: error.message });
      }
    }

    return results;
  }

  async exportUserData(format, filters) {
    const users = await prisma.user.findMany({
      where: this.buildUserFilters(filters),
      include: {
        profile: true,
        _count: {
          select: {
            auctions: true,
            bids: true,
            comments: true
          }
        }
      }
    });

    const data = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt,
      auctionsCount: user._count.auctions,
      bidsCount: user._count.bids,
      commentsCount: user._count.comments
    }));

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    // CSV format
    const fields = [
      'id', 'email', 'firstName', 'lastName', 'phone', 'role', 'status',
      'createdAt', 'lastActiveAt', 'auctionsCount', 'bidsCount', 'commentsCount'
    ];
    const parser = new Parser({ fields });
    return parser.parse(data);
  }

  async exportAuctionData(format, filters) {
    const auctions = await prisma.auction.findMany({
      where: this.buildAuctionFilters(filters),
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        category: {
          select: {
            name: true,
            nameAr: true
          }
        },
        _count: {
          select: {
            bids: true,
            comments: true,
            views: true
          }
        }
      }
    });

    const data = auctions.map(auction => ({
      id: auction.id,
      title: auction.title,
      description: auction.description,
      startingPrice: auction.startingPrice,
      currentPrice: auction.currentPrice,
      status: auction.status,
      startTime: auction.startTime,
      endTime: auction.endTime,
      sellerName: `${auction.seller.firstName} ${auction.seller.lastName}`,
      sellerEmail: auction.seller.email,
      categoryName: auction.category?.nameAr || auction.category?.name,
      bidsCount: auction._count.bids,
      commentsCount: auction._count.comments,
      viewsCount: auction._count.views,
      createdAt: auction.createdAt
    }));

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    // CSV format
    const fields = [
      'id', 'title', 'startingPrice', 'currentPrice', 'status', 'startTime', 'endTime',
      'sellerName', 'sellerEmail', 'categoryName', 'bidsCount', 'commentsCount', 'viewsCount', 'createdAt'
    ];
    const parser = new Parser({ fields });
    return parser.parse(data);
  }

  buildUserFilters(filters) {
    const where = {};
    if (filters.role) where.role = filters.role;
    if (filters.status) where.status = filters.status;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }
    return where;
  }

  buildAuctionFilters(filters) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.category) where.categoryId = filters.category;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }
    return where;
  }

  async createNotification(userId, notification) {
    return prisma.notification.create({
      data: {
        userId,
        ...notification,
        data: JSON.stringify(notification.data || {})
      }
    });
  }
}

module.exports = new AdminService();