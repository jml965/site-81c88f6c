/**
 * Bid type definitions and interfaces
 */

/**
 * Bid status constants
 */
export const BID_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  OUTBID: 'outbid',
  WINNING: 'winning',
  WON: 'won',
  LOST: 'lost'
};

/**
 * Bid type constants
 */
export const BID_TYPE = {
  MANUAL: 'manual',
  AUTO: 'auto',
  QUICK: 'quick',
  MAX: 'max'
};

/**
 * Bid validation status
 */
export const BID_VALIDATION = {
  VALID: 'valid',
  INVALID_AMOUNT: 'invalid_amount',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  AUCTION_ENDED: 'auction_ended',
  SELF_BID: 'self_bid',
  BANNED_USER: 'banned_user',
  RATE_LIMITED: 'rate_limited'
};

/**
 * Bid interface
 * @typedef {Object} Bid
 * @property {string} id - Unique bid identifier
 * @property {string} auctionId - Auction identifier
 * @property {string} userId - User who placed the bid
 * @property {Object} user - User information
 * @property {string} user.id - User ID
 * @property {string} user.name - User display name
 * @property {string} user.avatar - User avatar URL
 * @property {boolean} user.isVerified - User verification status
 * @property {number} amount - Bid amount
 * @property {number} previousHighestBid - Previous highest bid amount
 * @property {string} type - Bid type from BID_TYPE
 * @property {string} status - Bid status from BID_STATUS
 * @property {string} validation - Validation status
 * @property {Object} metadata - Additional bid metadata
 * @property {string} metadata.deviceType - Device used to place bid
 * @property {string} metadata.ipAddress - IP address (for fraud detection)
 * @property {string} metadata.userAgent - User agent string
 * @property {number} metadata.responseTime - Time taken to place bid
 * @property {boolean} metadata.isAutomatic - Whether bid was automatic
 * @property {Object} timing - Bid timing information
 * @property {Date} timing.placedAt - When bid was placed
 * @property {number} timing.auctionTimeRemaining - Seconds remaining when bid placed
 * @property {number} timing.timeFromPreviousBid - Seconds from previous bid
 * @property {boolean} timing.isLastMinute - Whether bid was in last minute
 * @property {Object} increment - Increment information
 * @property {number} increment.amount - Increment amount
 * @property {number} increment.percentage - Increment as percentage
 * @property {boolean} increment.isMinimum - Whether minimum increment was used
 * @property {Object} competition - Competition metrics
 * @property {number} competition.bidderCount - Number of active bidders
 * @property {number} competition.totalBids - Total bids on auction
 * @property {number} competition.bidFrequency - Bids per minute
 * @property {Array<string>} competition.competingBidders - IDs of competing bidders
 * @property {Date} createdAt - Bid creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * Bid creation data
 * @typedef {Object} CreateBidData
 * @property {string} auctionId - Auction ID
 * @property {number} amount - Bid amount
 * @property {string} type - Bid type
 * @property {Object} metadata - Additional metadata
 */

/**
 * Bid history item
 * @typedef {Object} BidHistoryItem
 * @property {string} id - Bid ID
 * @property {number} amount - Bid amount
 * @property {string} bidderName - Bidder display name
 * @property {Date} timestamp - Bid timestamp
 * @property {string} status - Bid status
 * @property {boolean} isWinning - Whether this is currently winning
 */

/**
 * Bid statistics
 * @typedef {Object} BidStatistics
 * @property {number} totalBids - Total number of bids
 * @property {number} uniqueBidders - Number of unique bidders
 * @property {number} averageBid - Average bid amount
 * @property {number} highestBid - Highest bid amount
 * @property {number} lowestBid - Lowest bid amount
 * @property {number} averageIncrement - Average increment amount
 * @property {number} bidFrequency - Bids per minute
 * @property {Object} timeDistribution - Bids by time period
 * @property {Array<Object>} topBidders - Top bidders list
 */

