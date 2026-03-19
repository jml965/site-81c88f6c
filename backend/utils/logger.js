const winston = require('winston');
const path = require('path');
const { NODE_ENV, LOG_LEVEL } = require('../config/env');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for console output with colors and emojis
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...metadata } = info;
    
    // Add emojis based on log level
    const emoji = {
      error: '❌',
      warn: '⚠️ ',
      info: 'ℹ️ ',
      debug: '🐛',
      verbose: '📝'
    }[level.replace(/\u001b\[\d+m/g, '')] || 'ℹ️ ';
    
    let output = `${emoji} [${timestamp}] ${level}: ${message}`;
    
    // Add metadata if exists
    if (Object.keys(metadata).length > 0) {
      output += `\n   📊 Metadata: ${JSON.stringify(metadata, null, 2)}`;
    }
    
    // Add stack trace for errors
    if (stack) {
      output += `\n   🔍 Stack: ${stack}`;
    }
    
    return output;
  })
);

// File format (JSON for better parsing)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports array
const transports = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    level: LOG_LEVEL,
    format: consoleFormat,
    handleExceptions: true,
    handleRejections: true
  })
);

// File transports for production
if (NODE_ENV === 'production') {
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
      handleExceptions: true,
      handleRejections: true
    })
  );
  
  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      tailable: true
    })
  );
  
  // Access log file for HTTP requests
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'access.log'),
      level: 'info',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 7,
      tailable: true
    })
  );
}

// Development file transport
if (NODE_ENV === 'development') {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'development.log'),
      format: fileFormat,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
      tailable: true
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true })
  ),
  defaultMeta: {
    service: 'mazad-motion-api',
    version: '1.0.0',
    environment: NODE_ENV
  },
  transports,
  exitOnError: false
});

// Custom logging methods with Arabic support
const customLogger = {
  // Standard log levels
  error: (message, metadata = {}) => {
    logger.error(message, metadata);
  },
  
  warn: (message, metadata = {}) => {
    logger.warn(message, metadata);
  },
  
  info: (message, metadata = {}) => {
    logger.info(message, metadata);
  },
  
  debug: (message, metadata = {}) => {
    logger.debug(message, metadata);
  },
  
  verbose: (message, metadata = {}) => {
    logger.verbose(message, metadata);
  },
  
  // Custom methods for specific scenarios
  database: (message, metadata = {}) => {
    logger.info(`🗄️  Database: ${message}`, metadata);
  },
  
  auth: (message, metadata = {}) => {
    logger.info(`🔐 Auth: ${message}`, metadata);
  },
  
  auction: (message, metadata = {}) => {
    logger.info(`🏆 Auction: ${message}`, metadata);
  },
  
  bid: (message, metadata = {}) => {
    logger.info(`💰 Bid: ${message}`, metadata);
  },
  
  upload: (message, metadata = {}) => {
    logger.info(`📁 Upload: ${message}`, metadata);
  },
  
  socket: (message, metadata = {}) => {
    logger.info(`🔌 Socket: ${message}`, metadata);
  },
  
  notification: (message, metadata = {}) => {
    logger.info(`🔔 Notification: ${message}`, metadata);
  },
  
  security: (message, metadata = {}) => {
    logger.warn(`🛡️  Security: ${message}`, metadata);
  },
  
  performance: (message, metadata = {}) => {
    logger.info(`⚡ Performance: ${message}`, metadata);
  },
  
  // Audit logging for important actions
  audit: (action, userId, details = {}) => {
    logger.info(`📋 Audit: ${action}`, {
      userId,
      timestamp: new Date().toISOString(),
      action,
      ...details
    });
  },
  
  // HTTP request logging
  http: (req, res, duration) => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    };
    
    if (res.statusCode >= 400) {
      logger.error(`🌐 HTTP ${res.statusCode}: ${req.method} ${req.originalUrl}`, logData);
    } else {
      logger.info(`🌐 HTTP ${res.statusCode}: ${req.method} ${req.originalUrl}`, logData);
    }
  },
  
  // Error logging with context
  errorWithContext: (error, context = {}) => {
    logger.error(`💥 ${error.message}`, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      },
      context,
      timestamp: new Date().toISOString()
    });
  },
  
  // Success operations
  success: (message, metadata = {}) => {
    logger.info(`✅ ${message}`, metadata);
  },
  
  // Start/stop operations
  startup: (message, metadata = {}) => {
    logger.info(`🚀 ${message}`, metadata);
  },
  
  shutdown: (message, metadata = {}) => {
    logger.info(`🔥 ${message}`, metadata);
  }
};

// Add stream for Morgan HTTP logger integration
customLogger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Performance timing utility
customLogger.time = (label) => {
  const start = process.hrtime.bigint();
  return () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    customLogger.performance(`${label} completed in ${duration.toFixed(2)}ms`);
    return duration;
  };
};

// Development helpers
if (NODE_ENV === 'development') {
  customLogger.dev = (message, metadata = {}) => {
    logger.debug(`🛠️  Dev: ${message}`, metadata);
  };
}

// Production helpers
if (NODE_ENV === 'production') {
  // Reduce log level for performance
  logger.level = 'info';
  
  // Add production-specific logging
  customLogger.production = (message, metadata = {}) => {
    logger.info(`🏭 Production: ${message}`, metadata);
  };
}

module.exports = customLogger;