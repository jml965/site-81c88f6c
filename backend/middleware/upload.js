const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../utils/errorHandling');
const logger = require('../utils/logger');

// Ensure upload directories exist
const ensureUploadDirs = async () => {
  const uploadPath = process.env.UPLOAD_PATH || './uploads';
  const dirs = [
    path.join(uploadPath, 'images'),
    path.join(uploadPath, 'videos'),
    path.join(uploadPath, 'thumbnails'),
    path.join(uploadPath, 'temp')
  ];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch (error) {
      await fs.mkdir(dir, { recursive: true });
      logger.info('Created upload directory', { path: dir });
    }
  }
};

// Initialize directories
ensureUploadDirs().catch(error => {
  logger.error('Failed to create upload directories', { error: error.message });
});

// Storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadPath = process.env.UPLOAD_PATH || './uploads';
      let subfolder = 'temp';

      // Determine subfolder based on file type
      if (file.mimetype.startsWith('image/')) {
        subfolder = 'images';
      } else if (file.mimetype.startsWith('video/')) {
        subfolder = 'videos';
      }

      const destPath = path.join(uploadPath, subfolder);
      
      // Ensure directory exists
      await fs.access(destPath).catch(async () => {
        await fs.mkdir(destPath, { recursive: true });
      });

      cb(null, destPath);
    } catch (error) {
      logger.error('Error setting upload destination', { error: error.message });
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      // Generate unique filename
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${uuidv4()}${ext}`;
      
      // Store original name in request for later use
      file.uniqueName = uniqueName;
      
      cb(null, uniqueName);
    } catch (error) {
      logger.error('Error generating filename', { error: error.message });
      cb(error);
    }
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const allowedImages = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  // Allowed video types
  const allowedVideos = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo', // .avi
    'video/webm'
  ];

  const isImage = allowedImages.includes(file.mimetype);
  const isVideo = allowedVideos.includes(file.mimetype);

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    const error = new AppError(
      `نوع الملف غير مدعوم. الأنواع المدعومة: ${[...allowedImages, ...allowedVideos].join(', ')}`,
      400
    );
    cb(error, false);
  }
};

// File size limits
const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB max
  files: 10 // Max 10 files at once
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits,
  onError: (error, next) => {
    logger.error('Multer error', { error: error.message });
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('حجم الملف كبير جداً. الحد الأقصى 100 ميجابايت', 400));
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('عدد الملفات كبير جداً. الحد الأقصى 10 ملفات', 400));
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new AppError('حقل الملف غير متوقع', 400));
    }
    
    next(new AppError('خطأ في رفع الملف', 500));
  }
});

// Custom middleware for additional file validation
const validateFile = (req, res, next) => {
  // Additional validation can be added here
  // For example: virus scanning, content analysis, etc.
  
  if (req.file) {
    // Log upload attempt
    logger.info('File upload validation', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      user_id: req.user?.id
    });

    // Validate file extension matches MIME type
    const ext = path.extname(req.file.originalname).toLowerCase();
    const mimetype = req.file.mimetype.toLowerCase();
    
    const validCombinations = {
      '.jpg': ['image/jpeg', 'image/jpg'],
      '.jpeg': ['image/jpeg', 'image/jpg'],
      '.png': ['image/png'],
      '.webp': ['image/webp'],
      '.gif': ['image/gif'],
      '.mp4': ['video/mp4'],
      '.mpeg': ['video/mpeg'],
      '.mpg': ['video/mpeg'],
      '.mov': ['video/quicktime'],
      '.avi': ['video/x-msvideo'],
      '.webm': ['video/webm']
    };

    if (validCombinations[ext] && !validCombinations[ext].includes(mimetype)) {
      return next(new AppError('امتداد الملف لا يتطابق مع نوع المحتوى', 400));
    }
  }

  if (req.files && req.files.length > 0) {
    // Validate multiple files
    for (const file of req.files) {
      logger.info('Multiple file upload validation', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        user_id: req.user?.id
      });
    }
  }

  next();
};

// Cleanup failed uploads middleware
const cleanupOnError = (error, req, res, next) => {
  // Clean up uploaded files on error
  const cleanupFile = async (file) => {
    try {
      await fs.unlink(file.path);
      logger.info('Cleaned up failed upload', { path: file.path });
    } catch (cleanupError) {
      logger.warn('Failed to cleanup file', { 
        path: file.path, 
        error: cleanupError.message 
      });
    }
  };

  if (error) {
    if (req.file) {
      cleanupFile(req.file);
    }
    
    if (req.files && req.files.length > 0) {
      req.files.forEach(cleanupFile);
    }
  }

  next(error);
};

// Image-specific upload middleware
const uploadImage = [
  upload.single('image'),
  validateFile,
  cleanupOnError
];

// Multiple images upload middleware
const uploadImages = [
  upload.array('images', 10),
  validateFile,
  cleanupOnError
];

// Video-specific upload middleware
const uploadVideo = [
  upload.single('video'),
  validateFile,
  cleanupOnError
];

// Generic upload middleware
const uploadAny = [
  upload.any(),
  validateFile,
  cleanupOnError
];

// Utility function to get file info
const getFileInfo = (file) => {
  if (!file) return null;
  
  return {
    originalname: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    destination: file.destination
  };
};

// Utility function to validate file type
const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.mimetype);
};

// Utility function to validate file size
const isValidFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Export everything
module.exports = {
  upload,
  uploadImage,
  uploadImages,
  uploadVideo,
  uploadAny,
  validateFile,
  cleanupOnError,
  getFileInfo,
  isValidFileType,
  isValidFileSize,
  ensureUploadDirs
};