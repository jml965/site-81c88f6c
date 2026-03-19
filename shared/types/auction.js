/**
 * Auction type definitions and interfaces
 */

/**
 * Auction status constants
 */
export const AUCTION_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended'
};

/**
 * Auction categories
 */
export const AUCTION_CATEGORIES = {
  LIVESTOCK: 'livestock',
  VEHICLES: 'vehicles',
  REAL_ESTATE: 'real_estate',
  ANTIQUES: 'antiques',
  ELECTRONICS: 'electronics',
  JEWELRY: 'jewelry',
  ART: 'art',
  COLLECTIBLES: 'collectibles',
  OTHER: 'other'
};

/**
 * Auction type interface
 * @typedef {Object} Auction
 * @property {string} id - Unique auction identifier
 * @property {string} title - Auction title in Arabic
 * @property {string} description - Detailed description
 * @property {string} shortDescription - Brief description for cards
 * @property {string} category - Auction category from AUCTION_CATEGORIES
 * @property {string} status - Current auction status from AUCTION_STATUS
 * @property {number} startingPrice - Initial bidding price
 * @property {number} currentPrice - Current highest bid
 * @property {number} minimumIncrement - Minimum bid increment
 * @property {string} sellerId - ID of the seller
 * @property {Object} seller - Seller information
 * @property {string} seller.id - Seller ID
 * @property {string} seller.name - Seller name
 * @property {string} seller.avatar - Seller avatar URL
 * @property {number} seller.rating - Seller rating (1-5)
 * @property {Date} startTime - Auction start time
 * @property {Date} endTime - Auction end time
 * @property {number} duration - Auction duration in minutes
 * @property {string} videoUrl - Main auction video URL
 * @property {string} thumbnailUrl - Video thumbnail URL
 * @property {Array<string>} imageUrls - Additional images
 * @property {string} location - Auction location
 * @property {Object} stats - Auction statistics
 * @property {number} stats.viewCount - Number of views
 * @property {number} stats.participantCount - Number of bidders
 * @property {number} stats.bidCount - Total number of bids
 * @property {number} stats.likeCount - Number of likes
 * @property {number} stats.commentCount - Number of comments
 * @property {number} stats.followCount - Number of followers
 * @property {Object} timeline - Auction timeline data
 * @property {number} timeline.currentTime - Current auction time in seconds
 * @property {number} timeline.totalDuration - Total auction duration in seconds
 * @property {Array<Object>} timeline.events - Timeline events
 * @property {Array<Object>} bids - Recent bids
 * @property {Array<Object>} comments - Recent comments
 * @property {Object} settings - Auction settings
 * @property {boolean} settings.allowComments - Allow comments
 * @property {boolean} settings.allowMessages - Allow messages
 * @property {boolean} settings.autoExtend - Auto-extend on late bids
 * @property {number} settings.extensionTime - Extension time in minutes
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * Timeline event interface
 * @typedef {Object} TimelineEvent
 * @property {string} id - Event ID
 * @property {string} type - Event type (bid, comment, milestone)
 * @property {number} timestamp - Time in seconds from auction start
 * @property {string} description - Event description
 * @property {Object} data - Additional event data
 * @property {string} userId - User who triggered the event
 * @property {Date} createdAt - Event creation time
 */

/**
 * Auction filter options
 * @typedef {Object} AuctionFilters
 * @property {string} category - Filter by category
 * @property {string} status - Filter by status
 * @property {number} minPrice - Minimum price filter
 * @property {number} maxPrice - Maximum price filter
 * @property {string} location - Location filter
 * @property {string} sellerId - Filter by seller
 * @property {Date} startDate - Start date filter
 * @property {Date} endDate - End date filter
 * @property {string} sortBy - Sort criteria (price, time, popularity)
 * @property {string} sortOrder - Sort order (asc, desc)
 * @property {number} page - Page number for pagination
 * @property {number} limit - Items per page
 */

/**
 * Auction search options
 * @typedef {Object} AuctionSearch
 * @property {string} query - Search query
 * @property {Array<string>} categories - Categories to search in
 * @property {Object} filters - Additional filters
 * @property {string} sortBy - Sort criteria
 * @property {string} sortOrder - Sort order
 */

/**
 * Auction creation data
 * @typedef {Object} CreateAuctionData
 * @property {string} title - Auction title
 * @property {string} description - Detailed description
 * @property {string} shortDescription - Brief description
 * @property {string} category - Auction category
 * @property {number} startingPrice - Starting bid price
 * @property {number} minimumIncrement - Minimum bid increment
 * @property {Date} startTime - Auction start time
 * @property {number} duration - Auction duration in minutes
 * @property {File} video - Video file
 * @property {File} thumbnail - Thumbnail image
 * @property {Array<File>} images - Additional images
 * @property {string} location - Auction location
 * @property {Object} settings - Auction settings
 */

