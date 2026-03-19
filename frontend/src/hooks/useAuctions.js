import { useState, useEffect, useCallback } from 'react';
import auctionApi from '../services/auctionApi';

const useAuctions = (options = {}) => {
  const {
    search = '',
    filters = {},
    sort = 'newest',
    page = 1,
    limit = 12,
    autoRefresh = false,
    refreshInterval = 30000
  } = options;

  const [state, setState] = useState({
    auctions: [],
    loading: true,
    error: null,
    totalCount: 0,
    categories: [],
    locations: [],
    hasMore: false,
    initialized: false
  });

  // Build query parameters
  const buildQueryParams = useCallback(() => {
    const params = {
      page,
      limit,
      sort
    };

    if (search) {
      params.search = search;
    }

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          // Handle price range
          if (key === 'priceRange' && (value[0] !== 0 || value[1] !== 10000)) {
            params.minPrice = value[0];
            params.maxPrice = value[1];
          }
        } else {
          params[key] = value;
        }
      }
    });

    return params;
  }, [search, filters, sort, page, limit]);

  // Fetch auctions
  const fetchAuctions = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      const params = buildQueryParams();
      const response = await auctionApi.getAuctions(params);
      
      setState(prev => ({
        ...prev,
        auctions: response.data || [],
        totalCount: response.meta?.total || 0,
        hasMore: response.meta?.hasMore || false,
        loading: false,
        error: null,
        initialized: true
      }));
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'حدث خطأ في تحميل المزادات',
        initialized: true
      }));
    }
  }, [buildQueryParams]);

  // Fetch filter options (categories, locations)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [categoriesResponse, locationsResponse] = await Promise.all([
        auctionApi.getCategories(),
        auctionApi.getLocations()
      ]);

      setState(prev => ({
        ...prev,
        categories: categoriesResponse.data || [],
        locations: locationsResponse.data || []
      }));
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  }, []);

  // Load more auctions (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const params = buildQueryParams();
      params.page = page + 1;
      
      const response = await auctionApi.getAuctions(params);
      
      setState(prev => ({
        ...prev,
        auctions: [...prev.auctions, ...(response.data || [])],
        hasMore: response.meta?.hasMore || false,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading more auctions:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'حدث خطأ في تحميل المزيد من المزادات'
      }));
    }
  }, [state.loading, state.hasMore, page, buildQueryParams]);

  // Refresh auctions
  const refresh = useCallback(() => {
    fetchAuctions(false);
  }, [fetchAuctions]);

  // Refetch with loading
  const refetch = useCallback(() => {
    fetchAuctions(true);
  }, [fetchAuctions]);

  // Update auction in state (for real-time updates)
  const updateAuction = useCallback((auctionId, updates) => {
    setState(prev => ({
      ...prev,
      auctions: prev.auctions.map(auction =>
        auction.id === auctionId 
          ? { ...auction, ...updates }
          : auction
      )
    }));
  }, []);

  // Add new auction to state
  const addAuction = useCallback((newAuction) => {
    setState(prev => ({
      ...prev,
      auctions: [newAuction, ...prev.auctions],
      totalCount: prev.totalCount + 1
    }));
  }, []);

  // Remove auction from state
  const removeAuction = useCallback((auctionId) => {
    setState(prev => ({
      ...prev,
      auctions: prev.auctions.filter(auction => auction.id !== auctionId),
      totalCount: Math.max(0, prev.totalCount - 1)
    }));
  }, []);

  // Initial load
  useEffect(() => {
    fetchAuctions();
    if (!state.categories.length || !state.locations.length) {
      fetchFilterOptions();
    }
  }, [fetchAuctions]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !state.initialized) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh, state.initialized]);

  // Like/unlike auction
  const likeAuction = useCallback(async (auctionId) => {
    try {
      await auctionApi.likeAuction(auctionId);
      
      setState(prev => ({
        ...prev,
        auctions: prev.auctions.map(auction =>
          auction.id === auctionId
            ? { 
                ...auction, 
                isLiked: !auction.isLiked,
                likes: auction.isLiked ? auction.likes - 1 : auction.likes + 1
              }
            : auction
        )
      }));
    } catch (error) {
      console.error('Error liking auction:', error);
      throw error;
    }
  }, []);

  // Follow/unfollow auction
  const followAuction = useCallback(async (auctionId) => {
    try {
      await auctionApi.followAuction(auctionId);
      
      setState(prev => ({
        ...prev,
        auctions: prev.auctions.map(auction =>
          auction.id === auctionId
            ? { ...auction, isFollowed: !auction.isFollowed }
            : auction
        )
      }));
    } catch (error) {
      console.error('Error following auction:', error);
      throw error;
    }
  }, []);

  // Get auction by ID from current state
  const getAuctionById = useCallback((auctionId) => {
    return state.auctions.find(auction => auction.id === auctionId);
  }, [state.auctions]);

  // Filter auctions locally (useful for client-side filtering)
  const filterAuctionsLocally = useCallback((filterFn) => {
    return state.auctions.filter(filterFn);
  }, [state.auctions]);

  // Sort auctions locally
  const sortAuctionsLocally = useCallback((sortFn) => {
    return [...state.auctions].sort(sortFn);
  }, [state.auctions]);

  // Get auction stats
  const getStats = useCallback(() => {
    const { auctions } = state;
    
    return {
      total: auctions.length,
      active: auctions.filter(a => a.status === 'active').length,
      upcoming: auctions.filter(a => a.status === 'upcoming').length,
      ended: auctions.filter(a => a.status === 'ended').length,
      totalViews: auctions.reduce((sum, a) => sum + (a.viewsCount || 0), 0),
      totalParticipants: auctions.reduce((sum, a) => sum + (a.participantsCount || 0), 0),
      averagePrice: auctions.length > 0 
        ? auctions.reduce((sum, a) => sum + (a.currentPrice || 0), 0) / auctions.length
        : 0
    };
  }, [state.auctions]);

  return {
    // State
    auctions: state.auctions,
    loading: state.loading,
    error: state.error,
    totalCount: state.totalCount,
    categories: state.categories,
    locations: state.locations,
    hasMore: state.hasMore,
    initialized: state.initialized,
    
    // Actions
    refresh,
    refetch,
    loadMore,
    updateAuction,
    addAuction,
    removeAuction,
    likeAuction,
    followAuction,
    
    // Utilities
    getAuctionById,
    filterAuctionsLocally,
    sortAuctionsLocally,
    getStats
  };
};

export default useAuctions;