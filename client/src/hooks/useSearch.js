import { useMemo } from 'react';

/**
 * useSearch Hook
 * Filter progress data based on search term and filters
 * 
 * @param {Array} data - Array of progress objects
 * @param {string} searchTerm - Search keyword
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered progress data
 */
export const useSearch = (data, searchTerm = '', filters = {}) => {
  return useMemo(() => {
    if (!data || data.length === 0) return [];

    let filtered = [...data];

    // Apply search term filter
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.catatan?.toLowerCase().includes(term) ||
        item.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(item => item.tanggal >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(item => item.tanggal <= filters.dateTo);
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(item =>
        item.tags && filters.tags.some(tag => item.tags.includes(tag))
      );
    }

    // Apply images filter
    if (filters.hasImages) {
      filtered = filtered.filter(item =>
        item.gambar && item.gambar.length > 0
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return filtered;
  }, [data, searchTerm, filters]);
};

/**
 * Extract unique tags from progress data
 */
export const useAvailableTags = (data) => {
  return useMemo(() => {
    if (!data || data.length === 0) return [];

    const tagsSet = new Set();
    data.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tagsSet.add(tag));
      }
    });

    return Array.from(tagsSet).sort();
  }, [data]);
};

export default useSearch;
