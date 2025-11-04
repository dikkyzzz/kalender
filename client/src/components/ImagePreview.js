import React, { useEffect, useCallback } from 'react';
import './ImagePreview.css';

function ImagePreview({ imageUrl, onClose }) {
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  }, [onClose]);

  const handleContainerClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleCloseClick = useCallback((e) => {
    e.stopPropagation();
    onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  return (
    <div className="image-preview-overlay" onClick={handleOverlayClick}>
      <div className="image-preview-container" onClick={handleContainerClick}>
        <button className="image-preview-close" onClick={handleCloseClick}>
          ×
        </button>
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="image-preview-img"
        />
        <div className="image-preview-hint">
          Click outside or press ESC to close
        </div>
      </div>
    </div>
  );
}

export default ImagePreview;
