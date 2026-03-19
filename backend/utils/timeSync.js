/**
 * Time Synchronization Utility
 * Provides server-side time management for auction synchronization
 */

class TimeSyncManager {
  constructor() {
    this.serverStartTime = Date.now();
    this.timezone = process.env.TZ || 'Asia/Riyadh';
    this.clockDrift = 0; // For potential NTP sync adjustments
    this.performanceOffset = 0;
    
    this.initializeTimeSync();
  }

  /**
   * Initialize time synchronization
   */
  initializeTimeSync() {
    // Calculate performance time offset for high-precision timing
    if (typeof performance !== 'undefined' && performance.now) {
      const start = Date.now();
      const perfStart = performance.now();
      this.performanceOffset = start - perfStart;
    }
    
    console.log(`Time sync initialized at ${new Date(this.serverStartTime).toISOString()}`);
    console.log(`Timezone: ${this.timezone}`);
  }

  /**
   * Get current server time in milliseconds
   * This is the authoritative time for all auction synchronization
   */
  getServerTime() {
    if (typeof performance !== 'undefined' && performance.now) {
      // Use high-precision timer when available
      return Math.floor(performance.now() + this.performanceOffset + this.clockDrift);
    }
    
    return Date.now() + this.clockDrift;
  }

  /**
   * Get server time as Date object
   */
  getServerDate() {
    return new Date(this.getServerTime());
  }

  /**
   * Get server time in ISO string format
   */
  getServerISOString() {
    return this.getServerDate().toISOString();
  }

  /**
   * Calculate time difference between two timestamps
   */
  getTimeDifference(startTime, endTime = null) {
    const end = endTime || this.getServerTime();
    return end - startTime;
  }

  /**
   * Check if a given time is in the past
   */
  isPastTime(timestamp) {
    return timestamp < this.getServerTime();
  }

  /**
   * Check if a given time is in the future
   */
  isFutureTime(timestamp) {
    return timestamp > this.getServerTime();
  }

  /**
   * Calculate auction phase based on start and end times
   */
  getAuctionPhase(startTime, endTime) {
    const now = this.getServerTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    
    if (now < start) {
      return {
        phase: 'scheduled',
        timeUntilStart: start - now,
        timeUntilEnd: end - now,
        progress: 0
      };
    }
    
    if (now > end) {
      return {
        phase: 'ended',
        timeUntilStart: 0,
        timeUntilEnd: 0,
        progress: 1,
        elapsed: end - start
      };
    }
    
    // Auction is active
    const elapsed = now - start;
    const duration = end - start;
    const remaining = end - now;
    const progress = duration > 0 ? elapsed / duration : 1;
    
    let subPhase = 'active';
    if (remaining < 60000) { // Less than 1 minute
      subPhase = 'ending';
    } else if (elapsed < 30000) { // First 30 seconds
      subPhase = 'starting';
    }
    
    return {
      phase: 'active',
      subPhase,
      elapsed,
      remaining,
      duration,
      progress: Math.min(1, Math.max(0, progress)),
      timeUntilStart: 0,
      timeUntilEnd: remaining
    };
  }

  /**
   * Calculate synchronized video position based on auction timing
   */
  calculateVideoPosition(auctionStartTime, videoDuration) {
    const auctionStart = new Date(auctionStartTime).getTime();
    const now = this.getServerTime();
    
    if (now < auctionStart) {
      return 0; // Video hasn't started
    }
    
    const elapsed = now - auctionStart;
    const elapsedSeconds = elapsed / 1000;
    
    if (videoDuration && elapsedSeconds > videoDuration) {
      return videoDuration; // Video has ended
    }
    
    return elapsedSeconds;
  }

