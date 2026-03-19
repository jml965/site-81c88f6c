const jwt = require('jsonwebtoken');
const messageService = require('../services/messageService');

class MessageSocketHandler {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> Set of socketIds
    this.socketUsers = new Map(); // socketId -> userId
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('New socket connection:', socket.id);

      // Authenticate user on connection
      socket.on('authenticate', async (data) => {
        try {
          await this.authenticateUser(socket, data.token);
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('authentication_error', { message: 'فشل في المصادقة' });
          socket.disconnect();
        }
      });

      // Join conversation room
      socket.on('join_conversation', async (data) => {
        try {
          await this.joinConversation(socket, data.conversationId);
        } catch (error) {
          console.error('Join conversation error:', error);
          socket.emit('error', { message: 'فشل في الانضمام للمحادثة' });
        }
      });

      // Leave conversation room
      socket.on('leave_conversation', (data) => {
        try {
          this.leaveConversation(socket, data.conversationId);
        } catch (error) {
          console.error('Leave conversation error:', error);
        }
      });

      // Handle new message
      socket.on('send_message', async (data) => {
        try {
          await this.handleSendMessage(socket, data);
        } catch (error) {
          console.error('Send message error:', error);
          socket.emit('message_error', { 
            message: 'فشل في إرسال الرسالة',
            error: error.message 
          });
        }
      });

      // Handle typing indicator
      socket.on('typing_start', (data) => {
        try {
          this.handleTypingStart(socket, data);
        } catch (error) {
          console.error('Typing start error:', error);
        }
      });

      socket.on('typing_stop', (data) => {
        try {
          this.handleTypingStop(socket, data);
        } catch (error) {
          console.error('Typing stop error:', error);
        }
      });

      // Handle message read status
      socket.on('mark_messages_read', async (data) => {
        try {
          await this.handleMarkMessagesRead(socket, data);
        } catch (error) {
          console.error('Mark messages read error:', error);
        }
      });

