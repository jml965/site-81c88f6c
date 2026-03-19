import { useState, useEffect, useCallback } from 'react';

const useSeller = (sellerId = null) => {
  const [seller, setSeller] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    scheduledAuctions: 0,
    endedAuctions: 0,
    cancelledAuctions: 0,
    totalRevenue: 0,
    totalBidders: 0,
    averagePrice: 0,
    topAuction: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current seller ID from token or props
  const getCurrentSellerId = useCallback(() => {
    if (sellerId) return sellerId;
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sellerId || payload.userId;
      } catch (e) {
        console.error('Invalid token:', e);
        return null;
      }
    }
    return null;
  }, [sellerId]);

  // Fetch seller profile
  const fetchSeller = useCallback(async () => {
    const currentSellerId = getCurrentSellerId();
    if (!currentSellerId) {
      setError('لم يتم العثور على معرف البائع');
      return;
    }

    try {
      const response = await fetch(`/api/sellers/${currentSellerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSeller(data);
      } else if (response.status === 404) {
        setError('لم يتم العثور على حساب البائع');
      } else {
        throw new Error('فشل في تحميل بيانات البائع');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل بيانات البائع');
    }
  }, [getCurrentSellerId]);

  // Fetch seller auctions
  const fetchAuctions = useCallback(async (filters = {}) => {
    const currentSellerId = getCurrentSellerId();
    if (!currentSellerId) return;

    try {
      const params = new URLSearchParams({
        sellerId: currentSellerId,
        limit: filters.limit || 50,
        ...filters
      });

      const response = await fetch(`/api/auctions?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuctions(data.auctions || []);
        
        // Update stats from auctions data
        updateStatsFromAuctions(data.auctions || []);
      } else {
        throw new Error('فشل في تحميل المزادات');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل المزادات');
    }
  }, [getCurrentSellerId]);

  // Fetch seller statistics
  const fetchStats = useCallback(async () => {
    const currentSellerId = getCurrentSellerId();
    if (!currentSellerId) return;

    try {
      const response = await fetch(`/api/sellers/${currentSellerId}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({ ...prev, ...data }));
      } else {
        // If stats endpoint doesn't exist, calculate from auctions
        console.warn('Stats endpoint not available, calculating from auctions');
      }
    } catch (err) {
      console.warn('Error fetching stats:', err);
    }
  }, [getCurrentSellerId]);

  // Update stats from auctions data
  const updateStatsFromAuctions = useCallback((auctionsData) => {
    const totalAuctions = auctionsData.length;
    const activeAuctions = auctionsData.filter(a => a.status === 'active').length;
    const scheduledAuctions = auctionsData.filter(a => a.status === 'scheduled').length;
    const endedAuctions = auctionsData.filter(a => a.status === 'ended').length;
    const cancelledAuctions = auctionsData.filter(a => a.status === 'cancelled').length;
    
    const totalRevenue = auctionsData
      .filter(a => a.status === 'ended' && a.winnerId)
      .reduce((sum, a) => sum + (a.currentPrice || 0), 0);
    
    const totalBidders = new Set(
      auctionsData.flatMap(a => a.bids?.map(b => b.userId) || [])
    ).size;
    
    const averagePrice = endedAuctions > 0 
      ? totalRevenue / endedAuctions 
      : 0;
    
    const topAuction = auctionsData
      .filter(a => a.status === 'ended')
      .sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0))[0] || null;

    setStats({
      totalAuctions,
      activeAuctions,
      scheduledAuctions,
      endedAuctions,
      cancelledAuctions,
      totalRevenue,
      totalBidders,
      averagePrice,
      topAuction
    });
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchSeller(),
        fetchAuctions(),
        fetchStats()
      ]);
    } catch (err) {
      setError('فشل في تحديث البيانات');
    } finally {
      setLoading(false);
    }
  }, [fetchSeller, fetchAuctions, fetchStats]);

  // Create new auction
  const createAuction = useCallback(async (auctionData) => {
    const currentSellerId = getCurrentSellerId();
    if (!currentSellerId) {
      throw new Error('غير مصرح لك بإنشاء مزادات');
    }

    const formData = new FormData();
    
    // Add basic auction data
    formData.append('sellerId', currentSellerId);
    formData.append('title', auctionData.title);
    formData.append('description', auctionData.description);
    formData.append('category', auctionData.category);
    formData.append('startingPrice', auctionData.startingPrice);
    formData.append('minimumIncrement', auctionData.minimumIncrement);
    formData.append('startTime', auctionData.startTime);
    formData.append('duration', auctionData.duration);
    formData.append('condition', auctionData.condition || 'new');
    
    if (auctionData.location) {
      formData.append('location', auctionData.location);
    }
    
    if (auctionData.specifications) {
      formData.append('specifications', auctionData.specifications);
    }
    
    if (auctionData.tags && auctionData.tags.length > 0) {
      formData.append('tags', JSON.stringify(auctionData.tags));
    }
    
    // Add video file
    if (auctionData.videoFile) {
      formData.append('video', auctionData.videoFile);
    }
    
    // Add image files
    if (auctionData.images && auctionData.images.length > 0) {
      auctionData.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });
    }

    const response = await fetch('/api/auctions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في إنشاء المزاد');
    }

    const newAuction = await response.json();
    
    // Refresh auctions list
    await fetchAuctions();
    
    return newAuction;
  }, [getCurrentSellerId, fetchAuctions]);

  // Update auction
  const updateAuction = useCallback(async (auctionId, updateData) => {
    const response = await fetch(`/api/auctions/${auctionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في تحديث المزاد');
    }

    const updatedAuction = await response.json();
    
    // Update local state
    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId ? { ...auction, ...updatedAuction } : auction
    ));
    
    return updatedAuction;
  }, []);

  // Delete auction
  const deleteAuction = useCallback(async (auctionId) => {
    const response = await fetch(`/api/auctions/${auctionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في حذف المزاد');
    }

    // Remove from local state
    setAuctions(prev => prev.filter(auction => auction.id !== auctionId));
    
    // Update stats
    const updatedAuctions = auctions.filter(auction => auction.id !== auctionId);
    updateStatsFromAuctions(updatedAuctions);
  }, [auctions, updateStatsFromAuctions]);

  // Get auction by ID
  const getAuction = useCallback((auctionId) => {
    return auctions.find(auction => auction.id === auctionId) || null;
  }, [auctions]);

  // Get auctions by status
  const getAuctionsByStatus = useCallback((status) => {
    return auctions.filter(auction => auction.status === status);
  }, [auctions]);

  // Calculate performance metrics
  const getPerformanceMetrics = useCallback(() => {
    const totalViews = auctions.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
    const totalBids = auctions.reduce((sum, a) => sum + (a.bidsCount || 0), 0);
    const completionRate = stats.totalAuctions > 0 
      ? (stats.endedAuctions / stats.totalAuctions) * 100 
      : 0;
    
    const averageBidsPerAuction = stats.totalAuctions > 0 
      ? totalBids / stats.totalAuctions 
      : 0;
    
    const averageViewsPerAuction = stats.totalAuctions > 0 
      ? totalViews / stats.totalAuctions 
      : 0;

    return {
      totalViews,
      totalBids,
      completionRate,
      averageBidsPerAuction,
      averageViewsPerAuction
    };
  }, [auctions, stats]);

  // Initialize data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // Data
    seller,
    auctions,
    stats,
    loading,
    error,
    
    // Actions
    refreshData,
    createAuction,
    updateAuction,
    deleteAuction,
    fetchAuctions,
    
    // Getters
    getAuction,
    getAuctionsByStatus,
    getPerformanceMetrics,
    
    // Utils
    getCurrentSellerId
  };
};

export { useSeller };
export default useSeller;