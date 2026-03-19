/**
 * Bid validation utilities
 */

/**
 * Validate bid creation data
 */
const validateBid = ({ auctionId, amount, userId }) => {
  const errors = [];

  // Validate auction ID
  if (!auctionId) {
    errors.push({
      field: 'auctionId',
      message: 'معرف المزاد مطلوب'
    });
  } else if (isNaN(parseInt(auctionId)) || parseInt(auctionId) <= 0) {
    errors.push({
      field: 'auctionId',
      message: 'معرف المزاد غير صحيح'
    });
  }

  // Validate amount
  if (!amount && amount !== 0) {
    errors.push({
      field: 'amount',
      message: 'مبلغ المزايدة مطلوب'
    });
  } else if (isNaN(parseFloat(amount))) {
    errors.push({
      field: 'amount',
      message: 'مبلغ المزايدة يجب أن يكون رقماً'
    });
  } else {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      errors.push({
        field: 'amount',
        message: 'مبلغ المزايدة يجب أن يكون أكبر من صفر'
      });
    }
    if (numAmount > 999999999.99) {
      errors.push({
        field: 'amount',
        message: 'مبلغ المزايدة كبير جداً'
      });
    }
    // Check decimal places (max 2)
    if (numAmount.toString().includes('.') && numAmount.toString().split('.')[1].length > 2) {
      errors.push({
        field: 'amount',
        message: 'مبلغ المزايدة يجب ألا يحتوي على أكثر من منزلتين عشريتين'
      });
    }
  }

  // Validate user ID
  if (!userId) {
    errors.push({
      field: 'userId',
      message: 'معرف المستخدم مطلوب'
    });
  } else if (isNaN(parseInt(userId)) || parseInt(userId) <= 0) {
    errors.push({
      field: 'userId',
      message: 'معرف المستخدم غير صحيح'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate bid update data
 */
const validateUpdateBid = ({ bidId, ...updateData }) => {
  const errors = [];

  // Validate bid ID
  if (!bidId) {
    errors.push({
      field: 'bidId',
      message: 'معرف المزايدة مطلوب'
    });
  } else if (isNaN(parseInt(bidId)) || parseInt(bidId) <= 0) {
    errors.push({
      field: 'bidId',
      message: 'معرف المزايدة غير صحيح'
    });
  }

  // Validate cancellation reason if provided
  if (updateData.cancellationReason !== undefined) {
    if (typeof updateData.cancellationReason !== 'string') {
      errors.push({
        field: 'cancellationReason',
        message: 'سبب الإلغاء يجب أن يكون نصاً'
      });
    } else if (updateData.cancellationReason.length > 500) {
      errors.push({
        field: 'cancellationReason',
        message: 'سبب الإلغاء طويل جداً (الحد الأقصى 500 حرف)'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate bid query parameters
 */
const validateBidQuery = ({ page, limit, sort, status }) => {
  const errors = [];

  // Validate page
  if (page !== undefined) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({
        field: 'page',
        message: 'رقم الصفحة يجب أن يكون رقماً موجباً'
      });
    } else if (pageNum > 1000) {
      errors.push({
        field: 'page',
        message: 'رقم الصفحة كبير جداً'
      });
    }
  }

  // Validate limit
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1) {
      errors.push({
        field: 'limit',
        message: 'حد العناصر يجب أن يكون رقماً موجباً'
      });
    } else if (limitNum > 100) {
      errors.push({
        field: 'limit',
        message: 'حد العناصر كبير جداً (الحد الأقصى 100)'
      });
    }
  }

  // Validate sort
  if (sort !== undefined) {
    const validSortOptions = ['asc', 'desc', 'newest', 'oldest', 'highest', 'lowest'];
    if (!validSortOptions.includes(sort.toLowerCase())) {
      errors.push({
        field: 'sort',
        message: `خيار الترتيب غير صحيح. الخيارات المتاحة: ${validSortOptions.join(', ')}`
      });
    }
  }

  // Validate status
  if (status !== undefined) {
    const validStatuses = ['all', 'active', 'cancelled', 'winning', 'lost'];
    if (!validStatuses.includes(status.toLowerCase())) {
      errors.push({
        field: 'status',
        message: `حالة المزايدة غير صحيحة. الحالات المتاحة: ${validStatuses.join(', ')}`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate auction timing constraints for bidding
 */
const validateAuctionTiming = (auction) => {
  const errors = [];
  const now = new Date();
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);

  // Check if auction has started
  if (now < startTime) {
    errors.push({
      field: 'timing',
      message: 'لم يبدأ المزاد بعد',
      code: 'AUCTION_NOT_STARTED',
      startsAt: startTime.toISOString()
    });
  }

  // Check if auction has ended
  if (now > endTime) {
    errors.push({
      field: 'timing',
      message: 'انتهى وقت المزاد',
      code: 'AUCTION_ENDED',
      endedAt: endTime.toISOString()
    });
  }

  // Check if auction is in the closing minutes (warn but don't block)
  const timeRemaining = endTime - now;
  const closingWarningMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds
  if (timeRemaining > 0 && timeRemaining < closingWarningMinutes) {
    errors.push({
      field: 'timing',
      message: 'المزاد على وشك الانتهاء',
      code: 'AUCTION_CLOSING_SOON',
      timeRemaining: Math.ceil(timeRemaining / 1000), // seconds
      level: 'warning'
    });
  }

  return {
    isValid: errors.filter(e => e.level !== 'warning').length === 0,
    errors,
    warnings: errors.filter(e => e.level === 'warning')
  };
};

/**
 * Validate bid amount against auction rules
 */
const validateBidAmount = ({ amount, auction, currentHighestBid }) => {
  const errors = [];
  const warnings = [];
  
  const bidAmount = parseFloat(amount);
  const startingPrice = parseFloat(auction.startingPrice);
  const minimumIncrement = parseFloat(auction.minimumIncrement);
  const currentPrice = parseFloat(auction.currentPrice || auction.startingPrice);
  const highestBidAmount = currentHighestBid ? parseFloat(currentHighestBid.amount) : 0;

  // Check minimum starting price
  if (bidAmount < startingPrice) {
    errors.push({
      field: 'amount',
      message: `المزايدة يجب أن تكون أكبر من أو تساوي السعر الافتتاحي (${startingPrice} ريال)`,
      code: 'BELOW_STARTING_PRICE'
    });
  }

  // Check minimum increment
  const requiredMinimum = Math.max(startingPrice, currentPrice + minimumIncrement);
  if (bidAmount < requiredMinimum) {
    errors.push({
      field: 'amount',
      message: `الحد الأدنى للمزايدة هو ${requiredMinimum} ريال`,
      code: 'BELOW_MINIMUM_INCREMENT'
    });
  }

  // Check if bid is significantly higher than current (warn but don't block)
  if (currentPrice > 0) {
    const bidIncrease = bidAmount - currentPrice;
    const significantIncreaseThreshold = currentPrice * 0.5; // 50% increase
    
    if (bidIncrease > significantIncreaseThreshold) {
      warnings.push({
        field: 'amount',
        message: `مزايدتك أعلى بكثير من السعر الحالي. هل أنت متأكد؟`,
        code: 'SIGNIFICANT_INCREASE',
        level: 'warning'
      });
    }
  }

  // Check maximum reasonable bid (very high amounts)
  const maxReasonableBid = startingPrice * 100; // 100x starting price
  if (bidAmount > maxReasonableBid) {
    warnings.push({
      field: 'amount',
      message: 'مزايدتك عالية جداً. يرجى التأكد من المبلغ',
      code: 'VERY_HIGH_BID',
      level: 'warning'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate bid frequency (rate limiting)
 */
const validateBidFrequency = (userRecentBids, timeWindowMinutes = 5, maxBidsInWindow = 10) => {
  const errors = [];
  const now = new Date();
  const timeWindow = timeWindowMinutes * 60 * 1000; // Convert to milliseconds
  
  const recentBids = userRecentBids.filter(bid => {
    const bidTime = new Date(bid.timestamp);
    return (now - bidTime) < timeWindow;
  });

  if (recentBids.length >= maxBidsInWindow) {
    errors.push({
      field: 'frequency',
      message: `تم الوصول للحد الأقصى من المزايدات (${maxBidsInWindow}) خلال ${timeWindowMinutes} دقائق`,
      code: 'TOO_MANY_BIDS',
      retryAfter: Math.ceil(timeWindow / 1000) // seconds
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Comprehensive bid validation
 */
const validateCompleteBid = async ({ userId, auctionId, amount, auction, currentHighestBid, userRecentBids }) => {
  const errors = [];
  const warnings = [];

  // Basic data validation
  const basicValidation = validateBid({ userId, auctionId, amount });
  if (!basicValidation.isValid) {
    errors.push(...basicValidation.errors);
  }

  // If basic validation fails, return early
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // Timing validation
  if (auction) {
    const timingValidation = validateAuctionTiming(auction);
    errors.push(...timingValidation.errors.filter(e => e.level !== 'warning'));
    warnings.push(...timingValidation.warnings);
  }

  // Amount validation
  if (auction) {
    const amountValidation = validateBidAmount({ amount, auction, currentHighestBid });
    errors.push(...amountValidation.errors);
    warnings.push(...amountValidation.warnings);
  }

  // Frequency validation
  if (userRecentBids) {
    const frequencyValidation = validateBidFrequency(userRecentBids);
    errors.push(...frequencyValidation.errors);
  }

  // User-specific validations
  if (auction && auction.sellerId === parseInt(userId)) {
    errors.push({
      field: 'user',
      message: 'لا يمكن للبائع المزايدة على مزاده الخاص',
      code: 'SELLER_CANNOT_BID'
    });
  }

  if (currentHighestBid && currentHighestBid.userId === parseInt(userId)) {
    errors.push({
      field: 'user',
      message: 'لديك أعلى مزايدة حالياً',
      code: 'ALREADY_HIGHEST_BIDDER'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

module.exports = {
  validateBid,
  validateUpdateBid,
  validateBidQuery,
  validateAuctionTiming,
  validateBidAmount,
  validateBidFrequency,
  validateCompleteBid
};