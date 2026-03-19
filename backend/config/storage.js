const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

class StorageConfig {
  constructor() {
    this.uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads');
    this.maxFileSize = {
      image: parseInt(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024, // 5MB
      video: parseInt(process.env.MAX_VIDEO_SIZE) || 100 * 1024 * 1024, // 100MB
      document: parseInt(process.env.MAX_DOCUMENT_SIZE) || 10 * 1024 * 1024 // 10MB
    };
    
    this.allowedTypes = {
      image: [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/gif'
      ],
      video: [
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm'
      ],
      document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    };
    
    this.directories = {
      images: path.join(this.uploadPath, 'images'),
      videos: path.join(this.uploadPath, 'videos'),
      thumbnails: path.join(this.uploadPath, 'thumbnails'),
      documents: path.join(this.uploadPath, 'documents'),
      temp: path.join(this.uploadPath, 'temp'),
      processed: path.join(this.uploadPath, 'processed')
    };
    
    this.imageSettings = {
      maxWidth: parseInt(process.env.MAX_IMAGE_WIDTH) || 1920,
      maxHeight: parseInt(process.env.MAX_IMAGE_HEIGHT) || 1080,
      quality: parseInt(process.env.IMAGE_QUALITY) || 85,
      thumbnailSize: {
        width: parseInt(process.env.THUMBNAIL_WIDTH) || 300,
        height: parseInt(process.env.THUMBNAIL_HEIGHT) || 300
      },
      generateWebP: process.env.GENERATE_WEBP === 'true',
      generateThumbnails: process.env.GENERATE_THUMBNAILS !== 'false'
    };
    
    this.videoSettings = {
      maxDuration: parseInt(process.env.MAX_VIDEO_DURATION) || 3600, // 1 hour in seconds
      outputFormat: process.env.VIDEO_OUTPUT_FORMAT || 'mp4',
      codecVideo: process.env.VIDEO_CODEC || 'libx264',
      codecAudio: process.env.AUDIO_CODEC || 'aac',
      bitrate: process.env.VIDEO_BITRATE || 'auto',
      maxResolution: {
        width: parseInt(process.env.MAX_VIDEO_WIDTH) || 1920,
        height: parseInt(process.env.MAX_VIDEO_HEIGHT) || 1080
      },
      generateThumbnails: process.env.GENERATE_VIDEO_THUMBNAILS !== 'false',
      thumbnailTimestamps: [1, 5, 10] // seconds
    };
    
    this.cleanup = {
      tempFileExpiry: parseInt(process.env.TEMP_FILE_EXPIRY) || 24 * 60 * 60 * 1000, // 24 hours
      orphanFileExpiry: parseInt(process.env.ORPHAN_FILE_EXPIRY) || 7 * 24 * 60 * 60 * 1000, // 7 days
      autoCleanup: process.env.AUTO_CLEANUP !== 'false',
      cleanupInterval: parseInt(process.env.CLEANUP_INTERVAL) || 6 * 60 * 60 * 1000 // 6 hours
    };
    
    this.security = {
      virusScan: process.env.VIRUS_SCAN === 'true',
      allowExecutables: process.env.ALLOW_EXECUTABLES === 'true',
      maxFilesPerUpload: parseInt(process.env.MAX_FILES_PER_UPLOAD) || 10,
      rateLimiting: {
        windowMs: parseInt(process.env.UPLOAD_RATE_WINDOW) || 15 * 60 * 1000, // 15 minutes
        maxUploads: parseInt(process.env.MAX_UPLOADS_PER_WINDOW) || 20,
        maxVideoUploads: parseInt(process.env.MAX_VIDEO_UPLOADS_PER_WINDOW) || 5
      }
    };
  }

  // Initialize storage directories
  async initializeDirectories() {
    try {
      for (const [name, dirPath] of Object.entries(this.directories)) {
        try {
          await fs.access(dirPath);
          logger.info(`Storage directory exists: ${name}`, { path: dirPath });
        } catch (error) {
          await fs.mkdir(dirPath, { recursive: true });
          logger.info(`Created storage directory: ${name}`, { path: dirPath });
        }
      }
      
      // Set proper permissions (Linux/Mac only)
      if (process.platform !== 'win32') {
        for (const dirPath of Object.values(this.directories)) {
          await fs.chmod(dirPath, 0o755);
        }
      }
      
      logger.info('Storage directories initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize storage directories', { error: error.message });
      throw error;
    }
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      const stats = {
        directories: {},
        totalSize: 0,
        fileCount: 0
      };
      
      for (const [name, dirPath] of Object.entries(this.directories)) {
        try {
          const dirStats = await this.getDirectoryStats(dirPath);
          stats.directories[name] = dirStats;
          stats.totalSize += dirStats.totalSize;
          stats.fileCount += dirStats.fileCount;
        } catch (error) {
          logger.warn(`Failed to get stats for directory: ${name}`, { error: error.message });
          stats.directories[name] = { totalSize: 0, fileCount: 0, error: error.message };
        }
      }
      
      return stats;
    } catch (error) {
      logger.error('Failed to get storage statistics', { error: error.message });
      throw error;
    }
  }

