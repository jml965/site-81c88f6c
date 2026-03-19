const timeSync = require('./timeSync');
const EventEmitter = require('events');

/**
 * Auction Synchronization Utility
 * Manages synchronized auction state across all clients
 */
class AuctionSyncManager extends EventEmitter {
  constructor() {
    super();
    this.auctionStates = new Map(); // auctionId -> state
    this.clientSessions = new Map(); // sessionId -> client info
    this.auctionClients = new Map(); // auctionId -> Set of sessionIds
  }

  /**
   * Initialize auction sync state
   */
  initializeAuction(auctionId, auctionData) {
    const startTime = new Date(auctionData.start_time).getTime();
    const endTime = new Date(auctionData.end_time).getTime();
    
    const state = {
      auctionId: parseInt(auctionId),
      title: auctionData.title,
      status: auctionData.status,
      startTime: startTime,
      endTime: endTime,
      duration: endTime - startTime,
      currentPrice: parseFloat(auctionData.current_price || auctionData.starting_price),
      startingPrice: parseFloat(auctionData.starting_price),
      minBidIncrement: parseFloat(auctionData.min_bid_increment),
      videoUrl: auctionData.video_url,
      videoDuration: auctionData.video_duration || null,
      
      // Sync-specific data
      lastBidTime: null,
      lastSyncTime: timeSync.getServerTime(),
      participantCount: 0,
      bidCount: 0,
      
      // Timeline events
      timeline: [],
      
      // State flags
      isEnded: false,
      hasStarted: auctionData.status === 'active',
      
      // Auto-extend settings
      autoExtend: auctionData.auto_extend || false,
      extendMinutes: auctionData.extend_minutes || 5,
      extendCount: 0,
      maxExtensions: 3
    };
    
    this.auctionStates.set(auctionId, state);
    this.auctionClients.set(auctionId, new Set());
    
    console.log(`Initialized auction sync for auction ${auctionId}`);
    return state;
  }

  /**
   * Get current synchronized time position for auction
   */
  getCurrentTimePosition(auctionId) {
    const state = this.auctionStates.get(auctionId);
    if (!state) {
      throw new Error(`Auction ${auctionId} not found in sync manager`);
    }
    
    const serverTime = timeSync.getServerTime();
    
    // If auction hasn't started, return 0
    if (!state.hasStarted || serverTime < state.startTime) {
      return {
        serverTime,
        auctionTime: 0,
        elapsed: 0,
        remaining: state.endTime - serverTime,
        progress: 0,
        videoPosition: 0,
        phase: 'waiting'
      };
    }
    
    // Calculate elapsed time since auction start
    const elapsed = serverTime - state.startTime;
    const remaining = Math.max(0, state.endTime - serverTime);
    const progress = Math.min(1, elapsed / state.duration);
    
    // Calculate video position (if video duration is known)
    let videoPosition = 0;
    if (state.videoDuration) {
      videoPosition = Math.min(state.videoDuration, (elapsed / 1000)); // Convert to seconds
    }
    
    // Determine auction phase
    let phase = 'active';
    if (remaining === 0 || state.isEnded) {
      phase = 'ended';
    } else if (remaining < 60000) { // Less than 1 minute
      phase = 'ending';
    } else if (elapsed < 30000) { // First 30 seconds
      phase = 'starting';
    }
    
    return {
      serverTime,
      auctionTime: elapsed,
      elapsed,
      remaining,
      progress,
      videoPosition,
      phase
    };
  }

