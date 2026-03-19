import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import socketService from '../services/socketService';
import { timeSyncService } from '../utils/timeSync';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [stats, setStats] = useState({});
  
  const initializingRef = useRef(false);
  const reconnectTimeoutRef = useRef(null);
  const statsIntervalRef = useRef(null);

  // Initialize socket connection
  const initializeSocket = useCallback(async () => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    try {
      console.log('Initializing socket connection...');
      
      // Initialize time sync service
      timeSyncService.initialize();
      
      // Initialize socket with auth token
      const socket = socketService.initialize(token);
      
      if (socket) {
        console.log('Socket service initialized successfully');
        setConnectionError(null);
      }
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setConnectionError('فشل في الاتصال بالخادم');
    } finally {
      initializingRef.current = false;
    }
  }, [token]);

  // Update authentication when token changes
  const updateAuthentication = useCallback(() => {
    if (token && socketService.isConnected()) {
      socketService.updateAuth(token);
    }
  }, [token]);

  // Force reconnection
  const forceReconnect = useCallback(() => {
    setConnectionError(null);
    socketService.forceReconnect();
  }, []);

  // Disconnect socket
  const disconnect = useCallback(() => {
    socketService.disconnect();
    setConnected(false);
    setReconnecting(false);
  }, []);

  // Get connection statistics
  const getConnectionStats = useCallback(() => {
    const socketStats = socketService.getStats();
    const timeSyncStats = timeSyncService.getStats();
    
    return {
      ...socketStats,
      timeSync: timeSyncStats
    };
  }, []);

  // Setup socket event listeners
  useEffect(() => {
    // Connection events
    const unsubConnected = socketService.on('connected', (data) => {
      console.log('Socket connected:', data);
      setConnected(true);
      setReconnecting(false);
      setConnectionError(null);
      
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    });

    const unsubDisconnected = socketService.on('disconnected', (data) => {
      console.log('Socket disconnected:', data);
      setConnected(false);
      setReconnecting(false);
      
      // Auto-reconnect after delay unless it was intentional
      if (data.reason !== 'io client disconnect') {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!socketService.isConnected()) {
            initializeSocket();
          }
        }, 3000);
      }
    });

    const unsubReconnecting = socketService.on('reconnecting', (data) => {
      console.log('Socket reconnecting, attempt:', data.attempt);
      setReconnecting(true);
      setConnectionError(null);
    });

    const unsubReconnected = socketService.on('reconnected', (data) => {
      console.log('Socket reconnected after attempts:', data.attempts);
      setConnected(true);
      setReconnecting(false);
      setConnectionError(null);
    });

    const unsubConnectionError = socketService.on('connection_error', (data) => {
      console.error('Socket connection error:', data.error);
      setConnectionError(data.error || 'خطأ في الاتصال');
      setConnected(false);
      setReconnecting(false);
    });

    const unsubReconnectionError = socketService.on('reconnection_error', (data) => {
      console.error('Socket reconnection error:', data.error);
      setConnectionError(data.error || 'فشل في إعادة الاتصال');
    });

    const unsubReconnectionFailed = socketService.on('reconnection_failed', () => {
      console.error('Socket reconnection failed completely');
      setConnectionError('فشل الاتصال نهائياً');
      setReconnecting(false);
    });

    // Authentication events
    const unsubAuthSuccess = socketService.on('auth_success', (data) => {
      console.log('Socket authentication successful:', data);
      setConnectionError(null);
    });

    const unsubAuthError = socketService.on('auth_error', (data) => {
      console.error('Socket authentication failed:', data.error);
      setConnectionError('فشل في المصادقة');
    });

    // Rate limiting
    const unsubRateLimit = socketService.on('rate_limit', (data) => {
      console.warn('Socket rate limited:', data);
      setConnectionError('تم تجاوز الحد المسموح للطلبات');
    });

    // Maintenance mode
    const unsubMaintenance = socketService.on('maintenance', (data) => {
      console.warn('Server in maintenance mode:', data);
      setConnectionError('الخادم تحت الصيانة');
    });

    return () => {
      // Clean up all event listeners
      unsubConnected();
      unsubDisconnected();
      unsubReconnecting();
      unsubReconnected();
      unsubConnectionError();
      unsubReconnectionError();
      unsubReconnectionFailed();
      unsubAuthSuccess();
      unsubAuthError();
      unsubRateLimit();
      unsubMaintenance();
    };
  }, [initializeSocket]);

  // Initialize socket when user or token changes
  useEffect(() => {
    if (user && token) {
      initializeSocket();
    } else if (!user && socketService.isConnected()) {
      // User logged out, disconnect socket
      disconnect();
    }
  }, [user, token, initializeSocket, disconnect]);

  // Update auth when token changes but user remains
  useEffect(() => {
    if (user && token && connected) {
      updateAuthentication();
    }
  }, [user, token, connected, updateAuthentication]);

  // Update stats periodically
  useEffect(() => {
    if (connected) {
      const updateStats = () => {
        setStats(getConnectionStats());
      };
      
      // Initial stats
      updateStats();
      
      // Update every 10 seconds
      statsIntervalRef.current = setInterval(updateStats, 10000);
      
      return () => {
        if (statsIntervalRef.current) {
          clearInterval(statsIntervalRef.current);
          statsIntervalRef.current = null;
        }
      };
    }
  }, [connected, getConnectionStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
      
      // Stop time sync
      timeSyncService.stopPeriodicSync();
      
      // Disconnect socket
      socketService.disconnect();
    };
  }, []);

  const contextValue = {
    // Socket instance (use with caution)
    socket: socketService.getSocket(),
    
    // Connection state
    connected,
    reconnecting,
    connectionError,
    stats,
    
    // Socket service methods
    socketService,
    
    // Actions
    forceReconnect,
    disconnect,
    getConnectionStats,
    
    // Utility flags
    isReady: connected && !reconnecting,
    hasError: !!connectionError
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export { SocketContext };
export default SocketProvider;