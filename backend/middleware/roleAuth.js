const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware للتحقق من وجود وصحة JWT Token
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'رمز الوصول غير موجود',
        errors: {
          auth: 'يجب تسجيل الدخول أولاً'
        }
      });
    }

    // التحقق من صحة التوكن
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    
    // التحقق من وجود المستخدم في قاعدة البيانات
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود',
        errors: {
          auth: 'المستخدم غير موجود أو تم حذفه'
        }
      });
    }

    // التحقق من حالة المستخدم
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'الحساب غير مفعل',
        errors: {
          auth: 'الحساب غير مفعل، يرجى تفعيل الحساب'
        }
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'الحساب محظور',
        errors: {
          auth: 'تم حظر هذا الحساب'
        }
      });
    }

    // إضافة بيانات المستخدم إلى الطلب
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      userType: user.userType
    };

    next();

  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'رمز الوصول غير صحيح',
        errors: {
          auth: 'رمز الوصول غير صحيح'
        }
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'رمز الوصول منتهي الصلاحية',
        errors: {
          auth: 'رمز الوصول منتهي الصلاحية، يرجى تسجيل الدخول مرة أخرى'
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من التفويض',
      errors: {
        server: 'خطأ داخلي في الخادم'
      }
    });
  }
};

/**
 * Middleware للتحقق من الأدوار (Roles)
 * @param {string|string[]} allowedRoles - الأدوار المسموحة
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'المستخدم غير مصرح له',
          errors: {
            auth: 'يجب التحقق من الهوية أولاً'
          }
        });
      }

      const userRole = req.user.role;
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      if (!rolesArray.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'ليس لديك صلاحية للوصول لهذا المورد',
          errors: {
            authorization: 'الصلاحيات غير كافية'
          }
        });
      }

      next();

    } catch (error) {
      console.error('Role authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ في التحقق من الصلاحيات',
        errors: {
          server: 'خطأ داخلي في الخادم'
        }
      });
    }
  };
};

/**
 * Middleware للتحقق من إذن المدير
 */
const requireAdmin = requireRole('admin');

/**
 * Middleware للتحقق من إذن المشرف أو المدير
 */
const requireModerator = requireRole(['admin', 'moderator']);

/**
 * Middleware للتحقق من إذن البائع أو المشرف أو المدير
 */
const requireSeller = requireRole(['admin', 'moderator', 'seller']);

/**
 * Middleware للتحقق من إذن المستخدم العادي أو أعلى
 */
const requireUser = requireRole(['admin', 'moderator', 'seller', 'user']);

/**
 * Middleware للتحقق من ملكية المورد
 * يسمح للمستخدم بالوصول للمورد الخاص به أو للمدير/المشرف
 * @param {string} resourceUserIdParam - اسم المعامل الذي يحتوي على معرف مالك المورد
 */
const requireOwnershipOrAdmin = (resourceUserIdParam = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'المستخدم غير مصرح له',
          errors: {
            auth: 'يجب التحقق من الهوية أولاً'
          }
        });
      }

      const userRole = req.user.role;
      const userId = req.user.id;
      const resourceUserId = req.params[resourceUserIdParam] || req.body[resourceUserIdParam];

      // السماح للمدير والمشرف
      if (userRole === 'admin' || userRole === 'moderator') {
        return next();
      }

      // السماح لمالك المورد
      if (resourceUserId && userId.toString() === resourceUserId.toString()) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية للوصول لهذا المورد',
        errors: {
          authorization: 'يمكنك فقط الوصول للموارد الخاصة بك'
        }
      });

    } catch (error) {
      console.error('Ownership authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ في التحقق من الملكية',
        errors: {
          server: 'خطأ داخلي في الخادم'
        }
      });
    }
  };
};

/**
 * Middleware للتحقق من تفعيل البريد الإلكتروني
 */
const requireEmailVerified = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير مصرح له',
        errors: {
          auth: 'يجب التحقق من الهوية أولاً'
        }
      });
    }

    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'يجب تفعيل البريد الإلكتروني أولاً',
        errors: {
          emailVerification: 'البريد الإلكتروني غير مفعل'
        }
      });
    }

    next();

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من تفعيل البريد الإلكتروني',
      errors: {
        server: 'خطأ داخلي في الخادم'
      }
    });
  }
};

