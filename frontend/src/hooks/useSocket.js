import { useContext, useCallback, useEffect, useRef } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { socket, connected, reconnecting } = useContext(SocketContext);
  const { user, token } = useAuth();
  const listenersRef = useRef(new Set());

  // Generic event listener
  const on = useCallback((event, handler) => {
    if (!socket) return;
    
    socket.on(event, handler);
    listenersRef.current.add({ event, handler });
    
    return () => {
      socket.off(event, handler);
      listenersRef.current.delete({ event, handler });
    };
  }, [socket]);

  // Generic event emitter
  const emit = useCallback((event, data, callback) => {
    if (!socket || !connected) {
      console.warn('Socket not connected. Cannot emit:', event);
      return false;
    }
    
    if (callback) {
      socket.emit(event, data, callback);
    } else {
      socket.emit(event, data);
    }
    return true;
  }, [socket, connected]);

  // Join auction room
  const joinAuctionRoom = useCallback((auctionId, callback) => {
    if (!socket || !connected) return false;
    
    socket.emit('join_auction', { auctionId, userId: user?.id }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user]);

  // Leave auction room
  const leaveAuctionRoom = useCallback((auctionId, callback) => {
    if (!socket || !connected) return false;
    
    socket.emit('leave_auction', { auctionId, userId: user?.id }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user]);

  // Place bid
  const placeBid = useCallback((auctionId, amount, callback) => {
    if (!socket || !connected) {
      if (callback) callback({ success: false, error: 'غير متصل' });
      return false;
    }
    
    if (!user || !token) {
      if (callback) callback({ success: false, error: 'يجب تسجيل الدخول' });
      return false;
    }
    
    socket.emit('place_bid', {
      auctionId,
      amount,
      userId: user.id,
      token
    }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user, token]);

  // Send auction comment
  const sendComment = useCallback((auctionId, content, callback) => {
    if (!socket || !connected) {
      if (callback) callback({ success: false, error: 'غير متصل' });
      return false;
    }
    
    socket.emit('auction_comment', {
      auctionId,
      content,
      userId: user?.id
    }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user]);

  // Request auction sync
  const requestSync = useCallback((auctionId, callback) => {
    if (!socket || !connected) return false;
    
    socket.emit('sync_request', {
      auctionId,
      userId: user?.id,
      timestamp: Date.now()
    }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user]);

  // Send heartbeat for sync
  const sendHeartbeat = useCallback((auctionId, currentTime) => {
    if (!socket || !connected) return false;
    
    socket.emit('heartbeat', {
      auctionId,
      userId: user?.id,
      currentTime,
      timestamp: Date.now()
    });
    return true;
  }, [socket, connected, user]);

  // Like/unlike auction
  const toggleAuctionLike = useCallback((auctionId, isLiked, callback) => {
    if (!socket || !connected) {
      if (callback) callback({ success: false, error: 'غير متصل' });
      return false;
    }
    
    socket.emit('toggle_like', {
      auctionId,
      isLiked,
      userId: user?.id
    }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user]);

  // Follow/unfollow auction
  const toggleAuctionFollow = useCallback((auctionId, isFollowing, callback) => {
    if (!socket || !connected) {
      if (callback) callback({ success: false, error: 'غير متصل' });
      return false;
    }
    
    socket.emit('toggle_follow', {
      auctionId,
      isFollowing,
      userId: user?.id
    }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user]);

  // Report content
  const reportContent = useCallback((type, targetId, reason, description, callback) => {
    if (!socket || !connected) {
      if (callback) callback({ success: false, error: 'غير متصل' });
      return false;
    }
    
    socket.emit('report_content', {
      type, // 'auction', 'comment', 'user'
      targetId,
      reason,
      description,
      userId: user?.id
    }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user]);

  // Join notification room
  const joinNotificationRoom = useCallback(() => {
    if (!socket || !connected || !user) return false;
    
    socket.emit('join_notifications', { userId: user.id });
    return true;
  }, [socket, connected, user]);

  // Mark notifications as read
  const markNotificationsRead = useCallback((notificationIds, callback) => {
    if (!socket || !connected) return false;
    
    socket.emit('mark_notifications_read', {
      notificationIds,
      userId: user?.id
    }, (response) => {
      if (callback) callback(response);
    });
    return true;
  }, [socket, connected, user]);

  // Clean up listeners on unmount
  useEffect(() => {
    return () => {
      if (listenersRef.current && socket) {
        listenersRef.current.forEach(({ event, handler }) => {
          socket.off(event, handler);
        });
        listenersRef.current.clear();
      }
    };
  }, [socket]);

  // Auto-join notification room when connected and authenticated
  useEffect(() => {
    if (connected && user && socket) {
      joinNotificationRoom();
    }
  }, [connected, user, joinNotificationRoom]);

  return {
    socket,
    connected,
    reconnecting,
    // Generic methods
    on,
    emit,
    // Auction-specific methods
    joinAuctionRoom,
    leaveAuctionRoom,
    placeBid,
    sendComment,
    requestSync,
    sendHeartbeat,
    toggleAuctionLike,
    toggleAuctionFollow,
    reportContent,
    // Notification methods
    joinNotificationRoom,
    markNotificationsRead
  };
};

export default useSocket;