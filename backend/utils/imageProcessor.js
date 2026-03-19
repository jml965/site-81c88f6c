const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const { AppError } = require('./errorHandling');

class ImageProcessor {
  constructor() {
    this.outputPath = process.env.UPLOAD_PATH || './uploads';
    this.imagesPath = path.join(this.outputPath, 'images');
    this.thumbnailsPath = path.join(this.outputPath, 'thumbnails');
  }

  // Process uploaded image
  async processImage(file, options = {}) {
    try {
      const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 85,
        generateThumbnail = true,
        thumbnailSize = { width: 300, height: 300 },
        format = 'auto' // 'auto', 'jpeg', 'png', 'webp'
      } = options;

      // Ensure output directory exists
      await fs.mkdir(this.imagesPath, { recursive: true });
      if (generateThumbnail) {
        await fs.mkdir(this.thumbnailsPath, { recursive: true });
      }

      // Generate unique filename
      const fileId = uuidv4();
      const ext = this.determineOutputFormat(file.mimetype, format);
      const filename = `${fileId}.${ext}`;
      const outputPath = path.join(this.imagesPath, filename);

      logger.info('Processing image', {
        original: file.originalname,
        output: filename,
        size: file.size,
        mimetype: file.mimetype
      });

      // Get image metadata
      const metadata = await sharp(file.path).metadata();
      
      // Process main image
      const processor = sharp(file.path)
        .rotate() // Auto-rotate based on EXIF
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality, progressive: true })
        .png({ compressionLevel: 9, progressive: true })
        .webp({ quality })
        .toFormat(ext === 'jpg' ? 'jpeg' : ext);

      // Save processed image
      await processor.toFile(outputPath);

      // Get processed image info
      const processedMetadata = await sharp(outputPath).metadata();
      const stats = await fs.stat(outputPath);

      // Generate thumbnail if requested
      let thumbnailInfo = null;
      if (generateThumbnail) {
        thumbnailInfo = await this.generateThumbnail({
          inputPath: outputPath,
          size: thumbnailSize,
          fileId
        });
      }

      // Clean up original uploaded file
      try {
        await fs.unlink(file.path);
      } catch (error) {
        logger.warn('Failed to delete original file', {
          path: file.path,
          error: error.message
        });
      }

      const result = {
        filename,
        path: outputPath,
        size: stats.size,
        width: processedMetadata.width,
        height: processedMetadata.height,
        format: processedMetadata.format,
        original: {
          filename: file.originalname,
          size: file.size,
          width: metadata.width,
          height: metadata.height,
          format: metadata.format
        }
      };

      if (thumbnailInfo) {
        result.thumbnail = thumbnailInfo;
      }

      logger.info('Image processed successfully', {
        filename,
        originalSize: file.size,
        processedSize: stats.size,
        compression: ((file.size - stats.size) / file.size * 100).toFixed(2) + '%'
      });

      return result;
    } catch (error) {
      logger.error('Image processing failed', {
        error: error.message,
        filename: file.originalname
      });
      throw new AppError('فشل في معالجة الصورة', 500);
    }
  }

  // Generate thumbnail
  async generateThumbnail({ inputPath, size = { width: 300, height: 300 }, fileId }) {
    try {
      const thumbnailFilename = `thumb_${fileId || uuidv4()}.jpg`;
      const thumbnailPath = path.join(this.thumbnailsPath, thumbnailFilename);

      await sharp(inputPath)
        .resize({
          width: size.width,
          height: size.height,
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(thumbnailPath);

      const stats = await fs.stat(thumbnailPath);
      const metadata = await sharp(thumbnailPath).metadata();

      return {
        filename: thumbnailFilename,
        path: thumbnailPath,
        size: stats.size,
        width: metadata.width,
        height: metadata.height
      };
    } catch (error) {
      logger.error('Thumbnail generation failed', {
        error: error.message,
        inputPath
      });
      throw new AppError('فشل في إنشاء الصورة المصغرة', 500);
    }
  }

  // Generate multiple sizes
  async generateMultipleSizes(inputPath, sizes = []) {
    const defaultSizes = [
      { name: 'thumbnail', width: 300, height: 300 },
      { name: 'small', width: 600, height: 400 },
      { name: 'medium', width: 1200, height: 800 },
      { name: 'large', width: 1920, height: 1080 }
    ];

    const sizesToGenerate = sizes.length > 0 ? sizes : defaultSizes;
    const results = [];

    for (const size of sizesToGenerate) {
      try {
        const fileId = uuidv4();
        const filename = `${size.name}_${fileId}.jpg`;
        const outputPath = path.join(this.imagesPath, filename);

        await sharp(inputPath)
          .resize({
            width: size.width,
            height: size.height,
            fit: size.fit || 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: size.quality || 85, progressive: true })
          .toFile(outputPath);

        const stats = await fs.stat(outputPath);
        const metadata = await sharp(outputPath).metadata();

        results.push({
          name: size.name,
          filename,
          path: outputPath,
          size: stats.size,
          width: metadata.width,
          height: metadata.height
        });
      } catch (error) {
        logger.error('Failed to generate size variant', {
          size: size.name,
          error: error.message
        });
      }
    }

    return results;
  }

  // Optimize existing image
  async optimizeImage(inputPath, options = {}) {
    try {
      const {
        quality = 85,
        format = 'auto',
        progressive = true
      } = options;

      const metadata = await sharp(inputPath).metadata();
      const outputFormat = this.determineOutputFormat(metadata.format, format);
      
      const fileId = uuidv4();
      const filename = `optimized_${fileId}.${outputFormat}`;
      const outputPath = path.join(this.imagesPath, filename);

      let processor = sharp(inputPath);

      switch (outputFormat) {
        case 'jpg':
        case 'jpeg':
          processor = processor.jpeg({ quality, progressive });
          break;
        case 'png':
          processor = processor.png({ compressionLevel: 9, progressive });
          break;
        case 'webp':
          processor = processor.webp({ quality });
          break;
      }

      await processor.toFile(outputPath);

      const originalStats = await fs.stat(inputPath);
      const optimizedStats = await fs.stat(outputPath);
      const optimizedMetadata = await sharp(outputPath).metadata();

      const compressionRatio = ((originalStats.size - optimizedStats.size) / originalStats.size * 100);

      logger.info('Image optimized', {
        filename,
        originalSize: originalStats.size,
        optimizedSize: optimizedStats.size,
        compression: compressionRatio.toFixed(2) + '%'
      });

      return {
        filename,
        path: outputPath,
        size: optimizedStats.size,
        width: optimizedMetadata.width,
        height: optimizedMetadata.height,
        format: optimizedMetadata.format,
        compression: compressionRatio
      };
    } catch (error) {
      logger.error('Image optimization failed', {
        error: error.message,
        inputPath
      });
      throw new AppError('فشل في تحسين الصورة', 500);
    }
  }

  // Convert image format
  async convertImage(inputPath, targetFormat, options = {}) {
    try {
      const { quality = 85 } = options;
      
      const fileId = uuidv4();
      const filename = `converted_${fileId}.${targetFormat}`;
      const outputPath = path.join(this.imagesPath, filename);

      let processor = sharp(inputPath);

      switch (targetFormat.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
          processor = processor.jpeg({ quality, progressive: true });
          break;
        case 'png':
          processor = processor.png({ compressionLevel: 9 });
          break;
        case 'webp':
          processor = processor.webp({ quality });
          break;
        case 'avif':
          processor = processor.avif({ quality });
          break;
        default:
          throw new AppError(`صيغة غير مدعومة: ${targetFormat}`, 400);
      }

      await processor.toFile(outputPath);

      const stats = await fs.stat(outputPath);
      const metadata = await sharp(outputPath).metadata();

      return {
        filename,
        path: outputPath,
        size: stats.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      };
    } catch (error) {
      logger.error('Image conversion failed', {
        error: error.message,
        inputPath,
        targetFormat
      });
      throw new AppError('فشل في تحويل الصورة', 500);
    }
  }

  // Add watermark to image
  async addWatermark(inputPath, watermarkPath, options = {}) {
    try {
      const {
        position = 'southeast',
        opacity = 0.5,
        margin = 10
      } = options;

      const fileId = uuidv4();
      const filename = `watermarked_${fileId}.jpg`;
      const outputPath = path.join(this.imagesPath, filename);

      // Prepare watermark
      const watermark = await sharp(watermarkPath)
        .png()
        .modulate({ brightness: 1, saturation: 1 })
        .composite([{
          input: Buffer.from([255, 255, 255, Math.round(255 * opacity)]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: 'dest-in'
        }])
        .toBuffer();

      // Apply watermark
      await sharp(inputPath)
        .composite([{
          input: watermark,
          gravity: position
        }])
        .jpeg({ quality: 90, progressive: true })
        .toFile(outputPath);

      const stats = await fs.stat(outputPath);
      const metadata = await sharp(outputPath).metadata();

      return {
        filename,
        path: outputPath,
        size: stats.size,
        width: metadata.width,
        height: metadata.height
      };
    } catch (error) {
      logger.error('Watermark application failed', {
        error: error.message,
        inputPath,
        watermarkPath
      });
      throw new AppError('فشل في إضافة العلامة المائية', 500);
    }
  }

  // Get image metadata
  async getImageInfo(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      const stats = await fs.stat(imagePath);

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        channels: metadata.channels,
        depth: metadata.depth,
        density: metadata.density,
        hasProfile: metadata.hasProfile,
        hasAlpha: metadata.hasAlpha,
        size: stats.size,
        isAnimated: metadata.pages && metadata.pages > 1
      };
    } catch (error) {
      throw new AppError('فشل في قراءة معلومات الصورة', 500);
    }
  }

  // Validate image file
  async validateImage(file) {
    try {
      const metadata = await sharp(file.path).metadata();
      
      const validationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        metadata
      };

      // Check dimensions
      if (metadata.width < 100 || metadata.height < 100) {
        validationResult.errors.push('الصورة صغيرة جداً (أقل من 100x100 بكسل)');
        validationResult.isValid = false;
      }

      if (metadata.width > 10000 || metadata.height > 10000) {
        validationResult.warnings.push('الصورة كبيرة جداً وقد تحتاج تصغير');
      }

      // Check file size
      if (file.size > 10 * 1024 * 1024) { // 10MB
        validationResult.warnings.push('حجم الصورة كبير وقد يحتاج ضغط');
      }

      // Check format
      const supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
      if (!supportedFormats.includes(metadata.format?.toLowerCase())) {
        validationResult.errors.push(`صيغة الصورة غير مدعومة: ${metadata.format}`);
        validationResult.isValid = false;
      }

      return validationResult;
    } catch (error) {
      return {
        isValid: false,
        errors: ['فشل في قراءة ملف الصورة'],
        warnings: [],
        metadata: null
      };
    }
  }

  // Determine output format
  determineOutputFormat(inputMimeType, requestedFormat = 'auto') {
    if (requestedFormat !== 'auto') {
      return requestedFormat;
    }

    // Default format mapping
    const formatMap = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif'
    };

    return formatMap[inputMimeType] || 'jpg';
  }

  // Batch process images
  async batchProcessImages(files, options = {}) {
    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const result = await this.processImage(file, options);
        results.push(result);
      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    return {
      successes: results,
      errors,
      total: files.length,
      successful: results.length,
      failed: errors.length
    };
  }
}

module.exports = {
  imageProcessor: new ImageProcessor()
};