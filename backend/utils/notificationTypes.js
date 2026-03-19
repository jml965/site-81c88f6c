// Notification types and their configurations
const NOTIFICATION_TYPES = {
  // Auction notifications
  AUCTION_STARTED: {
    type: 'auction_started',
    priority: 'medium',
    titleTemplate: 'بدأ المزاد: {{auctionTitle}}',
    messageTemplate: 'المزاد "{{auctionTitle}}" بدأ الآن! انضم للمزايدة',
    actionUrlTemplate: '/auction/{{auctionId}}',
    expiresInHours: 168 // 1 week
  },
  
  AUCTION_ENDING_SOON: {
    type: 'auction_ending_soon',
    priority: 'high',
    titleTemplate: 'ينتهي قريباً: {{auctionTitle}}',
    messageTemplate: 'المزاد "{{auctionTitle}}" ينتهي خلال {{timeRemaining}}',
    actionUrlTemplate: '/auction/{{auctionId}}',
    expiresInHours: 24
  },
  
  AUCTION_ENDED: {
    type: 'auction_ended',
    priority: 'medium',
    titleTemplate: 'انتهى المزاد: {{auctionTitle}}',
    messageTemplate: 'انتهى المزاد "{{auctionTitle}}" بسعر {{finalPrice}} ريال',
    actionUrlTemplate: '/auction/{{auctionId}}/results',
    expiresInHours: 720 // 30 days
  },
  
  // Bidding notifications
  BID_OUTBID: {
    type: 'bid_outbid',
    priority: 'high',
    titleTemplate: 'تم تجاوز مزايدتك',
    messageTemplate: 'تم تجاوز مزايدتك في "{{auctionTitle}}" بمبلغ {{newBidAmount}} ريال',
    actionUrlTemplate: '/auction/{{auctionId}}',
    expiresInHours: 72
  },
  
  BID_WON: {
    type: 'bid_won',
    priority: 'urgent',
    titleTemplate: '🎉 تهانينا! فزت بالمزاد',
    messageTemplate: 'فزت بالمزاد "{{auctionTitle}}" بمبلغ {{winningAmount}} ريال',
    actionUrlTemplate: '/auction/{{auctionId}}/results',
    expiresInHours: 8760 // 1 year
  },
  
  BID_PLACED: {
    type: 'bid_placed',
    priority: 'medium',
    titleTemplate: 'تم تأكيد مزايدتك',
    messageTemplate: 'تم تأكيد مزايدتك في "{{auctionTitle}}" بمبلغ {{bidAmount}} ريال',
    actionUrlTemplate: '/auction/{{auctionId}}',
    expiresInHours: 48
  },
  
  // Message notifications
  NEW_MESSAGE: {
    type: 'new_message',
    priority: 'medium',
    titleTemplate: 'رسالة جديدة من {{senderName}}',
    messageTemplate: '{{messagePreview}}',
    actionUrlTemplate: '/messages/{{conversationId}}',
    expiresInHours: 168
  },
  
  // Comment notifications
  NEW_COMMENT: {
    type: 'new_comment',
    priority: 'low',
    titleTemplate: 'تعليق جديد على {{auctionTitle}}',
    messageTemplate: '{{commenterName}}: {{commentPreview}}',
    actionUrlTemplate: '/auction/{{auctionId}}#comments',
    expiresInHours: 72
  },
  
  COMMENT_REPLY: {
    type: 'comment_reply',
    priority: 'medium',
    titleTemplate: 'رد على تعليقك',
    messageTemplate: 'رد {{replierName}} على تعليقك في "{{auctionTitle}}"',
    actionUrlTemplate: '/auction/{{auctionId}}#comment-{{commentId}}',
    expiresInHours: 72
  },
  
  // Follow notifications
  AUCTION_FOLLOWED: {
    type: 'auction_followed',
    priority: 'low',
    titleTemplate: '{{followerName}} يتابع مزادك',
    messageTemplate: 'بدأ {{followerName}} متابعة مزادك "{{auctionTitle}}"',
    actionUrlTemplate: '/auction/{{auctionId}}',
    expiresInHours: 48
  },
  
  SELLER_FOLLOWED: {
    type: 'seller_followed',
    priority: 'low',
    titleTemplate: 'متابع جديد',
    messageTemplate: 'بدأ {{followerName}} متابعتك كبائع',
    actionUrlTemplate: '/profile/{{followerId}}',
    expiresInHours: 48
  },
  
  // Like notifications
  AUCTION_LIKED: {
    type: 'auction_liked',
    priority: 'low',
    titleTemplate: '{{likerName}} أعجب بمزادك',
    messageTemplate: 'أعجب {{likerName}} بمزادك "{{auctionTitle}}"',
    actionUrlTemplate: '/auction/{{auctionId}}',
    expiresInHours: 24
  },
  
  // Report notifications
  REPORT_PROCESSED: {
    type: 'report_processed',
    priority: 'medium',
    titleTemplate: 'تم معالجة بلاغك',
    messageTemplate: 'تم معالجة بلاغك حول {{reportSubject}} - {{actionTaken}}',
    actionUrlTemplate: '/reports/{{reportId}}',
    expiresInHours: 720
  },
  
  // Admin notifications
  AUCTION_APPROVED: {
    type: 'auction_approved',
    priority: 'medium',
    titleTemplate: 'تم قبول مزادك',
    messageTemplate: 'تم قبول مزادك "{{auctionTitle}}" وسيبدأ في {{startTime}}',
    actionUrlTemplate: '/auction/{{auctionId}}',
    expiresInHours: 168
  },
  
  AUCTION_REJECTED: {
    type: 'auction_rejected',
    priority: 'medium',
    titleTemplate: 'تم رفض مزادك',
    messageTemplate: 'تم رفض مزادك "{{auctionTitle}}" - {{reason}}',
    actionUrlTemplate: '/seller/auctions/{{auctionId}}',
    expiresInHours: 720
  },
  
  // Payment notifications
  PAYMENT_REQUIRED: {
    type: 'payment_required',
    priority: 'urgent',
    titleTemplate: 'مطلوب دفع المبلغ',
    messageTemplate: 'يرجى دفع مبلغ {{amount}} ريال لمزادك الفائز "{{auctionTitle}}"',
    actionUrlTemplate: '/payment/{{auctionId}}',
    expiresInHours: 72
  },
  
  // System notifications
  SYSTEM_ANNOUNCEMENT: {
    type: 'system_announcement',
    priority: 'medium',
    titleTemplate: '{{title}}',
    messageTemplate: '{{message}}',
    actionUrlTemplate: '{{actionUrl}}',
    expiresInHours: 168
  }
};

