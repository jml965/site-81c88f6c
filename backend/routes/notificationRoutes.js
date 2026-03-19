const express = require('express');
const { 
  NotificationController,
  createNotificationValidation,
  createBulkNotificationsValidation,
  scheduleNotificationValidation
} = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorization');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const notificationController = new NotificationController();

// Rate limiting
const getNotificationsLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: 'تم تجاوز حد الطلبات، يرجى المحاولة مرة أخرى لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const markAsReadLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    success: false,
    message: 'تم تجاوز حد الطلبات، يرجى المحاولة مرة أخرى لاحقاً'
  }
});

const adminActionLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute for admin actions
  message: {
    success: false,
    message: 'تم تجاوز حد الطلبات للعمليات الإدارية'
  }
});

// User notification routes
router.get(
  '/',
  authenticateToken,
  getNotificationsLimit,
  async (req, res) => {
    await notificationController.getUserNotifications(req, res);
  }
);

router.get(
  '/unread-count',
  authenticateToken,
  getNotificationsLimit,
  async (req, res) => {
    await notificationController.getUnreadCount(req, res);
  }
);

router.get(
  '/stats',
  authenticateToken,
  getNotificationsLimit,
  async (req, res) => {
    await notificationController.getNotificationStats(req, res);
  }
);

router.patch(
  '/:notificationId/read',
  authenticateToken,
  markAsReadLimit,
  async (req, res) => {
    await notificationController.markAsRead(req, res);
  }
);

router.patch(
  '/mark-all-read',
  authenticateToken,
  markAsReadLimit,
  async (req, res) => {
    await notificationController.markAllAsRead(req, res);
  }
);

router.delete(
  '/:notificationId',
  authenticateToken,
  markAsReadLimit,
  async (req, res) => {
    await notificationController.deleteNotification(req, res);
  }
);

// Admin-only routes
router.get(
  '/config',
  authenticateToken,
  requireRole(['admin', 'moderator']),
  async (req, res) => {
    await notificationController.getNotificationConfig(req, res);
  }
);

router.post(
  '/create',
  authenticateToken,
  requireRole(['admin', 'moderator']),
  adminActionLimit,
  createNotificationValidation,
  async (req, res) => {
    await notificationController.createNotification(req, res);
  }
);

router.post(
  '/bulk',
  authenticateToken,
  requireRole(['admin']),
  adminActionLimit,
  createBulkNotificationsValidation,
  async (req, res) => {
    await notificationController.createBulkNotifications(req, res);
  }
);

router.post(
  '/schedule',
  authenticateToken,
  requireRole(['admin', 'moderator']),
  adminActionLimit,
  scheduleNotificationValidation,
  async (req, res) => {
    await notificationController.scheduleNotification(req, res);
  }
);

router.delete(
  '/scheduled/:jobId',
  authenticateToken,
  requireRole(['admin', 'moderator']),
  adminActionLimit,
  async (req, res) => {
    await notificationController.cancelScheduledNotification(req, res);
  }
);

router.post(
  '/cleanup-expired',
  authenticateToken,
  requireRole(['admin']),
  adminActionLimit,
  async (req, res) => {
    await notificationController.cleanupExpired(req, res);
  }
);

// Error handling middleware specific to notification routes
router.use((error, req, res, next) => {
  console.error('Notification route error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة',
      errors: error.errors
    });
  }
  
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'خطأ في قاعدة البيانات'
    });
  }
  
  if (error.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'خطأ في الاتصال بقاعدة البيانات'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'خطأ داخلي في الخادم',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

module.exports = router;