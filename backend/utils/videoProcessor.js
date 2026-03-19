const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('ffprobe-static').path;
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const { AppError } = require('./errorHandling');

// Set FFmpeg paths
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

class VideoProcessor {
  constructor() {
    this.outputPath = process.env.UPLOAD_PATH || './uploads';
    this.thumbnailPath = path.join(this.outputPath, 'thumbnails');
    this.videoPath = path.join(this.outputPath, 'videos');
  }

  // Get video metadata
  async getVideoMetadata(inputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          logger.error('FFprobe error', { error: err.message, path: inputPath });
          reject(new AppError('فشل في قراءة معلومات الفيديو', 500));
          return;
        }

        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

        if (!videoStream) {
          reject(new AppError('الملف لا يحتوي على فيديو صالح', 400));
          return;
        }

        resolve({
          duration: parseFloat(metadata.format.duration) || 0,
          width: videoStream.width || 0,
          height: videoStream.height || 0,
          codec: videoStream.codec_name,
          bitrate: parseInt(metadata.format.bit_rate) || 0,
          frameRate: this.parseFrameRate(videoStream.r_frame_rate || videoStream.avg_frame_rate),
          hasAudio: !!audioStream,
          fileSize: parseInt(metadata.format.size) || 0
        });
      });
    });
  }

  // Parse frame rate from string like "25/1"
  parseFrameRate(frameRateStr) {
    if (!frameRateStr) return 0;
    const parts = frameRateStr.split('/');
    if (parts.length === 2) {
      return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    return parseFloat(frameRateStr) || 0;
  }

  // Process video for web delivery
  async processVideo({ id, inputPath }) {
    try {
      const metadata = await this.getVideoMetadata(inputPath);
      
      // Generate output filename
      const outputFilename = `${id}.mp4`;
      const outputPath = path.join(this.videoPath, outputFilename);
      
      // Ensure output directory exists
      await fs.mkdir(this.videoPath, { recursive: true });
      
      logger.info('Starting video processing', {
        video_id: id,
        input: inputPath,
        output: outputPath,
        metadata
      });

      // Process video based on resolution and quality
      const processedVideo = await this.encodeVideo({
        inputPath,
        outputPath,
        metadata,
        id
      });

      // Generate thumbnail
      const thumbnail = await this.generateThumbnail({
        videoPath: outputPath,
        timestamp: Math.min(5, metadata.duration / 4), // 5 seconds or 1/4 of video
        outputDir: this.thumbnailPath
      });

      const outputStats = await fs.stat(outputPath);

      return {
        filename: outputFilename,
        path: outputPath,
        size: outputStats.size,
        width: processedVideo.width,
        height: processedVideo.height,
        duration: metadata.duration,
        codec: 'h264',
        bitrate: processedVideo.bitrate,
        frameRate: processedVideo.frameRate,
        thumbnailPath: thumbnail.path
      };
    } catch (error) {
      logger.error('Video processing failed', {
        video_id: id,
        error: error.message
      });
      throw error;
    }
  }

  // Encode video with optimal settings
  async encodeVideo({ inputPath, outputPath, metadata, id }) {
    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);

      // Determine target resolution and bitrate
      const settings = this.getOptimalSettings(metadata);
      
      command = command
        // Video codec settings
        .videoCodec('libx264')
        .videoBitrate(settings.bitrate)
        .fps(Math.min(settings.fps, metadata.frameRate || 30))
        
        // Audio codec settings
        .audioCodec('aac')
        .audioBitrate('128k')
        .audioChannels(2)
        .audioFrequency(44100)
        
        // Output format
        .format('mp4')
        .outputOptions([
          '-preset fast',
          '-profile:v baseline',
          '-level 3.0',
          '-pix_fmt yuv420p',
          '-movflags +faststart', // Web optimization
          '-max_muxing_queue_size 9999'
        ]);

      // Scale video if needed
      if (settings.width !== metadata.width || settings.height !== metadata.height) {
        command = command.size(`${settings.width}x${settings.height}`);
      }

      // Progress tracking
      command.on('progress', (progress) => {
        logger.info('Video encoding progress', {
          video_id: id,
          percent: progress.percent?.toFixed(2) || 0,
          currentTime: progress.timemark
        });
      });

      // Error handling
      command.on('error', (err) => {
        logger.error('FFmpeg encoding error', {
          video_id: id,
          error: err.message
        });
        reject(new AppError('فشل في معالجة الفيديو', 500));
      });

      // Success
      command.on('end', () => {
        logger.info('Video encoding completed', {
          video_id: id,
          output: outputPath
        });
        resolve({
          width: settings.width,
          height: settings.height,
          bitrate: settings.bitrate,
          frameRate: settings.fps
        });
      });

      // Start encoding
      command.save(outputPath);
    });
  }

  // Get optimal encoding settings based on input
  getOptimalSettings(metadata) {
    const { width, height, bitrate, frameRate } = metadata;
    
    // Define quality tiers
    const qualityTiers = [
      { maxWidth: 854, maxHeight: 480, bitrate: '1000k', name: '480p' },
      { maxWidth: 1280, maxHeight: 720, bitrate: '2500k', name: '720p' },
      { maxWidth: 1920, maxHeight: 1080, bitrate: '5000k', name: '1080p' },
      { maxWidth: 2560, maxHeight: 1440, bitrate: '8000k', name: '1440p' }
    ];

    // Find appropriate quality tier
    let targetTier = qualityTiers[0]; // Default to 480p
    for (const tier of qualityTiers) {
      if (width <= tier.maxWidth && height <= tier.maxHeight) {
        targetTier = tier;
        break;
      }
    }

    // Calculate target dimensions maintaining aspect ratio
    const aspectRatio = width / height;
    let targetWidth, targetHeight;

    if (aspectRatio > targetTier.maxWidth / targetTier.maxHeight) {
      // Width is the limiting factor
      targetWidth = Math.min(width, targetTier.maxWidth);
      targetHeight = Math.round(targetWidth / aspectRatio);
    } else {
      // Height is the limiting factor
      targetHeight = Math.min(height, targetTier.maxHeight);
      targetWidth = Math.round(targetHeight * aspectRatio);
    }

    // Ensure dimensions are even (required for some codecs)
    targetWidth = targetWidth % 2 === 0 ? targetWidth : targetWidth - 1;
    targetHeight = targetHeight % 2 === 0 ? targetHeight : targetHeight - 1;

    return {
      width: targetWidth,
      height: targetHeight,
      bitrate: targetTier.bitrate,
      fps: Math.min(frameRate || 30, 30), // Cap at 30fps for web
      quality: targetTier.name
    };
  }

  // Generate video thumbnail
  async generateThumbnail({ videoPath, timestamp = 5, outputDir }) {
    try {
      // Ensure thumbnail directory exists
      await fs.mkdir(outputDir, { recursive: true });
      
      const thumbnailFilename = `${uuidv4()}.jpg`;
      const thumbnailPath = path.join(outputDir, thumbnailFilename);

      return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .screenshots({
            timestamps: [timestamp],
            filename: thumbnailFilename,
            folder: outputDir,
            size: '640x360' // 16:9 aspect ratio thumbnail
          })
          .on('error', (err) => {
            logger.error('Thumbnail generation error', {
              error: err.message,
              videoPath,
              timestamp
            });
            reject(new AppError('فشل في إنشاء الصورة المصغرة', 500));
          })
          .on('end', () => {
            logger.info('Thumbnail generated', {
              path: thumbnailPath,
              timestamp
            });
            resolve({
              filename: thumbnailFilename,
              path: thumbnailPath
            });
          });
      });
    } catch (error) {
      logger.error('Thumbnail generation failed', {
        error: error.message,
        videoPath
      });
      throw error;
    }
  }

  // Generate multiple thumbnails for video timeline
  async generateTimelineThumbnails({ videoPath, count = 10 }) {
    try {
      const metadata = await this.getVideoMetadata(videoPath);
      const duration = metadata.duration;
      
      if (duration <= 0) {
        throw new AppError('مدة الفيديو غير صالحة', 400);
      }

      const interval = duration / (count + 1);
      const timestamps = [];
      
      for (let i = 1; i <= count; i++) {
        timestamps.push(i * interval);
      }

      const thumbnails = [];
      for (const timestamp of timestamps) {
        const thumbnail = await this.generateThumbnail({
          videoPath,
          timestamp,
          outputDir: this.thumbnailPath
        });
        thumbnails.push({
          ...thumbnail,
          timestamp
        });
      }

      return thumbnails;
    } catch (error) {
      logger.error('Timeline thumbnails generation failed', {
        error: error.message,
        videoPath
      });
      throw error;
    }
  }

  // Extract audio from video
  async extractAudio({ videoPath, outputDir }) {
    try {
      await fs.mkdir(outputDir, { recursive: true });
      
      const audioFilename = `${uuidv4()}.mp3`;
      const audioPath = path.join(outputDir, audioFilename);

      return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .noVideo()
          .audioCodec('mp3')
          .audioBitrate('128k')
          .on('error', (err) => {
            logger.error('Audio extraction error', {
              error: err.message,
              videoPath
            });
            reject(new AppError('فشل في استخراج الصوت', 500));
          })
          .on('end', () => {
            logger.info('Audio extracted', {
              path: audioPath
            });
            resolve({
              filename: audioFilename,
              path: audioPath
            });
          })
          .save(audioPath);
      });
    } catch (error) {
      logger.error('Audio extraction failed', {
        error: error.message,
        videoPath
      });
      throw error;
    }
  }

  // Validate video file
  async validateVideo(filePath) {
    try {
      const metadata = await this.getVideoMetadata(filePath);
      
      // Check minimum requirements
      const validationResults = {
        isValid: true,
        errors: [],
        warnings: [],
        metadata
      };

      // Duration check
      if (metadata.duration < 1) {
        validationResults.errors.push('مدة الفيديو قصيرة جداً (أقل من ثانية)');
        validationResults.isValid = false;
      }
      
      if (metadata.duration > 3600) { // 1 hour
        validationResults.errors.push('مدة الفيديو طويلة جداً (أكثر من ساعة)');
        validationResults.isValid = false;
      }

      // Resolution check
      if (metadata.width < 320 || metadata.height < 240) {
        validationResults.errors.push('دقة الفيديو منخفضة جداً');
        validationResults.isValid = false;
      }

      // Codec warnings
      if (!['h264', 'h265', 'vp8', 'vp9'].includes(metadata.codec.toLowerCase())) {
        validationResults.warnings.push(`تشفير الفيديو (${metadata.codec}) قد يحتاج إعادة تشفير`);
      }

      return validationResults;
    } catch (error) {
      return {
        isValid: false,
        errors: ['فشل في قراءة ملف الفيديو'],
        warnings: [],
        metadata: null
      };
    }
  }

  // Get video frame at specific time
  async getFrameAt({ videoPath, timestamp, outputDir }) {
    try {
      await fs.mkdir(outputDir, { recursive: true });
      
      const frameFilename = `frame_${uuidv4()}.jpg`;
      const framePath = path.join(outputDir, frameFilename);

      return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .seekInput(timestamp)
          .frames(1)
          .output(framePath)
          .on('error', (err) => {
            reject(new AppError('فشل في استخراج الإطار', 500));
          })
          .on('end', () => {
            resolve({
              filename: frameFilename,
              path: framePath,
              timestamp
            });
          })
          .run();
      });
    } catch (error) {
      throw new AppError('فشل في استخراج الإطار', 500);
    }
  }
}

module.exports = {
  videoProcessor: new VideoProcessor()
};