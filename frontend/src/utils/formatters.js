/**
 * Utility functions for formatting data display
 */

/**
 * Format currency in Arabic/English
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (SAR, USD, etc)
 * @param {string} locale - Locale (ar-SA, en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'SAR', locale = 'ar-SA') => {
  if (!amount && amount !== 0) return '0';
  
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  } catch (error) {
    return `${amount} ${currency}`;
  }
};

/**
 * Format numbers with Arabic/English numerals
 * @param {number} number - Number to format
 * @param {string} locale - Locale preference
 * @returns {string} Formatted number
 */
export const formatNumber = (number, locale = 'ar-SA') => {
  if (!number && number !== 0) return '0';
  
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    return number.toString();
  }
};

/**
 * Format date/time in Arabic
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type (full, short, time, date)
 * @param {string} locale - Locale preference
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'full', locale = 'ar-SA') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const options = {
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    date: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    relative: null // Will be handled separately
  };
  
  if (format === 'relative') {
    return formatRelativeTime(dateObj, locale);
  }
  
  try {
    return new Intl.DateTimeFormat(locale, options[format] || options.full).format(dateObj);
  } catch (error) {
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format relative time (منذ دقيقتين, قبل ساعة)
 * @param {Date} date - Date to compare
 * @param {string} locale - Locale preference
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date, locale = 'ar-SA') => {
  if (!date) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (locale === 'ar-SA') {
    if (diffMinutes < 1) return 'الآن';
    if (diffMinutes < 60) {
      return diffMinutes === 1 ? 'منذ دقيقة' : `منذ ${diffMinutes} دقيقة`;
    }
    if (diffHours < 24) {
      return diffHours === 1 ? 'منذ ساعة' : `منذ ${diffHours} ساعة`;
    }
    if (diffDays < 7) {
      return diffDays === 1 ? 'منذ يوم' : `منذ ${diffDays} أيام`;
    }
    return formatDate(date, 'short', locale);
  } else {
    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    }
    if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    if (diffDays < 7) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
    return formatDate(date, 'short', locale);
  }
};

/**
 * Format time duration (mm:ss)
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '00:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format auction status in Arabic
 * @param {string} status - Auction status
 * @returns {string} Arabic status
 */
export const formatAuctionStatus = (status) => {
  const statusMap = {
    'pending': 'قيد المراجعة',
    'scheduled': 'مجدول',
    'live': 'مباشر',
    'active': 'نشط',
    'ended': 'منتهي',
    'cancelled': 'ملغي',
    'paused': 'متوقف مؤقتاً'
  };
  
  return statusMap[status] || status;
};

/**
 * Format bid status
 * @param {string} status - Bid status
 * @returns {string} Arabic status
 */
export const formatBidStatus = (status) => {
  const statusMap = {
    'pending': 'قيد المراجعة',
    'accepted': 'مقبولة',
    'outbid': 'تم تجاوزها',
    'winning': 'رابحة',
    'lost': 'خاسرة',
    'cancelled': 'ملغية'
  };
  
  return statusMap[status] || status;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 بايت';
  
  const units = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, unitIndex)).toFixed(1);
  
  return `${size} ${units[unitIndex] || 'بايت'}`;
};

/**
 * Format username display
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export const formatUsername = (user) => {
  if (!user) return 'مستخدم غير معروف';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.username) {
    return user.username;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return `مستخدم ${user.id || ''}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';
  
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format video quality label
 * @param {string} quality - Video quality
 * @returns {string} Arabic quality label
 */
export const formatVideoQuality = (quality) => {
  const qualityMap = {
    '240p': 'جودة منخفضة',
    '360p': 'جودة متوسطة',
    '480p': 'جودة جيدة',
    '720p': 'جودة عالية',
    '1080p': 'جودة عالية جداً',
    '1440p': 'جودة فائقة',
    '2160p': 'جودة 4K'
  };
  
  return qualityMap[quality] || quality;
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @param {string} countryCode - Country code
 * @returns {string} Formatted phone
 */
export const formatPhone = (phone, countryCode = '+966') => {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 9 && countryCode === '+966') {
    // Saudi format: +966 5X XXX XXXX
    return `${countryCode} ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  
  return phone;
};

/**
 * Format search query for display
 * @param {string} query - Search query
 * @returns {string} Formatted query
 */
export const formatSearchQuery = (query) => {
  if (!query) return '';
  
  return query.trim().replace(/\s+/g, ' ');
};

/**
 * Format notification type
 * @param {string} type - Notification type
 * @returns {string} Arabic notification type
 */
export const formatNotificationType = (type) => {
  const typeMap = {
    'auction_started': 'بدء المزاد',
    'auction_ending': 'قرب انتهاء المزاد',
    'outbid': 'تجاوز المزايدة',
    'winning_bid': 'مزايدة رابحة',
    'auction_won': 'فوز بالمزاد',
    'auction_lost': 'خسارة المزاد',
    'new_message': 'رسالة جديدة',
    'new_comment': 'تعليق جديد',
    'comment_reply': 'رد على التعليق',
    'auction_follow': 'متابعة مزاد',
    'system': 'إشعار النظام'
  };
  
  return typeMap[type] || type;
};