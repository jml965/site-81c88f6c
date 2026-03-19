import { timeSyncService } from './timeSync';

/**
 * Sync utilities for auction timing and state synchronization
 */
class SyncUtils {
  constructor() {
    this.syncCallbacks = new Map();
    this.syncInterval = null;
    this.lastSyncTime = null;
    this.syncThreshold = 1000; // 1 second threshold for sync
  }

  /**
   * Calculate auction timing based on server time
   */
  calculateAuctionTiming(auction) {
    if (!auction) return null;

    const serverTime = timeSyncService.getServerTime();
    const startTime = new Date(auction.startTime).getTime();
    const endTime = new Date(auction.endTime).getTime();
    const duration = endTime - startTime;

    // Calculate elapsed time since start
    const elapsedTime = Math.max(0, serverTime - startTime);
    const remainingTime = Math.max(0, endTime - serverTime);
    const progress = duration > 0 ? Math.min(1, elapsedTime / duration) : 0;

    // Determine auction status
    let status = 'upcoming';
    if (serverTime >= startTime && serverTime < endTime) {
      status = 'active';
    } else if (serverTime >= endTime) {
      status = 'ended';
    }

    return {
      serverTime,
      startTime,
      endTime,
      duration,
      elapsedTime,
      remainingTime,
      progress,
      status,
      isActive: status === 'active',
      isUpcoming: status === 'upcoming',
      isEnded: status === 'ended'
    };
  }

  /**
   * Calculate video sync position based on auction timing
   */
  calculateVideoSync(auction, videoDuration = 0) {
    const timing = this.calculateAuctionTiming(auction);
    if (!timing) return null;

    let videoPosition = 0;
    let shouldPlay = false;
    let playbackRate = 1;

    if (timing.isActive && videoDuration > 0) {
      // Calculate position based on progress through auction
      videoPosition = (timing.progress * videoDuration) * 1000; // Convert to milliseconds
      shouldPlay = true;
      
      // Adjust playback rate if needed (future enhancement)
      if (timing.remainingTime < 60000 && timing.remainingTime > 0) {
        // Speed up slightly in final minute
        playbackRate = 1.1;
      }
    } else if (timing.isEnded) {
      videoPosition = videoDuration * 1000; // End position
      shouldPlay = false;
    }

    return {
      position: Math.max(0, videoPosition),
      shouldPlay,
      playbackRate,
      timing
    };
  }

  /**
   * Generate timeline markers for auction events
   */
  generateTimelineMarkers(auction, events = []) {
    const timing = this.calculateAuctionTiming(auction);
    if (!timing) return [];

    const markers = [];
    const { duration, startTime } = timing;

    // Add start marker
    markers.push({
      id: 'start',
      time: 0,
      percentage: 0,
      type: 'start',
      label: 'بداية المزاد',
      color: 'green'
    });

    // Add bid events
    events.filter(event => event.type === 'bid').forEach(event => {
      const eventTime = new Date(event.createdAt).getTime();
      const relativeTime = eventTime - startTime;
      const percentage = duration > 0 ? (relativeTime / duration) * 100 : 0;

      if (percentage >= 0 && percentage <= 100) {
        markers.push({
          id: `bid-${event.id}`,
          time: relativeTime,
          percentage,
          type: 'bid',
          label: `${event.amount} ريال`,
          color: 'blue',
          data: event
        });
      }
    });

    // Add milestone markers (quarter points)
    [25, 50, 75].forEach(percent => {
      markers.push({
        id: `milestone-${percent}`,
        time: (duration * percent) / 100,
        percentage: percent,
        type: 'milestone',
        label: `${percent}%`,
        color: 'gray'
      });
    });

    // Add end marker
    markers.push({
      id: 'end',
      time: duration,
      percentage: 100,
      type: 'end',
      label: 'نهاية المزاد',
      color: 'red'
    });

    return markers.sort((a, b) => a.percentage - b.percentage);
  }

