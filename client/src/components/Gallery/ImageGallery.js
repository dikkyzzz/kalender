import React, { useState } from 'react';
import './ImageGallery.css';

/**
 * ImageGallery Component
 * Display all progress images in grid layout
 * 
 * Props:
 * - images: array - Array of {url, date, alt}
 * - onImageClick: function - Callback when image clicked
 * - columns: number - Number of columns (responsive)
 */
const ImageGallery = ({ images = [], onImageClick, columns = 4 }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filter, setFilter] = useState('all'); // all, thisMonth, thisWeek

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    if (onImageClick) onImageClick(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="gallery-empty">
        <span className="gallery-empty-icon">📸</span>
        <p>No images yet</p>
        <span>Start adding images to your progress!</span>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h2>Image Gallery</h2>
        <span className="gallery-count">{images.length} images</span>
      </div>

      <div className="gallery-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {images.map((img, idx) => (
          <div
            key={idx}
            className="gallery-item"
            onClick={() => handleImageClick(idx)}
          >
            <img
              src={img.url}
              alt={img.alt || `Progress image ${idx + 1}`}
              loading="lazy"
            />
            <div className="gallery-overlay">
              <span className="gallery-date">{img.date}</span>
              {img.tags && (
                <div className="gallery-tags">
                  {img.tags.map(tag => (
                    <span key={tag} className="gallery-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="lightbox" onClick={handleClose}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={handleClose}>×</button>
            <button className="lightbox-prev" onClick={handlePrev}>‹</button>
            <button className="lightbox-next" onClick={handleNext}>›</button>
            
            <img
              src={images[selectedIndex].url}
              alt={images[selectedIndex].alt}
              className="lightbox-image"
            />
            
            <div className="lightbox-info">
              <span className="lightbox-counter">
                {selectedIndex + 1} / {images.length}
              </span>
              <span className="lightbox-date">
                {images[selectedIndex].date}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
