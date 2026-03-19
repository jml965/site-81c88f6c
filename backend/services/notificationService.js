const Notification = require('../models/Notification');
const { 
  createNotificationData, 
  NOTIFICATION_TYPES,
  DEFAULT_USER_PREFERENCES,
  DELIVERY_METHODS,
  PRIORITY_LEVELS
} = require('../utils/notificationTypes');
const { Op } = require('sequelize');
const EventEmitter = require('events');

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.scheduledJobs = new Map();
  }

  // Create and send notification
  async createNotification(userId, type, templateData = {}, options = {}) {
    try {
      const notificationData = createNotificationData(type, templateData);
      
      // Check user preferences
      const userPreferences = options.userPreferences || DEFAULT_USER_PREFERENCES;
      const typePreferences = userPreferences[type];
      
      if (!typePreferences?.enabled) {
        console.log(`Notification ${type} disabled for user ${userId}`);
        return null;
      }

      // Create notification in database
      const notification = await Notification.create({
        userId,
        ...notificationData,
        relatedId: options.relatedId || null,
        relatedType: options.relatedType || null,
        imageUrl: options.imageUrl || null,
        metadata: options.metadata || {}
      });

      // Emit real-time notification
      this.emit('notification_created', {
        userId,
        notification: notification.toJSON()
      });

      // Handle delivery methods
      if (typePreferences.methods) {
        await this.handleDeliveryMethods(
          notification,
          typePreferences.methods,
          options
        );
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Handle different delivery methods
  async handleDeliveryMethods(notification, methods, options = {}) {
    const promises = [];

    for (const method of methods) {
      switch (method) {
        case DELIVERY_METHODS.PUSH:
          promises.push(this.sendPushNotification(notification, options));
          break;
        case DELIVERY_METHODS.EMAIL:
          promises.push(this.sendEmailNotification(notification, options));
          break;
        case DELIVERY_METHODS.SMS:
          promises.push(this.sendSMSNotification(notification, options));
          break;
        // IN_APP is handled by real-time emission
      }
    }

    await Promise.allSettled(promises);
  }

  // Send push notification (placeholder - integrate with your push service)
  async sendPushNotification(notification, options = {}) {
    try {
      // Implement push notification logic here
      // This could integrate with Firebase FCM, Apple Push Notifications, etc.
      console.log(`Push notification sent for user ${notification.userId}:`, {
        title: notification.title,
        body: notification.message
      });
      
      // Emit event for tracking
      this.emit('push_notification_sent', {
        notificationId: notification.id,
        userId: notification.userId,
        success: true
      });
      
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      this.emit('push_notification_failed', {
        notificationId: notification.id,
        userId: notification.userId,
        error: error.message
      });
      return false;
    }
  }

  // Send email notification (placeholder)
  async sendEmailNotification(notification, options = {}) {
    try {
      // Implement email notification logic here
      console.log(`Email notification sent for user ${notification.userId}`);
      
      this.emit('email_notification_sent', {
        notificationId: notification.id,
        userId: notification.userId,
        success: true
      });
      
      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  // Send SMS notification (placeholder)
  async sendSMSNotification(notification, options = {}) {
    try {
      // Implement SMS notification logic here
      console.log(`SMS notification sent for user ${notification.userId}`);
      
      this.emit('sms_notification_sent', {
        notificationId: notification.id,
        userId: notification.userId,
        success: true
      });
      
      return true;
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      return false;
    }
  }

  // Get user notifications with pagination
  async getUserNotifications(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      types = null,
      priority = null
    } = options;

    const offset = (page - 1) * limit;
    const whereClause = { userId };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    if (types && Array.isArray(types)) {
      whereClause.type = { [Op.in]: types };
    }

    if (priority) {
      whereClause.priority = priority;
    }

    const { count, rows } = await Notification.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      notifications: rows.map(n => n.toJSON()),
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      hasMore: offset + rows.length < count
    };
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (!notification.isRead) {
      await notification.markAsRead();
      
      this.emit('notification_read', {
        userId,
        notificationId,
        notification: notification.toJSON()
      });
    }

    return notification;
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    const result = await Notification.markAllAsRead(userId);
    
    this.emit('all_notifications_read', {
      userId,
      updatedCount: result[0]
    });

    return result[0];
  }

  // Get unread count
  async getUnreadCount(userId) {
    return await Notification.getUnreadCount(userId);
  }

  // Delete notification
  async deleteNotification(notificationId, userId) {
    const result = await Notification.destroy({
      where: { id: notificationId, userId }
    });

    if (result > 0) {
      this.emit('notification_deleted', {
        userId,
        notificationId
      });
    }

    return result > 0;
  }

  // Bulk create notifications for multiple users
  async createBulkNotifications(userIds, type, templateData = {}, options = {}) {
    const notifications = [];
    const errors = [];

    for (const userId of userIds) {
      try {
        const notification = await this.createNotification(
          userId,
          type,
          templateData,
          options
        );
        if (notification) {
          notifications.push(notification);
        }
      } catch (error) {
        errors.push({ userId, error: error.message });
      }
    }

    return {
      successful: notifications.length,
      errors: errors.length,
      notifications,
      errorDetails: errors
    };
  }

  // Schedule notification for later delivery
  async scheduleNotification(userId, type, templateData, deliveryTime, options = {}) {
    const delay = new Date(deliveryTime).getTime() - Date.now();
    
    if (delay <= 0) {
      throw new Error('Delivery time must be in the future');
    }

    const jobId = `${userId}-${type}-${Date.now()}`;
    
    const timeoutId = setTimeout(async () => {
      try {
        await this.createNotification(userId, type, templateData, options);
        this.scheduledJobs.delete(jobId);
      } catch (error) {
        console.error('Error executing scheduled notification:', error);
      }
    }, delay);

    this.scheduledJobs.set(jobId, {
      timeoutId,
      userId,
      type,
      deliveryTime
    });

    return jobId;
  }

  // Cancel scheduled notification
  cancelScheduledNotification(jobId) {
    const job = this.scheduledJobs.get(jobId);
    if (job) {
      clearTimeout(job.timeoutId);
      this.scheduledJobs.delete(jobId);
      return true;
    }
    return false;
  }

  // Clean up expired notifications
  async cleanupExpiredNotifications() {
    try {
      const deletedCount = await Notification.deleteExpired();
      console.log(`Cleaned up ${deletedCount} expired notifications`);
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      throw error;
    }
  }

  // Get notification statistics
  async getNotificationStats(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await Notification.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'type',
        'priority',
        'isRead'
      ],
      raw: true
    });

    const summary = {
      total: stats.length,
      unread: stats.filter(s => !s.isRead).length,
      byType: {},
      byPriority: {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };

    stats.forEach(stat => {
      // Count by type
      summary.byType[stat.type] = (summary.byType[stat.type] || 0) + 1;
      
      // Count by priority
      summary.byPriority[stat.priority]++;
    });

    return summary;
  }

  // Auction-specific notification helpers
  async notifyAuctionStarted(auctionId, auctionTitle, followerIds = []) {
    const templateData = { auctionId, auctionTitle };
    const options = {
      relatedId: auctionId,
      relatedType: 'auction'
    };

    return await this.createBulkNotifications(
      followerIds,
      'auction_started',
      templateData,
      options
    );
  }

  async notifyAuctionEndingSoon(auctionId, auctionTitle, timeRemaining, participantIds = []) {
    const templateData = { 
      auctionId, 
      auctionTitle, 
      timeRemaining 
    };
    const options = {
      relatedId: auctionId,
      relatedType: 'auction'
    };

    return await this.createBulkNotifications(
      participantIds,
      'auction_ending_soon',
      templateData,
      options
    );
  }

  async notifyBidOutbid(userId, auctionId, auctionTitle, newBidAmount) {
    const templateData = {
      auctionId,
      auctionTitle,
      newBidAmount
    };
    const options = {
      relatedId: auctionId,
      relatedType: 'bid'
    };

    return await this.createNotification(
      userId,
      'bid_outbid',
      templateData,
      options
    );
  }

  async notifyAuctionWon(userId, auctionId, auctionTitle, winningAmount) {
    const templateData = {
      auctionId,
      auctionTitle,
      winningAmount
    };
    const options = {
      relatedId: auctionId,
      relatedType: 'auction'
    };

    return await this.createNotification(
      userId,
      'bid_won',
      templateData,
      options
    );
  }
}

module.exports = NotificationService;