  /**
   * Format time duration for display
   */
  formatDuration(milliseconds) {
    if (milliseconds <= 0) return '00:00';

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formatPad = (num) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${formatPad(hours)}:${formatPad(minutes % 60)}:${formatPad(seconds % 60)}`;
    }
    return `${formatPad(minutes)}:${formatPad(seconds % 60)}`;
  }

  /**
   * Format time remaining with Arabic text
   */
  formatTimeRemaining(milliseconds) {
    if (milliseconds <= 0) return 'انتهى المزاد';

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
    } else {
      return `${seconds} ${seconds === 1 ? 'ثانية' : 'ثواني'}`;
    }
  }

  /**
   * Check if client is synchronized with server
   */
  isSynchronized() {
    const offset = timeSyncService.getOffset();
    return Math.abs(offset) < this.syncThreshold;
  }

  /**
   * Get sync status information
   */
  getSyncStatus() {
    const offset = timeSyncService.getOffset();
    const lastSync = timeSyncService.getLastSyncTime();
    const now = Date.now();
    
    return {
      synchronized: this.isSynchronized(),
      offset,
      lastSync,
      timeSinceSync: lastSync ? now - lastSync : null,
      serverTime: timeSyncService.getServerTime(),
      clientTime: now
    };
  }

  /**
   * Register callback for sync updates
   */
  onSync(id, callback) {
    this.syncCallbacks.set(id, callback);
    
    return () => {
      this.syncCallbacks.delete(id);
    };
  }

  /**
   * Notify sync callbacks
   */
  notifySync(data) {
    this.syncCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in sync callback:', error);
      }
    });
  }

  /**
   * Start periodic sync checking
   */
  startPeriodicSync(interval = 5000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      const syncStatus = this.getSyncStatus();
      this.notifySync(syncStatus);
      
      // Request resync if offset is too large
      if (!syncStatus.synchronized) {
        timeSyncService.requestSync();
      }
    }, interval);
  }

  /**
   * Stop periodic sync checking
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Synchronize state object with server time
   */
  syncState(state, serverTimestamp) {
    if (!state || !serverTimestamp) return state;

    const now = timeSyncService.getServerTime();
    const timeDiff = now - serverTimestamp;

    // Adjust time-sensitive values
    const syncedState = { ...state };
    
    if (syncedState.timeRemaining) {
      syncedState.timeRemaining = Math.max(0, syncedState.timeRemaining - timeDiff);
    }
    
    if (syncedState.elapsedTime) {
      syncedState.elapsedTime += timeDiff;
    }

    if (syncedState.lastUpdate) {
      syncedState.lastUpdate = now;
    }

    return syncedState;
  }

  /**
   * Calculate optimal sync interval based on auction status
   */
  getOptimalSyncInterval(auctionStatus, timeRemaining) {
    if (auctionStatus === 'active') {
      if (timeRemaining < 60000) { // Less than 1 minute
        return 1000; // Every second
      } else if (timeRemaining < 300000) { // Less than 5 minutes
        return 2000; // Every 2 seconds
      } else {
        return 5000; // Every 5 seconds
      }
    } else if (auctionStatus === 'upcoming') {
      return 10000; // Every 10 seconds
    } else {
      return 30000; // Every 30 seconds for ended auctions
    }
  }

  /**
   * Validate bid timing
   */
  isValidBidTiming(auction, bufferMs = 1000) {
    const timing = this.calculateAuctionTiming(auction);
    if (!timing) return false;
    
    // Allow bids if auction is active and there's at least buffer time remaining
    return timing.isActive && timing.remainingTime > bufferMs;
  }

  /**
   * Get countdown data for display
   */
  getCountdownData(auction) {
    const timing = this.calculateAuctionTiming(auction);
    if (!timing) return null;

    const targetTime = timing.isUpcoming ? timing.startTime : timing.endTime;
    const timeToTarget = targetTime - timing.serverTime;
    const isCountingDown = timeToTarget > 0;
    
    return {
      ...timing,
      targetTime,
      timeToTarget: Math.max(0, timeToTarget),
      isCountingDown,
      displayText: timing.isUpcoming 
        ? 'يبدأ خلال: ' + this.formatTimeRemaining(Math.max(0, timeToTarget))
        : 'ينتهي خلال: ' + this.formatTimeRemaining(Math.max(0, timeToTarget))
    };
  }
}

// Create singleton instance
const syncUtils = new SyncUtils();

export default syncUtils;
export { syncUtils };