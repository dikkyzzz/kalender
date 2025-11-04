import React, { useState } from 'react';
import './TagInput.css';

/**
 * TagInput Component
 * Add/remove tags with autocomplete suggestions
 * 
 * Props:
 * - selectedTags: array - Currently selected tags
 * - onChange: function - Callback with updated tags array
 * - predefinedTags: array - Suggested tags with colors
 * - maxTags: number - Maximum allowed tags
 */
const TagInput = ({ selectedTags = [], onChange, predefinedTags = [], maxTags = 5 }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const defaultTags = [
    { name: 'Work', color: '#3B82F6' },
    { name: 'Personal', color: '#10B981' },
    { name: 'Study', color: '#F59E0B' },
    { name: 'Health', color: '#EF4444' },
    { name: 'Project', color: '#8B5CF6' },
    { name: 'Hobby', color: '#EC4899' }
  ];

  const tags = predefinedTags.length > 0 ? predefinedTags : defaultTags;

  const filteredSuggestions = tags.filter(tag =>
    tag.name.toLowerCase().includes(input.toLowerCase()) &&
    !selectedTags.includes(tag.name)
  );

  const handleAddTag = (tagName) => {
    if (selectedTags.length >= maxTags) {
      alert(`Maximum ${maxTags} tags allowed`);
      return;
    }
    
    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagName) => {
    onChange(selectedTags.filter(t => t !== tagName));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      handleAddTag(input.trim());
    }
  };

  const getTagColor = (tagName) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || '#A8E6CF';
  };

  return (
    <div className="tag-input-container">
      <div className="tag-input-wrapper">
        <div className="selected-tags">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="tag-badge"
              style={{ backgroundColor: getTagColor(tag) }}
            >
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>×</button>
            </span>
          ))}
        </div>
        
        {selectedTags.length < maxTags && (
          <input
            type="text"
            className="tag-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Add tags..."
          />
        )}
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="tag-suggestions">
          {filteredSuggestions.map(tag => (
            <button
              key={tag.name}
              className="tag-suggestion"
              onClick={() => handleAddTag(tag.name)}
              style={{ borderLeftColor: tag.color }}
            >
              <span className="tag-dot" style={{ backgroundColor: tag.color }}></span>
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
