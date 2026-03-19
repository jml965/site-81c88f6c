const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const corsMiddleware = require('./middleware/cors');
const authMiddleware = require('./middleware/auth');
const logger = require('./utils/logger');
const { NODE_ENV } = require('./config/env');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      mediaSrc: ["'self'", 'https:', 'blob:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'ws:', 'wss:'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS middleware
app.use(corsMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: {
    error: 'تم تجاوز الحد المسموح من الطلبات، الرجاء المحاولة لاحقاً',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'mazad-motion-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: NODE_ENV
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mazad Motion API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Routes will be added by other modules
// Example route structure:
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/auctions', require('./routes/auctions'));
// app.use('/api/bids', require('./routes/bids'));
// app.use('/api/messages', require('./routes/messages'));
// app.use('/api/notifications', require('./routes/notifications'));
// app.use('/api/media', require('./routes/media'));
// app.use('/api/admin', authMiddleware.requireAdmin, require('./routes/admin'));

// Static file serving (for uploaded media)
app.use('/uploads', express.static('uploads', {
  maxAge: '7d',
  etag: true,
  lastModified: true
}));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'endpoint_not_found',
    message: 'نقطة النهاية المطلوبة غير موجودة',
    englishMessage: 'Requested endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Global Error Handler:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'حدث خطأ في الخادم';
  let englishMessage = err.englishMessage || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'بيانات غير صحيحة';
    englishMessage = 'Validation error';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'غير مصرح لك بالوصول';
    englishMessage = 'Unauthorized access';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'معرف غير صحيح';
    englishMessage = 'Invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'بيانات مكررة';
    englishMessage = 'Duplicate data error';
  }

  // Don't expose internal errors in production
  if (NODE_ENV === 'production' && statusCode === 500) {
    message = 'حدث خطأ في الخادم';
    englishMessage = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    error: err.name || 'ServerError',
    message,
    englishMessage,
    ...(NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details
    })
  });
});

module.exports = app;