  /**
   * Get synchronized auction state for clients
   */
  getSyncState(auctionId, includeTimeline = true) {
    const state = this.auctionStates.get(auctionId);
    if (!state) {
      return null;
    }
    
    const timePosition = this.getCurrentTimePosition(auctionId);
    const clientCount = this.auctionClients.get(auctionId)?.size || 0;
    
    const syncState = {
      auctionId: state.auctionId,
      title: state.title,
      status: state.status,
      
      // Time synchronization
      ...timePosition,
      
      // Pricing
      currentPrice: state.currentPrice,
      startingPrice: state.startingPrice,
      minBidIncrement: state.minBidIncrement,
      minimumBid: state.currentPrice + state.minBidIncrement,
      
      // Participation
      participantCount: state.participantCount,
      clientCount: clientCount,
      bidCount: state.bidCount,
      
      // Media
      videoUrl: state.videoUrl,
      videoDuration: state.videoDuration,
      
      // State flags
      isEnded: state.isEnded,
      hasStarted: state.hasStarted,
      canBid: timePosition.phase === 'active' || timePosition.phase === 'ending',
      
      // Auto-extend info
      autoExtend: state.autoExtend,
      extendCount: state.extendCount,
      
      // Timestamps
      lastBidTime: state.lastBidTime,
      lastSyncTime: timeSync.getServerTime()
    };
    
    // Include timeline if requested
    if (includeTimeline) {
      syncState.timeline = this.getRelevantTimeline(auctionId, timePosition.elapsed);
    }
    
    return syncState;
  }

  /**
   * Update auction state with new bid
   */
  updateWithBid(auctionId, bidData) {
    const state = this.auctionStates.get(auctionId);
    if (!state) {
      throw new Error(`Auction ${auctionId} not found`);
    }
    
    const bidTime = new Date(bidData.created_at).getTime();
    const relativeTime = bidTime - state.startTime;
    
    // Update current price if this is the highest bid
    if (bidData.amount > state.currentPrice) {
      state.currentPrice = parseFloat(bidData.amount);
      state.lastBidTime = bidTime;
    }
    
    // Update bid count
    state.bidCount++;
    
    // Add to timeline
    const timelineEvent = {
      id: bidData.id,
      type: 'bid',
      timestamp: bidTime,
      relativeTime: relativeTime,
      data: {
        amount: parseFloat(bidData.amount),
        bidderName: bidData.bidder_name || 'مزايد',
        bidderId: bidData.user_id
      }
    };
    
    state.timeline.push(timelineEvent);
    
    // Sort timeline by relative time
    state.timeline.sort((a, b) => a.relativeTime - b.relativeTime);
    
    // Check for auto-extend
    this.checkAutoExtend(auctionId, bidTime);
    
    // Emit bid event
    this.emit('bidUpdate', {
      auctionId,
      bid: timelineEvent,
      newPrice: state.currentPrice,
      syncState: this.getSyncState(auctionId, false)
    });
    
    return timelineEvent;
  }

  /**
   * Check and handle auto-extend logic
   */
  checkAutoExtend(auctionId, bidTime) {
    const state = this.auctionStates.get(auctionId);
    if (!state || !state.autoExtend || state.extendCount >= state.maxExtensions) {
      return false;
    }
    
    const currentTime = timeSync.getServerTime();
    const timeRemaining = state.endTime - currentTime;
    const timeSinceBid = currentTime - bidTime;
    
    // Auto-extend if:
    // 1. Less than 2 minutes remaining
    // 2. Bid was placed within last 30 seconds
    if (timeRemaining < 120000 && timeSinceBid < 30000) {
      const extendMs = state.extendMinutes * 60 * 1000;
      state.endTime += extendMs;
      state.duration += extendMs;
      state.extendCount++;
      
      // Add extend event to timeline
      const extendEvent = {
        type: 'extend',
        timestamp: currentTime,
        relativeTime: currentTime - state.startTime,
        data: {
          minutes: state.extendMinutes,
          extendCount: state.extendCount,
          newEndTime: state.endTime
        }
      };
      
      state.timeline.push(extendEvent);
      
      this.emit('auctionExtended', {
        auctionId,
        extendEvent,
        newEndTime: state.endTime,
        extendCount: state.extendCount
      });
      
      return true;
    }
    
    return false;
  }

  /**
   * Add participant join event
   */
  addParticipant(auctionId, participantData) {
    const state = this.auctionStates.get(auctionId);
    if (!state) {
      return;
    }
    
    const joinTime = new Date(participantData.joined_at || Date.now()).getTime();
    const relativeTime = joinTime - state.startTime;
    
    // Update participant count
    state.participantCount++;
    
    // Add join event to timeline
    const joinEvent = {
      type: 'join',
      timestamp: joinTime,
      relativeTime: relativeTime,
      data: {
        userId: participantData.user_id,
        userName: participantData.user_name || 'مستخدم'
      }
    };
    
    state.timeline.push(joinEvent);
    
    this.emit('participantJoined', {
      auctionId,
      participant: joinEvent
    });
  }