      // Handle user presence
      socket.on('update_presence', (data) => {
        try {
          this.updateUserPresence(socket, data.status);
        } catch (error) {
          console.error('Update presence error:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        try {
          this.handleDisconnection(socket);
        } catch (error) {
          console.error('Disconnection handling error:', error);
        }
      });

      // Handle connection errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  async authenticateUser(socket, token) {
    if (!token) {
      throw new Error('رمز المصادقة مطلوب');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.id;
      
      if (!userId) {
        throw new Error('رمز المصادقة غير صحيح');
      }

      // Store user mapping
      socket.userId = userId;
      this.socketUsers.set(socket.id, userId);
      
      // Add socket to user's connections
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId).add(socket.id);

      // Join user-specific room for notifications
      socket.join(`user_${userId}`);

      // Emit authentication success
      socket.emit('authenticated', { 
        userId,
        message: 'تم تسجيل الدخول بنجاح' 
      });

      // Broadcast user online status
      this.broadcastUserStatus(userId, 'online');

      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new Error('رمز المصادقة غير صحيح');
    }
  }

  async joinConversation(socket, conversationId) {
    if (!socket.userId) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    // Verify user has access to conversation
    const hasAccess = await messageService.checkConversationAccess(
      conversationId, 
      socket.userId
    );
    
    if (!hasAccess) {
      throw new Error('غير مسموح لك بالوصول إلى هذه المحادثة');
    }

    const roomName = `conversation_${conversationId}`;
    socket.join(roomName);
    
    socket.emit('joined_conversation', { 
      conversationId,
      message: 'تم الانضمام للمحادثة بنجاح' 
    });

    // Notify other participants that user joined
    socket.to(roomName).emit('user_joined_conversation', {
      userId: socket.userId,
      conversationId
    });

    console.log(`User ${socket.userId} joined conversation ${conversationId}`);
  }

  leaveConversation(socket, conversationId) {
    const roomName = `conversation_${conversationId}`;
    socket.leave(roomName);
    
    socket.emit('left_conversation', { 
      conversationId,
      message: 'تم مغادرة المحادثة' 
    });

    // Notify other participants that user left
    socket.to(roomName).emit('user_left_conversation', {
      userId: socket.userId,
      conversationId
    });

    console.log(`User ${socket.userId} left conversation ${conversationId}`);
  }

  async handleSendMessage(socket, data) {
    if (!socket.userId) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    const { conversationId, content, messageType = 'text' } = data;

    if (!conversationId || !content) {
      throw new Error('معرف المحادثة ومحتوى الرسالة مطلوبان');
    }

    if (content.trim().length === 0) {
      throw new Error('محتوى الرسالة لا يمكن أن يكون فارغاً');
    }

    if (content.length > 2000) {
      throw new Error('محتوى الرسالة طويل جداً');
    }

    // Send message through service
    const message = await messageService.sendMessage({
      conversationId,
      senderId: socket.userId,
      content: content.trim(),
      messageType
    });

    const roomName = `conversation_${conversationId}`;
    
    // Emit to all users in conversation
    this.io.to(roomName).emit('new_message', {
      message,
      conversationId
    });

    // Send confirmation to sender
    socket.emit('message_sent', {
      message,
      conversationId,
      tempId: data.tempId // Client can use this to match sent messages
    });

    console.log(`Message sent by user ${socket.userId} in conversation ${conversationId}`);
  }

  handleTypingStart(socket, data) {
    if (!socket.userId) return;

    const { conversationId } = data;
    if (!conversationId) return;

    const roomName = `conversation_${conversationId}`;
    
    // Notify others in conversation that user is typing
    socket.to(roomName).emit('user_typing_start', {
      userId: socket.userId,
      conversationId
    });

    // Clear existing typing timeout
    if (socket.typingTimeout) {
      clearTimeout(socket.typingTimeout);
    }

    // Auto-stop typing after 3 seconds of inactivity
    socket.typingTimeout = setTimeout(() => {
      this.handleTypingStop(socket, data);
    }, 3000);
  }

  handleTypingStop(socket, data) {
    if (!socket.userId) return;

    const { conversationId } = data;
    if (!conversationId) return;

    const roomName = `conversation_${conversationId}`;
    
    // Notify others that user stopped typing
    socket.to(roomName).emit('user_typing_stop', {
      userId: socket.userId,
      conversationId
    });

    // Clear typing timeout
    if (socket.typingTimeout) {
      clearTimeout(socket.typingTimeout);
      socket.typingTimeout = null;
    }
  }

  async handleMarkMessagesRead(socket, data) {
    if (!socket.userId) return;

    const { conversationId } = data;
    if (!conversationId) return;

    try {
      await messageService.markMessagesAsRead(conversationId, socket.userId);
      
      const roomName = `conversation_${conversationId}`;
      
      // Notify others in conversation about read status
      socket.to(roomName).emit('messages_read', {
        userId: socket.userId,
        conversationId,
        readAt: new Date().toISOString()
      });

      socket.emit('messages_marked_read', {
        conversationId,
        message: 'تم تحديد الرسائل كمقروءة'
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      socket.emit('error', { message: 'فشل في تحديث حالة الرسائل' });
    }
  }

  updateUserPresence(socket, status) {
    if (!socket.userId) return;

    // Valid statuses: online, away, busy, offline
    const validStatuses = ['online', 'away', 'busy', 'offline'];
    if (!validStatuses.includes(status)) {
      status = 'online';
    }

    // Broadcast user status to all connected users
    this.broadcastUserStatus(socket.userId, status);
  }

  broadcastUserStatus(userId, status) {
    // Emit to all users who have conversations with this user
    this.io.emit('user_status_changed', {
      userId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  handleDisconnection(socket) {
    console.log('Socket disconnected:', socket.id);

    const userId = this.socketUsers.get(socket.id);
    if (userId) {
      // Remove socket from user's connections
      const userSockets = this.connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        
        // If no more connections for this user, mark as offline
        if (userSockets.size === 0) {
          this.connectedUsers.delete(userId);
          this.broadcastUserStatus(userId, 'offline');
        }
      }
      
      // Clean up socket mapping
      this.socketUsers.delete(socket.id);
    }

    // Clear any typing timeouts
    if (socket.typingTimeout) {
      clearTimeout(socket.typingTimeout);
    }
  }

  // Utility method to send notification to specific user
  sendNotificationToUser(userId, notification) {
    this.io.to(`user_${userId}`).emit('notification', notification);
  }

  // Utility method to get online status of user
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  // Utility method to get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Utility method to get all online users
  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // Send message notification to offline users
  async notifyOfflineUsers(conversationId, message, senderUser) {
    // This would typically integrate with your notification service
    // to send push notifications or emails to offline users
    console.log(`Notifying offline users about new message in conversation ${conversationId}`);
  }
}

module.exports = MessageSocketHandler;