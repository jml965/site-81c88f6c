import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

// Mock data for development
const MOCK_AUCTION_DATA = {
  id: '1',
  title: 'مزاد سيارة فولكس واجن 2020',
  description: 'سيارة فولكس واجن في حالة ممتازة، مستعملة بعناية',
  videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
  thumbnailUrl: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
  duration: 1800, // 30 minutes
  startingPrice: 15000,
  currentPrice: 18500,
  minimumIncrement: 250,
  status: 'active',
  startTime: new Date(Date.now() - 600000), // Started 10 minutes ago
  endTime: new Date(Date.now() + 1200000), // Ends in 20 minutes
  likesCount: 142,
  highestBidder: {
    id: 'user456',
    name: 'محمد الأحمد',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  timelineEvents: [
    {
      id: 'event1',
      timestamp: 300,
      title: 'عرض المحرك',
      description: 'فحص تفصيلي لحالة المحرك',
      type: 'highlight'
    },
    {
      id: 'event2',
      timestamp: 600,
      title: 'جولة داخلية',
      description: 'استعراض مقصورة السيارة',
      type: 'highlight'
    },
    {
      id: 'event3',
      timestamp: 900,
      title: 'اختبار القيادة',
      description: 'عرض أداء السيارة على الطريق',
      type: 'milestone'
    }
  ]
};

const MOCK_PARTICIPANTS = [
  {
    id: 'user123',
    name: 'أحمد محمد',
    displayName: 'أحمد م.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    totalBids: 8,
    highestBid: 18500,
    joinTime: new Date(Date.now() - 480000),
    lastBidTime: new Date(Date.now() - 120000)
  },
  {
    id: 'user456',
    name: 'محمد الأحمد',
    displayName: 'محمد الأ.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    totalBids: 12,
    highestBid: 18000,
    joinTime: new Date(Date.now() - 720000),
    lastBidTime: new Date(Date.now() - 300000)
  },
  {
    id: 'user789',
    name: 'سالم العلي',
    displayName: 'سالم الع.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    totalBids: 5,
    highestBid: 17500,
    joinTime: new Date(Date.now() - 600000),
    lastBidTime: new Date(Date.now() - 600000)
  },
  {
    id: 'user101',
    name: 'خالد الشمري',
    displayName: 'خالد الش.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    totalBids: 3,
    highestBid: 16800,
    joinTime: new Date(Date.now() - 300000),
    lastBidTime: new Date(Date.now() - 240000)
  },
  {
    id: 'user202',
    name: 'عبدالله الدوسري',
    displayName: 'عبدالله الد.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    totalBids: 1,
    highestBid: 15500,
    joinTime: new Date(Date.now() - 180000),
    lastBidTime: new Date(Date.now() - 180000)
  }
];

const MOCK_BID_HISTORY = [
  {
    id: 'bid1',
    amount: 18500,
    timestamp: 1080, // 18 minutes into auction
    bidder: { id: 'user123', name: 'أحمد محمد', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
  },
  {
    id: 'bid2',
    amount: 18000,
    timestamp: 900,
    bidder: { id: 'user456', name: 'محمد الأحمد', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }
  },
  {
    id: 'bid3',
    amount: 17500,
    timestamp: 720,
    bidder: { id: 'user789', name: 'سالم العلي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
  },
  {
    id: 'bid4',
    amount: 17000,
    timestamp: 540,
    bidder: { id: 'user101', name: 'خالد الشمري', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face' }
  },
  {
    id: 'bid5',
    amount: 16500,
    timestamp: 360,
    bidder: { id: 'user456', name: 'محمد الأحمد', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }
  },
  {
    id: 'bid6',
    amount: 16000,
    timestamp: 240,
    bidder: { id: 'user123', name: 'أحمد محمد', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
  },
  {
    id: 'bid7',
    amount: 15500,
    timestamp: 120,
    bidder: { id: 'user202', name: 'عبدالله الدوسري', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' }
  },
  {
    id: 'bid8',
    amount: 15000,
    timestamp: 60,
    bidder: { id: 'user789', name: 'سالم العلي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
  }
];

const MOCK_COMMENTS = [
  {
    id: 'comment1',
    content: 'السيارة في حالة ممتازة! 👍',
    timestamp: '2 د',
    user: {
      id: 'user456',
      name: 'محمد الأحمد',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: 'comment2',
    content: 'كم عدد الكيلومترات؟',
    timestamp: '5 د',
    user: {
      id: 'user789',
      name: 'سالم العلي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: 'comment3',
    content: 'هل تم فحصها في الوكالة؟',
    timestamp: '7 د',
    user: {
      id: 'user101',
      name: 'خالد الشمري',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: 'comment4',
    content: 'اللون جميل جداً 🚗',
    timestamp: '10 د',
    user: {
      id: 'user202',
      name: 'عبدالله الدوسري',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face'
    }
  }
];

export default function useAuctionSync(auctionId) {
  const [auctionData, setAuctionData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const syncIntervalRef = useRef(null);
  const auctionStartTimeRef = useRef(null);

  // Calculate auction time based on server sync
  const calculateAuctionTime = useCallback(() => {
    if (!auctionData || !auctionStartTimeRef.current) return 0;
    
    const now = new Date();
    const elapsed = (now - auctionStartTimeRef.current) / 1000;
    return Math.max(0, Math.min(elapsed, auctionData.duration));
  }, [auctionData]);

  // Update current time and progress
  const updateTimeAndProgress = useCallback(() => {
    if (!auctionData) return;
    
    const newCurrentTime = calculateAuctionTime();
    const progress = (newCurrentTime / auctionData.duration) * 100;
    const remaining = Math.max(0, (auctionData.endTime - new Date()) / 1000);
    
    setCurrentTime(newCurrentTime);
    setSyncProgress(progress);
    setTimeLeft(Math.floor(remaining));
    
    // Auto-play video when auction is active
    if (auctionData.status === 'active' && remaining > 0) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [auctionData, calculateAuctionTime]);

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    if (socketRef.current) return;
    
    try {
      socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
        transports: ['websocket'],
        timeout: 10000
      });
      
      socketRef.current.on('connect', () => {
        console.log('Connected to auction server');
        setIsConnected(true);
        socketRef.current.emit('join-auction', { auctionId });
      });
      
      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from auction server');
        setIsConnected(false);
      });
      
      socketRef.current.on('auction-sync', (data) => {
        console.log('Auction sync received:', data);
        setAuctionData(prev => ({ ...prev, ...data }));
        if (data.serverTime && data.auctionStartTime) {
          auctionStartTimeRef.current = new Date(data.auctionStartTime);
        }
      });
      
      socketRef.current.on('new-bid', (bidData) => {
        console.log('New bid received:', bidData);
        setBidHistory(prev => [bidData, ...prev]);
        setAuctionData(prev => ({
          ...prev,
          currentPrice: bidData.amount,
          highestBidder: bidData.bidder
        }));
        
        // Update participant data
        setParticipants(prev => 
          prev.map(p => 
            p.id === bidData.bidder.id 
              ? { ...p, highestBid: bidData.amount, totalBids: (p.totalBids || 0) + 1, lastBidTime: new Date() }
              : p
          )
        );
      });
      
      socketRef.current.on('new-comment', (commentData) => {
        console.log('New comment received:', commentData);
        setComments(prev => [commentData, ...prev]);
      });
      
      socketRef.current.on('participant-joined', (participantData) => {
        console.log('Participant joined:', participantData);
        setParticipants(prev => {
          if (prev.find(p => p.id === participantData.id)) return prev;
          return [...prev, participantData];
        });
      });
      
      socketRef.current.on('participant-left', (participantId) => {
        console.log('Participant left:', participantId);
        setParticipants(prev => prev.filter(p => p.id !== participantId));
      });
      
      socketRef.current.on('participants-update', (participantsList) => {
        console.log('Participants update received:', participantsList);
        setParticipants(participantsList);
      });
      
      socketRef.current.on('error', (errorData) => {
        console.error('Socket error:', errorData);
        setError(errorData.message || 'Connection error');
      });
      
    } catch (err) {
      console.error('Socket initialization error:', err);
      setError('Failed to connect to auction server');
    }
  }, [auctionId]);

  // Load auction data (mock for now)
  const loadAuctionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for now
      setAuctionData(MOCK_AUCTION_DATA);
      setParticipants(MOCK_PARTICIPANTS);
      setBidHistory(MOCK_BID_HISTORY);
      setComments(MOCK_COMMENTS);
      
      // Set auction start time for sync
      auctionStartTimeRef.current = MOCK_AUCTION_DATA.startTime;
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to load auction data:', err);
      setError('Failed to load auction data');
      setLoading(false);
    }
  }, []);

  // Place bid function
  const placeBid = useCallback(async (amount) => {
    if (!socketRef.current || !isConnected) {
      throw new Error('Not connected to auction server');
    }
    
    if (!auctionData || auctionData.status !== 'active') {
      throw new Error('Auction is not active');
    }
    
    if (amount < auctionData.currentPrice + auctionData.minimumIncrement) {
      throw new Error(`Minimum bid is ${auctionData.currentPrice + auctionData.minimumIncrement}`);
    }
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Bid timeout'));
      }, 5000);
      
      socketRef.current.emit('place-bid', { auctionId, amount }, (response) => {
        clearTimeout(timeout);
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to place bid'));
        }
      });
    });
  }, [auctionId, auctionData, isConnected]);

  // Add comment function
  const addComment = useCallback(async (content) => {
    if (!socketRef.current || !isConnected) {
      throw new Error('Not connected to server');
    }
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Comment timeout'));
      }, 5000);
      
      socketRef.current.emit('add-comment', { auctionId, content }, (response) => {
        clearTimeout(timeout);
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to add comment'));
        }
      });
    });
  }, [auctionId, isConnected]);

  // Toggle like function
  const toggleLike = useCallback(async () => {
    if (!socketRef.current || !isConnected) {
      throw new Error('Not connected to server');
    }
    
    return new Promise((resolve, reject) => {
      socketRef.current.emit('toggle-like', { auctionId }, (response) => {
        if (response.success) {
          setAuctionData(prev => ({
            ...prev,
            likesCount: response.likesCount,
            isLiked: response.isLiked
          }));
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to toggle like'));
        }
      });
    });
  }, [auctionId, isConnected]);

  // Toggle follow function
  const toggleFollow = useCallback(async () => {
    if (!socketRef.current || !isConnected) {
      throw new Error('Not connected to server');
    }
    
    return new Promise((resolve, reject) => {
      socketRef.current.emit('toggle-follow', { auctionId }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to toggle follow'));
        }
      });
    });
  }, [auctionId, isConnected]);

  // Report auction function
  const reportAuction = useCallback(async (reason) => {
    if (!socketRef.current || !isConnected) {
      throw new Error('Not connected to server');
    }
    
    return new Promise((resolve, reject) => {
      socketRef.current.emit('report-auction', { auctionId, reason }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.message || 'Failed to report auction'));
        }
      });
    });
  }, [auctionId, isConnected]);

  // Initialize on mount
  useEffect(() => {
    loadAuctionData();
    initializeSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [auctionId, loadAuctionData, initializeSocket]);

  // Start sync timer when auction data is loaded
  useEffect(() => {
    if (auctionData && auctionStartTimeRef.current) {
      // Initial time calculation
      updateTimeAndProgress();
      
      // Start sync interval
      syncIntervalRef.current = setInterval(updateTimeAndProgress, 1000);
      
      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
        }
      };
    }
  }, [auctionData, updateTimeAndProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-auction', { auctionId });
        socketRef.current.disconnect();
      }
    };
  }, [auctionId]);

  return {
    auctionData,
    currentTime,
    isPlaying,
    syncProgress,
    timeLeft,
    participants,
    bidHistory,
    comments,
    isConnected,
    loading,
    error,
    placeBid,
    addComment,
    toggleLike,
    toggleFollow,
    reportAuction
  };
}