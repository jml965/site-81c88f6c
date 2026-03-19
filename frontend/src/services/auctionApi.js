// Mock data for development
const mockCategories = [
  { id: '1', name: 'سيارات', count: 45 },
  { id: '2', name: 'عقارات', count: 32 },
  { id: '3', name: 'مجوهرات', count: 28 },
  { id: '4', name: 'أنتيكات', count: 19 },
  { id: '5', name: 'لوحات فنية', count: 15 },
  { id: '6', name: 'ساعات', count: 23 },
  { id: '7', name: 'هواتف ذكية', count: 38 },
  { id: '8', name: 'كاميرات', count: 12 }
];

const mockLocations = [
  { id: '1', name: 'الرياض', count: 85 },
  { id: '2', name: 'جدة', count: 67 },
  { id: '3', name: 'الدمام', count: 42 },
  { id: '4', name: 'مكة المكرمة', count: 38 },
  { id: '5', name: 'المدينة المنورة', count: 29 },
  { id: '6', name: 'تبوك', count: 18 },
  { id: '7', name: 'الطائف', count: 25 },
  { id: '8', name: 'أبها', count: 16 }
];

const mockAuctions = [
  {
    id: '1',
    title: 'سيارة BMW X5 موديل 2020',
    description: 'سيارة BMW X5 في حالة ممتازة، فحص شامل، لون أزرق معدني، بحالة الوكالة',
    category: 'سيارات',
    status: 'active',
    currentPrice: 185000,
    startingPrice: 150000,
    minimumBid: 1000,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    location: 'الرياض',
    viewsCount: 1250,
    participantsCount: 28,
    bidCount: 45,
    likes: 89,
    isLiked: false,
    isFollowed: false,
    seller: {
      id: '1',
      name: 'محمد العلي',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      isVerified: true
    },
    winnerId: null
  },
  {
    id: '2',
    title: 'قلادة ذهبية مرصعة بالألماس',
    description: 'قلادة ذهبية عيار 18 مرصعة بالألماس الطبيعي، تصميم عصري وأنيق',
    category: 'مجوهرات',
    status: 'upcoming',
    currentPrice: 0,
    startingPrice: 25000,
    minimumBid: 500,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
    location: 'جدة',
    viewsCount: 890,
    participantsCount: 0,
    bidCount: 0,
    likes: 156,
    isLiked: true,
    isFollowed: false,
    seller: {
      id: '2',
      name: 'فاطمة أحمد',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      isVerified: true
    },
    winnerId: null
  },
  {
    id: '3',
    title: 'شقة 3 غرف وصالة في حي الملقا',
    description: 'شقة للبيع في حي الملقا، 3 غرف نوم وصالة، مساحة 120 متر مربع، دور ثالث',
    category: 'عقارات',
    status: 'active',
    currentPrice: 425000,
    startingPrice: 400000,
    minimumBid: 5000,
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    location: 'الرياض',
    viewsCount: 2100,
    participantsCount: 15,
    bidCount: 32,
    likes: 67,
    isLiked: false,
    isFollowed: true,
    seller: {
      id: '3',
      name: 'عبدالله السعيد',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.7,
      isVerified: true
    },
    winnerId: null
  },
  {
    id: '4',
    title: 'لوحة فنية أصلية للفنان محمد الرشيد',
    description: 'لوحة فنية زيتية أصلية بتوقيع الفنان محمد الرشيد، مقاس 80×60 سم',
    category: 'لوحات فنية',
    status: 'ended',
    currentPrice: 15000,
    startingPrice: 8000,
    minimumBid: 500,
    startTime: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    location: 'الدمام',
    viewsCount: 650,
    participantsCount: 12,
    bidCount: 28,
    likes: 45,
    isLiked: false,
    isFollowed: false,
    seller: {
      id: '4',
      name: 'سارة المطيري',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 4.6,
      isVerified: false
    },
    winnerId: 'user123'
  },
  {
    id: '5',
    title: 'ساعة رولكس سابمارينر أصلية',
    description: 'ساعة رولكس سابمارينر أصلية، موديل 2019، مع الشهادة والضمان',
    category: 'ساعات',
    status: 'active',
    currentPrice: 95000,
    startingPrice: 80000,
    minimumBid: 2000,
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=600&fit=crop',
    location: 'جدة',
    viewsCount: 1800,
    participantsCount: 22,
    bidCount: 38,
    likes: 134,
    isLiked: true,
    isFollowed: false,
    seller: {
      id: '5',
      name: 'خالد البلوي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      isVerified: true
    },
    winnerId: null
  },
  {
    id: '6',
    title: 'آيفون 14 برو ماكس 256GB',
    description: 'آيفون 14 برو ماكس، 256 جيجابايت، لون بنفسجي عميق، جديد في العلبة',
    category: 'هواتف ذكية',
    status: 'upcoming',
    currentPrice: 0,
    startingPrice: 4200,
    minimumBid: 100,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    location: 'الرياض',
    viewsCount: 950,
    participantsCount: 0,
    bidCount: 0,
    likes: 78,
    isLiked: false,
    isFollowed: true,
    seller: {
      id: '6',
      name: 'أحمد الغامدي',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      rating: 4.5,
      isVerified: true
    },
    winnerId: null
  },
  {
    id: '7',
    title: 'مجموعة كتب أثرية نادرة',
    description: 'مجموعة من الكتب الأثرية النادرة، بعضها من القرن السادس عشر، 12 كتاب',
    category: 'أنتيكات',
    status: 'active',
    currentPrice: 35000,
    startingPrice: 25000,
    minimumBid: 1000,
    startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    location: 'مكة المكرمة',
    viewsCount: 720,
    participantsCount: 18,
    bidCount: 25,
    likes: 92,
    isLiked: false,
    isFollowed: false,
    seller: {
      id: '7',
      name: 'عثمان الحارثي',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      isVerified: true
    },
    winnerId: null
  },
  {
    id: '8',
    title: 'كاميرا كانون EOS R5 احترافية',
    description: 'كاميرا كانون EOS R5 مع عدسة 24-70mm، استخدام خفيف، حالة ممتازة',
    category: 'كاميرات',
    status: 'upcoming',
    currentPrice: 0,
    startingPrice: 12000,
    minimumBid: 300,
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
    location: 'المدينة المنورة',
    viewsCount: 540,
    participantsCount: 0,
    bidCount: 0,
    likes: 63,
    isLiked: true,
    isFollowed: false,
    seller: {
      id: '8',
      name: 'نورا العتيبي',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4.7,
      isVerified: false
    },
    winnerId: null
  }
];

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate network errors occasionally
const shouldSimulateError = () => {
  return Math.random() < 0.05; // 5% chance of error
};