/**
 * Auto-bidding configuration
 * @typedef {Object} AutoBidConfig
 * @property {boolean} enabled - Whether auto-bidding is enabled
 * @property {number} maxAmount - Maximum amount to bid
 * @property {number} incrementType - Increment type (fixed/percentage)
 * @property {number} incrementValue - Increment value
 * @property {boolean} bidInLastMinutes - Bid in final minutes
 * @property {number} lastMinuteThreshold - Threshold in seconds
 * @property {boolean} stopIfOutbid - Stop if outbid by large amount
 * @property {number} stopThreshold - Amount threshold to stop
 */

/**
 * Bid validation rules
 */
export const BID_VALIDATION_RULES = {
  MIN_BID_AMOUNT: 1,
  MAX_BID_AMOUNT: 1000000,
  MIN_INCREMENT_PERCENTAGE: 1, // 1%
  MAX_INCREMENT_PERCENTAGE: 100, // 100%
  MAX_BIDS_PER_MINUTE: 5,
  MAX_BIDS_PER_AUCTION: 100,
  MIN_TIME_BETWEEN_BIDS: 1, // seconds
  MAX_AUTO_BID_AMOUNT: 50000,
  LATE_BID_EXTENSION: 60 // seconds
};

/**
 * Quick bid increments
 */
export const QUICK_BID_INCREMENTS = {
  SMALL: [5, 10, 25, 50],
  MEDIUM: [50, 100, 250, 500],
  LARGE: [500, 1000, 2500, 5000],
  XLARGE: [1000, 2500, 5000, 10000]
};

/**
 * Bid utility functions
 */
