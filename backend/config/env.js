const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\n💡 Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Environment configuration with defaults
const config = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 5000,
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // CORS configuration
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : 
    ['http://localhost:3000', 'http://localhost:5173'],
  
  // File upload configuration
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024, // 100MB
  MAX_VIDEO_SIZE: parseInt(process.env.MAX_VIDEO_SIZE) || 500 * 1024 * 1024, // 500MB
  ALLOWED_IMAGE_TYPES: process.env.ALLOWED_IMAGE_TYPES ? 
    process.env.ALLOWED_IMAGE_TYPES.split(',') : 
    ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: process.env.ALLOWED_VIDEO_TYPES ? 
    process.env.ALLOWED_VIDEO_TYPES.split(',') : 
    ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
  
  // Email configuration (for notifications)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@mazadmotion.com',
  
  // Redis configuration (for caching and sessions)
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  
  // Rate limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  
  // Socket.IO configuration
  SOCKET_IO_CORS_ORIGIN: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000',
  
  // Auction configuration
  MIN_AUCTION_DURATION: parseInt(process.env.MIN_AUCTION_DURATION) || 5 * 60 * 1000, // 5 minutes
  MAX_AUCTION_DURATION: parseInt(process.env.MAX_AUCTION_DURATION) || 7 * 24 * 60 * 60 * 1000, // 7 days
  DEFAULT_AUCTION_DURATION: parseInt(process.env.DEFAULT_AUCTION_DURATION) || 60 * 60 * 1000, // 1 hour
  MIN_BID_INCREMENT: parseFloat(process.env.MIN_BID_INCREMENT) || 1.0,
  
  // Notification configuration
  PUSH_NOTIFICATION_VAPID_PUBLIC_KEY: process.env.PUSH_NOTIFICATION_VAPID_PUBLIC_KEY,
  PUSH_NOTIFICATION_VAPID_PRIVATE_KEY: process.env.PUSH_NOTIFICATION_VAPID_PRIVATE_KEY,
  
  // Logging configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'combined',
  
  // External services
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-key',
  
  // Feature flags
  ENABLE_REGISTRATION: process.env.ENABLE_REGISTRATION !== 'false',
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
  ENABLE_TWO_FACTOR_AUTH: process.env.ENABLE_TWO_FACTOR_AUTH === 'true',
  
  // Admin configuration
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  
  // Maintenance mode
  MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === 'true',
  MAINTENANCE_MESSAGE: process.env.MAINTENANCE_MESSAGE || 'الموقع تحت الصيانة، الرجاء المحاولة لاحقاً'
};

// Validate configuration based on environment
if (config.NODE_ENV === 'production') {
  const productionRequiredVars = [
    'API_BASE_URL',
    'FRONTEND_URL',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS'
  ];
  
  const missingProductionVars = productionRequiredVars.filter(
    envVar => !config[envVar.toUpperCase()] && !process.env[envVar]
  );
  
  if (missingProductionVars.length > 0) {
    console.warn('⚠️  Missing recommended production environment variables:');
    missingProductionVars.forEach(envVar => {
      console.warn(`   - ${envVar}`);
    });
  }
}

// Log configuration summary
console.log(`🚀 Environment: ${config.NODE_ENV}`);
console.log(`🌐 API URL: ${config.API_BASE_URL}`);
console.log(`🎯 Frontend URL: ${config.FRONTEND_URL}`);
console.log(`📊 Port: ${config.PORT}`);
console.log(`🔐 JWT expires in: ${config.JWT_EXPIRES_IN}`);
console.log(`📁 Upload path: ${config.UPLOAD_PATH}`);
console.log(`📧 Email from: ${config.EMAIL_FROM}`);

if (config.NODE_ENV === 'development') {
  console.log('\n🔧 Development mode - additional debugging enabled');
}

if (config.MAINTENANCE_MODE) {
  console.log('\n🚧 Maintenance mode is ENABLED');
  console.log(`📝 Maintenance message: ${config.MAINTENANCE_MESSAGE}`);
}

module.exports = config;