// Helper functions
const getNotificationConfig = (type) => {
  const config = Object.values(NOTIFICATION_TYPES).find(config => config.type === type);
  if (!config) {
    throw new Error(`Unknown notification type: ${type}`);
  }
  return config;
};

const interpolateTemplate = (template, data) => {
  return template.replace(/{{(\w+)}}/g, (match, key) => {
    return data[key] || match;
  });
};

const createNotificationData = (type, templateData = {}) => {
  const config = getNotificationConfig(type);
  
  const expiresAt = config.expiresInHours 
    ? new Date(Date.now() + config.expiresInHours * 60 * 60 * 1000)
    : null;
  
  return {
    type: config.type,
    title: interpolateTemplate(config.titleTemplate, templateData),
    message: interpolateTemplate(config.messageTemplate, templateData),
    priority: config.priority,
    actionUrl: config.actionUrlTemplate 
      ? interpolateTemplate(config.actionUrlTemplate, templateData)
      : null,
    expiresAt,
    data: templateData
  };
};

// Notification priority levels
const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Time constants
const TIME_CONSTANTS = {
  MINUTES_15: 15 * 60 * 1000,
  MINUTES_30: 30 * 60 * 1000,
  HOUR_1: 60 * 60 * 1000,
  HOURS_2: 2 * 60 * 60 * 1000,
  HOURS_6: 6 * 60 * 60 * 1000,
  HOURS_24: 24 * 60 * 60 * 1000,
  DAYS_3: 3 * 24 * 60 * 60 * 1000,
  WEEK_1: 7 * 24 * 60 * 60 * 1000
};

// Notification delivery preferences
const DELIVERY_METHODS = {
  IN_APP: 'in_app',
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push'
};

// User notification preferences structure
const DEFAULT_USER_PREFERENCES = {
  auction_started: {
    enabled: true,
    methods: ['in_app', 'push']
  },
  auction_ending_soon: {
    enabled: true,
    methods: ['in_app', 'push', 'email']
  },
  auction_ended: {
    enabled: true,
    methods: ['in_app', 'email']
  },
  bid_outbid: {
    enabled: true,
    methods: ['in_app', 'push', 'email']
  },
  bid_won: {
    enabled: true,
    methods: ['in_app', 'push', 'email', 'sms']
  },
  bid_placed: {
    enabled: true,
    methods: ['in_app']
  },
  new_message: {
    enabled: true,
    methods: ['in_app', 'push']
  },
  new_comment: {
    enabled: true,
    methods: ['in_app']
  },
  comment_reply: {
    enabled: true,
    methods: ['in_app', 'push']
  },
  auction_followed: {
    enabled: true,
    methods: ['in_app']
  },
  seller_followed: {
    enabled: true,
    methods: ['in_app']
  },
  auction_liked: {
    enabled: false,
    methods: ['in_app']
  },
  report_processed: {
    enabled: true,
    methods: ['in_app', 'email']
  },
  auction_approved: {
    enabled: true,
    methods: ['in_app', 'push', 'email']
  },
  auction_rejected: {
    enabled: true,
    methods: ['in_app', 'email']
  },
  payment_required: {
    enabled: true,
    methods: ['in_app', 'push', 'email', 'sms']
  },
  system_announcement: {
    enabled: true,
    methods: ['in_app', 'push']
  }
};

module.exports = {
  NOTIFICATION_TYPES,
  PRIORITY_LEVELS,
  TIME_CONSTANTS,
  DELIVERY_METHODS,
  DEFAULT_USER_PREFERENCES,
  getNotificationConfig,
  interpolateTemplate,
  createNotificationData
};