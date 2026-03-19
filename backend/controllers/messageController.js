const messageService = require('../services/messageService');
const { validationResult } = require('express-validator');

class MessageController {
  // Get all conversations for authenticated user
  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await messageService.getUserConversations(userId);
      
      res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب المحادثات'
      });
    }
  }

  // Get or create conversation between two users
  async getOrCreateConversation(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { otherUserId } = req.body;

      if (userId === parseInt(otherUserId)) {
        return res.status(400).json({
          success: false,
          message: 'لا يمكن إنشاء محادثة مع نفسك'
        });
      }

      const conversation = await messageService.getOrCreateConversation(
        userId, 
        parseInt(otherUserId)
      );
      
      res.status(200).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في إنشاء المحادثة'
      });
    }
  }

  // Get messages for a specific conversation
  async getMessages(req, res) {
    try {
      const userId = req.user.id;
      const conversationId = parseInt(req.params.conversationId);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      // Check if user is part of conversation
      const hasAccess = await messageService.checkConversationAccess(
        conversationId, 
        userId
      );
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'غير مسموح لك بالوصول إلى هذه المحادثة'
        });
      }

      const result = await messageService.getMessages(
        conversationId, 
        page, 
        limit
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب الرسائل'
      });
    }
  }

  // Send a message
  async sendMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { conversationId, content, messageType = 'text' } = req.body;

      // Check if user is part of conversation
      const hasAccess = await messageService.checkConversationAccess(
        conversationId, 
        userId
      );
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'غير مسموح لك بالوصول إلى هذه المحادثة'
        });
      }

      const message = await messageService.sendMessage({
        conversationId: parseInt(conversationId),
        senderId: userId,
        content: content.trim(),
        messageType
      });
      
      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في إرسال الرسالة'
      });
    }
  }

  // Mark messages as read
  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const conversationId = parseInt(req.params.conversationId);

      // Check if user is part of conversation
      const hasAccess = await messageService.checkConversationAccess(
        conversationId, 
        userId
      );
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'غير مسموح لك بالوصول إلى هذه المحادثة'
        });
      }

      await messageService.markMessagesAsRead(conversationId, userId);
      
      res.status(200).json({
        success: true,
        message: 'تم تحديد الرسائل كمقروءة'
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تحديث حالة الرسائل'
      });
    }
  }

  // Delete a message
  async deleteMessage(req, res) {
    try {
      const userId = req.user.id;
      const messageId = parseInt(req.params.messageId);

      const canDelete = await messageService.canDeleteMessage(messageId, userId);
      
      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: 'غير مسموح لك بحذف هذه الرسالة'
        });
      }

      await messageService.deleteMessage(messageId);
      
      res.status(200).json({
        success: true,
        message: 'تم حذف الرسالة بنجاح'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في حذف الرسالة'
      });
    }
  }

  // Get unread messages count
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await messageService.getUnreadMessagesCount(userId);
      
      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب عدد الرسائل غير المقروءة'
      });
    }
  }

  // Search messages
  async searchMessages(req, res) {
    try {
      const userId = req.user.id;
      const { query, conversationId } = req.query;
      
      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'يجب أن يكون البحث أكثر من حرفين'
        });
      }

      const messages = await messageService.searchMessages(
        userId,
        query.trim(),
        conversationId ? parseInt(conversationId) : null
      );
      
      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error searching messages:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في البحث في الرسائل'
      });
    }
  }

  // Report a conversation or message
  async reportMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { messageId, conversationId, reason, description } = req.body;

      const report = await messageService.createReport({
        reporterId: userId,
        messageId: messageId ? parseInt(messageId) : null,
        conversationId: conversationId ? parseInt(conversationId) : null,
        reason,
        description: description?.trim() || null
      });
      
      res.status(201).json({
        success: true,
        message: 'تم تقديم البلاغ بنجاح',
        data: report
      });
    } catch (error) {
      console.error('Error reporting message:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تقديم البلاغ'
      });
    }
  }

  // Block/unblock user
  async toggleBlockUser(req, res) {
    try {
      const userId = req.user.id;
      const { targetUserId } = req.body;

      if (userId === parseInt(targetUserId)) {
        return res.status(400).json({
          success: false,
          message: 'لا يمكن حظر نفسك'
        });
      }

      const result = await messageService.toggleBlockUser(
        userId,
        parseInt(targetUserId)
      );
      
      res.status(200).json({
        success: true,
        message: result.blocked ? 'تم حظر المستخدم' : 'تم إلغاء حظر المستخدم',
        data: result
      });
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تحديث حالة الحظر'
      });
    }
  }

  // Get blocked users
  async getBlockedUsers(req, res) {
    try {
      const userId = req.user.id;
      const blockedUsers = await messageService.getBlockedUsers(userId);
      
      res.status(200).json({
        success: true,
        data: blockedUsers
      });
    } catch (error) {
      console.error('Error getting blocked users:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في جلب قائمة المحظورين'
      });
    }
  }

  // Archive/unarchive conversation
  async toggleArchiveConversation(req, res) {
    try {
      const userId = req.user.id;
      const conversationId = parseInt(req.params.conversationId);

      // Check if user is part of conversation
      const hasAccess = await messageService.checkConversationAccess(
        conversationId, 
        userId
      );
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'غير مسموح لك بالوصول إلى هذه المحادثة'
        });
      }

      const result = await messageService.toggleArchiveConversation(
        conversationId,
        userId
      );
      
      res.status(200).json({
        success: true,
        message: result.archived ? 'تم أرشفة المحادثة' : 'تم إلغاء أرشفة المحادثة',
        data: result
      });
    } catch (error) {
      console.error('Error archiving conversation:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في أرشفة المحادثة'
      });
    }
  }
}

module.exports = new MessageController();