  /**
   * Create a time-based event ID for ordering
   */
  generateTimeBasedId() {
    const timestamp = this.getServerTime();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}_${random}`;
  }

  /**
   * Format time duration for display
   */
  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}د ${hours % 24}س ${minutes % 60}ق`;
    }
    if (hours > 0) {
      return `${hours}س ${minutes % 60}ق ${seconds % 60}ث`;
    }
    if (minutes > 0) {
      return `${minutes}ق ${seconds % 60}ث`;
    }
    return `${seconds}ث`;
  }

  /**
   * Format time remaining for display
   */
  formatTimeRemaining(milliseconds) {
    if (milliseconds <= 0) {
      return 'انتهى';
    }
    
    const seconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} يوم ${hours % 24} ساعة`;
    }
    if (hours > 0) {
      return `${hours} ساعة ${minutes % 60} دقيقة`;
    }
    if (minutes > 0) {
      return `${minutes} دقيقة ${seconds % 60} ثانية`;
    }
    return `${seconds} ثانية`;
  }

  /**
   * Get time in specific timezone
   */
  getTimeInTimezone(timezone = this.timezone) {
    return new Date().toLocaleString('ar-SA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Validate time range for auction
   */
  validateAuctionTiming(startTime, endTime, durationMinutes) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const now = this.getServerTime();
    const expectedEnd = start + (durationMinutes * 60 * 1000);
    
    const errors = [];
    
    // Check if start time is valid
    if (isNaN(start)) {
      errors.push('وقت البداية غير صحيح');
    }
    
    // Check if end time is valid
    if (isNaN(end)) {
      errors.push('وقت النهاية غير صحيح');
    }
    
    // Check if start time is not too far in the past
    if (start < now - 300000) { // 5 minutes grace period
      errors.push('وقت البداية لا يمكن أن يكون في الماضي');
    }
    
    // Check if end time is after start time
    if (end <= start) {
      errors.push('وقت النهاية يجب أن يكون بعد وقت البداية');
    }
    
    // Check if duration matches
    if (Math.abs(end - expectedEnd) > 60000) { // 1 minute tolerance
      errors.push('مدة المزاد لا تتطابق مع أوقات البداية والنهاية');
    }
    
    // Check minimum duration (5 minutes)
    if (end - start < 300000) {
      errors.push('مدة المزاد يجب أن تكون 5 دقائق على الأقل');
    }
    
    // Check maximum duration (24 hours)
    if (end - start > 86400000) {
      errors.push('مدة المزاد يجب ألا تتجاوز 24 ساعة');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      calculatedDuration: end - start,
      phase: this.getAuctionPhase(startTime, endTime)
    };
  }

  /**
   * Generate auction schedule suggestions
   */
  suggestAuctionSchedule(durationMinutes = 60, preferredStartTime = null) {
    const now = this.getServerTime();
    const startTime = preferredStartTime 
      ? new Date(preferredStartTime).getTime()
      : now + 300000; // Default: 5 minutes from now
      
    const endTime = startTime + (durationMinutes * 60 * 1000);
    
    // Generate alternative suggestions
    const suggestions = [];
    
    for (let i = 0; i < 5; i++) {
      const suggestionStart = now + (300000 * (i + 1)); // 5 minute intervals
      const suggestionEnd = suggestionStart + (durationMinutes * 60 * 1000);
      
      suggestions.push({
        startTime: new Date(suggestionStart).toISOString(),
        endTime: new Date(suggestionEnd).toISOString(),
        startTimeFormatted: this.getTimeInTimezone(),
        duration: durationMinutes,
        timeUntilStart: suggestionStart - now
      });
    }
    
    return {
      recommended: {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration: durationMinutes
      },
      alternatives: suggestions
    };
  }

  /**
   * Adjust for clock drift (for NTP synchronization)
   */
  adjustClockDrift(driftMs) {
    this.clockDrift = driftMs;
    console.log(`Clock drift adjusted by ${driftMs}ms`);
  }

  /**
   * Get synchronization info for client
   */
  getSyncInfo() {
    return {
      serverTime: this.getServerTime(),
      serverTimeISO: this.getServerISOString(),
      timezone: this.timezone,
      uptime: this.getServerTime() - this.serverStartTime,
      clockDrift: this.clockDrift,
      timestamp: this.getServerTime() // For client clock sync
    };
  }

  /**
   * Calculate network latency compensation
   */
  calculateLatencyCompensation(clientTimestamp) {
    const serverTime = this.getServerTime();
    const roundTripTime = serverTime - clientTimestamp;
    const estimatedLatency = roundTripTime / 2;
    
    return {
      serverTime,
      clientTimestamp,
      roundTripTime,
      estimatedLatency,
      compensatedTime: serverTime - estimatedLatency
    };
  }
}

// Create singleton instance
const timeSyncManager = new TimeSyncManager();

module.exports = timeSyncManager;