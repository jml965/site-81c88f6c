const cors = require('cors');
const logger = require('../utils/logger');
const { ALLOWED_ORIGINS, NODE_ENV } = require('../config/env');

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow localhost in development and testing
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Log blocked origin
    logger.warn(`CORS blocked origin: ${origin}`);
    
    const error = new Error(
      `الأصل '${origin}' غير مسموح بسبب سياسة CORS - Origin '${origin}' not allowed by CORS policy`
    );
    error.status = 403;
    callback(error, false);
  },
  
  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
    'HEAD'
  ],
  
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-HTTP-Method-Override',
    'X-Forwarded-For',
    'X-Real-IP',
    'User-Agent',
    'Accept-Language',
    'Accept-Encoding'
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page',
    'X-Rate-Limit-Limit',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset'
  ],
  
  credentials: true, // Allow credentials (cookies, authorization headers)
  
  optionsSuccessStatus: 200, // Support legacy browsers
  
  maxAge: 86400 // Cache preflight for 24 hours
};

// Create CORS middleware
const corsMiddleware = cors(corsOptions);

// Enhanced CORS middleware with logging
const enhancedCorsMiddleware = (req, res, next) => {
  // Log CORS requests in development
  if (NODE_ENV === 'development') {
    const origin = req.get('Origin');
    const method = req.method;
    
    if (method === 'OPTIONS') {
      logger.debug(`CORS preflight request from ${origin || 'unknown'} for ${req.get('Access-Control-Request-Method') || 'unknown method'}`);
    } else if (origin) {
      logger.debug(`CORS request from ${origin} - ${method} ${req.url}`);
    }
  }
  
  // Apply CORS
  corsMiddleware(req, res, (err) => {
    if (err) {
      logger.error('CORS error:', {
        error: err.message,
        origin: req.get('Origin'),
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(403).json({
        success: false,
        error: 'cors_blocked',
        message: 'طلبك مرفوض بسبب سياسة الأمان',
        englishMessage: 'Request blocked by CORS policy',
        origin: req.get('Origin')
      });
    }
    
    // Add security headers
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Add Arabic-specific headers
    if (req.get('Accept-Language')?.includes('ar')) {
      res.header('Content-Language', 'ar');
    }
    
    next();
  });
};

// Specific CORS handler for Socket.IO
const socketCorsOptions = {
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST'],
  credentials: true
};

// CORS preflight handler for complex requests
const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    res.header('Vary', 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    
    logger.debug('CORS preflight handled:', {
      origin: req.get('Origin'),
      requestMethod: req.get('Access-Control-Request-Method'),
      requestHeaders: req.get('Access-Control-Request-Headers')
    });
    
    return res.status(204).end();
  }
  
  next();
};

// CORS error handler
const corsErrorHandler = (error, req, res, next) => {
  if (error && error.message.includes('CORS')) {
    logger.warn('CORS policy violation:', {
      origin: req.get('Origin'),
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      error: error.message
    });
    
    return res.status(403).json({
      success: false,
      error: 'cors_violation',
      message: 'مخالفة لسياسة CORS - يرجى التأكد من الأصل المرسل للطلب',
      englishMessage: 'CORS policy violation - please check the request origin',
      details: {
        origin: req.get('Origin'),
        allowedOrigins: NODE_ENV === 'development' ? ['*'] : ALLOWED_ORIGINS
      }
    });
  }
  
  next(error);
};

// Development CORS bypass (use with caution)
const developmentCorsBypass = (req, res, next) => {
  if (NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  
  next();
};

module.exports = enhancedCorsMiddleware;
module.exports.corsOptions = corsOptions;
module.exports.socketCorsOptions = socketCorsOptions;
module.exports.handlePreflight = handlePreflight;
module.exports.corsErrorHandler = corsErrorHandler;
module.exports.developmentCorsBypass = developmentCorsBypass;