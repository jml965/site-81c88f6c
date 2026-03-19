const adminService = require('../services/adminService');
const reportService = require('../services/reportService');
const { asyncHandler } = require('../middleware/asyncHandler');
const { ValidationError, NotFoundError, ForbiddenError } = require('../utils/errors');

// Dashboard Statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.json({ success: true, data: stats });
});

// User Management
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  const result = await adminService.getAllUsers({
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    role,
    status,
    sortBy,
    sortOrder
  });
  
  res.json({ success: true, data: result });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await adminService.getUserById(userId);
  
  if (!user) {
    throw new NotFoundError('المستخدم غير موجود');
  }
  
  res.json({ success: true, data: user });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status, reason } = req.body;
  
  if (!['active', 'suspended', 'banned'].includes(status)) {
    throw new ValidationError('حالة المستخدم غير صالحة');
  }
  
  const user = await adminService.updateUserStatus(userId, status, reason, req.user.id);
  
  res.json({
    success: true,
    message: 'تم تحديث حالة المستخدم بنجاح',
    data: user
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  
  if (!['user', 'seller', 'admin', 'super_admin'].includes(role)) {
    throw new ValidationError('دور المستخدم غير صالح');
  }
  
  // Only super admin can assign admin roles
  if ((role === 'admin' || role === 'super_admin') && req.user.role !== 'super_admin') {
    throw new ForbiddenError('غير مسموح بتعديل صلاحيات الإدارة');
  }
  
  const user = await adminService.updateUserRole(userId, role, req.user.id);
  
  res.json({
    success: true,
    message: 'تم تحديث دور المستخدم بنجاح',
    data: user
  });
});

// Auction Management
const getAllAuctions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    category,
    seller,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const result = await adminService.getAllAuctions({
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    status,
    category,
    seller,
    sortBy,
    sortOrder
  });
  
  res.json({ success: true, data: result });
});

const updateAuctionStatus = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;
  const { status, reason } = req.body;
  
  if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
    throw new ValidationError('حالة المزاد غير صالحة');
  }
  
  const auction = await adminService.updateAuctionStatus(auctionId, status, reason, req.user.id);
  
  res.json({
    success: true,
    message: 'تم تحديث حالة المزاد بنجاح',
    data: auction
  });
});

const deleteAuction = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;
  const { reason } = req.body;
  
  await adminService.deleteAuction(auctionId, reason, req.user.id);
  
  res.json({
    success: true,
    message: 'تم حذف المزاد بنجاح'
  });
});

// Bid Management
const getAllBids = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    auctionId,
    userId,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const result = await adminService.getAllBids({
    page: parseInt(page),
    limit: parseInt(limit),
    auctionId,
    userId,
    status,
    sortBy,
    sortOrder
  });
  
  res.json({ success: true, data: result });
});

const cancelBid = asyncHandler(async (req, res) => {
  const { bidId } = req.params;
  const { reason } = req.body;
  
  const bid = await adminService.cancelBid(bidId, reason, req.user.id);
  
  res.json({
    success: true,
    message: 'تم إلغاء المزايدة بنجاح',
    data: bid
  });
});

// Comments Management
const getAllComments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    auctionId,
    userId,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const result = await adminService.getAllComments({
    page: parseInt(page),
    limit: parseInt(limit),
    auctionId,
    userId,
    status,
    sortBy,
    sortOrder
  });
  
  res.json({ success: true, data: result });
});

const updateCommentStatus = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { status, reason } = req.body;
  
  if (!['active', 'hidden', 'deleted'].includes(status)) {
    throw new ValidationError('حالة التعليق غير صالحة');
  }
  
  const comment = await adminService.updateCommentStatus(commentId, status, reason, req.user.id);
  
  res.json({
    success: true,
    message: 'تم تحديث حالة التعليق بنجاح',
    data: comment
  });
});

// Reports Management
const getAllReports = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    status,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const result = await reportService.getAllReports({
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    status,
    priority,
    sortBy,
    sortOrder
  });
  
  res.json({ success: true, data: result });
});

const getReportById = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const report = await reportService.getReportById(reportId);
  
  if (!report) {
    throw new NotFoundError('البلاغ غير موجود');
  }
  
  res.json({ success: true, data: report });
});

