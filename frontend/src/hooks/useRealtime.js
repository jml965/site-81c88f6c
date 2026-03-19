import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import { timeSyncService } from '../utils/timeSync';

export const useRealtime = (auctionId, options = {}) => {
  const {
    autoJoin = true,
    syncInterval = 5000,
    heartbeatInterval = 10000,
    maxRetries = 3
  } = options;

  const { 
    connected, 
    joinAuctionRoom, 
    leaveAuctionRoom, 
    on, 
    requestSync,
    sendHeartbeat 
  } = useSocket();

  // Realtime state
  const [auctionState, setAuctionState] = useState({
    currentPrice: 0,
    highestBid: null,
    participantCount: 0,
    timeRemaining: 0,
    status: 'upcoming', // 'upcoming', 'active', 'ended'
    syncTime: 0,
    isLive: false
  });

  const [bids, setBids] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Intervals and refs
  const syncIntervalRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const retryCountRef = useRef(0);
  const isUnmountedRef = useRef(false);

  // Join auction room
  const joinAuction = useCallback(async () => {
    if (!auctionId || !connected || isJoined) return;

    try {
      const success = joinAuctionRoom(auctionId, (response) => {
        if (response.success) {
          setIsJoined(true);
          setSyncError(null);
          retryCountRef.current = 0;
          
          // Update initial state from response
          if (response.auctionState) {
            setAuctionState(prev => ({
              ...prev,
              ...response.auctionState,
              syncTime: timeSyncService.getServerTime()
            }));
          }
          
          if (response.recentBids) setBids(response.recentBids);
          if (response.recentComments) setComments(response.recentComments);
          if (response.stats) {
            setLikes(response.stats.likes || 0);
            setFollowers(response.stats.followers || 0);
          }
          
          console.log('Joined auction room successfully');
        } else {
          setSyncError(response.error || 'فشل في الدخول للمزاد');
        }
      });

      if (!success) {
        setSyncError('غير متصل بالخادم');
      }
    } catch (error) {
      console.error('Error joining auction:', error);
      setSyncError('خطأ في الاتصال');
    }
  }, [auctionId, connected, isJoined, joinAuctionRoom]);

  // Leave auction room
  const leaveAuction = useCallback(() => {
    if (!isJoined || !auctionId) return;

    leaveAuctionRoom(auctionId, (response) => {
      if (response.success) {
        setIsJoined(false);
        console.log('Left auction room');
      }
    });
  }, [isJoined, auctionId, leaveAuctionRoom]);

  // Request sync with server
  const syncWithServer = useCallback(() => {
    if (!isJoined || !connected) return;

    requestSync(auctionId, (response) => {
      if (response.success && !isUnmountedRef.current) {
        const serverTime = timeSyncService.getServerTime();
        
        setAuctionState(prev => ({
          ...prev,
          ...response.auctionState,
          syncTime: serverTime
        }));
        
        setLastSyncTime(new Date());
        setSyncError(null);
        retryCountRef.current = 0;
      } else if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(syncWithServer, 2000 * retryCountRef.current);
      } else {
        setSyncError('فشل في مزامنة البيانات');
      }
    });
  }, [isJoined, connected, auctionId, requestSync, maxRetries]);

  // Send heartbeat
  const sendHeartbeatPing = useCallback(() => {
    if (!isJoined || !connected) return;

    const currentTime = timeSyncService.getServerTime();
    sendHeartbeat(auctionId, currentTime);
  }, [isJoined, connected, auctionId, sendHeartbeat]);

  // Setup event listeners
  useEffect(() => {
    if (!connected || !auctionId) return;

    // Auction state updates
    const unsubAuctionUpdate = on('auction_update', (data) => {
      if (data.auctionId === auctionId && !isUnmountedRef.current) {
        setAuctionState(prev => ({
          ...prev,
          ...data.state,
          syncTime: timeSyncService.getServerTime()
        }));
      }
    });

    // New bid received
    const unsubBidUpdate = on('bid_update', (data) => {
      if (data.auctionId === auctionId && !isUnmountedRef.current) {
        setBids(prev => [data.bid, ...prev.slice(0, 49)]); // Keep last 50 bids
        
        if (data.newState) {
          setAuctionState(prev => ({
            ...prev,
            ...data.newState,
            syncTime: timeSyncService.getServerTime()
          }));
        }
      }
    });

    // New comment received
    const unsubCommentUpdate = on('comment_update', (data) => {
      if (data.auctionId === auctionId && !isUnmountedRef.current) {
        if (data.type === 'new_comment') {
          setComments(prev => [data.comment, ...prev.slice(0, 99)]); // Keep last 100 comments
        } else if (data.type === 'delete_comment') {
          setComments(prev => prev.filter(c => c.id !== data.commentId));
        }
      }
    });

    // Likes and follows updates
    const unsubStatsUpdate = on('stats_update', (data) => {
      if (data.auctionId === auctionId && !isUnmountedRef.current) {
        if (data.likes !== undefined) setLikes(data.likes);
        if (data.followers !== undefined) setFollowers(data.followers);
      }
    });

    // Participant count updates
    const unsubParticipantsUpdate = on('participants_update', (data) => {
      if (data.auctionId === auctionId && !isUnmountedRef.current) {
        setAuctionState(prev => ({
          ...prev,
          participantCount: data.count
        }));
      }
    });

    // Auction ended event
    const unsubAuctionEnded = on('auction_ended', (data) => {
      if (data.auctionId === auctionId && !isUnmountedRef.current) {
        setAuctionState(prev => ({
          ...prev,
          status: 'ended',
          timeRemaining: 0,
          isLive: false,
          ...data.finalState
        }));
      }
    });

    // Sync event from server
    const unsubSyncEvent = on('sync_update', (data) => {
      if (data.auctionId === auctionId && !isUnmountedRef.current) {
        const serverTime = timeSyncService.getServerTime();
        
        setAuctionState(prev => ({
          ...prev,
          ...data.state,
          syncTime: serverTime
        }));
        
        setLastSyncTime(new Date());
      }
    });

    // Connection status changes
    const unsubReconnected = on('reconnected', () => {
      if (isJoined && !isUnmountedRef.current) {
        // Rejoin room and sync
        setTimeout(() => {
          joinAuction();
          syncWithServer();
        }, 1000);
      }
    });

    return () => {
      // Clean up all listeners
      unsubAuctionUpdate?.();
      unsubBidUpdate?.();
      unsubCommentUpdate?.();
      unsubStatsUpdate?.();
      unsubParticipantsUpdate?.();
      unsubAuctionEnded?.();
      unsubSyncEvent?.();
      unsubReconnected?.();
    };
  }, [connected, auctionId, isJoined, on, joinAuction, syncWithServer]);

  // Auto-join auction room when connected
  useEffect(() => {
    if (connected && auctionId && autoJoin && !isJoined) {
      joinAuction();
    }
  }, [connected, auctionId, autoJoin, isJoined, joinAuction]);

  // Setup sync and heartbeat intervals
  useEffect(() => {
    if (!isJoined) return;

    // Sync interval
    if (syncInterval > 0) {
      syncIntervalRef.current = setInterval(() => {
        if (!isUnmountedRef.current) {
          syncWithServer();
        }
      }, syncInterval);
    }

    // Heartbeat interval
    if (heartbeatInterval > 0) {
      heartbeatIntervalRef.current = setInterval(() => {
        if (!isUnmountedRef.current) {
          sendHeartbeatPing();
        }
      }, heartbeatInterval);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [isJoined, syncInterval, heartbeatInterval, syncWithServer, sendHeartbeatPing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      
      if (isJoined) {
        leaveAuction();
      }
      
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [isJoined, leaveAuction]);

  // Calculate derived state
  const isActive = auctionState.status === 'active' && auctionState.timeRemaining > 0;
  const isUpcoming = auctionState.status === 'upcoming';
  const isEnded = auctionState.status === 'ended' || auctionState.timeRemaining <= 0;
  const isSynced = lastSyncTime && (Date.now() - lastSyncTime.getTime()) < syncInterval * 2;

  return {
    // State
    auctionState,
    bids,
    comments,
    likes,
    followers,
    
    // Connection status
    isJoined,
    connected,
    syncError,
    lastSyncTime,
    isSynced,
    
    // Derived state
    isActive,
    isUpcoming,
    isEnded,
    
    // Actions
    joinAuction,
    leaveAuction,
    syncWithServer,
    
    // For manual updates (used by other hooks)
    setAuctionState,
    setBids,
    setComments,
    setLikes,
    setFollowers
  };
};

export default useRealtime;