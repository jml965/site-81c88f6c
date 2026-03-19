/**
 * Time synchronization utility for client-server time alignment
 * Handles network latency compensation and maintains accurate server time
 */
class TimeSyncService {
  constructor() {
    this.offset = 0; // Client time offset from server time
    this.latency = 0; // Network round-trip time
    this.lastSyncTime = null;
    this.syncHistory = [];
    this.maxHistorySize = 10;
    this.syncCallbacks = new Set();
    this.isInitialized = false;
    this.confidence = 0; // Confidence level in sync accuracy (0-1)
  }

  /**
   * Initialize time sync
   */
  initialize() {
    this.isInitialized = true;
    this.requestSync();
    
    // Start periodic sync
    this.startPeriodicSync();
  }

  /**
   * Get current server time accounting for offset
   */
  getServerTime() {
    return Date.now() + this.offset;
  }

  /**
   * Get client time (local time)
   */
  getClientTime() {
    return Date.now();
  }

  /**
   * Get current time offset
   */
  getOffset() {
    return this.offset;
  }

  /**
   * Get network latency
   */
  getLatency() {
    return this.latency;
  }

  /**
   * Get last sync time
   */
  getLastSyncTime() {
    return this.lastSyncTime;
  }

  /**
   * Get sync confidence level
   */
  getConfidence() {
    return this.confidence;
  }

  /**
   * Update offset based on server response
   */
  updateOffset(newOffset, latency = 0) {
    // Store sync data
    const syncData = {
      offset: newOffset,
      latency,
      timestamp: Date.now(),
      confidence: this.calculateConfidence(latency)
    };
    
    this.syncHistory.push(syncData);
    if (this.syncHistory.length > this.maxHistorySize) {
      this.syncHistory.shift();
    }

    // Calculate weighted average of recent syncs
    this.offset = this.calculateWeightedOffset();
    this.latency = latency;
    this.lastSyncTime = Date.now();
    this.confidence = this.calculateOverallConfidence();

    // Notify callbacks
    this.notifySyncUpdate({
      offset: this.offset,
      latency: this.latency,
      confidence: this.confidence,
      serverTime: this.getServerTime()
    });
  }

  /**
   * Calculate weighted average offset from sync history
   */
  calculateWeightedOffset() {
    if (this.syncHistory.length === 0) return 0;

    const now = Date.now();
    let totalWeight = 0;
    let weightedSum = 0;

    this.syncHistory.forEach(sync => {
      // Weight based on recency and confidence
      const age = now - sync.timestamp;
      const ageWeight = Math.exp(-age / 60000); // Exponential decay over 1 minute
      const confidence = sync.confidence || 0.5;
      const weight = ageWeight * confidence;
      
      weightedSum += sync.offset * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Calculate confidence based on latency
   */
  calculateConfidence(latency) {
    if (latency < 50) return 1.0;      // Excellent
    if (latency < 100) return 0.9;     // Very good
    if (latency < 200) return 0.7;     // Good
    if (latency < 500) return 0.5;     // Fair
    if (latency < 1000) return 0.3;    // Poor
    return 0.1;                        // Very poor
  }

  /**
   * Calculate overall confidence from sync history
   */
  calculateOverallConfidence() {
    if (this.syncHistory.length === 0) return 0;

    const recentSyncs = this.syncHistory.slice(-5); // Last 5 syncs
    const avgConfidence = recentSyncs.reduce((sum, sync) => sum + (sync.confidence || 0), 0) / recentSyncs.length;
    
    // Factor in consistency (variance)
    const offsets = recentSyncs.map(sync => sync.offset);
    const variance = this.calculateVariance(offsets);
    const consistencyFactor = Math.exp(-variance / 1000); // Lower variance = higher consistency
    
    return Math.min(1, avgConfidence * consistencyFactor);
  }

  /**
   * Calculate variance of an array
   */
  calculateVariance(values) {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Update server time directly (from server push)
   */
  updateServerTime(serverTimestamp) {
    const clientTime = Date.now();
    const newOffset = serverTimestamp - clientTime;
    this.updateOffset(newOffset, 0); // No latency for push updates
  }

  /**
   * Request time sync from server
   */
  requestSync() {
    // This should be called by the socket service
    // We just track the request time here
    this.syncRequestTime = Date.now();
  }

  /**
   * Handle time sync response from server
   */
  handleSyncResponse(serverTime, requestTime = null) {
    const responseTime = Date.now();
    const clientRequestTime = requestTime || this.syncRequestTime || responseTime;
    
    // Calculate round-trip latency
    const latency = responseTime - clientRequestTime;
    
    // Estimate server time at client request time
    const estimatedServerRequestTime = serverTime - (latency / 2);
    
    // Calculate offset
    const offset = estimatedServerRequestTime - clientRequestTime;
    
    this.updateOffset(offset, latency);
  }

  /**
   * Start periodic sync with server
   */
  startPeriodicSync(interval = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.requestSync();
    }, interval);
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Add callback for sync updates
   */
  onSyncUpdate(callback) {
    this.syncCallbacks.add(callback);
    
    return () => {
      this.syncCallbacks.delete(callback);
    };
  }

  /**
   * Notify all callbacks of sync update
   */
  notifySyncUpdate(data) {
    this.syncCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in time sync callback:', error);
      }
    });
  }

  /**
   * Convert client timestamp to server timestamp
   */
  clientToServerTime(clientTimestamp) {
    return clientTimestamp + this.offset;
  }

  /**
   * Convert server timestamp to client timestamp
   */
  serverToClientTime(serverTimestamp) {
    return serverTimestamp - this.offset;
  }

  /**
   * Check if sync is recent and reliable
   */
  isSyncReliable(maxAge = 60000) { // 1 minute
    if (!this.lastSyncTime) return false;
    
    const age = Date.now() - this.lastSyncTime;
    return age < maxAge && this.confidence > 0.5;
  }

  /**
   * Get sync statistics
   */
  getStats() {
    const now = Date.now();
    const syncAge = this.lastSyncTime ? now - this.lastSyncTime : null;
    
    return {
      offset: this.offset,
      latency: this.latency,
      confidence: this.confidence,
      lastSyncTime: this.lastSyncTime,
      syncAge,
      syncCount: this.syncHistory.length,
      isReliable: this.isSyncReliable(),
      serverTime: this.getServerTime(),
      clientTime: now
    };
  }

  /**
   * Reset sync state
   */
  reset() {
    this.offset = 0;
    this.latency = 0;
    this.lastSyncTime = null;
    this.syncHistory = [];
    this.confidence = 0;
    this.stopPeriodicSync();
  }

  /**
   * Calibrate time sync with multiple requests
   */
  async calibrate(samples = 5) {
    const results = [];
    
    for (let i = 0; i < samples; i++) {
      const startTime = Date.now();
      
      // This would need to be implemented by the socket service
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const endTime = Date.now();
      const simulatedServerTime = endTime + Math.random() * 1000 - 500; // Simulate server time
      
      results.push({
        latency: endTime - startTime,
        offset: simulatedServerTime - startTime
      });
    }
    
    // Process results
    const validResults = results.filter(r => r.latency < 1000); // Filter out high latency
    if (validResults.length > 0) {
      const avgLatency = validResults.reduce((sum, r) => sum + r.latency, 0) / validResults.length;
      const avgOffset = validResults.reduce((sum, r) => sum + r.offset, 0) / validResults.length;
      
      this.updateOffset(avgOffset, avgLatency);
    }
    
    return this.getStats();
  }
}

// Create singleton instance
const timeSyncService = new TimeSyncService();

export default timeSyncService;
export { timeSyncService };