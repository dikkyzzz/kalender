/**
 * Storage Utilities
 * LocalStorage and caching management
 */

/**
 * Cache Manager
 * Store data with TTL (time to live)
 */
export const cacheManager = {
  /**
   * Set cache item with expiry
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (default: 1 hour)
   */
  set: (key, data, ttl = 3600000) => {
    try {
      const item = {
        data,
        expiry: Date.now() + ttl,
        timestamp: Date.now()
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  /**
   * Get cache item if not expired
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null
   */
  get: (key) => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check if expired
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Remove cache item
   * @param {string} key - Cache key
   */
  remove: (key) => {
    localStorage.removeItem(`cache_${key}`);
  },

  /**
   * Clear all cache items
   */
  clearAll: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  },

  /**
   * Get cache info
   * @param {string} key - Cache key
   * @returns {Object|null} Cache metadata
   */
  getInfo: (key) => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const age = Date.now() - parsed.timestamp;
      const remaining = parsed.expiry - Date.now();

      return {
        age,
        remaining,
        expired: remaining <= 0,
        size: new Blob([item]).size
      };
    } catch (error) {
      return null;
    }
  }
};

/**
 * Settings Manager
 * Persistent app settings
 */
export const settingsManager = {
  /**
   * Get setting value
   * @param {string} key - Setting key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Setting value
   */
  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(`setting_${key}`);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  },

  /**
   * Set setting value
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   */
  set: (key, value) => {
    try {
      localStorage.setItem(`setting_${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Setting set error:', error);
      return false;
    }
  },

  /**
   * Remove setting
   * @param {string} key - Setting key
   */
  remove: (key) => {
    localStorage.removeItem(`setting_${key}`);
  },

  /**
   * Get all settings
   * @returns {Object} All settings
   */
  getAll: () => {
    const settings = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('setting_')) {
        const settingKey = key.replace('setting_', '');
        settings[settingKey] = settingsManager.get(settingKey);
      }
    });

    return settings;
  }
};

/**
 * Check localStorage quota usage
 * @returns {Object} Storage usage info
 */
export const getStorageUsage = () => {
  let total = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }

  const totalKB = (total / 1024).toFixed(2);
  const quota = 5120; // ~5MB typical quota
  const percentage = ((total / 1024 / quota) * 100).toFixed(2);

  return {
    used: totalKB,
    quota,
    percentage,
    available: (quota - totalKB).toFixed(2)
  };
};

/**
 * Export localStorage data
 * @returns {Object} All localStorage data
 */
export const exportStorage = () => {
  const data = {};
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      data[key] = localStorage[key];
    }
  }

  return data;
};

/**
 * Import localStorage data
 * @param {Object} data - Data to import
 * @param {boolean} clearFirst - Clear existing data first
 */
export const importStorage = (data, clearFirst = false) => {
  if (clearFirst) {
    localStorage.clear();
  }

  for (let key in data) {
    localStorage.setItem(key, data[key]);
  }
};

export default {
  cacheManager,
  settingsManager,
  getStorageUsage,
  exportStorage,
  importStorage
};
