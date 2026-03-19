# Video Uploads Directory

This directory stores uploaded auction videos from users.

## Directory Structure

```
videos/
├── original/           # Original uploaded videos
├── processed/          # Processed videos (different qualities)
├── thumbnails/         # Auto-generated video thumbnails
└── temp/              # Temporary files during upload/processing
```

## File Naming Convention

### Original Videos
- Format: `{auctionId}_{timestamp}_{originalName}.{ext}`
- Example: `123_1703123456789_diamond_necklace.mp4`

### Processed Videos
- Format: `{auctionId}_{quality}.{ext}`
- Example: `123_720p.mp4`, `123_1080p.mp4`

### Thumbnails
- Format: `{auctionId}_thumb_{timestamp}.jpg`
- Example: `123_thumb_00-30.jpg` (thumbnail at 30 seconds)

## Video Processing Pipeline

1. **Upload**: Original video stored in `original/`
2. **Validation**: Check format, duration, size
3. **Processing**: Convert to multiple qualities
4. **Thumbnail Generation**: Extract key frames
5. **Storage**: Move processed files to appropriate folders
6. **Cleanup**: Remove temporary files

## Supported Formats

### Input Formats
- MP4 (H.264/H.265)
- MOV (QuickTime)
- AVI
- MKV
- WebM

### Output Formats
- MP4 (H.264) - Primary format
- WebM (VP9) - Fallback for older browsers

## Quality Levels

| Quality | Resolution | Bitrate | Use Case |
|---------|------------|---------|----------|
| 240p    | 426x240    | 500k    | Very slow connections |
| 360p    | 640x360    | 800k    | Mobile data |
| 480p    | 854x480    | 1.2M    | Standard mobile |
| 720p    | 1280x720   | 2.5M    | HD viewing |
| 1080p   | 1920x1080  | 5M      | Full HD |

## Storage Limits

- **Max file size**: 500MB per video
- **Max duration**: 30 minutes
- **Min duration**: 30 seconds
- **Storage quota per user**: 5GB
- **Total platform storage**: Unlimited (cloud storage)

## Security Measures

1. **File type validation**: Only allow approved video formats
2. **Virus scanning**: Scan all uploads for malware
3. **Content moderation**: AI-powered inappropriate content detection
4. **Access control**: Secure URL generation with expiration
5. **Backup**: Automatic backup to cloud storage

## Performance Optimization

1. **Lazy loading**: Load videos only when needed
2. **CDN delivery**: Serve videos from global CDN
3. **Adaptive streaming**: Automatically adjust quality based on bandwidth
4. **Compression**: Optimize file sizes without quality loss
5. **Caching**: Cache frequently accessed videos

## Monitoring

- **Upload success rate**: Track failed uploads
- **Processing time**: Monitor video processing duration
- **Storage usage**: Track disk space utilization
- **Bandwidth usage**: Monitor CDN traffic
- **Error rates**: Track encoding/decoding errors

## Maintenance Tasks

### Daily
- Clean up temp files older than 24 hours
- Verify backup completion
- Check disk space usage

### Weekly
- Remove orphaned video files
- Optimize database indexes
- Generate usage reports

### Monthly
- Archive old auction videos
- Update video processing software
- Security audit of access logs

## Environment Variables

```bash
# Video processing
VIDEO_PROCESSING_ENABLED=true
VIDEO_PROCESSING_QUEUE=redis://localhost:6379
VIDEO_PROCESSING_WORKERS=4

# Storage
VIDEO_STORAGE_PATH=/app/uploads/videos
VIDEO_CDN_URL=https://cdn.mazadmotion.com
VIDEO_BACKUP_ENABLED=true
VIDEO_BACKUP_PROVIDER=aws_s3

# Limits
VIDEO_MAX_FILE_SIZE=524288000  # 500MB
VIDEO_MAX_DURATION=1800        # 30 minutes
VIDEO_MIN_DURATION=30          # 30 seconds
```

## API Endpoints

### Upload Video
```
POST /api/v1/videos/upload
Content-Type: multipart/form-data

Parameters:
- file: Video file
- auctionId: Auction ID
- title: Video title (optional)
- description: Video description (optional)
```

### Get Video Info
```
GET /api/v1/videos/:videoId

Response:
{
  "id": "123",
  "auctionId": "456",
  "status": "processed",
  "qualities": ["720p", "1080p"],
  "thumbnails": ["thumb_00-30.jpg"],
  "duration": 180,
  "fileSize": 45000000,
  "uploadedAt": "2023-12-01T10:30:00Z"
}
```

### Stream Video
```
GET /api/v1/videos/:videoId/stream?quality=720p

Response: Video stream with appropriate headers
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 4001 | Invalid file format | Uploaded file is not a supported video format |
| 4002 | File too large | Video exceeds maximum file size limit |
| 4003 | Video too long | Video duration exceeds maximum limit |
| 4004 | Video too short | Video duration is below minimum requirement |
| 4005 | Processing failed | Video processing/encoding failed |
| 4006 | Storage full | Not enough storage space available |
| 4007 | Virus detected | Malware detected in uploaded file |
| 4008 | Content rejected | Inappropriate content detected |

## Troubleshooting

### Common Issues

1. **Upload fails**: Check file size and format
2. **Processing stuck**: Restart processing workers
3. **Video not playing**: Verify file integrity
4. **Slow streaming**: Check CDN configuration
5. **Storage full**: Clean up old files or expand storage

### Debug Commands

```bash
# Check processing queue
redis-cli llen video:processing:queue

# View processing logs
tail -f /var/log/mazad/video-processing.log

# Check disk space
df -h /app/uploads/videos

# Verify video file
ffmpeg -i /path/to/video.mp4 -f null -

# Test streaming endpoint
curl -I http://localhost:3000/api/v1/videos/123/stream
```