/**
 * Auction update data
 * @typedef {Object} UpdateAuctionData
 * @property {string} title - Updated title
 * @property {string} description - Updated description
 * @property {string} shortDescription - Updated brief description
 * @property {Date} startTime - Updated start time
 * @property {number} duration - Updated duration
 * @property {string} location - Updated location
 * @property {Object} settings - Updated settings
 */

/**
 * Auction validation rules
 */
export const AUCTION_VALIDATION = {
  TITLE_MIN_LENGTH: 10,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 2000,
  SHORT_DESCRIPTION_MAX_LENGTH: 200,
  MIN_STARTING_PRICE: 1,
  MAX_STARTING_PRICE: 1000000,
  MIN_INCREMENT: 1,
  MIN_DURATION: 5, // minutes
  MAX_DURATION: 1440, // 24 hours
  MAX_VIDEO_SIZE: 500 * 1024 * 1024, // 500MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES: 10,
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'webm', 'mov'],
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp']
};

/**
 * Auction utility functions
 */
export const AuctionUtils = {
  /**
   * Check if auction is active
   * @param {Auction} auction 
   * @returns {boolean}
   */
  isActive(auction) {
    return auction.status === AUCTION_STATUS.LIVE;
  },

  /**
   * Check if auction is upcoming
   * @param {Auction} auction 
   * @returns {boolean}
   */
  isUpcoming(auction) {
    return auction.status === AUCTION_STATUS.SCHEDULED;
  },

  /**
   * Check if auction has ended
   * @param {Auction} auction 
   * @returns {boolean}
   */
  hasEnded(auction) {
    return auction.status === AUCTION_STATUS.ENDED;
  },

  /**
   * Get time remaining in auction
   * @param {Auction} auction 
   * @returns {number} Seconds remaining
   */
  getTimeRemaining(auction) {
    if (auction.status !== AUCTION_STATUS.LIVE) return 0;
    const now = new Date();
    const endTime = new Date(auction.endTime);
    return Math.max(0, Math.floor((endTime - now) / 1000));
  },

  /**
   * Get auction progress percentage
   * @param {Auction} auction 
   * @returns {number} Progress percentage (0-100)
   */
  getProgress(auction) {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.floor((elapsed / total) * 100);
  },

  /**
   * Format auction price
   * @param {number} price 
   * @returns {string} Formatted price
   */
  formatPrice(price) {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(price);
  },

  /**
   * Get next valid bid amount
   * @param {Auction} auction 
   * @returns {number} Next valid bid
   */
  getNextBidAmount(auction) {
    return auction.currentPrice + auction.minimumIncrement;
  },

  /**
   * Validate bid amount
   * @param {Auction} auction 
   * @param {number} amount 
   * @returns {boolean}
   */
  isValidBidAmount(auction, amount) {
    return amount >= this.getNextBidAmount(auction);
  },

  /**
   * Get auction status display text
   * @param {string} status 
   * @returns {string}
   */
  getStatusText(status) {
    const statusTexts = {
      [AUCTION_STATUS.DRAFT]: 'مسودة',
      [AUCTION_STATUS.SCHEDULED]: 'مجدول',
      [AUCTION_STATUS.LIVE]: 'نشط',
      [AUCTION_STATUS.ENDED]: 'منتهي',
      [AUCTION_STATUS.CANCELLED]: 'ملغي',
      [AUCTION_STATUS.SUSPENDED]: 'معلق'
    };
    return statusTexts[status] || 'غير معروف';
  },

  /**
   * Get category display name
   * @param {string} category 
   * @returns {string}
   */
  getCategoryName(category) {
    const categoryNames = {
      [AUCTION_CATEGORIES.LIVESTOCK]: 'الماشية والمواشي',
      [AUCTION_CATEGORIES.VEHICLES]: 'المركبات',
      [AUCTION_CATEGORIES.REAL_ESTATE]: 'العقارات',
      [AUCTION_CATEGORIES.ANTIQUES]: 'التحف والآثار',
      [AUCTION_CATEGORIES.ELECTRONICS]: 'الإلكترونيات',
      [AUCTION_CATEGORIES.JEWELRY]: 'المجوهرات',
      [AUCTION_CATEGORIES.ART]: 'الفنون',
      [AUCTION_CATEGORIES.COLLECTIBLES]: 'المقتنيات',
      [AUCTION_CATEGORIES.OTHER]: 'أخرى'
    };
    return categoryNames[category] || 'غير محدد';
  }
};

export default {
  AUCTION_STATUS,
  AUCTION_CATEGORIES,
  AUCTION_VALIDATION,
  AuctionUtils
};