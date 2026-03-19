// Video assets for auction platform

// Sample auction videos - these would be replaced with actual uploaded videos
export const AUCTION_VIDEOS = {
  // Jewelry auctions
  jewelry_1: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=450&fit=crop',
    duration: 180, // 3 minutes
    size: '45MB',
    format: 'mp4'
  },
  jewelry_2: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=450&fit=crop',
    duration: 240, // 4 minutes
    size: '52MB',
    format: 'mp4'
  },
  jewelry_3: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=450&fit=crop',
    duration: 120, // 2 minutes
    size: '28MB',
    format: 'mp4'
  },

  // Art auctions
  art_1: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop',
    duration: 300, // 5 minutes
    size: '68MB',
    format: 'mp4'
  },
  art_2: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=450&fit=crop',
    duration: 360, // 6 minutes
    size: '75MB',
    format: 'mp4'
  },

  // Antiques auctions
  antique_1: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&h=450&fit=crop',
    duration: 210, // 3.5 minutes
    size: '48MB',
    format: 'mp4'
  },
  antique_2: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&h=450&fit=crop',
    duration: 270, // 4.5 minutes
    size: '58MB',
    format: 'mp4'
  },

  // Watch auctions
  watch_1: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=800&h=450&fit=crop',
    duration: 150, // 2.5 minutes
    size: '35MB',
    format: 'mp4'
  },
  watch_2: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=450&fit=crop',
    duration: 180, // 3 minutes
    size: '42MB',
    format: 'mp4'
  },

  // Car auctions
  car_1: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=450&fit=crop',
    duration: 480, // 8 minutes
    size: '95MB',
    format: 'mp4'
  },
  car_2: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=450&fit=crop',
    duration: 420, // 7 minutes
    size: '88MB',
    format: 'mp4'
  },

  // Premium auctions
  premium_1: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=450&fit=crop',
    duration: 600, // 10 minutes
    size: '120MB',
    format: 'mp4'
  },
  premium_2: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=450&fit=crop',
    duration: 540, // 9 minutes
    size: '110MB',
    format: 'mp4'
  }
};

// Video quality options
export const VIDEO_QUALITIES = {
  '240p': { width: 426, height: 240, bitrate: '500k' },
  '360p': { width: 640, height: 360, bitrate: '800k' },
  '480p': { width: 854, height: 480, bitrate: '1200k' },
  '720p': { width: 1280, height: 720, bitrate: '2500k' },
  '1080p': { width: 1920, height: 1080, bitrate: '5000k' }
};

// Platform introduction/tutorial videos
export const PLATFORM_VIDEOS = {
  intro: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=450&fit=crop',
    duration: 120,
    title: 'مرحباً بكم في منصة مزاد موشن',
    description: 'تعلم كيفية المشاركة في المزادات'
  },
  howToBid: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1635776062043-223faf322554?w=800&h=450&fit=crop',
    duration: 180,
    title: 'كيفية المزايدة',
    description: 'دليل شامل للمزايدة الناجحة'
  },
  sellerGuide: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1556742400-b36f84b5c4d7?w=800&h=450&fit=crop',
    duration: 240,
    title: 'دليل البائع',
    description: 'كيفية إنشاء مزادك الأول'
  }
};

// Video streaming settings
export const STREAMING_CONFIG = {
  defaultQuality: '720p',
  autoQuality: true,
  bufferSize: 30, // seconds
  seekTolerance: 2, // seconds
  maxRetries: 3,
  retryDelay: 1000 // milliseconds
};

// Video player settings
export const PLAYER_SETTINGS = {
  controls: {
    play: true,
    pause: true,
    seek: false, // Disabled during live auctions
    volume: true,
    fullscreen: true,
    quality: true,
    speed: false // Disabled to maintain sync
  },
  autoplay: false,
  muted: false,
  loop: false,
  preload: 'metadata'
};

// Video formats supported
export const SUPPORTED_FORMATS = {
  upload: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  streaming: ['mp4', 'webm'],
  maxFileSize: 500 * 1024 * 1024, // 500MB
  maxDuration: 1800, // 30 minutes
  minDuration: 30, // 30 seconds
  recommendedFormat: 'mp4',
  recommendedCodec: 'h264'
};

// Helper functions
export const getVideoById = (videoId) => {
  return AUCTION_VIDEOS[videoId] || null;
};

export const getVideoThumbnail = (videoId, width = 800, height = 450) => {
  const video = AUCTION_VIDEOS[videoId];
  if (!video) return null;
  return `${video.thumbnail}?w=${width}&h=${height}&fit=crop`;
};

export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)}${units[unitIndex]}`;
};

export const validateVideoFile = (file) => {
  const errors = [];
  
  // Check file type
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!SUPPORTED_FORMATS.upload.includes(fileExtension)) {
    errors.push(`نوع الملف غير مدعوم. الأنواع المدعومة: ${SUPPORTED_FORMATS.upload.join(', ')}`);
  }
  
  // Check file size
  if (file.size > SUPPORTED_FORMATS.maxFileSize) {
    errors.push(`حجم الملف كبير جداً. الحد الأقصى: ${formatFileSize(SUPPORTED_FORMATS.maxFileSize)}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  AUCTION_VIDEOS,
  VIDEO_QUALITIES,
  PLATFORM_VIDEOS,
  STREAMING_CONFIG,
  PLAYER_SETTINGS,
  SUPPORTED_FORMATS,
  getVideoById,
  getVideoThumbnail,
  formatDuration,
  formatFileSize,
  validateVideoFile
};