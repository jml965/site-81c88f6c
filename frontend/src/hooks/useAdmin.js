import { useState, useEffect, useCallback } from 'react';

// Mock data for admin functionality
const mockStats = {
  totalUsers: 15420,
  totalAuctions: 1250,
  totalBids: 28540,
  totalRevenue: 2450000,
  activeAuctions: 45,
  todayViews: 8920,
  todayBids: 340,
  todayRevenue: 45600,
  pendingReports: 12,
  totalComments: 5670
};

const mockAuctions = [
  {
    id: '1',
    title: 'ساعة رولكس أصلية - حالة ممتازة',
    category: 'jewelry',
    status: 'live',
    startingPrice: 25000,
    currentBid: 45000,
    createdAt: new Date('2024-01-15'),
    endDate: new Date('2024-01-20'),
    coverImage: 'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=400&h=300&fit=crop',
    seller: { id: '1', name: 'محمد أحمد' },
    bids: new Array(23).fill(null).map((_, i) => ({ id: i })),
    views: 1250
  },
  {
    id: '2',
    title: 'سيارة BMW X5 موديل 2022',
    category: 'vehicles',
    status: 'scheduled',
    startingPrice: 180000,
    currentBid: null,
    createdAt: new Date('2024-01-14'),
    endDate: new Date('2024-01-22'),
    coverImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    seller: { id: '2', name: 'سارة محمد' },
    bids: [],
    views: 890
  },
  {
    id: '3',
    title: 'لوحة فنية نادرة من القرن التاسع عشر',
    category: 'art',
    status: 'pending',
    startingPrice: 50000,
    currentBid: null,
    createdAt: new Date('2024-01-13'),
    endDate: new Date('2024-01-25'),
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    seller: { id: '3', name: 'خالد العتيبي' },
    bids: [],
    views: 567
  },
  {
    id: '4',
    title: 'جهاز iPhone 15 Pro Max جديد',
    category: 'electronics',
    status: 'live',
    startingPrice: 4500,
    currentBid: 5200,
    createdAt: new Date('2024-01-12'),
    endDate: new Date('2024-01-18'),
    coverImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    seller: { id: '4', name: 'عبدالله الشمري' },
    bids: new Array(18).fill(null).map((_, i) => ({ id: i })),
    views: 2100
  },
  {
    id: '5',
    title: 'شقة للبيع في الرياض - حي النخيل',
    category: 'real-estate',
    status: 'ended',
    startingPrice: 650000,
    currentBid: 720000,
    createdAt: new Date('2024-01-10'),
    endDate: new Date('2024-01-17'),
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    seller: { id: '5', name: 'نورا القحطاني' },
    bids: new Array(31).fill(null).map((_, i) => ({ id: i })),
    views: 3400
  }
];

const mockUsers = [
  {
    id: '1',
    name: 'محمد أحمد العلي',
    email: 'mohammed.ali@email.com',
    phone: '+966501234567',
    role: 'seller',
    status: 'active',
    createdAt: new Date('2023-12-15'),
    avatar: null,
    auctions: new Array(8).fill(null).map((_, i) => ({ id: i })),
    bids: new Array(23).fill(null).map((_, i) => ({ id: i }))
  },
  {
    id: '2',
    name: 'سارة محمد الشمري',
    email: 'sara.shamri@email.com',
    phone: '+966507654321',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-02'),
    avatar: null,
    auctions: new Array(3).fill(null).map((_, i) => ({ id: i })),
    bids: new Array(45).fill(null).map((_, i) => ({ id: i }))
  },
  {
    id: '3',
    name: 'خالد العتيبي',
    email: 'khalid.otaibi@email.com',
    phone: '+966509876543',
    role: 'seller',
    status: 'suspended',
    createdAt: new Date('2023-11-20'),
    avatar: null,
    auctions: new Array(12).fill(null).map((_, i) => ({ id: i })),
    bids: new Array(67).fill(null).map((_, i) => ({ id: i }))
  },
  {
    id: '4',
    name: 'عبدالله الشمري',
    email: 'abdullah.shamri@email.com',
    phone: '+966502345678',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    avatar: null,
    auctions: [],
    bids: new Array(12).fill(null).map((_, i) => ({ id: i }))
  },
  {
    id: '5',
    name: 'نورا القحطاني',
    email: 'nora.qahtani@email.com',
    phone: '+966508765432',
    role: 'seller',
    status: 'active',
    createdAt: new Date('2023-10-12'),
    avatar: null,
    auctions: new Array(15).fill(null).map((_, i) => ({ id: i })),
    bids: new Array(89).fill(null).map((_, i) => ({ id: i }))
  }
];

const mockBids = [
  {
    id: '1',
    amount: 45000,
    createdAt: new Date('2024-01-16T10:30:00'),
    auction: { id: '1', title: 'ساعة رولكس أصلية' },
    user: { id: '2', name: 'سارة محمد' }
  },
  {
    id: '2',
    amount: 5200,
    createdAt: new Date('2024-01-16T09:15:00'),
    auction: { id: '4', title: 'جهاز iPhone 15 Pro Max' },
    user: { id: '4', name: 'عبدالله الشمري' }
  }
];

