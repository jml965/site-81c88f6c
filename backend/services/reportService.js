const { PrismaClient } = require('@prisma/client');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/errors');
const { logActivity } = require('../utils/activityLogger');
const { sendNotification } = require('../utils/notifications');

const prisma = new PrismaClient();

class ReportService {
  async createReport({ userId, type, targetId, reason, description, priority = 'medium' }) {
    // Validate target exists
    await this.validateTarget(type, targetId);

    // Check if user already reported this target
    const existingReport = await prisma.report.findFirst({
      where: {
        reportedBy: userId,
        targetType: type,
        targetId,
        status: { in: ['pending', 'in_review'] }
      }
    });

    if (existingReport) {
      throw new ConflictError('لقد قمت بالإبلاغ عن هذا العنصر مسبقاً');
    }

    const report = await prisma.report.create({
      data: {
        reportedBy: userId,
        targetType: type,
        targetId,
        reason,
        description,
        priority,
        status: 'pending'
      },
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Log activity
    await logActivity({
      userId,
      action: 'create_report',
      targetType: 'report',
      targetId: report.id,
      details: { type, targetId, reason }
    });

    // Notify admins about new report
    await this.notifyAdminsOfNewReport(report);

    return report;
  }

  async getAllReports(filters) {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      priority,
      assignedTo,
      reportedBy,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (type) {
      where.targetType = type;
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    if (reportedBy) {
      where.reportedBy = reportedBy;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          assignedAdmin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              actions: true
            }
          }
        }
      }),
      prisma.report.count({ where })
    ]);

    // Enrich reports with target details
    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        const targetDetails = await this.getTargetDetails(report.targetType, report.targetId);
        return {
          ...report,
          target: targetDetails
        };
      })
    );

    return {
      reports: enrichedReports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getReportById(reportId) {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profile: {
              select: {
                avatar: true
              }
            }
          }
        },
        assignedAdmin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        actions: {
          orderBy: { createdAt: 'desc' },
          include: {
            admin: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!report) {
      throw new NotFoundError('البلاغ غير موجود');
    }

    // Get target details
    const targetDetails = await this.getTargetDetails(report.targetType, report.targetId);
    
    // Get similar reports
    const similarReports = await this.getSimilarReports(report.targetType, report.targetId, reportId);

    return {
      ...report,
      target: targetDetails,
      similarReports
    };
  }

  async updateReportStatus(reportId, status, resolution, notes, adminId) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    
    if (!report) {
      throw new NotFoundError('البلاغ غير موجود');
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['in_review', 'resolved', 'rejected'],
      'in_review': ['resolved', 'rejected', 'pending'],
      'resolved': [],
      'rejected': ['pending', 'in_review']
    };

    if (!validTransitions[report.status]?.includes(status)) {
      throw new ValidationError(`لا يمكن تغيير حالة البلاغ من ${report.status} إلى ${status}`);
    }

    const updatedReport = await prisma.$transaction(async (tx) => {
      // Update report status
      const updated = await tx.report.update({
        where: { id: reportId },
        data: {
          status,
          resolution,
          resolvedAt: status === 'resolved' ? new Date() : null,
          resolvedBy: ['resolved', 'rejected'].includes(status) ? adminId : null
        }
      });

      // Create report action
      await tx.reportAction.create({
        data: {
          reportId,
          adminId,
          action: `status_changed_to_${status}`,
          notes,
          details: JSON.stringify({ previousStatus: report.status, newStatus: status })
        }
      });

      return updated;
    });

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'update_report_status',
      targetType: 'report',
      targetId: reportId,
      details: {
        previousStatus: report.status,
        newStatus: status,
        resolution
      }
    });

    // Notify reporter about status change
    if (['resolved', 'rejected'].includes(status)) {
      await this.notifyReporterOfResolution(report.reportedBy, reportId, status, resolution);
    }

    // Auto-moderate target if report is resolved with action
    if (status === 'resolved' && resolution) {
      await this.applyModerationAction(report.targetType, report.targetId, resolution, adminId);
    }

    return updatedReport;
  }

  async assignReport(reportId, adminId, assignedBy) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    
    if (!report) {
      throw new NotFoundError('البلاغ غير موجود');
    }

    // Validate admin exists and has appropriate role
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { id: true, role: true, firstName: true, lastName: true }
    });

    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      throw new ValidationError('المستخدم المحدد ليس مشرفاً');
    }

    const updatedReport = await prisma.$transaction(async (tx) => {
      // Update report assignment
      const updated = await tx.report.update({
        where: { id: reportId },
        data: {
          assignedTo: adminId,
          assignedAt: new Date(),
          status: report.status === 'pending' ? 'in_review' : report.status
        }
      });

      // Create report action
      await tx.reportAction.create({
        data: {
          reportId,
          adminId: assignedBy,
          action: 'assigned',
          notes: `تم تكليف ${admin.firstName} ${admin.lastName}`,
          details: JSON.stringify({ assignedTo: adminId, assignedToName: `${admin.firstName} ${admin.lastName}` })
        }
      });

      return updated;
    });

    // Log activity
    await logActivity({
      userId: assignedBy,
      action: 'assign_report',
      targetType: 'report',
      targetId: reportId,
      details: { assignedTo: adminId }
    });

    // Notify assigned admin
    await sendNotification(adminId, {
      type: 'report_assigned',
      title: 'تم تكليفك ببلاغ جديد',
      message: `تم تكليفك بمراجعة بلاغ حول ${this.getTargetTypeArabic(report.targetType)}`,
      data: { reportId, targetType: report.targetType }
    });

    return updatedReport;
  }

  async getReportStats(adminId = null) {
    const where = adminId ? { assignedTo: adminId } : {};

    const [totalReports, statusStats, typeStats, priorityStats, recentReports] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.groupBy({
        by: ['status'],
        where,
        _count: true
      }),
      prisma.report.groupBy({
        by: ['targetType'],
        where,
        _count: true
      }),
      prisma.report.groupBy({
        by: ['priority'],
        where,
        _count: true
      }),
      prisma.report.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ]);

    return {
      total: totalReports,
      recent: recentReports,
      byStatus: statusStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {}),
      byType: typeStats.reduce((acc, stat) => {
        acc[stat.targetType] = stat._count;
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc, stat) => {
        acc[stat.priority] = stat._count;
        return acc;
      }, {})
    };
  }

  async getUserReports(userId, filters = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where = { reportedBy: userId };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.targetType = type;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          targetType: true,
          targetId: true,
          reason: true,
          status: true,
          priority: true,
          resolution: true,
          createdAt: true,
          resolvedAt: true
        }
      }),
      prisma.report.count({ where })
    ]);

    // Enrich with target details
    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        const targetDetails = await this.getTargetDetails(report.targetType, report.targetId);
        return {
          ...report,
          target: targetDetails
        };
      })
    );

    return {
      reports: enrichedReports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async validateTarget(type, targetId) {
    let exists = false;

    switch (type) {
      case 'auction':
        exists = await prisma.auction.findUnique({ where: { id: targetId } });
        break;
      case 'comment':
        exists = await prisma.comment.findUnique({ where: { id: targetId } });
        break;
      case 'user':
        exists = await prisma.user.findUnique({ where: { id: targetId } });
        break;
      case 'message':
        exists = await prisma.message.findUnique({ where: { id: targetId } });
        break;
      default:
        throw new ValidationError('نوع التبليغ غير صالح');
    }

    if (!exists) {
      throw new NotFoundError('العنصر المبلغ عنه غير موجود');
    }

    return true;
  }

  async getTargetDetails(type, targetId) {
    try {
      switch (type) {
        case 'auction':
          return await prisma.auction.findUnique({
            where: { id: targetId },
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              seller: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              },
              media: {
                where: { type: 'image' },
                take: 1,
                select: { url: true }
              }
            }
          });

        case 'comment':
          return await prisma.comment.findUnique({
            where: { id: targetId },
            select: {
              id: true,
              content: true,
              status: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              },
              auction: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          });

        case 'user':
          return await prisma.user.findUnique({
            where: { id: targetId },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
              profile: {
                select: {
                  avatar: true,
                  bio: true
                }
              }
            }
          });

        case 'message':
          return await prisma.message.findUnique({
            where: { id: targetId },
            select: {
              id: true,
              content: true,
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              },
              conversation: {
                select: {
                  id: true,
                  auction: {
                    select: {
                      id: true,
                      title: true
                    }
                  }
                }
              }
            }
          });

        default:
          return null;
      }
    } catch (error) {
      return { id: targetId, title: 'عنصر محذوف أو غير موجود', status: 'deleted' };
    }
  }

  async getSimilarReports(targetType, targetId, excludeReportId) {
    return await prisma.report.findMany({
      where: {
        targetType,
        targetId,
        id: { not: excludeReportId }
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        status: true,
        createdAt: true,
        reporter: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  async notifyAdminsOfNewReport(report) {
    // Get all active admins
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['admin', 'super_admin'] },
        status: 'active'
      },
      select: { id: true }
    });

    // Send notifications to all admins
    const notifications = admins.map(admin => 
      sendNotification(admin.id, {
        type: 'new_report',
        title: 'بلاغ جديد',
        message: `تم تقديم بلاغ جديد حول ${this.getTargetTypeArabic(report.targetType)}`,
        data: {
          reportId: report.id,
          targetType: report.targetType,
          priority: report.priority
        }
      })
    );

    await Promise.all(notifications);
  }

  async notifyReporterOfResolution(reporterId, reportId, status, resolution) {
    await sendNotification(reporterId, {
      type: 'report_resolved',
      title: status === 'resolved' ? 'تم حل البلاغ' : 'تم رفض البلاغ',
      message: resolution || `تم ${status === 'resolved' ? 'حل' : 'رفض'} البلاغ الذي قدمته`,
      data: { reportId, status, resolution }
    });
  }

  async applyModerationAction(targetType, targetId, resolution, adminId) {
    try {
      switch (targetType) {
        case 'auction':
          if (resolution.includes('suspend')) {
            await prisma.auction.update({
              where: { id: targetId },
              data: {
                status: 'suspended',
                statusReason: 'تم تعليق المزاد بناءً على بلاغ المستخدمين'
              }
            });
          }
          break;

        case 'comment':
          if (resolution.includes('hide')) {
            await prisma.comment.update({
              where: { id: targetId },
              data: {
                status: 'hidden',
                statusReason: 'تم إخفاء التعليق بناءً على بلاغ المستخدمين'
              }
            });
          }
          break;

        case 'user':
          if (resolution.includes('suspend')) {
            await prisma.user.update({
              where: { id: targetId },
              data: {
                status: 'suspended',
                statusReason: 'تم تعليق الحساب بناءً على بلاغات المستخدمين'
              }
            });
          }
          break;
      }

      // Log moderation action
      await logActivity({
        userId: adminId,
        action: 'auto_moderate',
        targetType,
        targetId,
        details: { resolution }
      });
    } catch (error) {
      console.error('فشل في تطبيق إجراء الإشراف:', error);
    }
  }

  getTargetTypeArabic(type) {
    const translations = {
      'auction': 'مزاد',
      'comment': 'تعليق',
      'user': 'مستخدم',
      'message': 'رسالة'
    };
    return translations[type] || type;
  }
}

module.exports = new ReportService();