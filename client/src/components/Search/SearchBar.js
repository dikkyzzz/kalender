import React, { useState } from 'react';
import './SearchBar.css';

/**
 * SearchBar Component
 * Search progress by keyword in notes
 * 
 * Props:
 * - onSearch: function - Callback with search term
 * - placeholder: string - Input placeholder text
 * - initialValue: string - Initial search value
 */
const SearchBar = ({ onSearch, placeholder = 'Search progress...', initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {query && (
        <button className="search-clear" onClick={handleClear}>
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