const auctionApi = {
  // Get auctions with filtering, sorting, and pagination
  async getAuctions(params = {}) {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('فشل في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    }

    let filtered = [...mockAuctions];
    const {
      search,
      category,
      status,
      location,
      minPrice,
      maxPrice,
      dateRange,
      startDate,
      endDate,
      sellerRating,
      sort = 'newest',
      page = 1,
      limit = 12
    } = params;

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(searchLower) ||
        auction.description.toLowerCase().includes(searchLower) ||
        auction.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (category) {
      const categoryName = mockCategories.find(c => c.id === category)?.name;
      if (categoryName) {
        filtered = filtered.filter(auction => auction.category === categoryName);
      }
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter(auction => auction.status === status);
    }

    // Apply location filter
    if (location) {
      const locationName = mockLocations.find(l => l.id === location)?.name;
      if (locationName) {
        filtered = filtered.filter(auction => auction.location === locationName);
      }
    }

    // Apply price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filtered = filtered.filter(auction => {
        const price = auction.currentPrice || auction.startingPrice;
        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;
        return true;
      });
    }

    // Apply date range filter
    if (dateRange) {
      const now = new Date();
      let filterDate;
      
      switch (dateRange) {
        case 'today':
          filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          filtered = filtered.filter(auction => 
            new Date(auction.startTime) >= filterDate
          );
          break;
        case 'this_week':
          const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
          filtered = filtered.filter(auction => 
            new Date(auction.startTime) >= weekStart
          );
          break;
        case 'this_month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(auction => 
            new Date(auction.startTime) >= monthStart
          );
          break;
        case 'custom':
          if (startDate) {
            filtered = filtered.filter(auction => 
              new Date(auction.startTime) >= new Date(startDate)
            );
          }
          if (endDate) {
            filtered = filtered.filter(auction => 
              new Date(auction.startTime) <= new Date(endDate + 'T23:59:59')
            );
          }
          break;
      }
    }

    // Apply seller rating filter
    if (sellerRating) {
      const minRating = parseFloat(sellerRating);
      filtered = filtered.filter(auction => auction.seller.rating >= minRating);
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        break;
      case 'ending_soon':
        filtered = filtered.filter(a => a.status === 'active');
        filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.currentPrice || b.startingPrice) - (a.currentPrice || a.startingPrice));
        break;
      case 'price_low':
        filtered.sort((a, b) => (a.currentPrice || a.startingPrice) - (b.currentPrice || b.startingPrice));
        break;
      case 'most_bids':
        filtered.sort((a, b) => b.bidCount - a.bidCount);
        break;
      case 'most_viewed':
        filtered.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      case 'most_participants':
        filtered.sort((a, b) => b.participantsCount - a.participantsCount);
        break;
      case 'highest_rated':
        filtered.sort((a, b) => b.seller.rating - a.seller.rating);
        break;
      default:
        // Default to newest
        filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    }

    // Apply pagination
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filtered.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    return {
      data: paginatedResults,
      meta: {
        total,
        page,
        limit,
        hasMore,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Get single auction by ID
  async getAuction(id) {
    await delay(200);
    
    if (shouldSimulateError()) {
      throw new Error('فشل في تحميل بيانات المزاد');
    }

    const auction = mockAuctions.find(a => a.id === id);
    if (!auction) {
      throw new Error('المزاد غير موجود');
    }

    return { data: auction };
  },

  // Get categories with counts
  async getCategories() {
    await delay(100);
    return { data: mockCategories };
  },

  // Get locations with counts
  async getLocations() {
    await delay(100);
    return { data: mockLocations };
  },

  // Like/unlike auction
  async likeAuction(id) {
    await delay(200);
    
    if (shouldSimulateError()) {
      throw new Error('فشل في تحديث الإعجاب');
    }

    // In real implementation, this would make an API call
    // For now, we just simulate success
    return { success: true };
  },

  // Follow/unfollow auction
  async followAuction(id) {
    await delay(200);
    
    if (shouldSimulateError()) {
      throw new Error('فشل في تحديث المتابعة');
    }

    return { success: true };
  },

  // Report auction
  async reportAuction(id, reason, description) {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('فشل في إرسال البلاغ');
    }

    return { success: true, message: 'تم إرسال البلاغ بنجاح' };
  },

  // Get trending searches
  async getTrendingSearches() {
    await delay(150);
    
    const trending = [
      'سيارات BMW',
      'مجوهرات ذهب',
      'عقارات الرياض',
      'ساعات رولكس',
      'لوحات فنية',
      'أنتيكات نادرة',
      'هواتف آيفون',
      'كاميرات كانون'
    ];

    return { data: trending };
  },

  // Get auction statistics
  async getAuctionStats() {
    await delay(200);
    
    const stats = {
      totalAuctions: mockAuctions.length,
      activeAuctions: mockAuctions.filter(a => a.status === 'active').length,
      upcomingAuctions: mockAuctions.filter(a => a.status === 'upcoming').length,
      endedAuctions: mockAuctions.filter(a => a.status === 'ended').length,
      totalBids: mockAuctions.reduce((sum, a) => sum + a.bidCount, 0),
      totalViews: mockAuctions.reduce((sum, a) => sum + a.viewsCount, 0),
      totalParticipants: mockAuctions.reduce((sum, a) => sum + a.participantsCount, 0),
      averagePrice: mockAuctions.reduce((sum, a) => sum + (a.currentPrice || a.startingPrice), 0) / mockAuctions.length
    };

    return { data: stats };
  },

  // Search suggestions
  async getSearchSuggestions(query) {
    await delay(100);
    
    if (!query || query.length < 2) {
      return { data: [] };
    }

    const suggestions = mockAuctions
      .filter(auction => 
        auction.title.toLowerCase().includes(query.toLowerCase()) ||
        auction.description.toLowerCase().includes(query.toLowerCase()) ||
        auction.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8)
      .map(auction => ({
        id: auction.id,
        title: auction.title,
        category: auction.category,
        type: 'auction'
      }));

    // Add category suggestions
    const categorySuggestions = mockCategories
      .filter(cat => cat.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(cat => ({
        id: cat.id,
        title: cat.name,
        type: 'category'
      }));

    return { 
      data: [...suggestions, ...categorySuggestions].slice(0, 10)
    };
  }
};

export default auctionApi;