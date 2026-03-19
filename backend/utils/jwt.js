const jwt = require('jsonwebtoken');

/**
 * إنشاء JWT Token للمصادقة
 * @param {Object} payload - البيانات المراد تشفيرها في التوكن
 * @param {string} expiresIn - مدة انتهاء صلاحية التوكن (افتراضي: 24h)
 * @returns {string} JWT Token
 */
const generateToken = (payload, expiresIn = '24h') => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000), // issued at
        type: 'access_token'
      },
      process.env.JWT_SECRET,
      {
        expiresIn,
        issuer: process.env.JWT_ISSUER || 'mazad-motion',
        audience: process.env.JWT_AUDIENCE || 'mazad-users'
      }
    );

    return token;

  } catch (error) {
    console.error('Generate token error:', error);
    throw new Error('فشل في إنشاء رمز الوصول');
  }
};

/**
 * إنشاء Refresh Token
 * @param {Object} payload - البيانات المراد تشفيرها في التوكن
 * @param {string} expiresIn - مدة انتهاء صلاحية التوكن (افتراضي: 30d)
 * @returns {string} Refresh Token
 */
const generateRefreshToken = (payload, expiresIn = '30d') => {
  try {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }

    const refreshToken = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        iat: Math.floor(Date.now() / 1000),
        type: 'refresh_token'
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn,
        issuer: process.env.JWT_ISSUER || 'mazad-motion',
        audience: process.env.JWT_AUDIENCE || 'mazad-users'
      }
    );

    return refreshToken;

  } catch (error) {
    console.error('Generate refresh token error:', error);
    throw new Error('فشل في إنشاء رمز التجديد');
  }
};

/**
 * التحقق من صحة JWT Token
 * @param {string} token - التوكن المراد التحقق منه
 * @param {string} secret - المفتاح السري للتحقق (افتراضي: JWT_SECRET)
 * @returns {Object} البيانات المفكوكة من التوكن
 */
const verifyToken = (token, secret = null) => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }

    const secretKey = secret || process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT secret is not defined');
    }

    const decoded = jwt.verify(token, secretKey, {
      issuer: process.env.JWT_ISSUER || 'mazad-motion',
      audience: process.env.JWT_AUDIENCE || 'mazad-users'
    });

    return decoded;

  } catch (error) {
    console.error('Verify token error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      throw new Error('رمز الوصول غير صحيح');
    }
    
    if (error.name === 'TokenExpiredError') {
      throw new Error('رمز الوصول منتهي الصلاحية');
    }
    
    if (error.name === 'NotBeforeError') {
      throw new Error('رمز الوصول غير نشط بعد');
    }
    
    throw new Error('فشل في التحقق من رمز الوصول');
  }
};

/**
 * التحقق من صحة Refresh Token
 * @param {string} refreshToken - رمز التجديد
 * @returns {Object} البيانات المفكوكة من رمز التجديد
 */
const verifyRefreshToken = (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
      issuer: process.env.JWT_ISSUER || 'mazad-motion',
      audience: process.env.JWT_AUDIENCE || 'mazad-users'
    });

    // التحقق من نوع التوكن
    if (decoded.type !== 'refresh_token') {
      throw new Error('Invalid token type');
    }

    return decoded;

  } catch (error) {
    console.error('Verify refresh token error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      throw new Error('رمز التجديد غير صحيح');
    }
    
    if (error.name === 'TokenExpiredError') {
      throw new Error('رمز التجديد منتهي الصلاحية');
    }
    
    throw new Error('فشل في التحقق من رمز التجديد');
  }
};

/**
 * فك تشفير التوكن بدون التحقق من صحته (للقراءة فقط)
 * @param {string} token - التوكن المراد فك تشفيره
 * @returns {Object} البيانات المفكوكة
 */
const decodeToken = (token) => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }

    const decoded = jwt.decode(token);
    return decoded;

  } catch (error) {
    console.error('Decode token error:', error);
    throw new Error('فشل في فك تشفير التوكن');
  }
};

/**
 * الحصول على معلومات انتهاء صلاحية التوكن
 * @param {string} token - التوكن
 * @returns {Object} معلومات انتهاء الصلاحية
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token structure');
    }

    const expirationDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();
    const isExpired = currentDate > expirationDate;
    const timeUntilExpiration = expirationDate.getTime() - currentDate.getTime();

    return {
      expirationDate,
      isExpired,
      timeUntilExpiration: Math.max(0, timeUntilExpiration),
      timeUntilExpirationHours: Math.max(0, Math.floor(timeUntilExpiration / (1000 * 60 * 60))),
      timeUntilExpirationMinutes: Math.max(0, Math.floor(timeUntilExpiration / (1000 * 60)))
    };

  } catch (error) {
    console.error('Get token expiration error:', error);
    throw new Error('فشل في الحصول على معلومات انتهاء صلاحية التوكن');
  }
};

/**
 * إنشاء توكن مؤقت للعمليات الحساسة (مثل إعادة تعيين كلمة المرور)
 * @param {Object} payload - البيانات
 * @param {string} expiresIn - مدة الصلاحية (افتراضي: 1h)
 * @returns {string} التوكن المؤقت
 */
