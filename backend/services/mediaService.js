const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { imageProcessor } = require('../utils/imageProcessor');
const { videoProcessor } = require('../utils/videoProcessor');
const { AppError } = require('../utils/errorHandling');

const prisma = new PrismaClient();

class MediaService {
  // Upload single image
  async uploadImage({ file, user_id, type, entity_id, is_cover = false }) {
    try {
      // Process image
      const processedImage = await imageProcessor.processImage(file);
      
      // Save to database
      const media = await prisma.media.create({
        data: {
          id: uuidv4(),
          type: 'image',
          entity_type: type,
          entity_id: entity_id || null,
          original_name: file.originalname,
          filename: processedImage.filename,
          file_path: processedImage.path,
          file_size: processedImage.size,
          mime_type: file.mimetype,
          width: processedImage.width,
          height: processedImage.height,
          is_cover,
          uploaded_by: user_id,
          status: 'completed'
        }
      });

      // If this is a cover image, unset other covers for the same entity
      if (is_cover && entity_id) {
        await prisma.media.updateMany({
          where: {
            entity_type: type,
            entity_id: entity_id,
            type: 'image',
            is_cover: true,
            id: { not: media.id }
          },
          data: {
            is_cover: false
          }
        });
      }

      logger.info('Image uploaded successfully', {
        media_id: media.id,
        user_id,
        filename: processedImage.filename
      });

      return {
        id: media.id,
        filename: media.filename,
        file_path: media.file_path,
        url: `/uploads/images/${processedImage.filename}`,
        width: media.width,
        height: media.height,
        size: media.file_size,
        is_cover: media.is_cover,
        created_at: media.created_at
      };
    } catch (error) {
      logger.error('Image upload failed', {
        error: error.message,
        user_id,
        filename: file.originalname
      });
      throw new AppError('فشل في رفع الصورة', 500);
    }
  }

