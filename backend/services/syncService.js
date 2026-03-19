const timeSync = require('../utils/timeSync');
const auctionSync = require('../utils/auctionSync');
const db = require('../config/database');
const EventEmitter = require('events');

class SyncService extends EventEmitter {
  constructor() {
    super();
    this.activeAuctions = new Map(); // auctionId -> sync data
    this.syncIntervals = new Map(); // auctionId -> interval ID
    this.initializeService();
  }

  // Initialize the sync service
  async initializeService() {
    try {
      // Load all active auctions on startup
      await this.loadActiveAuctions();
      
      // Start the main sync loop
      this.startMainSyncLoop();
      
      console.log('Sync service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
    }
  }

  // Load all currently active auctions
  async loadActiveAuctions() {
    try {
      const query = `
        SELECT 
          a.*,
          COUNT(DISTINCT ap.user_id) as participant_count,
          COUNT(DISTINCT b.id) as bid_count,
          MAX(b.amount) as current_price
        FROM auctions a
        LEFT JOIN auction_participants ap ON a.id = ap.auction_id
        LEFT JOIN bids b ON a.id = b.auction_id AND b.status = 'active'
        WHERE a.status = 'active'
        GROUP BY a.id
      `;
      
      const result = await db.query(query);
      
      for (const auction of result.rows) {
        await this.initializeAuction(auction.id, auction);
      }
      
      console.log(`Loaded ${result.rows.length} active auctions`);
    } catch (error) {
      console.error('Error loading active auctions:', error);
    }
  }

  // Initialize sync for a specific auction
  async initializeAuction(auctionId, auctionData = null) {
    try {
      // Get auction data if not provided
      if (!auctionData) {
        const result = await db.query(
          'SELECT * FROM auctions WHERE id = $1 AND status = \'active\'',
          [auctionId]
        );
        
        if (result.rows.length === 0) {
          throw new Error(`Auction ${auctionId} not found or not active`);
        }
        
        auctionData = result.rows[0];
      }

      // Create sync data structure
      const syncData = {
        auctionId: parseInt(auctionId),
        startTime: new Date(auctionData.start_time).getTime(),
        endTime: new Date(auctionData.end_time).getTime(),
        duration: new Date(auctionData.end_time).getTime() - new Date(auctionData.start_time).getTime(),
        currentPrice: parseFloat(auctionData.current_price || auctionData.starting_price),
        startingPrice: parseFloat(auctionData.starting_price),
        minBidIncrement: parseFloat(auctionData.min_bid_increment),
        participantCount: parseInt(auctionData.participant_count || 0),
        bidCount: parseInt(auctionData.bid_count || 0),
        timeline: [],
        lastBidTime: null,
        lastSyncTime: timeSync.getServerTime(),
        status: 'active'
      };

      // Load timeline events
      await this.loadAuctionTimeline(auctionId, syncData);

      // Store in memory
      this.activeAuctions.set(auctionId, syncData);

      // Start individual auction sync
      this.startAuctionSync(auctionId);

      console.log(`Initialized sync for auction ${auctionId}`);
      
      // Emit initialization event
      this.emit('auctionInitialized', { auctionId, syncData });
      
      return syncData;
    } catch (error) {
      console.error(`Error initializing auction ${auctionId}:`, error);
      throw error;
    }
  }

  // Load timeline events for an auction
  async loadAuctionTimeline(auctionId, syncData) {
    try {
      // Load bid events
      const bidEvents = await db.query(
        `SELECT 
           b.id,
           b.amount,
           b.created_at,
           u.name as bidder_name
         FROM bids b
         LEFT JOIN users u ON b.user_id = u.id
         WHERE b.auction_id = $1 AND b.status = 'active'
         ORDER BY b.created_at ASC`,
        [auctionId]
      );

      // Convert bids to timeline events
      for (const bid of bidEvents.rows) {
        const eventTime = new Date(bid.created_at).getTime();
        const relativeTime = eventTime - syncData.startTime;
        
        if (relativeTime >= 0 && relativeTime <= syncData.duration) {
          syncData.timeline.push({
            type: 'bid',
            timestamp: eventTime,
            relativeTime: relativeTime,
            data: {
              bidId: bid.id,
              amount: parseFloat(bid.amount),
              bidderName: bid.bidder_name || 'مزايد مجهول'
            }
          });
        }
        
        // Update last bid time
        if (!syncData.lastBidTime || eventTime > syncData.lastBidTime) {
          syncData.lastBidTime = eventTime;
          syncData.currentPrice = parseFloat(bid.amount);
        }
      }

      // Load other timeline events (comments, joins, etc.)
      await this.loadOtherTimelineEvents(auctionId, syncData);

      // Sort timeline by relative time
      syncData.timeline.sort((a, b) => a.relativeTime - b.relativeTime);
    } catch (error) {
      console.error(`Error loading timeline for auction ${auctionId}:`, error);
    }
  }

  // Load other timeline events (comments, joins, etc.)
  async loadOtherTimelineEvents(auctionId, syncData) {
    try {
      // Load participant join events
      const joinEvents = await db.query(
        `SELECT 
           ap.user_id,
           ap.joined_at,
           u.name as user_name
         FROM auction_participants ap
         LEFT JOIN users u ON ap.user_id = u.id
         WHERE ap.auction_id = $1
         ORDER BY ap.joined_at ASC`,
        [auctionId]
      );

      for (const join of joinEvents.rows) {
        const eventTime = new Date(join.joined_at).getTime();
        const relativeTime = eventTime - syncData.startTime;
        
        if (relativeTime >= 0 && relativeTime <= syncData.duration) {
          syncData.timeline.push({
            type: 'join',
            timestamp: eventTime,
            relativeTime: relativeTime,
            data: {
              userId: join.user_id,
              userName: join.user_name || 'مستخدم'
            }
          });
        }
      }

      // Load milestone events (every 25% of duration)
      const quarterDuration = syncData.duration / 4;
      for (let i = 1; i <= 3; i++) {
        const milestoneTime = syncData.startTime + (quarterDuration * i);
        const relativeTime = quarterDuration * i;
        
        syncData.timeline.push({
          type: 'milestone',
          timestamp: milestoneTime,
          relativeTime: relativeTime,
          data: {
            percentage: i * 25,
            message: `مر ${i * 25}% من وقت المزاد`
          }
        });
      }
    } catch (error) {
      console.error(`Error loading other timeline events for auction ${auctionId}:`, error);
    }
  }

  // Start sync loop for a specific auction
  startAuctionSync(auctionId) {
    // Clear existing interval if any
    if (this.syncIntervals.has(auctionId)) {
      clearInterval(this.syncIntervals.get(auctionId));
    }

    // Start new sync interval (every second)
    const intervalId = setInterval(async () => {
      await this.syncAuction(auctionId);
    }, 1000);

    this.syncIntervals.set(auctionId, intervalId);
  }

  // Sync a specific auction
  async syncAuction(auctionId) {
    try {
      const syncData = this.activeAuctions.get(auctionId);
      if (!syncData) {
        return;
      }

      const currentTime = timeSync.getServerTime();
      
      // Check if auction should end
      if (currentTime >= syncData.endTime) {
        await this.endAuctionSync(auctionId);
        return;
      }

      // Calculate current position
      const elapsed = currentTime - syncData.startTime;
      const progress = Math.min(1, elapsed / syncData.duration);
      const timeRemaining = Math.max(0, syncData.endTime - currentTime);

      // Update sync data
      syncData.lastSyncTime = currentTime;
      syncData.currentElapsed = elapsed;
      syncData.currentProgress = progress;
      syncData.timeRemaining = timeRemaining;

      // Emit sync update
      this.emit('auctionSync', {
        auctionId,
        syncData: this.getPublicSyncData(syncData)
      });

      // Check for bid updates periodically (every 5 seconds)
      if (currentTime - (syncData.lastBidCheck || 0) >= 5000) {
        await this.checkBidUpdates(auctionId, syncData);
        syncData.lastBidCheck = currentTime;
      }
    } catch (error) {
      console.error(`Error syncing auction ${auctionId}:`, error);
    }
  }

  // Check for new bids and update timeline
  async checkBidUpdates(auctionId, syncData) {
    try {
      const query = `
        SELECT 
          b.id,
          b.amount,
          b.created_at,
          u.name as bidder_name
        FROM bids b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.auction_id = $1 
          AND b.status = 'active' 
          AND b.created_at > $2
        ORDER BY b.created_at ASC
      `;
      
      const lastCheck = syncData.lastBidTime 
        ? new Date(syncData.lastBidTime)
        : new Date(syncData.startTime);
      
      const result = await db.query(query, [auctionId, lastCheck]);
      
      for (const bid of result.rows) {
        const eventTime = new Date(bid.created_at).getTime();
        const relativeTime = eventTime - syncData.startTime;
        
        // Add to timeline
        const timelineEvent = {
          type: 'bid',
          timestamp: eventTime,
          relativeTime: relativeTime,
          data: {
            bidId: bid.id,
            amount: parseFloat(bid.amount),
            bidderName: bid.bidder_name || 'مزايد مجهول'
          }
        };
        
        syncData.timeline.push(timelineEvent);
        
        // Update current price and last bid time
        if (parseFloat(bid.amount) > syncData.currentPrice) {
          syncData.currentPrice = parseFloat(bid.amount);
        }
        
        if (eventTime > (syncData.lastBidTime || 0)) {
          syncData.lastBidTime = eventTime;
        }
        
        // Update bid count
        syncData.bidCount++;
        
        // Emit new bid event
        this.emit('newBid', {
          auctionId,
          bid: timelineEvent,
          currentPrice: syncData.currentPrice
        });
      }
      
      // Re-sort timeline
      if (result.rows.length > 0) {
        syncData.timeline.sort((a, b) => a.relativeTime - b.relativeTime);
      }
    } catch (error) {
      console.error(`Error checking bid updates for auction ${auctionId}:`, error);
    }
  }

  // End auction sync
  async endAuctionSync(auctionId) {
    try {
      const syncData = this.activeAuctions.get(auctionId);
      if (!syncData) {
        return;
      }

      // Mark as ended
      syncData.status = 'ended';
      syncData.timeRemaining = 0;
      syncData.currentProgress = 1;

      // Clear sync interval
      if (this.syncIntervals.has(auctionId)) {
        clearInterval(this.syncIntervals.get(auctionId));
        this.syncIntervals.delete(auctionId);
      }

      // Update database
      await db.query(
        'UPDATE auctions SET status = \'ended\', end_time = CURRENT_TIMESTAMP WHERE id = $1',
        [auctionId]
      );

      // Emit end event
      this.emit('auctionEnded', {
        auctionId,
        finalPrice: syncData.currentPrice,
        bidCount: syncData.bidCount
      });

      // Remove from active auctions after a delay (keep for 5 minutes for clients to sync)
      setTimeout(() => {
        this.activeAuctions.delete(auctionId);
      }, 5 * 60 * 1000);

      console.log(`Ended auction sync for auction ${auctionId}`);
    } catch (error) {
      console.error(`Error ending auction sync for ${auctionId}:`, error);
    }
  }

  // Get public sync data (filtered for client consumption)
  getPublicSyncData(syncData) {
    const currentTime = timeSync.getServerTime();
    const elapsed = currentTime - syncData.startTime;
    const progress = Math.min(1, elapsed / syncData.duration);
    
    return {
      auctionId: syncData.auctionId,
      serverTime: currentTime,
      startTime: syncData.startTime,
      endTime: syncData.endTime,
      duration: syncData.duration,
      elapsed: elapsed,
      progress: progress,
      timeRemaining: Math.max(0, syncData.endTime - currentTime),
      currentPrice: syncData.currentPrice,
      startingPrice: syncData.startingPrice,
      minBidIncrement: syncData.minBidIncrement,
      participantCount: syncData.participantCount,
      bidCount: syncData.bidCount,
      lastBidTime: syncData.lastBidTime,
      status: syncData.status,
      timeline: this.getFilteredTimeline(syncData.timeline, elapsed)
    };
  }

  // Get filtered timeline events (only relevant ones)
  getFilteredTimeline(timeline, currentElapsed) {
    const relevantWindow = 30000; // 30 seconds
    
    return timeline.filter(event => {
      // Include all bids
      if (event.type === 'bid') {
        return true;
      }
      
      // Include events in current window
      if (Math.abs(event.relativeTime - currentElapsed) <= relevantWindow) {
        return true;
      }
      
      // Include upcoming milestones
      if (event.type === 'milestone' && event.relativeTime > currentElapsed) {
        return true;
      }
      
      return false;
    }).slice(-50); // Limit to last 50 events
  }

  // Get sync data for a specific auction
  async getAuctionSyncData(auctionId) {
    try {
      const syncData = this.activeAuctions.get(auctionId);
      
      if (!syncData) {
        // Try to initialize if auction is active
        const result = await db.query(
          'SELECT * FROM auctions WHERE id = $1 AND status = \'active\'',
          [auctionId]
        );
        
        if (result.rows.length === 0) {
          throw new Error('المزاد غير نشط أو غير موجود');
        }
        
        // Initialize and return
        const newSyncData = await this.initializeAuction(auctionId, result.rows[0]);
        return this.getPublicSyncData(newSyncData);
      }
      
      return this.getPublicSyncData(syncData);
    } catch (error) {
      console.error(`Error getting sync data for auction ${auctionId}:`, error);
      throw error;
    }
  }

  // Start main sync loop (for cleanup and maintenance)
  startMainSyncLoop() {
    setInterval(async () => {
      try {
        await this.performMaintenanceTasks();
      } catch (error) {
        console.error('Error in main sync loop:', error);
      }
    }, 60000); // Every minute
  }

  // Perform maintenance tasks
  async performMaintenanceTasks() {
    try {
      const currentTime = timeSync.getServerTime();
      
      // Check for auctions that should start
      const scheduledAuctions = await db.query(
        'SELECT * FROM auctions WHERE status = \'scheduled\' AND start_time <= CURRENT_TIMESTAMP'
      );
      
      for (const auction of scheduledAuctions.rows) {
        console.log(`Auto-starting scheduled auction ${auction.id}`);
        await this.autoStartAuction(auction.id);
      }
      
      // Clean up old sync data
      for (const [auctionId, syncData] of this.activeAuctions.entries()) {
        if (syncData.status === 'ended' && currentTime - syncData.endTime > 300000) { // 5 minutes
          this.activeAuctions.delete(auctionId);
          console.log(`Cleaned up sync data for ended auction ${auctionId}`);
        }
      }
    } catch (error) {
      console.error('Error in maintenance tasks:', error);
    }
  }

  // Auto-start a scheduled auction
  async autoStartAuction(auctionId) {
    try {
      await db.query(
        'UPDATE auctions SET status = \'active\', updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [auctionId]
      );
      
      await this.initializeAuction(auctionId);
      
      console.log(`Auto-started auction ${auctionId}`);
    } catch (error) {
      console.error(`Error auto-starting auction ${auctionId}:`, error);
    }
  }

  // Stop sync for an auction
  stopAuctionSync(auctionId) {
    if (this.syncIntervals.has(auctionId)) {
      clearInterval(this.syncIntervals.get(auctionId));
      this.syncIntervals.delete(auctionId);
    }
    
    this.activeAuctions.delete(auctionId);
    console.log(`Stopped sync for auction ${auctionId}`);
  }

  // Get all active auction IDs
  getActiveAuctionIds() {
    return Array.from(this.activeAuctions.keys());
  }

  // Check if auction is being synced
  isAuctionActive(auctionId) {
    return this.activeAuctions.has(auctionId);
  }
}

module.exports = new SyncService();