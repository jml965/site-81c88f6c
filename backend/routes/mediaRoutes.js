const express = require('express');
const multer = require('multer');
const {
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
} = require('../controllers/mediaController');
const { protect, restrictTo } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 upload requests per windowMs
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح للرفع، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const videoUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 video uploads per hour
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح لرفع الفيديوهات، يرجى المحاولة لاحقاً'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
router.get('/:id', getMedia);
router.get('/entity/:type/:entity_id', getMediaByEntity);

// Protected routes
router.use(protect);

// Image upload routes
router.post('/upload/image', uploadLimiter, upload.single('image'), uploadImage);
router.post('/upload/images', uploadLimiter, upload.array('images', 10), uploadImages);

// Video upload routes
router.post('/upload/video', videoUploadLimiter, upload.single('video'), uploadVideo);

// Media management
router.patch('/:id', updateMedia);
router.delete('/:id', deleteMedia);

// Video specific routes
router.get('/video/:id/status', getVideoStatus);
router.post('/video/:id/thumbnail', generateThumbnail);

// User media
router.get('/user/:userId', getUserMedia);

// Bulk operations (admin/moderator only)
router.delete('/bulk', restrictTo('admin', 'moderator'), bulkDeleteMedia);

// Admin routes
router.use(restrictTo('admin', 'moderator'));

// Additional admin endpoints can be added here
// For example: bulk media management, storage analytics, etc.

module.exports = router;