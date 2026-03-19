/**
 * API utility functions and HTTP client
 */

import { API_BASE_URL, ERROR_MESSAGES, STORAGE_KEYS } from './constants';

/**
 * HTTP Client class for API communication
 */
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
  }

  /**
   * Get authentication token from storage
   * @returns {string|null} Auth token
   */
  getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Set authentication token
   * @param {string} token - Auth token
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }

  /**
   * Get request headers with authentication
   * @param {Object} customHeaders - Custom headers to merge
   * @returns {Object} Request headers
   */
  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAuthToken();
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch response
   * @returns {Promise<any>} Parsed response data
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(data.message || this.getErrorMessage(response.status));
      error.status = response.status;
      error.data = data;
      
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        this.handleUnauthorized();
      }
      
      throw error;
    }

    return data;
  }

  /**
   * Handle unauthorized access
   */
  handleUnauthorized() {
    this.setAuthToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Get error message based on status code
   * @param {number} status - HTTP status code
   * @returns {string} Error message
   */
  getErrorMessage(status) {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  /**
   * Build URL with query parameters
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {string} Full URL with params
   */
  buildURL(endpoint, params = {}) {
    const url = new URL(endpoint, this.baseURL);
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  }

  /**
   * Make GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async get(endpoint, params = {}, options = {}) {
    const url = this.buildURL(endpoint, params);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(options.headers),
      signal: options.signal,
      ...options
    });

    return this.handleResponse(response);
  }

  /**
   * Make POST request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async post(endpoint, data = null, options = {}) {
    const url = this.buildURL(endpoint);
    
    const requestOptions = {
      method: 'POST',
      headers: this.getHeaders(options.headers),
      signal: options.signal,
      ...options
    };

    if (data instanceof FormData) {
      // Remove Content-Type header for FormData (browser will set it)
      delete requestOptions.headers['Content-Type'];
      requestOptions.body = data;
    } else if (data !== null) {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, requestOptions);
    return this.handleResponse(response);
  }

  /**
   * Make PUT request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async put(endpoint, data = null, options = {}) {
    const url = this.buildURL(endpoint);
    
    const requestOptions = {
      method: 'PUT',
      headers: this.getHeaders(options.headers),
      signal: options.signal,
      ...options
    };

    if (data instanceof FormData) {
      delete requestOptions.headers['Content-Type'];
      requestOptions.body = data;
    } else if (data !== null) {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, requestOptions);
    return this.handleResponse(response);
  }

  /**
   * Make PATCH request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async patch(endpoint, data = null, options = {}) {
    const url = this.buildURL(endpoint);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(options.headers),
      body: data instanceof FormData ? data : JSON.stringify(data),
      signal: options.signal,
      ...options
    });

    return this.handleResponse(response);
  }

  /**
   * Make DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async delete(endpoint, options = {}) {
    const url = this.buildURL(endpoint);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(options.headers),
      signal: options.signal,
      ...options
    });

    return this.handleResponse(response);
  }

  /**
   * Upload file with progress tracking
   * @param {string} endpoint - Upload endpoint
   * @param {FormData} formData - Form data with file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<any>} Upload response
   */
  async uploadWithProgress(endpoint, formData, onProgress) {
    const url = this.buildURL(endpoint);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Add auth header
      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      // Track upload progress
      if (onProgress && xhr.upload) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });
      }
      
      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response);
          } else {
            reject(new Error(response.message || this.getErrorMessage(xhr.status)));
          }
        } catch (error) {
          reject(error);
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });
      
      xhr.open('POST', url);
      xhr.send(formData);
    });
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// API endpoint helpers
export const endpoints = {
  // Authentication
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  
  // User Management
  profile: '/user/profile',
  updateProfile: '/user/profile',
  changePassword: '/user/change-password',
  deleteAccount: '/user/delete-account',
  getUserById: (id) => `/user/${id}`,
  
  // Auctions
  auctions: '/auctions',
  auctionById: (id) => `/auctions/${id}`,
  createAuction: '/auctions',
  updateAuction: (id) => `/auctions/${id}`,
  deleteAuction: (id) => `/auctions/${id}`,
  joinAuction: (id) => `/auctions/${id}/join`,
  leaveAuction: (id) => `/auctions/${id}/leave`,
  auctionStatus: (id) => `/auctions/${id}/status`,
  
  // Bidding
  bids: '/bids',
  bidsByAuction: (auctionId) => `/auctions/${auctionId}/bids`,
  placeBid: '/bids',
  bidHistory: (auctionId) => `/auctions/${auctionId}/bids/history`,
  myBids: '/bids/my-bids',
  
  // Media/Upload
  upload: '/upload',
  uploadVideo: '/upload/video',
  uploadImage: '/upload/image',
  uploadThumbnail: '/upload/thumbnail',
  
  // Comments
  comments: '/comments',
  commentsByAuction: (auctionId) => `/auctions/${auctionId}/comments`,
  addComment: '/comments',
  updateComment: (id) => `/comments/${id}`,
  deleteComment: (id) => `/comments/${id}`,
  
  // Messages
  messages: '/messages',
  conversations: '/messages/conversations',
  conversation: (id) => `/messages/conversations/${id}`,
  sendMessage: '/messages',
  markAsRead: (id) => `/messages/${id}/read`,
  
  // Notifications
  notifications: '/notifications',
  markNotificationRead: (id) => `/notifications/${id}/read`,
  markAllNotificationsRead: '/notifications/read-all',
  notificationSettings: '/notifications/settings',
  
  // Following/Likes
  followAuction: (id) => `/auctions/${id}/follow`,
  unfollowAuction: (id) => `/auctions/${id}/unfollow`,
  likeAuction: (id) => `/auctions/${id}/like`,
  unlikeAuction: (id) => `/auctions/${id}/unlike`,
  myFollowedAuctions: '/user/followed-auctions',
  myLikedAuctions: '/user/liked-auctions',
  
  // Reports
  reports: '/reports',
  createReport: '/reports',
  
  // Categories
  categories: '/categories',
  categoryById: (id) => `/categories/${id}`,
  
  // Search
  search: '/search',
  searchAuctions: '/search/auctions',
  searchSuggestions: '/search/suggestions',
  
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    auctions: '/admin/auctions',
    reports: '/admin/reports',
    settings: '/admin/settings',
    stats: '/admin/stats'
  }
};

/**
 * Create request with timeout
 * @param {Promise} request - Fetch promise
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<any>} Request with timeout
 */
export const withTimeout = (request, timeout = 30000) => {
  return Promise.race([
    request,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    })
  ]);
};

/**
 * Create abort controller for request cancellation
 * @returns {AbortController} Abort controller
 */
export const createAbortController = () => {
  return new AbortController();
};

/**
 * Retry request with exponential backoff
 * @param {Function} requestFn - Request function
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<any>} Request result
 */
export const retryRequest = async (requestFn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Check if user is online
 * @returns {boolean} Online status
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Queue request for when online
 * @param {Function} requestFn - Request function to queue
 * @returns {Promise<any>} Request result when online
 */
export const queueRequest = (requestFn) => {
  return new Promise((resolve, reject) => {
    const executeRequest = async () => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    if (isOnline()) {
      executeRequest();
    } else {
      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        executeRequest();
      };
      window.addEventListener('online', handleOnline);
    }
  });
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Suggested filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format API error for display
 * @param {Error} error - API error
 * @returns {string} User-friendly error message
 */
export const formatApiError = (error) => {
  if (error.data && error.data.message) {
    return error.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES.NETWORK_ERROR;
};

// Export default API client
export default apiClient;