const generateTempToken = (payload, expiresIn = '1h') => {
  try {
    if (!process.env.JWT_TEMP_SECRET) {
      throw new Error('JWT_TEMP_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        type: 'temp_token'
      },
      process.env.JWT_TEMP_SECRET,
      {
        expiresIn,
        issuer: process.env.JWT_ISSUER || 'mazad-motion',
        audience: process.env.JWT_AUDIENCE || 'mazad-users'
      }
    );

    return token;

  } catch (error) {
    console.error('Generate temp token error:', error);
    throw new Error('فشل في إنشاء الرمز المؤقت');
  }
};

/**
 * التحقق من التوكن المؤقت
 * @param {string} tempToken - التوكن المؤقت
 * @returns {Object} البيانات المفكوكة
 */
const verifyTempToken = (tempToken) => {
  try {
    if (!tempToken) {
      throw new Error('Temp token is required');
    }

    if (!process.env.JWT_TEMP_SECRET) {
      throw new Error('JWT_TEMP_SECRET is not defined');
    }

    const decoded = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET, {
      issuer: process.env.JWT_ISSUER || 'mazad-motion',
      audience: process.env.JWT_AUDIENCE || 'mazad-users'
    });

    // التحقق من نوع التوكن
    if (decoded.type !== 'temp_token') {
      throw new Error('Invalid token type');
    }

    return decoded;

  } catch (error) {
    console.error('Verify temp token error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      throw new Error('الرمز المؤقت غير صحيح');
    }
    
    if (error.name === 'TokenExpiredError') {
      throw new Error('الرمز المؤقت منتهي الصلاحية');
    }
    
    throw new Error('فشل في التحقق من الرمز المؤقت');
  }
};

/**
 * تنسيق خطأ JWT للإرسال للعميل
 * @param {Error} error - خطأ JWT
 * @returns {Object} خطأ منسق
 */
const formatJWTError = (error) => {
  const errorResponse = {
    success: false,
    message: 'خطأ في التحقق من الهوية',
    errors: {
      auth: 'خطأ في رمز الوصول'
    }
  };

  switch (error.name) {
    case 'JsonWebTokenError':
      errorResponse.message = 'رمز الوصول غير صحيح';
      errorResponse.errors.auth = 'رمز الوصول غير صحيح أو تالف';
      break;
    
    case 'TokenExpiredError':
      errorResponse.message = 'رمز الوصول منتهي الصلاحية';
      errorResponse.errors.auth = 'رمز الوصول منتهي الصلاحية، يرجى تسجيل الدخول مرة أخرى';
      break;
    
    case 'NotBeforeError':
      errorResponse.message = 'رمز الوصول غير نشط بعد';
      errorResponse.errors.auth = 'رمز الوصول غير صالح للاستخدام حالياً';
      break;
    
    default:
      errorResponse.message = 'خطأ في معالجة رمز الوصول';
      errorResponse.errors.auth = error.message || 'خطأ غير محدد في رمز الوصول';
  }

  return errorResponse;
};

/**
 * استخراج التوكن من header التفويض
 * @param {Object} req - طلب Express
 * @returns {string|null} التوكن أو null
 */
const extractTokenFromHeader = (req) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return null;
    }

    // تنسيق: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];

  } catch (error) {
    console.error('Extract token error:', error);
    return null;
  }
};

/**
 * التحقق من قوة التوكن (طول المفتاح، خوارزمية التشفير، إلخ)
 * @param {string} token - التوكن
 * @returns {Object} معلومات قوة التوكن
 */
const analyzeTokenStrength = (token) => {
  try {
    const decoded = decodeToken(token);
    const header = jwt.decode(token, { complete: true }).header;
    
    return {
      algorithm: header.alg,
      type: header.typ,
      hasExpiration: !!decoded.exp,
      hasIssuedAt: !!decoded.iat,
      hasIssuer: !!decoded.iss,
      hasAudience: !!decoded.aud,
      customFields: Object.keys(decoded).filter(key => 
        !['exp', 'iat', 'iss', 'aud', 'sub', 'jti', 'nbf'].includes(key)
      )
    };

  } catch (error) {
    console.error('Analyze token strength error:', error);
    throw new Error('فشل في تحليل قوة التوكن');
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiration,
  generateTempToken,
  verifyTempToken,
  formatJWTError,
  extractTokenFromHeader,
  analyzeTokenStrength
};