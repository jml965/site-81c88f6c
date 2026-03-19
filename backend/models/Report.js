const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Report {
  constructor(data) {
    this.id = data.id;
    this.reportedBy = data.reportedBy;
    this.targetType = data.targetType;
    this.targetId = data.targetId;
    this.reason = data.reason;
    this.description = data.description;
    this.status = data.status;
    this.priority = data.priority;
    this.assignedTo = data.assignedTo;
    this.assignedAt = data.assignedAt;
    this.resolution = data.resolution;
    this.resolvedAt = data.resolvedAt;
    this.resolvedBy = data.resolvedBy;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Static methods for database operations
  static async create(reportData) {
    const report = await prisma.report.create({
      data: {
        reportedBy: reportData.reportedBy,
        targetType: reportData.targetType,
        targetId: reportData.targetId,
        reason: reportData.reason,
        description: reportData.description,
        priority: reportData.priority || 'medium',
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

    return new Report(report);
  }

  static async findById(reportId) {
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

    return report ? new Report(report) : null;
  }

  static async findMany(filters = {}) {
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

    if (type) where.targetType = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (reportedBy) where.reportedBy = reportedBy;

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

    return {
      reports: reports.map(report => new Report(report)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findByUser(userId, filters = {}) {
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

    if (status) where.status = status;
    if (type) where.targetType = type;

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

    return {
      reports: reports.map(report => new Report(report)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findSimilar(targetType, targetId, excludeReportId = null) {
    const where = {
      targetType,
      targetId
    };

    if (excludeReportId) {
      where.id = { not: excludeReportId };
    }

    const reports = await prisma.report.findMany({
      where,
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        status: true,
        priority: true,
        createdAt: true,
        reporter: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return reports.map(report => new Report(report));
  }

  static async exists(userId, targetType, targetId) {
    const report = await prisma.report.findFirst({
      where: {
        reportedBy: userId,
        targetType,
        targetId,
        status: { in: ['pending', 'in_review'] }
      }
    });

    return !!report;
  }

  static async getStats(adminId = null) {
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

  static async getPriorityReports(limit = 10) {
    const reports = await prisma.report.findMany({
      where: {
        status: { in: ['pending', 'in_review'] }
      },
      take: limit,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
      include: {
        reporter: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return reports.map(report => new Report(report));
  }

  static async getOverdueReports(hours = 24) {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const reports = await prisma.report.findMany({
      where: {
        status: { in: ['pending', 'in_review'] },
        createdAt: {
          lt: cutoffDate
        }
      },
      orderBy: { createdAt: 'asc' },
      include: {
        reporter: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        assignedAdmin: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return reports.map(report => new Report(report));
  }

  // Instance methods
  async update(updateData) {
    const updatedReport = await prisma.report.update({
      where: { id: this.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
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
        }
      }
    });

    // Update instance properties
    Object.assign(this, updatedReport);
    return this;
  }

  async updateStatus(status, adminId, resolution = null, notes = null) {
    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (['resolved', 'rejected'].includes(status)) {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = adminId;
      if (resolution) updateData.resolution = resolution;
    }

    const updatedReport = await this.update(updateData);

    // Create action log
    await this.addAction({
      adminId,
      action: `status_changed_to_${status}`,
      notes,
      details: {
        previousStatus: this.status,
        newStatus: status,
        resolution
      }
    });

    return updatedReport;
  }

  async assign(adminId, assignedBy) {
    const updateData = {
      assignedTo: adminId,
      assignedAt: new Date(),
      status: this.status === 'pending' ? 'in_review' : this.status
    };

    const updatedReport = await this.update(updateData);

    // Create action log
    await this.addAction({
      adminId: assignedBy,
      action: 'assigned',
      notes: `تم تكليف المشرف`,
      details: { assignedTo: adminId }
    });

    return updatedReport;
  }

  async addAction({ adminId, action, notes = null, details = {} }) {
    return await prisma.reportAction.create({
      data: {
        reportId: this.id,
        adminId,
        action,
        notes,
        details: JSON.stringify(details)
      }
    });
  }

  async getActions() {
    return await prisma.reportAction.findMany({
      where: { reportId: this.id },
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
    });
  }

  // Validation methods
  static validateTargetType(type) {
    const validTypes = ['auction', 'comment', 'user', 'message'];
    return validTypes.includes(type);
  }

  static validateStatus(status) {
    const validStatuses = ['pending', 'in_review', 'resolved', 'rejected'];
    return validStatuses.includes(status);
  }

  static validatePriority(priority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    return validPriorities.includes(priority);
  }

  static validateReason(reason) {
    const validReasons = [
      'inappropriate_content',
      'spam',
      'harassment',
      'false_information',
      'copyright_violation',
      'scam',
      'violence',
      'hate_speech',
      'adult_content',
      'other'
    ];
    return validReasons.includes(reason);
  }

  // Helper methods
  isOverdue(hours = 24) {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.createdAt < cutoffDate && ['pending', 'in_review'].includes(this.status);
  }

  isPending() {
    return this.status === 'pending';
  }

  isInReview() {
    return this.status === 'in_review';
  }

  isResolved() {
    return this.status === 'resolved';
  }

  isRejected() {
    return this.status === 'rejected';
  }

  isAssigned() {
    return !!this.assignedTo;
  }

  isHighPriority() {
    return ['high', 'urgent'].includes(this.priority);
  }

  getStatusText() {
    const statusMap = {
      'pending': 'في الانتظار',
      'in_review': 'قيد المراجعة',
      'resolved': 'تم الحل',
      'rejected': 'مرفوض'
    };
    return statusMap[this.status] || this.status;
  }

  getPriorityText() {
    const priorityMap = {
      'low': 'منخفض',
      'medium': 'متوسط',
      'high': 'عالي',
      'urgent': 'عاجل'
    };
    return priorityMap[this.priority] || this.priority;
  }

  getTargetTypeText() {
    const typeMap = {
      'auction': 'مزاد',
      'comment': 'تعليق',
      'user': 'مستخدم',
      'message': 'رسالة'
    };
    return typeMap[this.targetType] || this.targetType;
  }

  toJSON() {
    return {
      id: this.id,
      reportedBy: this.reportedBy,
      targetType: this.targetType,
      targetId: this.targetId,
      reason: this.reason,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assignedTo: this.assignedTo,
      assignedAt: this.assignedAt,
      resolution: this.resolution,
      resolvedAt: this.resolvedAt,
      resolvedBy: this.resolvedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Report;