const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const rateLimitMiddleware = require('../middleware/rateLimit');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all conversations for authenticated user
router.get(
  '/conversations',
  rateLimitMiddleware(100, 15), // 100 requests per 15 minutes
  messageController.getConversations
);

// Get or create conversation between two users
router.post(
  '/conversations',
  rateLimitMiddleware(50, 15), // 50 requests per 15 minutes
  [
    body('otherUserId')
      .isInt({ min: 1 })
      .withMessage('معرف المستخدم الآخر يجب أن يكون رقم صحيح')
  ],
  messageController.getOrCreateConversation
);

// Get messages for a specific conversation
router.get(
  '/conversations/:conversationId/messages',
  rateLimitMiddleware(200, 15), // 200 requests per 15 minutes
  [
    param('conversationId')
      .isInt({ min: 1 })
      .withMessage('معرف المحادثة يجب أن يكون رقم صحيح')
  ],
  messageController.getMessages
);

// Send a message
router.post(
  '/messages',
  rateLimitMiddleware(100, 15), // 100 messages per 15 minutes
  [
    body('conversationId')
      .isInt({ min: 1 })
      .withMessage('معرف المحادثة مطلوب ويجب أن يكون رقم صحيح'),
    body('content')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('محتوى الرسالة مطلوب ويجب أن يكون بين 1 و 2000 حرف'),
    body('messageType')
      .optional()
      .isIn(['text', 'image', 'file', 'system'])
      .withMessage('نوع الرسالة غير صحيح')
  ],
  messageController.sendMessage
);

// Mark messages as read
router.put(
  '/conversations/:conversationId/read',
  rateLimitMiddleware(200, 15), // 200 requests per 15 minutes
  [
    param('conversationId')
      .isInt({ min: 1 })
      .withMessage('معرف المحادثة يجب أن يكون رقم صحيح')
  ],
  messageController.markAsRead
);

// Delete a message
router.delete(
  '/messages/:messageId',
  rateLimitMiddleware(50, 15), // 50 deletions per 15 minutes
  [
    param('messageId')
      .isInt({ min: 1 })
      .withMessage('معرف الرسالة يجب أن يكون رقم صحيح')
  ],
  messageController.deleteMessage
);

// Get unread messages count
router.get(
  '/unread-count',
  rateLimitMiddleware(100, 15), // 100 requests per 15 minutes
  messageController.getUnreadCount
);

// Search messages
router.get(
  '/search',
  rateLimitMiddleware(50, 15), // 50 searches per 15 minutes
  messageController.searchMessages
);

// Report a conversation or message
router.post(
  '/reports',
  rateLimitMiddleware(20, 60), // 20 reports per hour
  [
    body('messageId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('معرف الرسالة يجب أن يكون رقم صحيح'),
    body('conversationId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('معرف المحادثة يجب أن يكون رقم صحيح'),
    body('reason')
      .isIn([
        'spam',
        'harassment', 
        'inappropriate_content',
        'fake_profile',
        'scam',
        'other'
      ])
      .withMessage('سبب البلاغ غير صحيح'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('وصف البلاغ يجب أن يكون أقل من 1000 حرف')
  ],
  messageController.reportMessage
);

// Block/unblock user
router.post(
  '/block',
  rateLimitMiddleware(30, 60), // 30 block actions per hour
  [
    body('targetUserId')
      .isInt({ min: 1 })
      .withMessage('معرف المستخدم المراد حظره يجب أن يكون رقم صحيح')
  ],
  messageController.toggleBlockUser
);

// Get blocked users
router.get(
  '/blocked',
  rateLimitMiddleware(50, 15), // 50 requests per 15 minutes
  messageController.getBlockedUsers
);

// Archive/unarchive conversation
router.put(
  '/conversations/:conversationId/archive',
  rateLimitMiddleware(100, 15), // 100 requests per 15 minutes
  [
    param('conversationId')
      .isInt({ min: 1 })
      .withMessage('معرف المحادثة يجب أن يكون رقم صحيح')
  ],
  messageController.toggleArchiveConversation
);

// Error handling middleware for this router
router.use((error, req, res, next) => {
  console.error('Message routes error:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'بيانات JSON غير صحيحة'
    });
  }
  
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'حجم البيانات كبير جداً'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'خطأ في نظام الرسائل'
  });
});

module.exports = router;