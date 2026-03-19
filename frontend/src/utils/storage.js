/**
 * Local storage and session storage utility functions
 */

import { STORAGE_KEYS } from './constants';

/**
 * Storage utility class
 */
class StorageUtil {
  /**
   * Check if storage is available
   * @param {Storage} storage - Storage object (localStorage or sessionStorage)
   * @returns {boolean} Storage availability
   */
  isStorageAvailable(storage) {
    try {
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Safely get item from storage
   * @param {Storage} storage - Storage object
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} Stored value or default
   */
  getItem(storage, key, defaultValue = null) {
    if (!this.isStorageAvailable(storage)) {
      return defaultValue;
    }

    try {
      const item = storage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      // Try to parse as JSON
      try {
        return JSON.parse(item);
      } catch {
        // Return as string if not valid JSON
        return item;
      }
    } catch (error) {
      console.warn(`Error reading from storage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Safely set item to storage
   * @param {Storage} storage - Storage object
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  setItem(storage, key, value) {
    if (!this.isStorageAvailable(storage)) {
      return false;
    }

    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.warn(`Error writing to storage (${key}):`, error);
      return false;
    }
  }

  /**
   * Safely remove item from storage
   * @param {Storage} storage - Storage object
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeItem(storage, key) {
    if (!this.isStorageAvailable(storage)) {
      return false;
    }

    try {
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from storage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   * @param {Storage} storage - Storage object
   * @returns {boolean} Success status
   */
  clear(storage) {
    if (!this.isStorageAvailable(storage)) {
      return false;
    }

    try {
      storage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get all keys from storage
   * @param {Storage} storage - Storage object
   * @returns {string[]} Array of keys
   */
  getKeys(storage) {
    if (!this.isStorageAvailable(storage)) {
      return [];
    }

    try {
      return Object.keys(storage);
    } catch (error) {
      console.warn('Error getting storage keys:', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes
   * @param {Storage} storage - Storage object
   * @returns {number} Storage size
   */
  getStorageSize(storage) {
    if (!this.isStorageAvailable(storage)) {
      return 0;
    }

    try {
      let total = 0;
      for (const key in storage) {
        if (storage.hasOwnProperty(key)) {
          total += storage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.warn('Error calculating storage size:', error);
      return 0;
    }
  }
}

const storageUtil = new StorageUtil();

// LocalStorage helpers
export const localStorage = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value
   * @returns {any} Stored value
   */
  get: (key, defaultValue = null) => {
    return storageUtil.getItem(window.localStorage, key, defaultValue);
  },

  /**
   * Set item to localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  set: (key, value) => {
    return storageUtil.setItem(window.localStorage, key, value);
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove: (key) => {
    return storageUtil.removeItem(window.localStorage, key);
  },

  /**
   * Clear localStorage
   * @returns {boolean} Success status
   */
  clear: () => {
    return storageUtil.clear(window.localStorage);
  },

  /**
   * Get all keys from localStorage
   * @returns {string[]} Array of keys
   */
  keys: () => {
    return storageUtil.getKeys(window.localStorage);
  },

  /**
   * Get localStorage size
   * @returns {number} Storage size in bytes
   */
  size: () => {
    return storageUtil.getStorageSize(window.localStorage);
  }
};

// SessionStorage helpers
export const sessionStorage = {
  /**
   * Get item from sessionStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value
   * @returns {any} Stored value
   */
  get: (key, defaultValue = null) => {
    return storageUtil.getItem(window.sessionStorage, key, defaultValue);
  },

  /**
   * Set item to sessionStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  set: (key, value) => {
    return storageUtil.setItem(window.sessionStorage, key, value);
  },

  /**
   * Remove item from sessionStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove: (key) => {
    return storageUtil.removeItem(window.sessionStorage, key);
  },

  /**
   * Clear sessionStorage
   * @returns {boolean} Success status
   */
  clear: () => {
    return storageUtil.clear(window.sessionStorage);
  },

  /**
   * Get all keys from sessionStorage
   * @returns {string[]} Array of keys
   */
  keys: () => {
    return storageUtil.getKeys(window.sessionStorage);
  },

  /**
   * Get sessionStorage size
   * @returns {number} Storage size in bytes
   */
  size: () => {
    return storageUtil.getStorageSize(window.sessionStorage);
  }
};

// Application-specific storage functions
export const authStorage = {
  /**
   * Get auth token
   * @returns {string|null} Auth token
   */
  getToken: () => {
    return localStorage.get(STORAGE_KEYS.TOKEN);
  },

  /**
   * Set auth token
   * @param {string} token - Auth token
   */
  setToken: (token) => {
    localStorage.set(STORAGE_KEYS.TOKEN, token);
  },

  /**
   * Remove auth token
   */
  removeToken: () => {
    localStorage.remove(STORAGE_KEYS.TOKEN);
  },

  /**
   * Get refresh token
   * @returns {string|null} Refresh token
   */
  getRefreshToken: () => {
    return localStorage.get(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Set refresh token
   * @param {string} token - Refresh token
   */
  setRefreshToken: (token) => {
    localStorage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * Remove refresh token
   */
  removeRefreshToken: () => {
    localStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get user data
   * @returns {Object|null} User data
   */
  getUser: () => {
    return localStorage.get(STORAGE_KEYS.USER);
  },

  /**
   * Set user data
   * @param {Object} user - User data
   */
  setUser: (user) => {
    localStorage.set(STORAGE_KEYS.USER, user);
  },

  /**
   * Remove user data
   */
  removeUser: () => {
    localStorage.remove(STORAGE_KEYS.USER);
  },

  /**
   * Clear all auth data
   */
  clearAuth: () => {
    localStorage.remove(STORAGE_KEYS.TOKEN);
    localStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.remove(STORAGE_KEYS.USER);
  }
};

// App settings storage
export const settingsStorage = {
  /**
   * Get app theme
   * @returns {string} Theme name
   */
  getTheme: () => {
    return localStorage.get(STORAGE_KEYS.THEME, 'light');
  },

  /**
   * Set app theme
   * @param {string} theme - Theme name
   */
  setTheme: (theme) => {
    localStorage.set(STORAGE_KEYS.THEME, theme);
  },

  /**
   * Get app language
   * @returns {string} Language code
   */
  getLanguage: () => {
    return localStorage.get(STORAGE_KEYS.LANGUAGE, 'ar');
  },

  /**
   * Set app language
   * @param {string} language - Language code
   */
  setLanguage: (language) => {
    localStorage.set(STORAGE_KEYS.LANGUAGE, language);
  },

  /**
   * Get notification settings
   * @returns {Object} Notification settings
   */
  getNotificationSettings: () => {
    return localStorage.get(STORAGE_KEYS.NOTIFICATIONS, {
      sound: true,
      browser: true,
      email: true,
      bidUpdates: true,
      auctionStart: true,
      auctionEnd: true,
      messages: true
    });
  },

  /**
   * Set notification settings
   * @param {Object} settings - Notification settings
   */
  setNotificationSettings: (settings) => {
    localStorage.set(STORAGE_KEYS.NOTIFICATIONS, settings);
  },

  /**
   * Get video preferences
   * @returns {Object} Video preferences
   */
  getVideoPreferences: () => {
    return localStorage.get(STORAGE_KEYS.VIDEO_PREFERENCES, {
      quality: 'auto',
      autoplay: true,
      muted: false,
      volume: 0.8
    });
  },

  /**
   * Set video preferences
   * @param {Object} preferences - Video preferences
   */
  setVideoPreferences: (preferences) => {
    localStorage.set(STORAGE_KEYS.VIDEO_PREFERENCES, preferences);
  }
};

// Cache storage for temporary data
export const cacheStorage = {
  /**
   * Get cached data with expiration check
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if expired
   */
  get: (key) => {
    const cached = sessionStorage.get(`cache_${key}`);
    if (!cached) return null;

    const { data, timestamp, ttl } = cached;
    const now = Date.now();

    if (ttl && now - timestamp > ttl) {
      sessionStorage.remove(`cache_${key}`);
      return null;
    }

    return data;
  },

  /**
   * Set cached data with TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set: (key, data, ttl = 300000) => { // Default 5 minutes
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    sessionStorage.set(`cache_${key}`, cacheData);
  },

  /**
   * Remove cached data
   * @param {string} key - Cache key
   */
  remove: (key) => {
    sessionStorage.remove(`cache_${key}`);
  },

  /**
   * Clear all cached data
   */
  clear: () => {
    const keys = sessionStorage.keys();
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        sessionStorage.remove(key);
      }
    });
  }
};

// Recent searches storage
export const searchStorage = {
  /**
   * Get recent searches
   * @returns {string[]} Array of recent search queries
   */
  getRecentSearches: () => {
    return localStorage.get(STORAGE_KEYS.RECENT_SEARCHES, []);
  },

  /**
   * Add search query to recent searches
   * @param {string} query - Search query
   * @param {number} maxItems - Maximum items to keep
   */
  addRecentSearch: (query, maxItems = 10) => {
    if (!query || !query.trim()) return;

    const recent = searchStorage.getRecentSearches();
    const trimmedQuery = query.trim();

    // Remove if already exists
    const filtered = recent.filter(item => item !== trimmedQuery);

    // Add to beginning
    filtered.unshift(trimmedQuery);

    // Keep only maxItems
    const limited = filtered.slice(0, maxItems);

    localStorage.set(STORAGE_KEYS.RECENT_SEARCHES, limited);
  },

  /**
   * Clear recent searches
   */
  clearRecentSearches: () => {
    localStorage.remove(STORAGE_KEYS.RECENT_SEARCHES);
  }
};

// Followed auctions storage
export const followStorage = {
  /**
   * Get followed auction IDs
   * @returns {string[]} Array of auction IDs
   */
  getFollowedAuctions: () => {
    return localStorage.get(STORAGE_KEYS.FOLLOWED_AUCTIONS, []);
  },

  /**
   * Add auction to followed list
   * @param {string} auctionId - Auction ID
   */
  addFollowedAuction: (auctionId) => {
    const followed = followStorage.getFollowedAuctions();
    if (!followed.includes(auctionId)) {
      followed.push(auctionId);
      localStorage.set(STORAGE_KEYS.FOLLOWED_AUCTIONS, followed);
    }
  },

  /**
   * Remove auction from followed list
   * @param {string} auctionId - Auction ID
   */
  removeFollowedAuction: (auctionId) => {
    const followed = followStorage.getFollowedAuctions();
    const filtered = followed.filter(id => id !== auctionId);
    localStorage.set(STORAGE_KEYS.FOLLOWED_AUCTIONS, filtered);
  },

  /**
   * Check if auction is followed
   * @param {string} auctionId - Auction ID
   * @returns {boolean} Is followed
   */
  isAuctionFollowed: (auctionId) => {
    const followed = followStorage.getFollowedAuctions();
    return followed.includes(auctionId);
  },

  /**
   * Clear all followed auctions
   */
  clearFollowedAuctions: () => {
    localStorage.remove(STORAGE_KEYS.FOLLOWED_AUCTIONS);
  }
};

// Draft auction storage
export const draftStorage = {
  /**
   * Get draft auction data
   * @returns {Object|null} Draft auction data
   */
  getDraftAuction: () => {
    return localStorage.get(STORAGE_KEYS.DRAFT_AUCTION);
  },

  /**
   * Save draft auction data
   * @param {Object} draftData - Draft auction data
   */
  saveDraftAuction: (draftData) => {
    const draft = {
      ...draftData,
      lastSaved: new Date().toISOString()
    };
    localStorage.set(STORAGE_KEYS.DRAFT_AUCTION, draft);
  },

  /**
   * Clear draft auction data
   */
  clearDraftAuction: () => {
    localStorage.remove(STORAGE_KEYS.DRAFT_AUCTION);
  },

  /**
   * Check if draft exists
   * @returns {boolean} Has draft
   */
  hasDraft: () => {
    return !!draftStorage.getDraftAuction();
  }
};

// Export storage utilities
export default {
  localStorage,
  sessionStorage,
  authStorage,
  settingsStorage,
  cacheStorage,
  searchStorage,
  followStorage,
  draftStorage
};