const jwt = require('jsonwebtoken');
const NotificationService = require('../services/notificationService');
const { NOTIFICATION_TYPES } = require('../utils/notificationTypes');

class NotificationSocket {
  constructor(io) {
    this.io = io;
    this.notificationService = new NotificationService();
    this.connectedUsers = new Map(); // userId -> Set of socketIds
    this.socketUsers = new Map(); // socketId -> userId
    
    this.setupEventHandlers();
    this.setupSocketHandlers();
  }

  // Setup notification service event handlers
  setupEventHandlers() {
    // When a notification is created, emit it to the user
    this.notificationService.on('notification_created', (data) => {
      this.emitToUser(data.userId, 'new_notification', data.notification);
    });

    // When a notification is read
    this.notificationService.on('notification_read', (data) => {
      this.emitToUser(data.userId, 'notification_read', {
        notificationId: data.notificationId,
        notification: data.notification
      });
    });

    // When all notifications are marked as read
    this.notificationService.on('all_notifications_read', (data) => {
      this.emitToUser(data.userId, 'all_notifications_read', {
        updatedCount: data.updatedCount
      });
    });

    // When a notification is deleted
    this.notificationService.on('notification_deleted', (data) => {
      this.emitToUser(data.userId, 'notification_deleted', {
        notificationId: data.notificationId
      });
    });
  }

