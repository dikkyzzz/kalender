import React, { useState } from 'react';
import './FilterPanel.css';

/**
 * FilterPanel Component
 * Filter progress by date range, tags, and other criteria
 * 
 * Props:
 * - onFilterChange: function - Callback with filter object
 * - availableTags: array - List of available tags
 * - initialFilters: object - Initial filter state
 */
const FilterPanel = ({ onFilterChange, availableTags = [], initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
    tags: initialFilters.tags || [],
    hasImages: initialFilters.hasImages || false,
    ...initialFilters
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      dateFrom: '',
      dateTo: '',
      tags: [],
      hasImages: false
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = 
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    filters.tags.length +
    (filters.hasImages ? 1 : 0);

  return (
    <div className="filter-panel">
      <button 
        className="filter-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        🎯 Filter
        {activeFilterCount > 0 && (
          <span className="filter-badge">{activeFilterCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-section">
            <h4>Date Range</h4>
            <div className="filter-date-inputs">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                placeholder="From"
              />
              <span>to</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                placeholder="To"
              />
            </div>
          </div>

          {availableTags.length > 0 && (
            <div className="filter-section">
              <h4>Tags</h4>
              <div className="filter-tags">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`filter-tag ${filters.tags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="filter-section">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.hasImages}
                onChange={(e) => handleFilterChange('hasImages', e.target.checked)}
              />
              <span>Has Images</span>
            </label>
          </div>

          {activeFilterCount > 0 && (
            <button className="filter-clear" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