const mockReports = {
  overview: {
    totalAuctions: 1250,
    totalUsers: 15420,
    totalRevenue: 2450000,
    totalBids: 28540,
    auctionsGrowth: 12.5,
    usersGrowth: 8.3,
    revenueGrowth: 15.7,
    bidsGrowth: 22.1
  },
  auctions: {
    live: 45,
    completed: 1150,
    scheduled: 55,
    successRate: 87.2,
    topCategories: [
      { name: 'المجوهرات', count: 320, totalValue: 850000 },
      { name: 'المركبات', count: 280, totalValue: 1200000 },
      { name: 'الإلكترونيات', count: 250, totalValue: 450000 },
      { name: 'العقارات', count: 180, totalValue: 2100000 },
      { name: 'الفن والتحف', count: 120, totalValue: 320000 }
    ]
  },
  users: {
    active: 12340,
    newRegistrations: 1250,
    sellers: 890,
    retentionRate: 78.5
  },
  revenue: {
    commissions: 245000,
    subscriptions: 89000,
    averageTransactionValue: 8500
  },
  performance: {
    totalViews: 456000,
    engagementRate: 23.4,
    averageBidsPerAuction: 22.8,
    averageSessionDuration: 12.5
  }
};

const mockSystemHealth = {
  database: 'healthy',
  redis: 'healthy',
  websocket: 'healthy'
};

export function useAdmin() {
  const [stats, setStats] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBids, setRecentBids] = useState([]);
  const [reports, setReports] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API calls with delays
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      await delay(800); // Simulate API delay
      setStats(mockStats);
      setError(null);
    } catch (err) {
      setError('فشل في تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuctions = useCallback(async () => {
    try {
      await delay(600);
      setAuctions(mockAuctions);
      setRecentAuctions(mockAuctions.slice(0, 5));
    } catch (err) {
      setError('فشل في تحميل المزادات');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      await delay(500);
      setUsers(mockUsers);
      setRecentUsers(mockUsers.slice(0, 5));
    } catch (err) {
      setError('فشل في تحميل المستخدمين');
    }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      await delay(700);
      setReports(mockReports);
      setRecentBids(mockBids);
    } catch (err) {
      setError('فشل في تحميل التقارير');
    }
  }, []);

  const fetchSystemHealth = useCallback(async () => {
    try {
      await delay(300);
      setSystemHealth(mockSystemHealth);
    } catch (err) {
      console.error('Failed to fetch system health:', err);
    }
  }, []);

  // CRUD operations
  const deleteAuction = useCallback(async (auctionId) => {
    try {
      await delay(500);
      setAuctions(prev => prev.filter(auction => auction.id !== auctionId));
      setRecentAuctions(prev => prev.filter(auction => auction.id !== auctionId));
      // Update stats
      setStats(prev => ({
        ...prev,
        totalAuctions: prev.totalAuctions - 1
      }));
    } catch (err) {
      throw new Error('فشل في حذف المزاد');
    }
  }, []);

  const updateAuctionStatus = useCallback(async (auctionId, status) => {
    try {
      await delay(400);
      setAuctions(prev => prev.map(auction => 
        auction.id === auctionId 
          ? { ...auction, status }
          : auction
      ));
      setRecentAuctions(prev => prev.map(auction => 
        auction.id === auctionId 
          ? { ...auction, status }
          : auction
      ));
    } catch (err) {
      throw new Error('فشل في تحديث حالة المزاد');
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      await delay(500);
      setUsers(prev => prev.filter(user => user.id !== userId));
      setRecentUsers(prev => prev.filter(user => user.id !== userId));
      // Update stats
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1
      }));
    } catch (err) {
      throw new Error('فشل في حذف المستخدم');
    }
  }, []);

  const updateUserStatus = useCallback(async (userId, status) => {
    try {
      await delay(400);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status }
          : user
      ));
      setRecentUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status }
          : user
      ));
    } catch (err) {
      throw new Error('فشل في تحديث حالة المستخدم');
    }
  }, []);

  const updateUserRole = useCallback(async (userId, role) => {
    try {
      await delay(400);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role }
          : user
      ));
      setRecentUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role }
          : user
      ));
    } catch (err) {
      throw new Error('فشل في تحديث دور المستخدم');
    }
  }, []);

  const generateReport = useCallback(async (params) => {
    try {
      await delay(1000);
      // In a real app, this would generate and download a report file
      console.log('Generating report with params:', params);
      // Simulate successful report generation
      return { success: true, downloadUrl: '/reports/export.pdf' };
    } catch (err) {
      throw new Error('فشل في إنشاء التقرير');
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchStats(),
        fetchAuctions(),
        fetchUsers(),
        fetchReports(),
        fetchSystemHealth()
      ]);
    };

    initializeData();
  }, [fetchStats, fetchAuctions, fetchUsers, fetchReports, fetchSystemHealth]);

  return {
    // Data
    stats,
    auctions,
    users,
    recentAuctions,
    recentUsers,
    recentBids,
    reports,
    systemHealth,
    
    // State
    loading,
    error,
    
    // Actions
    deleteAuction,
    updateAuctionStatus,
    deleteUser,
    updateUserStatus,
    updateUserRole,
    generateReport,
    
    // Refresh functions
    refetchStats: fetchStats,
    refetchAuctions: fetchAuctions,
    refetchUsers: fetchUsers,
    refetchReports: fetchReports
  };
}