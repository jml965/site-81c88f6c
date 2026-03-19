/**
 * Application constants and configuration
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
export const UPLOAD_URL = `${API_BASE_URL}/upload`;

// App Configuration
export const APP_NAME = 'مزاد موشن';
export const APP_DESCRIPTION = 'منصة المزادات بالفيديو المتزامن';
export const APP_VERSION = '1.0.0';
export const DEFAULT_LOCALE = 'ar-SA';
export const DEFAULT_CURRENCY = 'SAR';
export const DEFAULT_TIMEZONE = 'Asia/Riyadh';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  BIDDER: 'bidder',
  MODERATOR: 'moderator'
};

// Auction Status
export const AUCTION_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  ACTIVE: 'active',
  ENDING_SOON: 'ending_soon',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
  PAUSED: 'paused'
};

// Auction Status Labels (Arabic)
export const AUCTION_STATUS_LABELS = {
  [AUCTION_STATUS.DRAFT]: 'مسودة',
  [AUCTION_STATUS.PENDING]: 'قيد المراجعة',
  [AUCTION_STATUS.SCHEDULED]: 'مجدول',
  [AUCTION_STATUS.LIVE]: 'مباشر',
  [AUCTION_STATUS.ACTIVE]: 'نشط',
  [AUCTION_STATUS.ENDING_SOON]: 'قرب الانتهاء',
  [AUCTION_STATUS.ENDED]: 'منتهي',
  [AUCTION_STATUS.CANCELLED]: 'ملغي',
  [AUCTION_STATUS.PAUSED]: 'متوقف مؤقتاً'
};

// Auction Status Colors
export const AUCTION_STATUS_COLORS = {
  [AUCTION_STATUS.DRAFT]: 'gray',
  [AUCTION_STATUS.PENDING]: 'yellow',
  [AUCTION_STATUS.SCHEDULED]: 'blue',
  [AUCTION_STATUS.LIVE]: 'green',
  [AUCTION_STATUS.ACTIVE]: 'green',
  [AUCTION_STATUS.ENDING_SOON]: 'orange',
  [AUCTION_STATUS.ENDED]: 'gray',
  [AUCTION_STATUS.CANCELLED]: 'red',
  [AUCTION_STATUS.PAUSED]: 'yellow'
};

// Bid Status
export const BID_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  OUTBID: 'outbid',
  WINNING: 'winning',
  WON: 'won',
  LOST: 'lost',
  CANCELLED: 'cancelled'
};

// Bid Status Labels (Arabic)
export const BID_STATUS_LABELS = {
  [BID_STATUS.PENDING]: 'قيد المراجعة',
  [BID_STATUS.ACCEPTED]: 'مقبولة',
  [BID_STATUS.REJECTED]: 'مرفوضة',
  [BID_STATUS.OUTBID]: 'تم تجاوزها',
  [BID_STATUS.WINNING]: 'رابحة',
  [BID_STATUS.WON]: 'فائزة',
  [BID_STATUS.LOST]: 'خاسرة',
  [BID_STATUS.CANCELLED]: 'ملغية'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  AUCTION_STARTED: 'auction_started',
  AUCTION_ENDING: 'auction_ending',
  AUCTION_ENDED: 'auction_ended',
  OUTBID: 'outbid',
  WINNING_BID: 'winning_bid',
  AUCTION_WON: 'auction_won',
  AUCTION_LOST: 'auction_lost',
  NEW_MESSAGE: 'new_message',
  NEW_COMMENT: 'new_comment',
  COMMENT_REPLY: 'comment_reply',
  AUCTION_FOLLOW: 'auction_follow',
  SYSTEM: 'system',
  ACCOUNT: 'account'
};

// Notification Type Labels (Arabic)
export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPES.AUCTION_STARTED]: 'بدء المزاد',
  [NOTIFICATION_TYPES.AUCTION_ENDING]: 'قرب انتهاء المزاد',
  [NOTIFICATION_TYPES.AUCTION_ENDED]: 'انتهاء المزاد',
  [NOTIFICATION_TYPES.OUTBID]: 'تجاوز المزايدة',
  [NOTIFICATION_TYPES.WINNING_BID]: 'مزايدة رابحة',
  [NOTIFICATION_TYPES.AUCTION_WON]: 'فوز بالمزاد',
  [NOTIFICATION_TYPES.AUCTION_LOST]: 'خسارة المزاد',
  [NOTIFICATION_TYPES.NEW_MESSAGE]: 'رسالة جديدة',
  [NOTIFICATION_TYPES.NEW_COMMENT]: 'تعليق جديد',
  [NOTIFICATION_TYPES.COMMENT_REPLY]: 'رد على التعليق',
  [NOTIFICATION_TYPES.AUCTION_FOLLOW]: 'متابعة مزاد',
  [NOTIFICATION_TYPES.SYSTEM]: 'إشعار النظام',
  [NOTIFICATION_TYPES.ACCOUNT]: 'الحساب'
};

// Message Types
export const MESSAGE_TYPES = {
  PRIVATE: 'private',
  AUCTION: 'auction',
  SYSTEM: 'system',
  SUPPORT: 'support'
};

// Report Types
export const REPORT_TYPES = {
  SPAM: 'spam',
  INAPPROPRIATE: 'inappropriate',
  SCAM: 'scam',
  HARASSMENT: 'harassment',
  FAKE: 'fake',
  OTHER: 'other'
};

// Report Type Labels (Arabic)
export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.SPAM]: 'رسائل مزعجة',
  [REPORT_TYPES.INAPPROPRIATE]: 'محتوى غير مناسب',
  [REPORT_TYPES.SCAM]: 'احتيال',
  [REPORT_TYPES.HARASSMENT]: 'تحرش',
  [REPORT_TYPES.FAKE]: 'محتوى مزيف',
  [REPORT_TYPES.OTHER]: 'أخرى'
};

// File Upload Limits
export const FILE_LIMITS = {
  VIDEO: {
    MAX_SIZE: 500 * 1024 * 1024, // 500MB
    ALLOWED_TYPES: ['video/mp4', 'video/webm', 'video/avi', 'video/mov'],
    MAX_DURATION: 3600 // 1 hour in seconds
  },
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_COUNT: 10
  },
  THUMBNAIL: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }
};

// Video Quality Options
export const VIDEO_QUALITIES = {
  '240p': { width: 426, height: 240, label: 'جودة منخفضة' },
  '360p': { width: 640, height: 360, label: 'جودة متوسطة' },
  '480p': { width: 854, height: 480, label: 'جودة جيدة' },
  '720p': { width: 1280, height: 720, label: 'جودة عالية' },
  '1080p': { width: 1920, height: 1080, label: 'جودة عالية جداً' }
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  AUCTION_PAGE_SIZE: 12,
  COMMENT_PAGE_SIZE: 20,
  MESSAGE_PAGE_SIZE: 50,
  NOTIFICATION_PAGE_SIZE: 30
};

// Time Intervals (in milliseconds)
export const INTERVALS = {
  AUCTION_SYNC: 1000, // 1 second
  BID_REFRESH: 2000, // 2 seconds
  NOTIFICATION_CHECK: 30000, // 30 seconds
  HEARTBEAT: 5000, // 5 seconds
  RECONNECT_DELAY: 3000, // 3 seconds
  DEBOUNCE_SEARCH: 300, // 300ms
  TOAST_DURATION: 5000 // 5 seconds
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  NOTIFICATIONS: 'notification_settings',
  RECENT_SEARCHES: 'recent_searches',
  FOLLOWED_AUCTIONS: 'followed_auctions',
  VIDEO_PREFERENCES: 'video_preferences',
  DRAFT_AUCTION: 'draft_auction'
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Currency Options
export const CURRENCIES = {
  SAR: { symbol: 'ر.س', name: 'ريال سعودي', code: 'SAR' },
  USD: { symbol: '$', name: 'دولار أمريكي', code: 'USD' },
  EUR: { symbol: '€', name: 'يورو', code: 'EUR' },
  AED: { symbol: 'د.إ', name: 'درهم إماراتي', code: 'AED' }
};

// Language Options
export const LANGUAGES = {
  AR: { code: 'ar', name: 'العربية', dir: 'rtl' },
  EN: { code: 'en', name: 'English', dir: 'ltr' }
};

// Quick Bid Amounts (based on current price)
export const QUICK_BID_INCREMENTS = [5, 10, 25, 50, 100, 250, 500, 1000];

// Auction Duration Options (in minutes)
export const AUCTION_DURATIONS = [
  { value: 30, label: '30 دقيقة' },
  { value: 60, label: 'ساعة واحدة' },
  { value: 120, label: 'ساعتان' },
  { value: 240, label: '4 ساعات' },
  { value: 480, label: '8 ساعات' },
  { value: 720, label: '12 ساعة' },
  { value: 1440, label: '24 ساعة' },
  { value: 2880, label: 'يومان' },
  { value: 4320, label: '3 أيام' },
  { value: 10080, label: 'أسبوع' }
];

// Default Auction Settings
export const DEFAULT_AUCTION_SETTINGS = {
  STARTING_PRICE: 10,
  MIN_INCREMENT: 5,
  DURATION: 60, // minutes
  ENDING_SOON_THRESHOLD: 300, // 5 minutes in seconds
  AUTO_EXTEND_THRESHOLD: 60, // 1 minute in seconds
  AUTO_EXTEND_DURATION: 300 // 5 minutes in seconds
};

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',
  
  // Authentication
  AUTH: 'auth',
  AUTH_SUCCESS: 'auth_success',
  AUTH_ERROR: 'auth_error',
  
  // Auction Room
  JOIN_AUCTION: 'join_auction',
  LEAVE_AUCTION: 'leave_auction',
  AUCTION_UPDATE: 'auction_update',
  AUCTION_SYNC: 'auction_sync',
  AUCTION_STATUS_CHANGE: 'auction_status_change',
  
  // Bidding
  NEW_BID: 'new_bid',
  BID_ACCEPTED: 'bid_accepted',
  BID_REJECTED: 'bid_rejected',
  BID_UPDATE: 'bid_update',
  
  // Timeline
  TIMELINE_UPDATE: 'timeline_update',
  TIMELINE_EVENT: 'timeline_event',
  
  // Comments
  NEW_COMMENT: 'new_comment',
  COMMENT_UPDATE: 'comment_update',
  COMMENT_DELETE: 'comment_delete',
  
  // Messages
  NEW_MESSAGE: 'new_message',
  MESSAGE_READ: 'message_read',
  
  // Notifications
  NEW_NOTIFICATION: 'new_notification',
  NOTIFICATION_READ: 'notification_read',
  
  // User Activity
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  USER_COUNT_UPDATE: 'user_count_update'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
  SERVER_ERROR: 'خطأ في الخادم',
  UNAUTHORIZED: 'غير مخول للوصول',
  FORBIDDEN: 'محظور',
  NOT_FOUND: 'غير موجود',
  VALIDATION_ERROR: 'خطأ في البيانات',
  UPLOAD_ERROR: 'خطأ في رفع الملف',
  CONNECTION_LOST: 'تم فقدان الاتصال',
  AUCTION_ENDED: 'انتهى المزاد',
  BID_TOO_LOW: 'مبلغ المزايدة منخفض',
  INSUFFICIENT_FUNDS: 'رصيد غير كافي'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  BID_PLACED: 'تم وضع المزايدة بنجاح',
  AUCTION_CREATED: 'تم إنشاء المزاد بنجاح',
  COMMENT_ADDED: 'تم إضافة التعليق بنجاح',
  MESSAGE_SENT: 'تم إرسال الرسالة بنجاح',
  PROFILE_UPDATED: 'تم تحديث الملف الشخصي',
  NOTIFICATION_SENT: 'تم إرسال الإشعار',
  FOLLOW_ADDED: 'تم إضافة المتابعة',
  REPORT_SUBMITTED: 'تم إرسال البلاغ'
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_VIDEO_CHAT: false,
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_AUTO_BID: false,
  ENABLE_LIVE_STREAM: false,
  ENABLE_PAYMENT_GATEWAY: false
};

// Browser Support
export const BROWSER_SUPPORT = {
  WEBRTC: 'webrtc' in window,
  WEBSOCKETS: 'WebSocket' in window,
  FILE_API: 'FileReader' in window,
  LOCAL_STORAGE: 'localStorage' in window,
  SESSION_STORAGE: 'sessionStorage' in window,
  GEOLOCATION: 'geolocation' in navigator,
  NOTIFICATIONS: 'Notification' in window
};

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_SA: /^(\+966|966|0)?5[0-9]{8}$/,
  USERNAME: /^[a-zA-Z0-9_\u0600-\u06FF]{3,30}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  ARABIC_TEXT: /[\u0600-\u06FF]/,
  NUMERIC: /^[0-9]+$/,
  DECIMAL: /^[0-9]+(\.[0-9]+)?$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Default Values
export const DEFAULTS = {
  AVATAR: '/images/default-avatar.png',
  AUCTION_THUMBNAIL: '/images/default-auction.png',
  VIDEO_POSTER: '/images/default-video-poster.jpg',
  COMPANY_LOGO: '/images/logo.png',
  CURRENCY: 'SAR',
  LANGUAGE: 'ar',
  THEME: 'light',
  PAGE_SIZE: 12,
  NOTIFICATION_SOUND: true,
  EMAIL_NOTIFICATIONS: true
};