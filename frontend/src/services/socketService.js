import io from 'socket.io-client';
import { timeSyncService } from '../utils/timeSync';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.reconnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.pendingEmits = [];
    this.heartbeatInterval = null;
    this.syncInterval = null;
    this.lastActivity = Date.now();
    this.connectionStartTime = null;
    this.serverTimeOffset = 0;
  }

  // Initialize socket connection
  initialize(token = null) {
    if (this.socket) {
      this.disconnect();
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001';
    
    // Socket configuration
    const config = {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
      maxHttpBufferSize: 1e6,
      pingTimeout: 60000,
      pingInterval: 25000
    };

    // Add auth token if provided
    if (token) {
      config.auth = { token };
    }

    // Add query parameters
    config.query = {
      timestamp: Date.now(),
      client: 'web',
      version: '1.0.0'
    };

    try {
      this.socket = io(socketUrl, config);
      this.setupEventListeners();
      this.connectionStartTime = Date.now();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      throw error;
    }

    return this.socket;
  }

  // Setup core event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;
      this.reconnecting = false;
      this.reconnectAttempts = 0;
      this.lastActivity = Date.now();
      
      // Initialize time sync
      this.initializeTimeSync();
      
      // Process pending emits
      this.processPendingEmits();
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Emit connection established event
      this.emit('connection_established', {
        socketId: this.socket.id,
        timestamp: Date.now()
      });

      // Notify listeners
      this.notifyListeners('connected', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connected = false;
      this.stopHeartbeat();
      this.stopTimeSync();
      
      this.notifyListeners('disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connected = false;
      this.notifyListeners('connection_error', { error: error.message });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.reconnecting = false;
      this.reconnectAttempts = 0;
      this.notifyListeners('reconnected', { attempts: attemptNumber });
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket reconnection attempt:', attemptNumber);
      this.reconnecting = true;
      this.reconnectAttempts = attemptNumber;
      this.notifyListeners('reconnecting', { attempt: attemptNumber });
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      this.notifyListeners('reconnection_error', { error: error.message });
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      this.reconnecting = false;
      this.notifyListeners('reconnection_failed', {});
    });

    // Server time sync events
    this.socket.on('time_sync_response', (data) => {
      this.handleTimeSyncResponse(data);
    });

    this.socket.on('server_time', (data) => {
      timeSyncService.updateServerTime(data.timestamp);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.notifyListeners('socket_error', { error });
    });

    // Authentication events
    this.socket.on('auth_error', (error) => {
      console.error('Socket auth error:', error);
      this.notifyListeners('auth_error', { error });
    });

    this.socket.on('auth_success', (data) => {
      console.log('Socket authenticated successfully');
      this.notifyListeners('auth_success', data);
    });

    // Rate limiting
    this.socket.on('rate_limit', (data) => {
      console.warn('Rate limited:', data);
      this.notifyListeners('rate_limit', data);
    });

    // Server maintenance
    this.socket.on('maintenance_mode', (data) => {
      console.warn('Server in maintenance mode:', data);
      this.notifyListeners('maintenance', data);
    });
  }

  // Initialize time synchronization
  initializeTimeSync() {
    if (!this.connected) return;

    // Initial sync
    this.requestTimeSync();

    // Periodic sync every 30 seconds
    this.syncInterval = setInterval(() => {
      if (this.connected) {
        this.requestTimeSync();
      }
    }, 30000);
  }

  // Request time sync from server
  requestTimeSync() {
    if (!this.connected) return;

    const clientTime = Date.now();
    this.socket.emit('time_sync_request', { clientTime });
  }

  // Handle time sync response
  handleTimeSyncResponse(data) {
    const { serverTime, clientTime } = data;
    const roundTripTime = Date.now() - clientTime;
    const offset = serverTime - clientTime - (roundTripTime / 2);
    
    timeSyncService.updateOffset(offset);
    this.serverTimeOffset = offset;
  }

  // Start heartbeat to keep connection alive
  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.socket.emit('heartbeat', {
          timestamp: Date.now(),
          clientTime: timeSyncService.getServerTime()
        });
      }
    }, 30000); // Every 30 seconds
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Stop time sync
  stopTimeSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Add event listener
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);

    // Also listen on socket if connected
    if (this.socket) {
      this.socket.on(event, handler);
    }

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  // Remove event listener
  off(event, handler) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(handler);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }

    if (this.socket) {
      this.socket.off(event, handler);
    }
  }

  // Emit event
  emit(event, data, callback) {
    this.lastActivity = Date.now();

    if (!this.connected || !this.socket) {
      // Queue for later if not connected
      if (event !== 'heartbeat' && event !== 'time_sync_request') {
        this.pendingEmits.push({ event, data, callback, timestamp: Date.now() });
      }
      if (callback) {
        callback({ success: false, error: 'غير متصل' });
      }
      return false;
    }

    try {
      if (callback) {
        this.socket.emit(event, data, callback);
      } else {
        this.socket.emit(event, data);
      }
      return true;
    } catch (error) {
      console.error('Error emitting event:', error);
      if (callback) {
        callback({ success: false, error: 'خطأ في الإرسال' });
      }
      return false;
    }
  }

  // Process pending emits after reconnection
  processPendingEmits() {
    const now = Date.now();
    const validEmits = this.pendingEmits.filter(emit => 
      now - emit.timestamp < 30000 // Only process emits less than 30 seconds old
    );

    validEmits.forEach(({ event, data, callback }) => {
      this.emit(event, data, callback);
    });

    this.pendingEmits = [];
  }

  // Notify internal listeners
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }
  }

  // Update authentication token
  updateAuth(token) {
    if (this.socket) {
      this.socket.auth = { token };
      if (this.connected) {
        this.socket.emit('update_auth', { token });
      }
    }
  }

  // Get connection stats
  getStats() {
    return {
      connected: this.connected,
      reconnecting: this.reconnecting,
      reconnectAttempts: this.reconnectAttempts,
      lastActivity: this.lastActivity,
      connectionDuration: this.connectionStartTime ? Date.now() - this.connectionStartTime : 0,
      serverTimeOffset: this.serverTimeOffset,
      socketId: this.socket?.id,
      pendingEmits: this.pendingEmits.length
    };
  }

  // Force reconnection
  forceReconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.connect();
    }
  }

  // Disconnect socket
  disconnect() {
    this.stopHeartbeat();
    this.stopTimeSync();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.connected = false;
    this.reconnecting = false;
    this.pendingEmits = [];
    this.listeners.clear();
  }

  // Get socket instance (use with caution)
  getSocket() {
    return this.socket;
  }

  // Check if connected
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Check if reconnecting
  isReconnecting() {
    return this.reconnecting;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
export { socketService };