  // Setup Socket.IO handlers
  setupSocketHandlers() {
    // Authentication middleware for socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
        
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Invalid authentication token'));
      }
    });

    // Handle socket connections
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  // Handle individual socket connection
  handleConnection(socket) {
    const userId = socket.userId;
    
    console.log(`User ${userId} connected via socket ${socket.id}`);
    
    // Track user connection
    this.addUserSocket(userId, socket.id);
    
    // Join user-specific room
    socket.join(`user_${userId}`);
    
    // If user is admin, join admin room
    if (socket.userRole === 'admin' || socket.userRole === 'moderator') {
      socket.join('admin_room');
    }

    // Send current unread count on connection
    this.sendUnreadCount(userId);

    // Handle notification events
    this.setupNotificationHandlers(socket);

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleDisconnection(socket);
    });
  }

  // Setup notification-specific socket handlers
  setupNotificationHandlers(socket) {
    const userId = socket.userId;

    // Mark notification as read
    socket.on('mark_notification_read', async (data) => {
      try {
        const { notificationId } = data;
        await this.notificationService.markAsRead(notificationId, userId);
        
        // Send updated unread count
        this.sendUnreadCount(userId);
      } catch (error) {
        console.error('Error marking notification as read via socket:', error);
        socket.emit('error', {
          message: 'فشل في تحديث الإشعار',
          code: 'MARK_READ_FAILED'
        });
      }
    });

    // Mark all notifications as read
    socket.on('mark_all_notifications_read', async () => {
      try {
        await this.notificationService.markAllAsRead(userId);
        this.sendUnreadCount(userId);
      } catch (error) {
        console.error('Error marking all notifications as read via socket:', error);
        socket.emit('error', {
          message: 'فشل في تحديث الإشعارات',
          code: 'MARK_ALL_READ_FAILED'
        });
      }
    });

    // Request unread count
    socket.on('get_unread_count', () => {
      this.sendUnreadCount(userId);
    });

    // Subscribe to specific notification types
    socket.on('subscribe_notification_types', (data) => {
      try {
        const { types } = data;
        if (Array.isArray(types)) {
          socket.subscribedTypes = types;
          socket.emit('subscription_confirmed', { types });
        }
      } catch (error) {
        console.error('Error subscribing to notification types:', error);
        socket.emit('error', {
          message: 'فشل في الاشتراك في أنواع الإشعارات',
          code: 'SUBSCRIPTION_FAILED'
        });
      }
    });

    // Request recent notifications
    socket.on('get_recent_notifications', async (data) => {
      try {
        const { limit = 10 } = data || {};
        const result = await this.notificationService.getUserNotifications(userId, {
          page: 1,
          limit: Math.min(limit, 50),
          unreadOnly: false
        });
        
        socket.emit('recent_notifications', result);
      } catch (error) {
        console.error('Error getting recent notifications via socket:', error);
        socket.emit('error', {
          message: 'فشل في جلب الإشعارات الحديثة',
          code: 'GET_RECENT_FAILED'
        });
      }
    });
  }

  // Handle socket disconnection
  handleDisconnection(socket) {
    const userId = socket.userId;
    console.log(`User ${userId} disconnected from socket ${socket.id}`);
    
    this.removeUserSocket(userId, socket.id);
  }

  // Add user socket to tracking
  addUserSocket(userId, socketId) {
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId).add(socketId);
    this.socketUsers.set(socketId, userId);
  }

  // Remove user socket from tracking
  removeUserSocket(userId, socketId) {
    if (this.connectedUsers.has(userId)) {
      this.connectedUsers.get(userId).delete(socketId);
      if (this.connectedUsers.get(userId).size === 0) {
        this.connectedUsers.delete(userId);
      }
    }
    this.socketUsers.delete(socketId);
  }

  // Emit event to specific user
  emitToUser(userId, event, data) {
    const userSockets = this.connectedUsers.get(userId);
    if (userSockets && userSockets.size > 0) {
      // Emit to user-specific room
      this.io.to(`user_${userId}`).emit(event, data);
      
      console.log(`Emitted ${event} to user ${userId} (${userSockets.size} sockets)`);
    }
  }

  // Emit to multiple users
  emitToUsers(userIds, event, data) {
    userIds.forEach(userId => {
      this.emitToUser(userId, event, data);
    });
  }

  // Emit to admin users
  emitToAdmins(event, data) {
    this.io.to('admin_room').emit(event, data);
  }

  // Send unread count to user
  async sendUnreadCount(userId) {
    try {
      const unreadCount = await this.notificationService.getUnreadCount(userId);
      this.emitToUser(userId, 'unread_count_updated', { unreadCount });
    } catch (error) {
      console.error('Error sending unread count:', error);
    }
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId) && this.connectedUsers.get(userId).size > 0;
  }

  // Get online users count
  getOnlineUsersCount() {
    return this.connectedUsers.size;
  }

  // Get user socket count
  getUserSocketCount(userId) {
    const userSockets = this.connectedUsers.get(userId);
    return userSockets ? userSockets.size : 0;
  }

  // Broadcast system notification
  async broadcastSystemNotification(type, templateData, options = {}) {
    try {
      // Get all connected users
      const connectedUserIds = Array.from(this.connectedUsers.keys());
      
      if (connectedUserIds.length === 0) {
        console.log('No connected users to broadcast to');
        return;
      }

      // Create bulk notifications
      const result = await this.notificationService.createBulkNotifications(
        connectedUserIds,
        type,
        templateData,
        options
      );

      console.log(`Broadcasted ${type} notification to ${result.successful} users`);
      
      return result;
    } catch (error) {
      console.error('Error broadcasting system notification:', error);
      throw error;
    }
  }

  // Auction-specific notification methods
  async notifyAuctionStarted(auctionId, auctionTitle, followerIds) {
    try {
      const result = await this.notificationService.notifyAuctionStarted(
        auctionId,
        auctionTitle,
        followerIds
      );
      
      // Also emit real-time event for immediate UI updates
      this.emitToUsers(followerIds, 'auction_started', {
        auctionId,
        auctionTitle,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      console.error('Error notifying auction started:', error);
      throw error;
    }
  }

  async notifyAuctionEndingSoon(auctionId, auctionTitle, timeRemaining, participantIds) {
    try {
      const result = await this.notificationService.notifyAuctionEndingSoon(
        auctionId,
        auctionTitle,
        timeRemaining,
        participantIds
      );
      
      // Emit real-time warning
      this.emitToUsers(participantIds, 'auction_ending_soon', {
        auctionId,
        auctionTitle,
        timeRemaining,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      console.error('Error notifying auction ending soon:', error);
      throw error;
    }
  }

  async notifyBidOutbid(userId, auctionId, auctionTitle, newBidAmount) {
    try {
      const result = await this.notificationService.notifyBidOutbid(
        userId,
        auctionId,
        auctionTitle,
        newBidAmount
      );
      
      // Emit immediate outbid alert
      this.emitToUser(userId, 'bid_outbid', {
        auctionId,
        auctionTitle,
        newBidAmount,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      console.error('Error notifying bid outbid:', error);
      throw error;
    }
  }

  // Cleanup method
  cleanup() {
    this.connectedUsers.clear();
    this.socketUsers.clear();
    this.notificationService.removeAllListeners();
  }
}

module.exports = NotificationSocket;