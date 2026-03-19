const NotificationService = require('../services/notificationService');
const { validationResult, body, query } = require('express-validator');
const { NOTIFICATION_TYPES, PRIORITY_LEVELS } = require('../utils/notificationTypes');

class NotificationController {
  constructor() {
    this.notificationService = new NotificationService();
  }

  // Get user notifications with pagination and filters
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 20,
        unreadOnly = false,
        types,
        priority
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 100), // Max 100 per page
        unreadOnly: unreadOnly === 'true',
        types: types ? types.split(',') : null,
        priority
      };

      const result = await this.notificationService.getUserNotifications(userId, options);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting user notifications:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب الإشعارات',
        error: error.message
      });
    }
  }

  // Get unread notifications count
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await this.notificationService.getUnreadCount(userId);
      
      res.json({
        success: true,
        data: { unreadCount: count }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب عدد الإشعارات غير المقروءة',
        error: error.message
      });
    }
  }

  // Mark notification as read
  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      const notification = await this.notificationService.markAsRead(
        notificationId,
        userId
      );

      res.json({
        success: true,
        message: 'تم تحديد الإشعار كمقروء',
        data: notification.toJSON()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      if (error.message === 'Notification not found') {
        return res.status(404).json({
          success: false,
          message: 'الإشعار غير موجود'
        });
      }

      res.status(500).json({
        success: false,
        message: 'خطأ في تحديث الإشعار',
        error: error.message
      });
    }
  }

  // Mark all notifications as read
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      const updatedCount = await this.notificationService.markAllAsRead(userId);
      
      res.json({
        success: true,
        message: 'تم تحديد جميع الإشعارات كمقروءة',
        data: { updatedCount }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تحديث الإشعارات',
        error: error.message
      });
    }
  }

  // Delete notification
  async deleteNotification(req, res) {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      const deleted = await this.notificationService.deleteNotification(
        notificationId,
        userId
      );

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'الإشعار غير موجود'
        });
      }

      res.json({
        success: true,
        message: 'تم حذف الإشعار بنجاح'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في حذف الإشعار',
        error: error.message
      });
    }
  }

  // Get notification statistics
  async getNotificationStats(req, res) {
    try {
      const userId = req.user.id;
      const { days = 30 } = req.query;
      
      const stats = await this.notificationService.getNotificationStats(
        userId,
        parseInt(days)
      );
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting notification stats:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب إحصائيات الإشعارات',
        error: error.message
      });
    }
  }

  // Create manual notification (admin only)
  async createNotification(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: errors.array()
        });
      }

      const {
        userId,
        type,
        title,
        message,
        actionUrl,
        priority = 'medium',
        data = {},
        relatedId,
        relatedType,
        imageUrl
      } = req.body;

      // For custom notifications, create directly
      const notification = await this.notificationService.createNotification(
        userId,
        type,
        data,
        {
          relatedId,
          relatedType,
          imageUrl,
          customTitle: title,
          customMessage: message,
          customActionUrl: actionUrl,
          customPriority: priority
        }
      );

      res.status(201).json({
        success: true,
        message: 'تم إنشاء الإشعار بنجاح',
        data: notification.toJSON()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في إنشاء الإشعار',
        error: error.message
      });
    }
  }

  // Send bulk notifications (admin only)
  async createBulkNotifications(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: errors.array()
        });
      }

      const {
        userIds,
        type,
        templateData = {},
        options = {}
      } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'يجب تحديد معرفات المستخدمين'
        });
      }

      const result = await this.notificationService.createBulkNotifications(
        userIds,
        type,
        templateData,
        options
      );

      res.json({
        success: true,
        message: `تم إرسال ${result.successful} إشعار بنجاح`,
        data: result
      });
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في إرسال الإشعارات المجمعة',
        error: error.message
      });
    }
  }

  // Schedule notification (admin only)
  async scheduleNotification(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: errors.array()
        });
      }

      const {
        userId,
        type,
        templateData,
        deliveryTime,
        options = {}
      } = req.body;

      const deliveryDate = new Date(deliveryTime);
      if (deliveryDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'وقت التسليم يجب أن يكون في المستقبل'
        });
      }

      const jobId = await this.notificationService.scheduleNotification(
        userId,
        type,
        templateData,
        deliveryDate,
        options
      );

      res.json({
        success: true,
        message: 'تم جدولة الإشعار بنجاح',
        data: { jobId, deliveryTime }
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جدولة الإشعار',
        error: error.message
      });
    }
  }

  // Cancel scheduled notification (admin only)
  async cancelScheduledNotification(req, res) {
    try {
      const { jobId } = req.params;
      
      const cancelled = this.notificationService.cancelScheduledNotification(jobId);
      
      if (!cancelled) {
        return res.status(404).json({
          success: false,
          message: 'المهمة المجدولة غير موجودة'
        });
      }

      res.json({
        success: true,
        message: 'تم إلغاء الإشعار المجدول بنجاح'
      });
    } catch (error) {
      console.error('Error cancelling scheduled notification:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في إلغاء الإشعار المجدول',
        error: error.message
      });
    }
  }

  // Get notification types and priorities (for admin interface)
  async getNotificationConfig(req, res) {
    try {
      res.json({
        success: true,
        data: {
          types: Object.keys(NOTIFICATION_TYPES),
          priorities: Object.values(PRIORITY_LEVELS),
          typeConfigs: NOTIFICATION_TYPES
        }
      });
    } catch (error) {
      console.error('Error getting notification config:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب إعدادات الإشعارات',
        error: error.message
      });
    }
  }

  // Cleanup expired notifications (admin only)
  async cleanupExpired(req, res) {
    try {
      const deletedCount = await this.notificationService.cleanupExpiredNotifications();
      
      res.json({
        success: true,
        message: `تم حذف ${deletedCount} إشعار منتهي الصلاحية`,
        data: { deletedCount }
      });
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تنظيف الإشعارات المنتهية الصلاحية',
        error: error.message
      });
    }
  }
}

