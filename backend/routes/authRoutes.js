const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/roleAuth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// معدل محدود للتسجيل وتسجيل الدخول
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // 5 محاولات كحد أقصى
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول. حاول مرة أخرى بعد 15 دقيقة',
    errors: {
      rateLimit: 'محاولات كثيرة جداً'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // تخطي المعدل المحدود للطلبات المحلية في البيئة التطويرية
    return process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1';
  }
});

// معدل محدود لإعادة تعيين كلمة المرور
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 3, // 3 محاولات كحد أقصى
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لطلبات إعادة تعيين كلمة المرور. حاول مرة أخرى بعد ساعة',
    errors: {
      rateLimit: 'محاولات كثيرة جداً'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// معدل محدود لإعادة إرسال رمز التفعيل
const verificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 دقائق
  max: 3, // 3 محاولات كحد أقصى
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى لطلبات إعادة الإرسال. حاول مرة أخرى بعد 10 دقائق',
    errors: {
      rateLimit: 'محاولات كثيرة جداً'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * @route POST /api/auth/register
 * @desc تسجيل مستخدم جديد
 * @access Public
 */
router.post('/register', authLimiter, (req, res, next) => {
  // التحقق من Content-Type
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'نوع المحتوى يجب أن يكون application/json',
      errors: {
        contentType: 'Content-Type header must be application/json'
      }
    });
  }
  next();
}, authController.register);

/**
 * @route POST /api/auth/login
 * @desc تسجيل الدخول
 * @access Public
 */
router.post('/login', authLimiter, (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'نوع المحتوى يجب أن يكون application/json',
      errors: {
        contentType: 'Content-Type header must be application/json'
      }
    });
  }
  next();
}, authController.login);

/**
 * @route POST /api/auth/logout
 * @desc تسجيل الخروج
 * @access Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route POST /api/auth/refresh-token
 * @desc تجديد رمز الوصول
 * @access Public
 */
router.post('/refresh-token', (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'نوع المحتوى يجب أن يكون application/json',
      errors: {
        contentType: 'Content-Type header must be application/json'
      }
    });
  }
  next();
}, authController.refreshToken);

/**
 * @route GET /api/auth/verify/:token
 * @desc التحقق من البريد الإلكتروني
 * @access Public
 */
router.get('/verify/:token', (req, res, next) => {
  // التحقق من وجود التوكن
  if (!req.params.token || req.params.token.length < 32) {
    return res.status(400).json({
      success: false,
      message: 'رمز التفعيل غير صحيح',
      errors: {
        token: 'رمز التفعيل يجب أن يكون صحيحاً'
      }
    });
  }
  next();
}, authController.verifyEmail);

/**
 * @route POST /api/auth/resend-verification
 * @desc إعادة إرسال رمز التفعيل
 * @access Public
 */
router.post('/resend-verification', verificationLimiter, (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'نوع المحتوى يجب أن يكون application/json',
      errors: {
        contentType: 'Content-Type header must be application/json'
      }
    });
  }
  next();
}, authController.resendVerification);

/**
 * @route POST /api/auth/forgot-password
 * @desc طلب إعادة تعيين كلمة المرور
 * @access Public
 */
router.post('/forgot-password', passwordResetLimiter, (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'نوع المحتوى يجب أن يكون application/json',
      errors: {
        contentType: 'Content-Type header must be application/json'
      }
    });
  }
  next();
}, authController.forgotPassword);

/**
 * @route POST /api/auth/reset-password/:token
 * @desc إعادة تعيين كلمة المرور
 * @access Public
 */
router.post('/reset-password/:token', passwordResetLimiter, (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'نوع المحتوى يجب أن يكون application/json',
      errors: {
        contentType: 'Content-Type header must be application/json'
      }
    });
  }
  
  // التحقق من وجود التوكن
  if (!req.params.token || req.params.token.length < 32) {
    return res.status(400).json({
      success: false,
      message: 'رمز إعادة التعيين غير صحيح',
      errors: {
        token: 'رمز إعادة التعيين يجب أن يكون صحيحاً'
      }
    });
  }
  next();
}, authController.resetPassword);

/**
 * @route GET /api/auth/profile
 * @desc الحصول على بيانات المستخدم الحالي
 * @access Private
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @route PUT /api/auth/profile
 * @desc تحديث بيانات المستخدم
 * @access Private
 */
router.put('/profile', authenticateToken, (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'نوع المحتوى يجب أن يكون application/json',
      errors: {
        contentType: 'Content-Type header must be application/json'
      }
    });
  }
  next();
}, authController.updateProfile);

/**
 * @route PUT /api/auth/change-password
 * @desc تغيير كلمة المرور
 * @access Private
 */
router.put('/change-password', authenticateToken, (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(400).json({
      success: false,
      message: 'نوع المحتوى يجب أن يكون application/json',
      errors: {
        contentType: 'Content-Type header must be application/json'
      }
    });
  }
  next();
}, authController.changePassword);

/**
 * @route GET /api/auth/check
 * @desc التحقق من صحة التوكن
 * @access Private
 */
router.get('/check', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'التوكن صحيح',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
        isEmailVerified: req.user.isEmailVerified
      }
    }
  });
});

// معالجة الأخطاء العامة للمسارات
router.use((error, req, res, next) => {
  console.error('Auth route error:', error);
  
  // إذا كان الخطأ من التحقق من JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'تنسيق JSON غير صحيح',
      errors: {
        json: 'البيانات المرسلة غير صحيحة'
      }
    });
  }
  
  // للأخطاء الأخرى
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في الخادم',
    errors: {
      server: 'خطأ داخلي في الخادم'
    }
  });
});

module.exports = router;