export const BidUtils = {
  /**
   * Check if bid is winning
   * @param {Bid} bid 
   * @returns {boolean}
   */
  isWinning(bid) {
    return bid.status === BID_STATUS.WINNING;
  },

  /**
   * Check if bid was successful
   * @param {Bid} bid 
   * @returns {boolean}
   */
  isSuccessful(bid) {
    return [BID_STATUS.WINNING, BID_STATUS.WON].includes(bid.status);
  },

  /**
   * Check if bid is still active
   * @param {Bid} bid 
   * @returns {boolean}
   */
  isActive(bid) {
    return [BID_STATUS.PENDING, BID_STATUS.ACCEPTED, BID_STATUS.WINNING].includes(bid.status);
  },

  /**
   * Get bid status display text
   * @param {string} status 
   * @returns {string}
   */
  getStatusText(status) {
    const statusTexts = {
      [BID_STATUS.PENDING]: 'في الانتظار',
      [BID_STATUS.ACCEPTED]: 'مقبولة',
      [BID_STATUS.REJECTED]: 'مرفوضة',
      [BID_STATUS.OUTBID]: 'تم تجاوزها',
      [BID_STATUS.WINNING]: 'فائزة',
      [BID_STATUS.WON]: 'فازت',
      [BID_STATUS.LOST]: 'خسرت'
    };
    return statusTexts[status] || 'غير معروف';
  },

  /**
   * Get bid type display text
   * @param {string} type 
   * @returns {string}
   */
  getTypeText(type) {
    const typeTexts = {
      [BID_TYPE.MANUAL]: 'يدوية',
      [BID_TYPE.AUTO]: 'تلقائية',
      [BID_TYPE.QUICK]: 'سريعة',
      [BID_TYPE.MAX]: 'حد أقصى'
    };
    return typeTexts[type] || 'عادية';
  },

  /**
   * Format bid amount
   * @param {number} amount 
   * @returns {string}
   */
  formatAmount(amount) {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  },

  /**
   * Calculate bid increment
   * @param {number} currentPrice 
   * @param {number} bidAmount 
   * @returns {number}
   */
  calculateIncrement(currentPrice, bidAmount) {
    return bidAmount - currentPrice;
  },

  /**
   * Calculate increment percentage
   * @param {number} currentPrice 
   * @param {number} bidAmount 
   * @returns {number}
   */
  calculateIncrementPercentage(currentPrice, bidAmount) {
    if (currentPrice === 0) return 0;
    return ((bidAmount - currentPrice) / currentPrice) * 100;
  },

  /**
   * Validate bid amount
   * @param {number} amount 
   * @param {number} currentPrice 
   * @param {number} minimumIncrement 
   * @returns {Object}
   */
  validateBidAmount(amount, currentPrice, minimumIncrement) {
    const result = {
      isValid: true,
      errors: []
    };

    if (amount <= currentPrice) {
      result.isValid = false;
      result.errors.push('المزايدة يجب أن تكون أعلى من السعر الحالي');
    }

    if (amount < currentPrice + minimumIncrement) {
      result.isValid = false;
      result.errors.push(`الحد الأدنى للزيادة هو ${this.formatAmount(minimumIncrement)}`);
    }

    if (amount < BID_VALIDATION_RULES.MIN_BID_AMOUNT) {
      result.isValid = false;
      result.errors.push(`الحد الأدنى للمزايدة هو ${this.formatAmount(BID_VALIDATION_RULES.MIN_BID_AMOUNT)}`);
    }

    if (amount > BID_VALIDATION_RULES.MAX_BID_AMOUNT) {
      result.isValid = false;
      result.errors.push(`الحد الأقصى للمزايدة هو ${this.formatAmount(BID_VALIDATION_RULES.MAX_BID_AMOUNT)}`);
    }

    return result;
  },

  /**
   * Get suggested quick bid increments
   * @param {number} currentPrice 
   * @returns {Array<number>}
   */
  getQuickBidIncrements(currentPrice) {
    if (currentPrice < 100) {
      return QUICK_BID_INCREMENTS.SMALL;
    } else if (currentPrice < 1000) {
      return QUICK_BID_INCREMENTS.MEDIUM;
    } else if (currentPrice < 10000) {
      return QUICK_BID_INCREMENTS.LARGE;
    } else {
      return QUICK_BID_INCREMENTS.XLARGE;
    }
  },

  /**
   * Calculate time until bid
   * @param {Date} bidTime 
   * @param {Date} auctionStart 
   * @returns {number}
   */
  getTimeUntilBid(bidTime, auctionStart) {
    return Math.floor((bidTime - auctionStart) / 1000);
  },

  /**
   * Check if bid was placed in last minute
   * @param {Bid} bid 
   * @returns {boolean}
   */
  isLastMinuteBid(bid) {
    return bid.timing.auctionTimeRemaining <= 60;
  },

  /**
   * Get bid confidence score
   * @param {Bid} bid 
   * @returns {number}
   */
  getConfidenceScore(bid) {
    let score = 50; // Base score
    
    // Boost for verified users
    if (bid.user.isVerified) score += 20;
    
    // Boost for reasonable increments
    if (bid.increment.percentage >= 5 && bid.increment.percentage <= 20) {
      score += 15;
    }
    
    // Penalty for very large increments
    if (bid.increment.percentage > 50) score -= 20;
    
    // Boost for consistent bidding pattern
    if (bid.competition.bidFrequency < 2) score += 10;
    
    // Penalty for suspicious rapid bidding
    if (bid.timing.timeFromPreviousBid < 5) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  },

  /**
   * Group bids by time periods
   * @param {Array<Bid>} bids 
   * @returns {Object}
   */
  groupBidsByTime(bids) {
    const periods = {
      first25: [],
      second25: [],
      third25: [],
      final25: []
    };
    
    bids.forEach(bid => {
      const percentage = bid.timing.auctionTimeRemaining / (bid.auctionDuration * 60) * 100;
      
      if (percentage > 75) periods.first25.push(bid);
      else if (percentage > 50) periods.second25.push(bid);
      else if (percentage > 25) periods.third25.push(bid);
      else periods.final25.push(bid);
    });
    
    return periods;
  }
};

export default {
  BID_STATUS,
  BID_TYPE,
  BID_VALIDATION,
  BID_VALIDATION_RULES,
  QUICK_BID_INCREMENTS,
  BidUtils
};