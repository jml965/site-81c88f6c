const express = require('express');
const adminController = require('../controllers/adminController');
const { auth, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { body, param, query } = require('express-validator');

const router = express.Router();

// Apply authentication and admin role requirement to all admin routes
router.use(auth);
router.use(requireRole(['admin', 'super_admin']));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User Management
router.get('/users',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('رقم الصفحة يجب أن يكون رقم موجب'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('عدد العناصر يجب أن يكون بين 1 و 100'),
    query('search').optional().isLength({ max: 100 }).withMessage('نص البحث طويل جداً'),
    query('role').optional().isIn(['user', 'seller', 'admin', 'super_admin']).withMessage('دور المستخدم غير صالح'),
    query('status').optional().isIn(['active', 'suspended', 'banned']).withMessage('حالة المستخدم غير صالحة'),
    query('sortBy').optional().isIn(['createdAt', 'name', 'email', 'lastActive']).withMessage('ترتيب غير صالح'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('اتجاه الترتيب غير صالح')
  ],
  validateRequest,
  adminController.getAllUsers
);

router.get('/users/:userId',
  [
    param('userId').isUUID().withMessage('معرف المستخدم غير صالح')
  ],
  validateRequest,
  adminController.getUserById
);

router.patch('/users/:userId/status',
  [
    param('userId').isUUID().withMessage('معرف المستخدم غير صالح'),
    body('status').isIn(['active', 'suspended', 'banned']).withMessage('حالة المستخدم غير صالحة'),
    body('reason').optional().isLength({ max: 500 }).withMessage('سبب التحديث طويل جداً')
  ],
  validateRequest,
  adminController.updateUserStatus
);

router.patch('/users/:userId/role',
  [
    param('userId').isUUID().withMessage('معرف المستخدم غير صالح'),
    body('role').isIn(['user', 'seller', 'admin', 'super_admin']).withMessage('دور المستخدم غير صالح')
  ],
  validateRequest,
  adminController.updateUserRole
);

// Auction Management
router.get('/auctions',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('رقم الصفحة يجب أن يكون رقم موجب'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('عدد العناصر يجب أن يكون بين 1 و 100'),
    query('search').optional().isLength({ max: 100 }).withMessage('نص البحث طويل جداً'),
    query('status').optional().isIn(['draft', 'pending', 'approved', 'active', 'completed', 'cancelled', 'rejected', 'suspended']).withMessage('حالة المزاد غير صالحة'),
    query('category').optional().isUUID().withMessage('معرف التصنيف غير صالح'),
    query('seller').optional().isUUID().withMessage('معرف البائع غير صالح'),
    query('sortBy').optional().isIn(['createdAt', 'title', 'startingPrice', 'currentPrice', 'startTime', 'endTime']).withMessage('ترتيب غير صالح'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('اتجاه الترتيب غير صالح')
  ],
  validateRequest,
  adminController.getAllAuctions
);

router.patch('/auctions/:auctionId/status',
  [
    param('auctionId').isUUID().withMessage('معرف المزاد غير صالح'),
    body('status').isIn(['pending', 'approved', 'rejected', 'suspended']).withMessage('حالة المزاد غير صالحة'),
    body('reason').optional().isLength({ max: 500 }).withMessage('سبب التحديث طويل جداً')
  ],
  validateRequest,
  adminController.updateAuctionStatus
);

router.delete('/auctions/:auctionId',
  [
    param('auctionId').isUUID().withMessage('معرف المزاد غير صالح'),
    body('reason').optional().isLength({ max: 500 }).withMessage('سبب الحذف طويل جداً')
  ],
  validateRequest,
  adminController.deleteAuction
);

// Bid Management
router.get('/bids',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('رقم الصفحة يجب أن يكون رقم موجب'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('عدد العناصر يجب أن يكون بين 1 و 100'),
    query('auctionId').optional().isUUID().withMessage('معرف المزاد غير صالح'),
    query('userId').optional().isUUID().withMessage('معرف المستخدم غير صالح'),
    query('status').optional().isIn(['active', 'cancelled', 'winning', 'lost']).withMessage('حالة المزايدة غير صالحة'),
    query('sortBy').optional().isIn(['createdAt', 'amount', 'bidTime']).withMessage('ترتيب غير صالح'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('اتجاه الترتيب غير صالح')
  ],
  validateRequest,
  adminController.getAllBids
);

router.patch('/bids/:bidId/cancel',
  [
    param('bidId').isUUID().withMessage('معرف المزايدة غير صالح'),
    body('reason').isLength({ min: 10, max: 500 }).withMessage('سبب الإلغاء يجب أن يكون بين 10 و 500 حرف')
  ],
  validateRequest,
  adminController.cancelBid
);

// Comments Management
router.get('/comments',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('رقم الصفحة يجب أن يكون رقم موجب'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('عدد العناصر يجب أن يكون بين 1 و 100'),
    query('auctionId').optional().isUUID().withMessage('معرف المزاد غير صالح'),
    query('userId').optional().isUUID().withMessage('معرف المستخدم غير صالح'),
    query('status').optional().isIn(['active', 'hidden', 'deleted']).withMessage('حالة التعليق غير صالحة'),
    query('sortBy').optional().isIn(['createdAt', 'likes', 'reports']).withMessage('ترتيب غير صالح'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('اتجاه الترتيب غير صالح')
  ],
  validateRequest,
  adminController.getAllComments
);

router.patch('/comments/:commentId/status',
  [
    param('commentId').isUUID().withMessage('معرف التعليق غير صالح'),
    body('status').isIn(['active', 'hidden', 'deleted']).withMessage('حالة التعليق غير صالحة'),
    body('reason').optional().isLength({ max: 500 }).withMessage('سبب التحديث طويل جداً')
  ],
  validateRequest,
  adminController.updateCommentStatus
);

// Reports Management
router.get('/reports',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('رقم الصفحة يجب أن يكون رقم موجب'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('عدد العناصر يجب أن يكون بين 1 و 100'),
    query('type').optional().isIn(['auction', 'comment', 'user', 'message']).withMessage('نوع البلاغ غير صالح'),
    query('status').optional().isIn(['pending', 'in_review', 'resolved', 'rejected']).withMessage('حالة البلاغ غير صالحة'),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('أولوية البلاغ غير صالحة'),
    query('sortBy').optional().isIn(['createdAt', 'priority', 'status']).withMessage('ترتيب غير صالح'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('اتجاه الترتيب غير صالح')
  ],
  validateRequest,
  adminController.getAllReports
);

router.get('/reports/:reportId',
  [
    param('reportId').isUUID().withMessage('معرف البلاغ غير صالح')
  ],
  validateRequest,
  adminController.getReportById
);

router.patch('/reports/:reportId/status',
  [
    param('reportId').isUUID().withMessage('معرف البلاغ غير صالح'),
    body('status').isIn(['pending', 'in_review', 'resolved', 'rejected']).withMessage('حالة البلاغ غير صالحة'),
    body('resolution').optional().isLength({ max: 1000 }).withMessage('نص الحل طويل جداً'),
    body('notes').optional().isLength({ max: 500 }).withMessage('الملاحظات طويلة جداً')
  ],
  validateRequest,
  adminController.updateReportStatus
);

router.patch('/reports/:reportId/assign',
  [
    param('reportId').isUUID().withMessage('معرف البلاغ غير صالح'),
    body('adminId').isUUID().withMessage('معرف المشرف غير صالح')
  ],
  validateRequest,
  adminController.assignReport
);

// System Settings
router.get('/settings', adminController.getSystemSettings);

router.patch('/settings',
  requireRole(['super_admin']), // Only super admin can update system settings
  [
    body('siteName').optional().isLength({ min: 2, max: 100 }).withMessage('اسم الموقع يجب أن يكون بين 2 و 100 حرف'),
    body('siteDescription').optional().isLength({ max: 500 }).withMessage('وصف الموقع طويل جداً'),
    body('contactEmail').optional().isEmail().withMessage('بريد إلكتروني غير صالح'),
    body('defaultBidIncrement').optional().isFloat({ min: 0.01 }).withMessage('زيادة المزايدة الافتراضية غير صالحة'),
    body('maxAuctionDuration').optional().isInt({ min: 1, max: 168 }).withMessage('مدة المزاد القصوى غير صالحة'), // max 7 days in hours
    body('minAuctionDuration').optional().isInt({ min: 1, max: 24 }).withMessage('مدة المزاد الدنيا غير صالحة'),
    body('commissionRate').optional().isFloat({ min: 0, max: 0.5 }).withMessage('نسبة العمولة غير صالحة'), // max 50%
    body('maxFileSize').optional().isInt({ min: 1, max: 1000 }).withMessage('حجم الملف الأقصى غير صالح'), // in MB
    body('allowedFileTypes').optional().isArray().withMessage('أنواع الملفات المسموحة غير صالحة'),
    body('maintenanceMode').optional().isBoolean().withMessage('وضع الصيانة غير صالح'),
    body('registrationEnabled').optional().isBoolean().withMessage('إعداد التسجيل غير صالح')
  ],
  validateRequest,
  adminController.updateSystemSettings
);

// Activity Logs
router.get('/activity-logs',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('رقم الصفحة يجب أن يكون رقم موجب'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('عدد العناصر يجب أن يكون بين 1 و 100'),
    query('action').optional().isLength({ max: 50 }).withMessage('نوع العملية طويل جداً'),
    query('userId').optional().isUUID().withMessage('معرف المستخدم غير صالح'),
    query('targetType').optional().isIn(['user', 'auction', 'bid', 'comment', 'report']).withMessage('نوع الهدف غير صالح'),
    query('startDate').optional().isISO8601().withMessage('تاريخ البداية غير صالح'),
    query('endDate').optional().isISO8601().withMessage('تاريخ النهاية غير صالح'),
    query('sortBy').optional().isIn(['createdAt', 'action', 'userId']).withMessage('ترتيب غير صالح'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('اتجاه الترتيب غير صالح')
  ],
  validateRequest,
  adminController.getActivityLogs
);

// Bulk Operations
router.patch('/users/bulk',
  requireRole(['super_admin']), // Only super admin can perform bulk operations
  [
    body('userIds').isArray({ min: 1 }).withMessage('يجب تحديد مستخدم واحد على الأقل'),
    body('userIds.*').isUUID().withMessage('معرف المستخدم غير صالح'),
    body('action').isIn(['updateStatus', 'updateRole', 'delete']).withMessage('عملية غير صالحة'),
    body('status').optional().isIn(['active', 'suspended', 'banned']).withMessage('حالة المستخدم غير صالحة'),
    body('role').optional().isIn(['user', 'seller', 'admin', 'super_admin']).withMessage('دور المستخدم غير صالح'),
    body('reason').optional().isLength({ max: 500 }).withMessage('السبب طويل جداً')
  ],
  validateRequest,
  adminController.bulkUpdateUsers
);

router.patch('/auctions/bulk',
  requireRole(['admin', 'super_admin']),
  [
    body('auctionIds').isArray({ min: 1 }).withMessage('يجب تحديد مزاد واحد على الأقل'),
    body('auctionIds.*').isUUID().withMessage('معرف المزاد غير صالح'),
    body('action').isIn(['updateStatus', 'delete']).withMessage('عملية غير صالحة'),
    body('status').optional().isIn(['pending', 'approved', 'rejected', 'suspended']).withMessage('حالة المزاد غير صالحة'),
    body('reason').optional().isLength({ max: 500 }).withMessage('السبب طويل جداً')
  ],
  validateRequest,
  adminController.bulkUpdateAuctions
);

// Export Data
router.get('/export/users',
  requireRole(['super_admin']),
  [
    query('format').optional().isIn(['csv', 'excel', 'json']).withMessage('نوع الملف غير مدعوم'),
    query('filters').optional().isJSON().withMessage('فلاتر التصدير غير صالحة')
  ],
  validateRequest,
  adminController.exportUserData
);

router.get('/export/auctions',
  requireRole(['admin', 'super_admin']),
  [
    query('format').optional().isIn(['csv', 'excel', 'json']).withMessage('نوع الملف غير مدعوم'),
    query('filters').optional().isJSON().withMessage('فلاتر التصدير غير صالحة')
  ],
  validateRequest,
  adminController.exportAuctionData
);

module.exports = router;