// Validation middleware
const createNotificationValidation = [
  body('userId').isUUID().withMessage('معرف المستخدم غير صحيح'),
  body('type').isIn(Object.keys(NOTIFICATION_TYPES)).withMessage('نوع الإشعار غير صحيح'),
  body('title').optional().isLength({ min: 1, max: 255 }).withMessage('العنوان يجب أن يكون بين 1 و 255 حرف'),
  body('message').optional().isLength({ min: 1, max: 1000 }).withMessage('الرسالة يجب أن تكون بين 1 و 1000 حرف'),
  body('priority').optional().isIn(Object.values(PRIORITY_LEVELS)).withMessage('الأولوية غير صحيحة'),
  body('actionUrl').optional().isURL().withMessage('رابط العمل غير صحيح'),
  body('data').optional().isObject().withMessage('البيانات يجب أن تكون كائن JSON')
];

const createBulkNotificationsValidation = [
  body('userIds').isArray({ min: 1 }).withMessage('يجب تحديد معرف مستخدم واحد على الأقل'),
  body('userIds.*').isUUID().withMessage('معرف المستخدم غير صحيح'),
  body('type').isIn(Object.keys(NOTIFICATION_TYPES)).withMessage('نوع الإشعار غير صحيح'),
  body('templateData').optional().isObject().withMessage('بيانات القالب يجب أن تكون كائن JSON'),
  body('options').optional().isObject().withMessage('الخيارات يجب أن تكون كائن JSON')
];

const scheduleNotificationValidation = [
  body('userId').isUUID().withMessage('معرف المستخدم غير صحيح'),
  body('type').isIn(Object.keys(NOTIFICATION_TYPES)).withMessage('نوع الإشعار غير صحيح'),
  body('deliveryTime').isISO8601().withMessage('وقت التسليم غير صحيح'),
  body('templateData').optional().isObject().withMessage('بيانات القالب يجب أن تكون كائن JSON')
];

module.exports = {
  NotificationController,
  createNotificationValidation,
  createBulkNotificationsValidation,
  scheduleNotificationValidation
};