const mediaService = require('../services/mediaService');
const { AppError, catchAsync } = require('../utils/errorHandling');
const logger = require('../utils/logger');

// Upload single image
const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('يرجى اختيار صورة للرفع', 400));
  }

  // Validate file type
  if (!req.file.mimetype.startsWith('image/')) {
    return next(new AppError('الملف المرفوع يجب أن يكون صورة', 400));
  }

  // Validate file size (5MB max)
  if (req.file.size > 5 * 1024 * 1024) {
    return next(new AppError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 400));
  }

  const { type = 'auction', entity_id, is_cover = false } = req.body;
  const user_id = req.user.id;

  logger.info('Processing image upload', {
    user_id,
    filename: req.file.originalname,
    size: req.file.size,
    type,
    entity_id
  });

  const result = await mediaService.uploadImage({
    file: req.file,
    user_id,
    type,
    entity_id,
    is_cover: is_cover === 'true'
  });

  res.status(201).json({
    success: true,
    message: 'تم رفع الصورة بنجاح',
    data: result
  });
});

// Upload multiple images
const uploadImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('يرجى اختيار الصور للرفع', 400));
  }

  // Validate files
  for (const file of req.files) {
    if (!file.mimetype.startsWith('image/')) {
      return next(new AppError('جميع الملفات يجب أن تكون صور', 400));
    }
    if (file.size > 5 * 1024 * 1024) {
      return next(new AppError('حجم كل صورة يجب أن يكون أقل من 5 ميجابايت', 400));
    }
  }

  const { type = 'auction', entity_id } = req.body;
  const user_id = req.user.id;

  logger.info('Processing multiple images upload', {
    user_id,
    count: req.files.length,
    type,
    entity_id
  });

  const results = await mediaService.uploadMultipleImages({
    files: req.files,
    user_id,
    type,
    entity_id
  });

  res.status(201).json({
    success: true,
    message: `تم رفع ${results.length} صورة بنجاح`,
    data: results
  });
});

// Upload video
const uploadVideo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('يرجى اختيار فيديو للرفع', 400));
  }

  // Validate file type
  if (!req.file.mimetype.startsWith('video/')) {
    return next(new AppError('الملف المرفوع يجب أن يكون فيديو', 400));
  }

  // Validate file size (100MB max)
  if (req.file.size > 100 * 1024 * 1024) {
    return next(new AppError('حجم الفيديو يجب أن يكون أقل من 100 ميجابايت', 400));
  }

  const { type = 'auction', entity_id } = req.body;
  const user_id = req.user.id;

  logger.info('Processing video upload', {
    user_id,
    filename: req.file.originalname,
    size: req.file.size,
    type,
    entity_id
  });

  // Start async video processing
  const result = await mediaService.uploadVideo({
    file: req.file,
    user_id,
    type,
    entity_id
  });

  res.status(201).json({
    success: true,
    message: 'تم رفع الفيديو بنجاح وبدأت عملية المعالجة',
    data: result
  });
});

// Get media by ID
const getMedia = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const media = await mediaService.getMediaById(id);
  
  if (!media) {
    return next(new AppError('الوسائط غير موجودة', 404));
  }

  res.json({
    success: true,
    data: media
  });
});

// Get media by entity
const getMediaByEntity = catchAsync(async (req, res, next) => {
  const { type, entity_id } = req.params;
  const { media_type } = req.query; // 'image' or 'video'
  
  const media = await mediaService.getMediaByEntity({
    type,
    entity_id,
    media_type
  });

  res.json({
    success: true,
    data: media
  });
});

// Delete media
const deleteMedia = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const user_role = req.user.role;
  
  const media = await mediaService.getMediaById(id);
  
  if (!media) {
    return next(new AppError('الوسائط غير موجودة', 404));
  }

  // Check permissions
  if (media.uploaded_by !== user_id && user_role !== 'admin' && user_role !== 'moderator') {
    return next(new AppError('لا يمكنك حذف هذه الوسائط', 403));
  }

  await mediaService.deleteMedia(id);

  logger.info('Media deleted', {
    media_id: id,
    deleted_by: user_id
  });

  res.json({
    success: true,
    message: 'تم حذف الوسائط بنجاح'
  });
});

// Update media metadata
const updateMedia = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const user_role = req.user.role;
  const { alt_text, title, is_cover } = req.body;
  
  const media = await mediaService.getMediaById(id);
  
  if (!media) {
    return next(new AppError('الوسائط غير موجودة', 404));
  }

  // Check permissions
  if (media.uploaded_by !== user_id && user_role !== 'admin' && user_role !== 'moderator') {
    return next(new AppError('لا يمكنك تعديل هذه الوسائط', 403));
  }

  const updatedMedia = await mediaService.updateMedia(id, {
    alt_text,
    title,
    is_cover
  });

  res.json({
    success: true,
    message: 'تم تحديث الوسائط بنجاح',
    data: updatedMedia
  });
});

// Get video processing status
const getVideoStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const status = await mediaService.getVideoProcessingStatus(id);
  
  if (!status) {
    return next(new AppError('الفيديو غير موجود', 404));
  }

  res.json({
    success: true,
    data: status
  });
});

// Generate video thumbnail
const generateThumbnail = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { timestamp = 5 } = req.body; // Default to 5 seconds
  
  const media = await mediaService.getMediaById(id);
  
  if (!media || media.type !== 'video') {
    return next(new AppError('الفيديو غير موجود', 404));
  }

  const thumbnail = await mediaService.generateVideoThumbnail(id, timestamp);

  res.json({
    success: true,
    message: 'تم إنشاء الصورة المصغرة بنجاح',
    data: thumbnail
  });
});

// Get user's media
const getUserMedia = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 20, type, media_type } = req.query;
  const currentUserId = req.user.id;
  const userRole = req.user.role;

  // Check permissions
  if (userId !== currentUserId && userRole !== 'admin' && userRole !== 'moderator') {
    return next(new AppError('لا يمكنك عرض وسائط المستخدمين الآخرين', 403));
  }

  const result = await mediaService.getUserMedia({
    userId,
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    media_type
  });

  res.json({
    success: true,
    data: result.media,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages
    }
  });
});

// Bulk delete media
const bulkDeleteMedia = catchAsync(async (req, res, next) => {
  const { media_ids } = req.body;
  const user_id = req.user.id;
  const user_role = req.user.role;

  if (!media_ids || !Array.isArray(media_ids) || media_ids.length === 0) {
    return next(new AppError('يرجى تحديد الوسائط المراد حذفها', 400));
  }

  const result = await mediaService.bulkDeleteMedia({
    media_ids,
    user_id,
    user_role
  });

  logger.info('Bulk media deletion', {
    deleted_count: result.deleted_count,
    failed_count: result.failed_count,
    deleted_by: user_id
  });

  res.json({
    success: true,
    message: `تم حذف ${result.deleted_count} وسائط بنجاح`,
    data: {
      deleted_count: result.deleted_count,
      failed_count: result.failed_count,
      failed_ids: result.failed_ids
    }
  });
});

module.exports = {
  uploadImage,
  uploadImages,
  uploadVideo,
  getMedia,
  getMediaByEntity,
  deleteMedia,
  updateMedia,
  getVideoStatus,
  generateThumbnail,
  getUserMedia,
  bulkDeleteMedia
};