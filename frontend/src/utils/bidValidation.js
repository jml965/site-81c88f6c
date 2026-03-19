// Bid validation utilities

/**
 * Validates a bid amount against auction rules
 * @param {number} amount - The bid amount to validate
 * @param {number} currentPrice - Current highest bid price
 * @param {number} minIncrement - Minimum increment for the auction
 * @param {Object} options - Additional validation options
 * @returns {Object} Validation result with isValid boolean and error message
 */
export const validateBid = (amount, currentPrice = 0, minIncrement = 1, options = {}) => {
  const {
    maxBidAmount = 10000000, // 10 million SAR max
    minBidAmount = 1,
    allowEqualBids = false,
    userMaxBids = null,
    userCurrentBids = 0,
    auctionStatus = 'active'
  } = options;

  // Check if amount is a valid number
  if (typeof amount !== 'number' || isNaN(amount)) {
    return {
      isValid: false,
      error: 'يجب إدخال مبلغ صحيح'
    };
  }

  // Check if amount is positive
  if (amount <= 0) {
    return {
      isValid: false,
      error: 'المبلغ يجب أن يكون أكبر من صفر'
    };
  }

  // Check minimum bid amount
  if (amount < minBidAmount) {
    return {
      isValid: false,
      error: `الحد الأدنى للمزايدة هو ${formatCurrency(minBidAmount)}`
    };
  }

  // Check maximum bid amount
  if (amount > maxBidAmount) {
    return {
      isValid: false,
      error: `الحد الأقصى للمزايدة هو ${formatCurrency(maxBidAmount)}`
    };
  }

  // Check auction status
  if (auctionStatus !== 'active') {
    return {
      isValid: false,
      error: 'المزاد غير نشط حالياً'
    };
  }

  // Check if bid is higher than current price
  const minimumRequired = currentPrice + minIncrement;
  if (amount < minimumRequired && !allowEqualBids) {
    return {
      isValid: false,
      error: `المزايدة يجب أن تكون أعلى من ${formatCurrency(minimumRequired)}`
    };
  }

  // Check if equal bid is not allowed
  if (amount === currentPrice && !allowEqualBids) {
    return {
      isValid: false,
      error: `المزايدة يجب أن تكون أعلى من السعر الحالي ${formatCurrency(currentPrice)}`
    };
  }

  // Check increment requirement
  const increment = amount - currentPrice;
  if (increment > 0 && increment < minIncrement) {
    return {
      isValid: false,
      error: `الحد الأدنى للزيادة هو ${formatCurrency(minIncrement)}`
    };
  }

  // Check user bid limit
  if (userMaxBids && userCurrentBids >= userMaxBids) {
    return {
      isValid: false,
      error: `لقد وصلت للحد الأقصى من المزايدات (${userMaxBids})`
    };
  }

  // Check for decimal places (no fractional riyals)
  if (amount % 1 !== 0) {
    return {
      isValid: false,
      error: 'يجب أن يكون المبلغ رقماً صحيحاً (بدون كسور)'
    };
  }

  // All validations passed
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates multiple bid amounts
 * @param {Array} bids - Array of bid amounts
 * @param {number} currentPrice - Current highest bid price
 * @param {number} minIncrement - Minimum increment for the auction
 * @returns {Object} Validation results
 */
export const validateMultipleBids = (bids, currentPrice, minIncrement) => {
  const results = bids.map(amount => 
    validateBid(amount, currentPrice, minIncrement)
  );
  
  const validBids = results.filter(result => result.isValid);
  const invalidBids = results.filter(result => !result.isValid);
  
  return {
    allValid: invalidBids.length === 0,
    validCount: validBids.length,
    invalidCount: invalidBids.length,
    results,
    errors: invalidBids.map(result => result.error)
  };
};

/**
 * Suggests optimal bid amounts
 * @param {number} currentPrice - Current highest bid price
 * @param {number} minIncrement - Minimum increment for the auction
 * @param {Object} options - Suggestion options
 * @returns {Array} Array of suggested bid amounts
 */
export const suggestBidAmounts = (currentPrice = 0, minIncrement = 1, options = {}) => {
  const {
    suggestionCount = 4,
    aggressive = false,
    conservative = false
  } = options;

  const suggestions = [];
  const baseAmount = currentPrice + minIncrement;

  if (conservative) {
    // Conservative suggestions (small increments)
    suggestions.push(baseAmount);
    suggestions.push(baseAmount + minIncrement);
    suggestions.push(baseAmount + (minIncrement * 2));
    suggestions.push(baseAmount + (minIncrement * 3));
  } else if (aggressive) {
    // Aggressive suggestions (larger increments)
    suggestions.push(baseAmount + (minIncrement * 2));
    suggestions.push(baseAmount + (minIncrement * 5));
    suggestions.push(baseAmount + (minIncrement * 10));
    suggestions.push(baseAmount + (minIncrement * 20));
  } else {
    // Balanced suggestions
    suggestions.push(baseAmount);
    suggestions.push(baseAmount + (minIncrement * 2));
    suggestions.push(baseAmount + (minIncrement * 5));
    suggestions.push(baseAmount + (minIncrement * 10));
  }

  return suggestions.slice(0, suggestionCount).map(amount => Math.round(amount));
};

/**
 * Calculates bid statistics
 * @param {Array} bids - Array of bid objects
 * @returns {Object} Bid statistics
 */
export const calculateBidStats = (bids = []) => {
  if (bids.length === 0) {
    return {
      count: 0,
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      range: 0,
      increments: []
    };
  }

  const amounts = bids.map(bid => bid.amount).sort((a, b) => a - b);
  const count = amounts.length;
  const min = amounts[0];
  const max = amounts[count - 1];
  const sum = amounts.reduce((total, amount) => total + amount, 0);
  const average = sum / count;
  const median = count % 2 === 0 
    ? (amounts[count / 2 - 1] + amounts[count / 2]) / 2
    : amounts[Math.floor(count / 2)];
  const range = max - min;

  // Calculate increments between consecutive bids
  const increments = [];
  for (let i = 1; i < amounts.length; i++) {
    increments.push(amounts[i] - amounts[i - 1]);
  }

  return {
    count,
    min,
    max,
    average: Math.round(average),
    median,
    range,
    increments
  };
};

/**
 * Checks if a bid amount is suspicious (potential fraud)
 * @param {number} amount - The bid amount to check
 * @param {number} currentPrice - Current highest bid price
 * @param {Array} recentBids - Array of recent bids
 * @param {Object} userBids - User's bidding history
 * @returns {Object} Suspicion analysis
 */
export const checkBidSuspicion = (amount, currentPrice, recentBids = [], userBids = []) => {
  const warnings = [];
  const flags = [];

  // Check for unreasonably high increase
  const increase = amount - currentPrice;
  const increaseRatio = currentPrice > 0 ? increase / currentPrice : 0;
  
  if (increaseRatio > 2) { // More than 200% increase
    flags.push('زيادة مفرطة في المبلغ');
  } else if (increaseRatio > 1) { // More than 100% increase
    warnings.push('زيادة كبيرة في المبلغ');
  }

  // Check for rapid consecutive bidding
  const userRecentBids = userBids.filter(bid => {
    const bidTime = new Date(bid.timestamp);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return bidTime > fiveMinutesAgo;
  });

  if (userRecentBids.length > 5) {
    warnings.push('مزايدات متتالية سريعة');
  }

  // Check for round numbers (potential automated bidding)
  if (amount % 1000 === 0 && amount > 10000) {
    warnings.push('مبلغ مقرب (قد يكون آلي)');
  }

  return {
    isSuspicious: flags.length > 0,
    hasWarnings: warnings.length > 0,
    flags,
    warnings,
    riskLevel: flags.length > 0 ? 'high' : warnings.length > 0 ? 'medium' : 'low'
  };
};

/**
 * Formats currency amount for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: SAR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'SAR') => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculates the next minimum bid amount
 * @param {number} currentPrice - Current highest bid price
 * @param {number} minIncrement - Minimum increment for the auction
 * @returns {number} Next minimum bid amount
 */
export const getNextMinBid = (currentPrice = 0, minIncrement = 1) => {
  return currentPrice + minIncrement;
};

/**
 * Validates bid timing
 * @param {Date} auctionEndTime - When the auction ends
 * @param {number} bufferSeconds - Buffer time in seconds before end
 * @returns {Object} Timing validation result
 */
export const validateBidTiming = (auctionEndTime, bufferSeconds = 30) => {
  const now = new Date();
  const endTime = new Date(auctionEndTime);
  const timeRemaining = endTime - now;
  const bufferTime = bufferSeconds * 1000;

  if (timeRemaining <= 0) {
    return {
      isValid: false,
      error: 'انتهى المزاد'
    };
  }

  if (timeRemaining < bufferTime) {
    return {
      isValid: true,
      warning: `المزاد سينتهي خلال ${Math.ceil(timeRemaining / 1000)} ثانية`
    };
  }

  return {
    isValid: true
  };
};

export default {
  validateBid,
  validateMultipleBids,
  suggestBidAmounts,
  calculateBidStats,
  checkBidSuspicion,
  formatCurrency,
  getNextMinBid,
  validateBidTiming
};