  // Get directory statistics
  async getDirectoryStats(dirPath) {
    let totalSize = 0;
    let fileCount = 0;
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isFile()) {
          const stat = await fs.stat(fullPath);
          totalSize += stat.size;
          fileCount++;
        } else if (entry.isDirectory()) {
          const subStats = await this.getDirectoryStats(fullPath);
          totalSize += subStats.totalSize;
          fileCount += subStats.fileCount;
        }
      }
    } catch (error) {
      logger.warn('Error reading directory stats', { dirPath, error: error.message });
    }
    
    return { totalSize, fileCount };
  }

  // Validate file type and size
  validateFile(file, type = 'auto') {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      detectedType: null
    };
    
    // Auto-detect file type if not specified
    if (type === 'auto') {
      if (file.mimetype.startsWith('image/')) {
        type = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        type = 'video';
      } else if (file.mimetype.startsWith('application/')) {
        type = 'document';
      } else {
        validation.errors.push('نوع الملف غير مدعوم');
        validation.isValid = false;
        return validation;
      }
    }
    
    validation.detectedType = type;
    
    // Check allowed file types
    if (!this.allowedTypes[type] || !this.allowedTypes[type].includes(file.mimetype)) {
      validation.errors.push(`نوع الملف ${file.mimetype} غير مدعوم لفئة ${type}`);
      validation.isValid = false;
    }
    
    // Check file size
    if (file.size > this.maxFileSize[type]) {
      const maxSizeMB = (this.maxFileSize[type] / (1024 * 1024)).toFixed(1);
      validation.errors.push(`حجم الملف كبير جداً. الحد الأقصى ${maxSizeMB} ميجابايت`);
      validation.isValid = false;
    }
    
    // Check for potentially malicious files
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.js', '.vbs', '.jar'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (dangerousExtensions.includes(fileExt) && !this.security.allowExecutables) {
      validation.errors.push('امتداد الملف غير آمن');
      validation.isValid = false;
    }
    
    // File size warnings
    const warningSizes = {
      image: 2 * 1024 * 1024, // 2MB
      video: 50 * 1024 * 1024, // 50MB
      document: 5 * 1024 * 1024 // 5MB
    };
    
    if (file.size > warningSizes[type]) {
      validation.warnings.push('الملف كبير وقد يحتاج وقت أطول للمعالجة');
    }
    
    return validation;
  }

  // Get file path for type
  getFilePath(filename, type) {
    const typeToDir = {
      image: 'images',
      video: 'videos',
      thumbnail: 'thumbnails',
      document: 'documents',
      temp: 'temp',
      processed: 'processed'
    };
    
    const dirName = typeToDir[type] || 'temp';
    return path.join(this.directories[dirName], filename);
  }

  // Get public URL for file
  getPublicUrl(filename, type) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${type}s/${filename}`;
  }

  // Clean up temporary files
  async cleanupTempFiles() {
    try {
      const tempDir = this.directories.temp;
      const entries = await fs.readdir(tempDir, { withFileTypes: true });
      const now = Date.now();
      let cleanedCount = 0;
      
      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = path.join(tempDir, entry.name);
          const stat = await fs.stat(filePath);
          
          // Delete files older than expiry time
          if (now - stat.mtime.getTime() > this.cleanup.tempFileExpiry) {
            await fs.unlink(filePath);
            cleanedCount++;
            logger.info('Cleaned up temp file', { filename: entry.name });
          }
        }
      }
      
      logger.info('Temp file cleanup completed', { cleanedCount });
      return cleanedCount;
    } catch (error) {
      logger.error('Temp file cleanup failed', { error: error.message });
      throw error;
    }
  }

  // Clean up orphaned files (files not referenced in database)
  async cleanupOrphanedFiles(getReferencedFiles) {
    try {
      if (typeof getReferencedFiles !== 'function') {
        throw new Error('getReferencedFiles function is required');
      }
      
      const referencedFiles = await getReferencedFiles();
      const referencedFilenames = new Set(referencedFiles.map(file => path.basename(file.file_path)));
      
      let cleanedCount = 0;
      const cleanupDirs = ['images', 'videos', 'thumbnails'];
      
      for (const dirName of cleanupDirs) {
        const dirPath = this.directories[dirName];
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.isFile() && !referencedFilenames.has(entry.name)) {
            const filePath = path.join(dirPath, entry.name);
            const stat = await fs.stat(filePath);
            
            // Delete files older than orphan expiry time
            if (Date.now() - stat.mtime.getTime() > this.cleanup.orphanFileExpiry) {
              await fs.unlink(filePath);
              cleanedCount++;
              logger.info('Cleaned up orphaned file', { filename: entry.name, directory: dirName });
            }
          }
        }
      }
      
      logger.info('Orphaned file cleanup completed', { cleanedCount });
      return cleanedCount;
    } catch (error) {
      logger.error('Orphaned file cleanup failed', { error: error.message });
      throw error;
    }
  }

  // Start auto cleanup process
  startAutoCleanup(getReferencedFiles) {
    if (!this.cleanup.autoCleanup) {
      logger.info('Auto cleanup is disabled');
      return;
    }
    
    const cleanup = async () => {
      try {
        logger.info('Starting scheduled cleanup');
        
        const tempCleaned = await this.cleanupTempFiles();
        const orphansCleaned = await this.cleanupOrphanedFiles(getReferencedFiles);
        
        logger.info('Scheduled cleanup completed', {
          tempFilesCleaned: tempCleaned,
          orphanedFilesCleaned: orphansCleaned
        });
      } catch (error) {
        logger.error('Scheduled cleanup failed', { error: error.message });
      }
    };
    
    // Run cleanup immediately
    cleanup();
    
    // Schedule periodic cleanup
    const intervalId = setInterval(cleanup, this.cleanup.cleanupInterval);
    
    logger.info('Auto cleanup started', {
      interval: this.cleanup.cleanupInterval,
      tempExpiry: this.cleanup.tempFileExpiry,
      orphanExpiry: this.cleanup.orphanFileExpiry
    });
    
    return intervalId;
  }

  // Get configuration summary
  getConfigSummary() {
    return {
      uploadPath: this.uploadPath,
      maxFileSizes: this.maxFileSize,
      allowedTypes: this.allowedTypes,
      imageSettings: this.imageSettings,
      videoSettings: this.videoSettings,
      security: this.security,
      cleanup: this.cleanup
    };
  }
}

// Create and export singleton instance
const storageConfig = new StorageConfig();

module.exports = {
  storageConfig,
  StorageConfig
};