const updateReportStatus = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { status, resolution, notes } = req.body;
  
  if (!['pending', 'in_review', 'resolved', 'rejected'].includes(status)) {
    throw new ValidationError('حالة البلاغ غير صالحة');
  }
  
  const report = await reportService.updateReportStatus(
    reportId,
    status,
    resolution,
    notes,
    req.user.id
  );
  
  res.json({
    success: true,
    message: 'تم تحديث حالة البلاغ بنجاح',
    data: report
  });
});

const assignReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { adminId } = req.body;
  
  const report = await reportService.assignReport(reportId, adminId, req.user.id);
  
  res.json({
    success: true,
    message: 'تم تكليف المشرف بالبلاغ بنجاح',
    data: report
  });
});

// System Settings
const getSystemSettings = asyncHandler(async (req, res) => {
  const settings = await adminService.getSystemSettings();
  res.json({ success: true, data: settings });
});

const updateSystemSettings = asyncHandler(async (req, res) => {
  const settings = req.body;
  const updatedSettings = await adminService.updateSystemSettings(settings, req.user.id);
  
  res.json({
    success: true,
    message: 'تم تحديث إعدادات النظام بنجاح',
    data: updatedSettings
  });
});

// Activity Logs
const getActivityLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    action,
    userId,
    targetType,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const result = await adminService.getActivityLogs({
    page: parseInt(page),
    limit: parseInt(limit),
    action,
    userId,
    targetType,
    startDate,
    endDate,
    sortBy,
    sortOrder
  });
  
  res.json({ success: true, data: result });
});

// Bulk Operations
const bulkUpdateUsers = asyncHandler(async (req, res) => {
  const { userIds, action, status, role, reason } = req.body;
  
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ValidationError('يجب تحديد المستخدمين');
  }
  
  if (!['updateStatus', 'updateRole', 'delete'].includes(action)) {
    throw new ValidationError('عملية غير صالحة');
  }
  
  const result = await adminService.bulkUpdateUsers({
    userIds,
    action,
    status,
    role,
    reason,
    adminId: req.user.id
  });
  
  res.json({
    success: true,
    message: `تم تحديث ${result.updated} مستخدم بنجاح`,
    data: result
  });
});

const bulkUpdateAuctions = asyncHandler(async (req, res) => {
  const { auctionIds, action, status, reason } = req.body;
  
  if (!Array.isArray(auctionIds) || auctionIds.length === 0) {
    throw new ValidationError('يجب تحديد المزادات');
  }
  
  if (!['updateStatus', 'delete'].includes(action)) {
    throw new ValidationError('عملية غير صالحة');
  }
  
  const result = await adminService.bulkUpdateAuctions({
    auctionIds,
    action,
    status,
    reason,
    adminId: req.user.id
  });
  
  res.json({
    success: true,
    message: `تم تحديث ${result.updated} مزاد بنجاح`,
    data: result
  });
});

// Export user data
const exportUserData = asyncHandler(async (req, res) => {
  const { format = 'csv', filters = {} } = req.query;
  
  if (!['csv', 'excel', 'json'].includes(format)) {
    throw new ValidationError('نوع الملف غير مدعوم');
  }
  
  const data = await adminService.exportUserData(format, filters);
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `users_export_${timestamp}.${format === 'excel' ? 'xlsx' : format}`;
  
  res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(data);
});

const exportAuctionData = asyncHandler(async (req, res) => {
  const { format = 'csv', filters = {} } = req.query;
  
  if (!['csv', 'excel', 'json'].includes(format)) {
    throw new ValidationError('نوع الملف غير مدعوم');
  }
  
  const data = await adminService.exportAuctionData(format, filters);
  
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `auctions_export_${timestamp}.${format === 'excel' ? 'xlsx' : format}`;
  
  res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(data);
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  getAllAuctions,
  updateAuctionStatus,
  deleteAuction,
  getAllBids,
  cancelBid,
  getAllComments,
  updateCommentStatus,
  getAllReports,
  getReportById,
  updateReportStatus,
  assignReport,
  getSystemSettings,
  updateSystemSettings,
  getActivityLogs,
  bulkUpdateUsers,
  bulkUpdateAuctions,
  exportUserData,
  exportAuctionData
};