  /**
   * End auction sync
   */
  endAuction(auctionId, winnerData = null) {
    const state = this.auctionStates.get(auctionId);
    if (!state) {
      return;
    }
    
    const endTime = timeSync.getServerTime();
    state.isEnded = true;
    state.status = 'ended';
    
    // Add end event to timeline
    const endEvent = {
      type: 'end',
      timestamp: endTime,
      relativeTime: endTime - state.startTime,
      data: {
        finalPrice: state.currentPrice,
        bidCount: state.bidCount,
        winner: winnerData
      }
    };
    
    state.timeline.push(endEvent);
    
    this.emit('auctionEnded', {
      auctionId,
      endEvent,
      finalState: this.getSyncState(auctionId)
    });
  }

  /**
   * Get relevant timeline events for current time position
   */
  getRelevantTimeline(auctionId, currentElapsed) {
    const state = this.auctionStates.get(auctionId);
    if (!state) {
      return [];
    }
    
    // Return events in a window around current time
    const windowSize = 60000; // 1 minute window
    
    return state.timeline.filter(event => {
      // Always include bid events
      if (event.type === 'bid') {
        return true;
      }
      
      // Include events within time window
      const timeDiff = Math.abs(event.relativeTime - currentElapsed);
      return timeDiff <= windowSize;
    }).slice(-50); // Limit to last 50 events
  }

  /**
   * Register client session
   */
  registerClient(sessionId, auctionId, clientData = {}) {
    // Store client session
    this.clientSessions.set(sessionId, {
      auctionId,
      joinedAt: timeSync.getServerTime(),
      ...clientData
    });
    
    // Add to auction clients
    if (!this.auctionClients.has(auctionId)) {
      this.auctionClients.set(auctionId, new Set());
    }
    this.auctionClients.get(auctionId).add(sessionId);
    
    // Update participant count if this is a new participant
    const state = this.auctionStates.get(auctionId);
    if (state && clientData.userId) {
      this.addParticipant(auctionId, {
        user_id: clientData.userId,
        user_name: clientData.userName,
        joined_at: new Date().toISOString()
      });
    }
  }

  /**
   * Unregister client session
   */
  unregisterClient(sessionId) {
    const clientInfo = this.clientSessions.get(sessionId);
    if (!clientInfo) {
      return;
    }
    
    const { auctionId } = clientInfo;
    
    // Remove from client sessions
    this.clientSessions.delete(sessionId);
    
    // Remove from auction clients
    if (this.auctionClients.has(auctionId)) {
      this.auctionClients.get(auctionId).delete(sessionId);
    }
  }

  /**
   * Get all clients for an auction
   */
  getAuctionClients(auctionId) {
    return Array.from(this.auctionClients.get(auctionId) || []);
  }

  /**
   * Clean up ended auction
   */
  cleanup(auctionId) {
    // Remove from states after delay (keep for 5 minutes for final sync)
    setTimeout(() => {
      this.auctionStates.delete(auctionId);
      this.auctionClients.delete(auctionId);
      
      // Remove associated client sessions
      for (const [sessionId, clientInfo] of this.clientSessions.entries()) {
        if (clientInfo.auctionId === auctionId) {
          this.clientSessions.delete(sessionId);
        }
      }
      
      console.log(`Cleaned up sync data for auction ${auctionId}`);
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Get synchronization statistics
   */
  getStats() {
    return {
      activeAuctions: this.auctionStates.size,
      totalClients: this.clientSessions.size,
      auctionsWithClients: Array.from(this.auctionClients.entries())
        .filter(([_, clients]) => clients.size > 0).length
    };
  }
}

// Create singleton instance
const auctionSyncManager = new AuctionSyncManager();

module.exports = auctionSyncManager;