/**
 * Middleware اختياري للتحقق من التوكن (إذا كان موجوداً)
 * يستخدم في الحالات التي قد يكون فيها المستخدم مسجلاً أو غير مسجل
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // لا يوجد توكن، المتابعة بدون مستخدم
      req.user = null;
      return next();
    }

    try {
      // التحقق من صحة التوكن
      const decoded = verifyToken(token, process.env.JWT_SECRET);
      
      // التحقق من وجود المستخدم
      const user = await User.findById(decoded.id);
      if (user && user.isActive && !user.isBlocked) {
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          userType: user.userType
        };
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      // التوكن غير صحيح، المتابعة بدون مستخدم
      req.user = null;
    }

    next();

  } catch (error) {
    console.error('Optional auth error:', error);
    req.user = null;
    next();
  }
};

/**
 * دالة مساعدة للتحقق من الصلاحيات
 * @param {string} userRole - دور المستخدم
 * @param {string} requiredRole - الدور المطلوب
 * @returns {boolean}
 */
const hasRole = (userRole, requiredRole) => {
  const roleHierarchy = {
    'admin': 4,
    'moderator': 3,
    'seller': 2,
    'user': 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * دالة مساعدة للتحقق من ملكية المورد
 * @param {string} userId - معرف المستخدم
 * @param {string} resourceUserId - معرف مالك المورد
 * @param {string} userRole - دور المستخدم
 * @returns {boolean}
 */
const hasOwnership = (userId, resourceUserId, userRole) => {
  // المدير والمشرف يملكان الصلاحية على جميع الموارد
  if (userRole === 'admin' || userRole === 'moderator') {
    return true;
  }

  // التحقق من الملكية المباشرة
  return userId.toString() === resourceUserId.toString();
};

/**
 * Middleware مركب للتحقق من الصلاحيات المتقدمة
 * @param {Object} options - خيارات التحقق
 * @param {string[]} options.roles - الأدوار المسموحة
 * @param {boolean} options.requireEmailVerified - يتطلب تفعيل البريد
 * @param {boolean} options.checkOwnership - التحقق من الملكية
 * @param {string} options.ownershipParam - معامل الملكية
 */
const authorize = (options = {}) => {
  const {
    roles = [],
    requireEmailVerified = false,
    checkOwnership = false,
    ownershipParam = 'userId'
  } = options;

  return async (req, res, next) => {
    try {
      // التحقق من المصادقة
      await authenticateToken(req, res, () => {});
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'المستخدم غير مصرح له',
          errors: {
            auth: 'يجب تسجيل الدخول أولاً'
          }
        });
      }

      // التحقق من تفعيل البريد الإلكتروني
      if (requireEmailVerified && !req.user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: 'يجب تفعيل البريد الإلكتروني أولاً',
          errors: {
            emailVerification: 'البريد الإلكتروني غير مفعل'
          }
        });
      }

      // التحقق من الأدوار
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'ليس لديك صلاحية للوصول لهذا المورد',
          errors: {
            authorization: 'الصلاحيات غير كافية'
          }
        });
      }

      // التحقق من الملكية
      if (checkOwnership) {
        const resourceUserId = req.params[ownershipParam] || req.body[ownershipParam];
        if (!hasOwnership(req.user.id, resourceUserId, req.user.role)) {
          return res.status(403).json({
            success: false,
            message: 'ليس لديك صلاحية للوصول لهذا المورد',
            errors: {
              authorization: 'يمكنك فقط الوصول للموارد الخاصة بك'
            }
          });
        }
      }

      next();

    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ في التحقق من التفويض',
        errors: {
          server: 'خطأ داخلي في الخادم'
        }
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireModerator,
  requireSeller,
  requireUser,
  requireOwnershipOrAdmin,
  requireEmailVerified,
  optionalAuth,
  authorize,
  hasRole,
  hasOwnership
};