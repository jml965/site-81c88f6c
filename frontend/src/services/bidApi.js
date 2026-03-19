const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return { success: true, data: null };
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Bid API service
export const bidApi = {
  // Get all bids for an auction
  getBids: async (auctionId, options = {}) => {
    const { page = 1, limit = 50, userId } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(userId && { userId })
    });

    try {
      const response = await makeRequest(`/auctions/${auctionId}/bids?${params}`);
      return {
        success: true,
        data: {
          bids: response.bids || [],
          currentPrice: response.currentPrice || 0,
          totalCount: response.totalCount || 0,
          pagination: response.pagination || {}
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Place a new bid
  placeBid: async (auctionId, amount) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/bids`, {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get auction statistics
  getAuctionStats: async (auctionId) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/stats`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get user's bid history
  getUserBids: async (userId, options = {}) => {
    const { page = 1, limit = 20, auctionId } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(auctionId && { auctionId })
    });

    try {
      const response = await makeRequest(`/users/${userId}/bids?${params}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get current user's bids
  getMyBids: async (options = {}) => {
    const { page = 1, limit = 20, auctionId, status } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(auctionId && { auctionId }),
      ...(status && { status })
    });

    try {
      const response = await makeRequest(`/bids/my?${params}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Cancel a bid (if allowed)
  cancelBid: async (bidId) => {
    try {
      const response = await makeRequest(`/bids/${bidId}/cancel`, {
        method: 'DELETE'
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get bid details
  getBidDetails: async (bidId) => {
    try {
      const response = await makeRequest(`/bids/${bidId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get bidding timeline for an auction
  getBiddingTimeline: async (auctionId) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/timeline`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get real-time auction status
  getAuctionStatus: async (auctionId) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/status`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Validate bid amount before placing
  validateBid: async (auctionId, amount) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/validate-bid`, {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get winning bids for completed auctions
  getWinningBids: async (options = {}) => {
    const { page = 1, limit = 20, userId } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(userId && { userId })
    });

    try {
      const response = await makeRequest(`/bids/winning?${params}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get bid analytics for sellers
  getBidAnalytics: async (auctionId) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/analytics`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Auto-bid functionality
  setAutoBid: async (auctionId, maxAmount, increment) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/auto-bid`, {
        method: 'POST',
        body: JSON.stringify({ maxAmount, increment })
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Cancel auto-bid
  cancelAutoBid: async (auctionId) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/auto-bid`, {
        method: 'DELETE'
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get auto-bid status
  getAutoBidStatus: async (auctionId) => {
    try {
      const response = await makeRequest(`/auctions/${auctionId}/auto-bid`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default bidApi;