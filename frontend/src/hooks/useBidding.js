import { useState, useEffect, useCallback, useRef } from 'react';
import { bidApi } from '../services/bidApi';
import { validateBid } from '../utils/bidValidation';

// Custom hook for managing bidding functionality
export const useBidding = (auctionId) => {
  const [bids, setBids] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!auctionId) return;

    const connectWebSocket = () => {
      try {
        const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/auction/${auctionId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connected for auction:', auctionId);
          setIsConnected(true);
          setError(null);
          reconnectAttempts.current = 0;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.reason);
          setIsConnected(false);
          
          // Attempt to reconnect
          if (reconnectAttempts.current < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
            reconnectTimeout.current = setTimeout(() => {
              reconnectAttempts.current++;
              console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`);
              connectWebSocket();
            }, delay);
          } else {
            setError('فقد الاتصال مع الخادم. يرجى إعادة تحديث الصفحة.');
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('خطأ في الاتصال');
        };

        setSocket(ws);
        return ws;
      } catch (err) {
        console.error('Failed to connect WebSocket:', err);
        setError('فشل في الاتصال بالخادم');
        return null;
      }
    };

    const ws = connectWebSocket();

    // Cleanup
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [auctionId]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    switch (data.type) {
      case 'NEW_BID':
        setBids(prev => {
          const newBids = [data.bid, ...prev.filter(b => b.id !== data.bid.id)];
          return newBids.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        });
        setCurrentPrice(data.bid.amount);
        break;

      case 'BID_UPDATE':
        setBids(prev => prev.map(bid => 
          bid.id === data.bid.id ? { ...bid, ...data.bid } : bid
        ));
        break;

      case 'AUCTION_STATS':
        setStats(data.stats);
        break;

      case 'PRICE_UPDATE':
        setCurrentPrice(data.price);
        break;

      case 'AUCTION_ENDED':
        setError('انتهى المزاد');
        break;

      case 'ERROR':
        setError(data.message);
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  // Fetch initial bids and auction data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!auctionId) return;

      try {
        setIsLoading(true);
        setError(null);

        const [bidsResponse, statsResponse] = await Promise.all([
          bidApi.getBids(auctionId),
          bidApi.getAuctionStats(auctionId)
        ]);

        if (bidsResponse.success) {
          setBids(bidsResponse.data.bids || []);
          setCurrentPrice(bidsResponse.data.currentPrice || 0);
        }

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('خطأ في تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [auctionId]);

  // Place a bid
  const placeBid = useCallback(async (amount) => {
    if (!auctionId) {
      throw new Error('معرف المزاد غير صحيح');
    }

    // Validate bid locally first
    const validation = validateBid(amount, currentPrice);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    try {
      const response = await bidApi.placeBid(auctionId, amount);
      
      if (!response.success) {
        throw new Error(response.error || 'فشل في تسجيل المزايدة');
      }

      // The bid will be updated via WebSocket
      return response.data;
    } catch (err) {
      console.error('Error placing bid:', err);
      
      if (err.message.includes('401')) {
        throw new Error('يجب تسجيل الدخول للمزايدة');
      } else if (err.message.includes('403')) {
        throw new Error('غير مسموح لك بالمزايدة في هذا المزاد');
      } else if (err.message.includes('409')) {
        throw new Error('تم تجاوز مزايدتك بالفعل. حاول مرة أخرى بمبلغ أعلى');
      } else {
        throw new Error(err.message || 'حدث خطأ أثناء تسجيل المزايدة');
      }
    }
  }, [auctionId, currentPrice]);

  // Get user's bids
  const getUserBids = useCallback((userId) => {
    return bids.filter(bid => bid.userId === userId);
  }, [bids]);

  // Get bid statistics
  const getBidStats = useCallback(() => {
    if (bids.length === 0) {
      return {
        totalBids: 0,
        participants: 0,
        averageBid: 0,
        highestBid: 0,
        lowestBid: 0,
        bidRange: 0
      };
    }

    const amounts = bids.map(bid => bid.amount);
    const uniqueUsers = new Set(bids.map(bid => bid.userId));
    
    return {
      totalBids: bids.length,
      participants: uniqueUsers.size,
      averageBid: amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length,
      highestBid: Math.max(...amounts),
      lowestBid: Math.min(...amounts),
      bidRange: Math.max(...amounts) - Math.min(...amounts)
    };
  }, [bids]);

  // Check if user has active bid
  const hasActiveBid = useCallback((userId) => {
    const userBids = getUserBids(userId);
    return userBids.length > 0 && userBids[0].amount === currentPrice;
  }, [getUserBids, currentPrice]);

  // Get user's highest bid
  const getUserHighestBid = useCallback((userId) => {
    const userBids = getUserBids(userId);
    if (userBids.length === 0) return null;
    
    return userBids.reduce((highest, bid) => 
      bid.amount > highest.amount ? bid : highest
    );
  }, [getUserBids]);

  // Retry connection
  const retryConnection = useCallback(() => {
    if (socket) {
      socket.close();
    }
    reconnectAttempts.current = 0;
    setError(null);
  }, [socket]);

  // Send heartbeat to keep connection alive
  useEffect(() => {
    if (!socket || !isConnected) return;

    const heartbeat = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'HEARTBEAT' }));
      }
    }, 30000); // Send heartbeat every 30 seconds

    return () => clearInterval(heartbeat);
  }, [socket, isConnected]);

  return {
    // State
    bids,
    currentPrice,
    isLoading,
    error,
    stats,
    isConnected,
    
    // Actions
    placeBid,
    retryConnection,
    
    // Utilities
    getUserBids,
    getBidStats,
    hasActiveBid,
    getUserHighestBid
  };
};

export default useBidding;