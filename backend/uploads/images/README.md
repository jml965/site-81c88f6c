# Image Uploads Directory

This directory stores uploaded images for auctions, user profiles, and other platform assets.

## Directory Structure

```
images/
├── auctions/           # Auction item images
│   ├── original/       # Original uploaded images
│   ├── thumbnails/     # Generated thumbnails
│   ├── medium/         # Medium-sized images
│   └── large/          # Large-sized images
├── profiles/           # User profile images
│   ├── avatars/        # User avatars
│   └── covers/         # Profile cover images
├── categories/         # Category images
├── banners/           # Platform banners and ads
└── temp/              # Temporary upload files
```

## File Naming Convention

### Auction Images
- Original: `auction_{auctionId}_{imageIndex}_{timestamp}.{ext}`
- Thumbnail: `auction_{auctionId}_{imageIndex}_thumb.{ext}`
- Medium: `auction_{auctionId}_{imageIndex}_medium.{ext}`
- Large: `auction_{auctionId}_{imageIndex}_large.{ext}`

Example:
- `auction_123_1_1703123456789.jpg`
- `auction_123_1_thumb.jpg`
- `auction_123_1_medium.jpg`
- `auction_123_1_large.jpg`

### Profile Images
- Avatar: `avatar_{userId}_{timestamp}.{ext}`
- Cover: `cover_{userId}_{timestamp}.{ext}`

Example:
- `avatar_456_1703123456789.jpg`
- `cover_456_1703123456789.jpg`

## Image Processing Pipeline

1. **Upload**: Store original image in temp folder
2. **Validation**: Check format, size, dimensions
3. **Processing**: Generate multiple sizes and optimize
4. **Storage**: Move processed images to appropriate folders
5. **Database**: Update image records in database
6. **Cleanup**: Remove temporary files

## Supported Formats

### Input Formats
- JPEG/JPG
- PNG
- WebP
- GIF (static only)
- BMP
- TIFF

### Output Formats
- JPEG (primary format, best compression)
- WebP (modern format, better compression)
- PNG (for images requiring transparency)

## Image Sizes

### Auction Images
| Size | Dimensions | Quality | Use Case |
|------|------------|---------|----------|
| Thumbnail | 150x150 | 75% | Grid views, lists |
| Medium | 400x300 | 85% | Detail views |
| Large | 800x600 | 90% | Lightbox, zoom |
| Original | As uploaded | 95% | Download, archive |

### Profile Images
| Type | Dimensions | Quality | Use Case |
|------|------------|---------|----------|
| Avatar (Small) | 50x50 | 80% | Comments, small UI |
| Avatar (Medium) | 100x100 | 85% | Profile cards |
| Avatar (Large) | 200x200 | 90% | Profile pages |
| Cover | 1200x300 | 85% | Profile headers |

### Category Images
| Size | Dimensions | Quality | Use Case |
|------|------------|---------|----------|
| Icon | 64x64 | 85% | Category icons |
| Card | 300x200 | 85% | Category cards |
| Banner | 800x400 | 90% | Category headers |

## Storage Limits

- **Max file size**: 10MB per image
- **Max resolution**: 4096x4096 pixels
- **Max images per auction**: 20 images
- **Storage quota per user**: 100MB
- **Supported aspect ratios**: 16:9, 4:3, 1:1, 3:4

## Security Measures

1. **File type validation**: Only allow approved image formats
2. **Image content validation**: Check for valid image headers
3. **Virus scanning**: Scan all uploads for malware
4. **Content moderation**: AI-powered inappropriate content detection
5. **EXIF data removal**: Strip metadata for privacy
6. **Access control**: Secure URL generation with authentication

## Performance Optimization

1. **Lazy loading**: Load images only when visible
2. **Progressive JPEG**: Enable progressive rendering
3. **WebP conversion**: Serve modern format to supported browsers
4. **CDN delivery**: Serve images from global CDN
5. **Caching**: Cache processed images for faster access
6. **Responsive images**: Serve appropriate size based on device

## Image Quality Guidelines

### For Sellers
- **Resolution**: Minimum 800x600 pixels
- **Lighting**: Good, natural lighting preferred
- **Focus**: Sharp, clear focus on item
- **Background**: Clean, neutral backgrounds
- **Angles**: Multiple angles showing item details
- **Format**: JPEG or PNG recommended

### Technical Requirements
- **Aspect ratio**: 4:3 or 16:9 preferred
- **Color space**: sRGB
- **Compression**: Balance between quality and file size
- **Watermarks**: Not allowed on auction images

## Monitoring

- **Upload success rate**: Track failed uploads
- **Processing time**: Monitor image processing duration
- **Storage usage**: Track disk space utilization
- **CDN hits**: Monitor cache hit rates
- **Error rates**: Track processing errors

