const express = require('express');
const { body, param, query } = require('express-validator');
const auctionController = require('../controllers/auctionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

// Validation schemas
const createAuctionValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('عنوان المزاد يجب أن يكون بين 5 و 200 حرف'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('وصف المزاد يجب أن يكون بين 10 و 2000 حرف'),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('يجب تحديد تصنيف صحيح'),
  body('starting_price')
    .isFloat({ min: 1 })
    .withMessage('سعر البداية يجب أن يكون أكبر من 0'),
  body('min_bid_increment')
    .isFloat({ min: 0.1 })
    .withMessage('أقل زيادة يجب أن تكون أكبر من 0.1'),
  body('duration_minutes')
    .isInt({ min: 5, max: 1440 })
    .withMessage('مدة المزاد يجب أن تكون بين 5 دقائق و 24 ساعة'),
  body('start_time')
    .optional()
    .isISO8601()
    .withMessage('وقت البداية يجب أن يكون تاريخ صحيح'),
  body('video_url')
    .optional()
    .isURL()
    .withMessage('رابط الفيديو يجب أن يكون صحيح'),
  body('cover_image_url')
    .optional()
    .isURL()
    .withMessage('رابط صورة الغلاف يجب أن يكون صحيح'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('الموقع يجب أن يكون أقل من 200 حرف'),
  body('condition')
    .optional()
    .isIn(['new', 'used', 'refurbished', 'damaged'])
    .withMessage('حالة المنتج يجب أن تكون إحدى القيم المحددة'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('العلامات يجب أن تكون مصفوفة'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('كل علامة يجب أن تكون بين 2 و 50 حرف')
];

const updateAuctionValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('عنوان المزاد يجب أن يكون بين 5 و 200 حرف'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('وصف المزاد يجب أن يكون بين 10 و 2000 حرف'),
  body('starting_price')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('سعر البداية يجب أن يكون أكبر من 0'),
  body('min_bid_increment')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('أقل زيادة يجب أن تكون أكبر من 0.1'),
  body('duration_minutes')
    .optional()
    .isInt({ min: 5, max: 1440 })
    .withMessage('مدة المزاد يجب أن تكون بين 5 دقائق و 24 ساعة'),
  body('start_time')
    .optional()
    .isISO8601()
    .withMessage('وقت البداية يجب أن يكون تاريخ صحيح'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('الموقع يجب أن يكون أقل من 200 حرف'),
  body('condition')
    .optional()
    .isIn(['new', 'used', 'refurbished', 'damaged'])
    .withMessage('حالة المنتج يجب أن تكون إحدى القيم المحددة'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('العلامات يجب أن تكون مصفوفة'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('كل علامة يجب أن تكون بين 2 و 50 حرف')
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('معرف المزاد يجب أن يكون رقم صحيح')
];

const sellerIdValidation = [
  param('seller_id')
    .isInt({ min: 1 })
    .withMessage('معرف البائع يجب أن يكون رقم صحيح')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('رقم الصفحة يجب أن يكون رقم صحيح أكبر من 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('عدد العناصر يجب أن يكون بين 1 و 100')
];

// Public routes
// Get all auctions with filtering
router.get('/', paginationValidation, auctionController.getAllAuctions);

// Get auction by ID
router.get('/:id', idValidation, auctionController.getAuctionById);

// Get auction sync data (for active auctions)
router.get('/:id/sync', idValidation, auctionController.getAuctionSync);

// Get auction participants
router.get('/:id/participants', 
  idValidation, 
  paginationValidation, 
  auctionController.getParticipants
);

// Get auction statistics
router.get('/:id/stats', idValidation, auctionController.getAuctionStats);

// Get seller auctions
router.get('/seller/:seller_id', 
  sellerIdValidation, 
  paginationValidation, 
  auctionController.getSellerAuctions
);

// Protected routes (require authentication)
// Join auction
router.post('/:id/join', 
  authMiddleware,
  idValidation,
  auctionController.joinAuction
);

// Leave auction
router.post('/:id/leave', 
  authMiddleware,
  idValidation,
  auctionController.leaveAuction
);

// Seller routes (require seller role)
// Create new auction
router.post('/', 
  authMiddleware,
  roleMiddleware(['seller', 'admin']),
  createAuctionValidation,
  auctionController.createAuction
);

// Update auction
router.put('/:id', 
  authMiddleware,
  roleMiddleware(['seller', 'admin']),
  idValidation,
  updateAuctionValidation,
  auctionController.updateAuction
);

// Start auction
router.post('/:id/start', 
  authMiddleware,
  roleMiddleware(['seller', 'admin']),
  idValidation,
  auctionController.startAuction
);

// End auction
router.post('/:id/end', 
  authMiddleware,
  roleMiddleware(['seller', 'admin']),
  idValidation,
  auctionController.endAuction
);

// Admin routes
// Delete auction
router.delete('/:id', 
  authMiddleware,
  roleMiddleware(['admin']),
  idValidation,
  auctionController.deleteAuction
);

// Error handling middleware for this router
router.use((error, req, res, next) => {
  console.error('Auction routes error:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'بيانات JSON غير صحيحة'
    });
  }
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'حجم الملف كبير جداً'
    });
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'عدد الملفات تجاوز الحد المسموح'
    });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'نوع الملف غير مدعوم'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;