  // Upload multiple images
  async uploadMultipleImages({ files, user_id, type, entity_id }) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await this.uploadImage({
          file,
          user_id,
          type,
          entity_id,
          is_cover: i === 0 // First image as cover
        });
        results.push(result);
      } catch (error) {
        logger.error('Failed to upload image in batch', {
          filename: file.originalname,
          error: error.message
        });
        // Continue with other images
      }
    }

    return results;
  }

  // Upload video
  async uploadVideo({ file, user_id, type, entity_id }) {
    try {
      const videoId = uuidv4();
      const originalPath = file.path;
      
      // Save initial record
      const media = await prisma.media.create({
        data: {
          id: videoId,
          type: 'video',
          entity_type: type,
          entity_id: entity_id || null,
          original_name: file.originalname,
          filename: file.filename,
          file_path: originalPath,
          file_size: file.size,
          mime_type: file.mimetype,
          uploaded_by: user_id,
          status: 'processing'
        }
      });

      // Start async video processing
      this.processVideoAsync(videoId, originalPath);

      logger.info('Video upload initiated', {
        media_id: videoId,
        user_id,
        filename: file.originalname
      });

      return {
        id: media.id,
        filename: media.filename,
        status: 'processing',
        size: media.file_size,
        created_at: media.created_at
      };
    } catch (error) {
      logger.error('Video upload failed', {
        error: error.message,
        user_id,
        filename: file.originalname
      });
      throw new AppError('فشل في رفع الفيديو', 500);
    }
  }

  // Process video asynchronously
  async processVideoAsync(videoId, originalPath) {
    try {
      const processedVideo = await videoProcessor.processVideo({
        id: videoId,
        inputPath: originalPath
      });

      // Update database with processed video info
      await prisma.media.update({
        where: { id: videoId },
        data: {
          filename: processedVideo.filename,
          file_path: processedVideo.path,
          file_size: processedVideo.size,
          width: processedVideo.width,
          height: processedVideo.height,
          duration: processedVideo.duration,
          video_codec: processedVideo.codec,
          bitrate: processedVideo.bitrate,
          frame_rate: processedVideo.frameRate,
          thumbnail_path: processedVideo.thumbnailPath,
          status: 'completed',
          processed_at: new Date()
        }
      });

      // Clean up original file
      try {
        await fs.unlink(originalPath);
      } catch (error) {
        logger.warn('Failed to delete original video file', {
          path: originalPath,
          error: error.message
        });
      }

      logger.info('Video processing completed', {
        video_id: videoId,
        output_filename: processedVideo.filename
      });
    } catch (error) {
      logger.error('Video processing failed', {
        video_id: videoId,
        error: error.message
      });

      // Update status to failed
      await prisma.media.update({
        where: { id: videoId },
        data: {
          status: 'failed',
          error_message: error.message
        }
      });
    }
  }

  // Get media by ID
  async getMediaById(id) {
    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                full_name: true,
                avatar_url: true
              }
            }
          }
        }
      }
    });

    if (!media) return null;

    return {
      ...media,
      url: this.getMediaUrl(media),
      thumbnail_url: media.thumbnail_path ? this.getThumbnailUrl(media) : null
    };
  }

  // Get media by entity
  async getMediaByEntity({ type, entity_id, media_type }) {
    const whereClause = {
      entity_type: type,
      entity_id: entity_id,
      status: 'completed'
    };

    if (media_type) {
      whereClause.type = media_type;
    }

    const media = await prisma.media.findMany({
      where: whereClause,
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                full_name: true,
                avatar_url: true
              }
            }
          }
        }
      },
      orderBy: [
        { is_cover: 'desc' },
        { created_at: 'desc' }
      ]
    });

    return media.map(item => ({
      ...item,
      url: this.getMediaUrl(item),
      thumbnail_url: item.thumbnail_path ? this.getThumbnailUrl(item) : null
    }));
  }

  // Delete media
  async deleteMedia(id) {
    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      throw new AppError('الوسائط غير موجودة', 404);
    }

    // Delete files from storage
    try {
      await fs.unlink(media.file_path);
      if (media.thumbnail_path) {
        await fs.unlink(media.thumbnail_path);
      }
    } catch (error) {
      logger.warn('Failed to delete media files', {
        media_id: id,
        error: error.message
      });
    }

    // Delete from database
    await prisma.media.delete({
      where: { id }
    });

    return true;
  }

  // Update media metadata
  async updateMedia(id, updates) {
    const media = await prisma.media.update({
      where: { id },
      data: {
        ...updates,
        updated_at: new Date()
      }
    });

    return {
      ...media,
      url: this.getMediaUrl(media),
      thumbnail_url: media.thumbnail_path ? this.getThumbnailUrl(media) : null
    };
  }

  // Get video processing status
  async getVideoProcessingStatus(id) {
    const media = await prisma.media.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        error_message: true,
        duration: true,
        width: true,
        height: true,
        created_at: true,
        processed_at: true
      }
    });

    return media;
  }

  // Generate video thumbnail
  async generateVideoThumbnail(videoId, timestamp = 5) {
    const media = await prisma.media.findUnique({
      where: { id: videoId }
    });

    if (!media || media.type !== 'video') {
      throw new AppError('الفيديو غير موجود', 404);
    }

    const thumbnail = await videoProcessor.generateThumbnail({
      videoPath: media.file_path,
      timestamp,
      outputDir: path.join(process.env.UPLOAD_PATH, 'thumbnails')
    });

    // Update media record with new thumbnail
    await prisma.media.update({
      where: { id: videoId },
      data: {
        thumbnail_path: thumbnail.path
      }
    });

    return {
      thumbnail_url: `/uploads/thumbnails/${thumbnail.filename}`,
      timestamp
    };
  }

  // Get user media
  async getUserMedia({ userId, page = 1, limit = 20, type, media_type }) {
    const skip = (page - 1) * limit;
    const whereClause = {
      uploaded_by: userId
    };

    if (type) {
      whereClause.entity_type = type;
    }

    if (media_type) {
      whereClause.type = media_type;
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          uploader: {
            select: {
              id: true,
              username: true,
              profile: {
                select: {
                  full_name: true,
                  avatar_url: true
                }
              }
            }
          }
        }
      }),
      prisma.media.count({ where: whereClause })
    ]);

    return {
      media: media.map(item => ({
        ...item,
        url: this.getMediaUrl(item),
        thumbnail_url: item.thumbnail_path ? this.getThumbnailUrl(item) : null
      })),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Bulk delete media
  async bulkDeleteMedia({ media_ids, user_id, user_role }) {
    const results = {
      deleted_count: 0,
      failed_count: 0,
      failed_ids: []
    };

    for (const media_id of media_ids) {
      try {
        const media = await prisma.media.findUnique({
          where: { id: media_id }
        });

        if (!media) {
          results.failed_count++;
          results.failed_ids.push(media_id);
          continue;
        }

        // Check permissions
        if (media.uploaded_by !== user_id && user_role !== 'admin' && user_role !== 'moderator') {
          results.failed_count++;
          results.failed_ids.push(media_id);
          continue;
        }

        await this.deleteMedia(media_id);
        results.deleted_count++;
      } catch (error) {
        logger.error('Failed to delete media in bulk operation', {
          media_id,
          error: error.message
        });
        results.failed_count++;
        results.failed_ids.push(media_id);
      }
    }

    return results;
  }

  // Helper methods
  getMediaUrl(media) {
    if (media.type === 'image') {
      return `/uploads/images/${media.filename}`;
    } else if (media.type === 'video') {
      return `/uploads/videos/${media.filename}`;
    }
    return null;
  }

  getThumbnailUrl(media) {
    if (media.thumbnail_path) {
      const filename = path.basename(media.thumbnail_path);
      return `/uploads/thumbnails/${filename}`;
    }
    return null;
  }

  // Clean up orphaned media (files without entity_id)
  async cleanupOrphanedMedia(olderThanHours = 24) {
    const cutoffDate = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000));
    
    const orphanedMedia = await prisma.media.findMany({
      where: {
        entity_id: null,
        created_at: {
          lt: cutoffDate
        }
      }
    });

    let cleaned = 0;
    for (const media of orphanedMedia) {
      try {
        await this.deleteMedia(media.id);
        cleaned++;
      } catch (error) {
        logger.error('Failed to clean orphaned media', {
          media_id: media.id,
          error: error.message
        });
      }
    }

    logger.info('Orphaned media cleanup completed', {
      cleaned_count: cleaned,
      total_orphaned: orphanedMedia.length
    });

    return { cleaned, total: orphanedMedia.length };
  }
}

module.exports = new MediaService();