## Maintenance Tasks

### Daily
- Clean up temp files older than 24 hours
- Verify backup completion
- Check disk space usage
- Process failed uploads

### Weekly
- Remove orphaned image files
- Optimize CDN cache settings
- Generate usage reports
- Update image processing software

### Monthly
- Archive old auction images
- Security audit of access logs
- Performance optimization review
- Storage cleanup and optimization

## Environment Variables

```bash
# Image processing
IMAGE_PROCESSING_ENABLED=true
IMAGE_PROCESSING_QUEUE=redis://localhost:6379
IMAGE_PROCESSING_WORKERS=2
IMAGE_QUALITY_DEFAULT=85
IMAGE_WEBP_ENABLED=true

# Storage
IMAGE_STORAGE_PATH=/app/uploads/images
IMAGE_CDN_URL=https://cdn.mazadmotion.com
IMAGE_BACKUP_ENABLED=true
IMAGE_BACKUP_PROVIDER=aws_s3

# Limits
IMAGE_MAX_FILE_SIZE=10485760   # 10MB
IMAGE_MAX_RESOLUTION=4096      # 4096x4096
IMAGE_MAX_PER_AUCTION=20
IMAGE_USER_QUOTA=104857600     # 100MB

# Security
IMAGE_VIRUS_SCAN_ENABLED=true
IMAGE_CONTENT_MODERATION=true
IMAGE_STRIP_EXIF=true
```

## API Endpoints

### Upload Image
```
POST /api/v1/images/upload
Content-Type: multipart/form-data

Parameters:
- file: Image file
- type: Image type (auction, profile, category)
- entityId: Related entity ID
- title: Image title (optional)
- alt: Alt text (optional)
```

### Get Image Info
```
GET /api/v1/images/:imageId

Response:
{
  "id": "123",
  "type": "auction",
  "entityId": "456",
  "filename": "auction_456_1_thumb.jpg",
  "sizes": {
    "thumbnail": "/uploads/images/auctions/thumbnails/auction_456_1_thumb.jpg",
    "medium": "/uploads/images/auctions/medium/auction_456_1_medium.jpg",
    "large": "/uploads/images/auctions/large/auction_456_1_large.jpg"
  },
  "dimensions": {
    "width": 800,
    "height": 600
  },
  "fileSize": 125000,
  "uploadedAt": "2023-12-01T10:30:00Z"
}
```

### Serve Image
```
GET /api/v1/images/:imageId/:size
GET /uploads/images/path/to/image.jpg

Response: Image file with appropriate headers
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 5001 | Invalid file format | Uploaded file is not a supported image format |
| 5002 | File too large | Image exceeds maximum file size limit |
| 5003 | Resolution too high | Image dimensions exceed maximum resolution |
| 5004 | Processing failed | Image processing/resizing failed |
| 5005 | Storage full | Not enough storage space available |
| 5006 | Virus detected | Malware detected in uploaded file |
| 5007 | Content rejected | Inappropriate content detected |
| 5008 | Quota exceeded | User has exceeded storage quota |
| 5009 | Too many images | Auction has reached maximum image limit |

## Responsive Image Implementation

### HTML Example
```html
<picture>
  <source 
    srcset="/uploads/images/auctions/large/auction_123_1_large.webp" 
    type="image/webp">
  <img 
    src="/uploads/images/auctions/medium/auction_123_1_medium.jpg"
    srcset="/uploads/images/auctions/thumbnails/auction_123_1_thumb.jpg 150w,
            /uploads/images/auctions/medium/auction_123_1_medium.jpg 400w,
            /uploads/images/auctions/large/auction_123_1_large.jpg 800w"
    sizes="(max-width: 640px) 150px, 
           (max-width: 1024px) 400px, 
           800px"
    alt="Diamond necklace auction item"
    loading="lazy">
</picture>
```

### CSS Example
```css
.auction-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.auction-image:hover {
  transform: scale(1.05);
}

@media (max-width: 640px) {
  .auction-grid .auction-image {
    height: 150px;
  }
}
```

## Troubleshooting

### Common Issues

1. **Upload fails**: Check file size and format
2. **Images not displaying**: Verify file permissions
3. **Slow loading**: Check CDN configuration
4. **Processing stuck**: Restart processing workers
5. **Storage full**: Clean up old files or expand storage

### Debug Commands

```bash
# Check processing queue
redis-cli llen image:processing:queue

# View processing logs
tail -f /var/log/mazad/image-processing.log

# Check disk space
df -h /app/uploads/images

# Verify image file
file /path/to/image.jpg
identify /path/to/image.jpg

# Test image endpoint
curl -I http://localhost:3000/uploads/images/auctions/medium/image.jpg
```