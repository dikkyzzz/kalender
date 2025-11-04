import React, { useState } from 'react';
import { deleteProgress } from '../services/api';
import ImagePreview from './ImagePreview';
import './ProgressCard.css';

function ProgressCard({ progress, onEdit, onUpdate }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProgress(progress.id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting progress:', error);
      alert('Gagal menghapus progress. Silakan coba lagi.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="progress-card">
      <div className="progress-card-header">
        <div className="progress-time">
          <span className="clock-icon">🕐</span>
          {formatTime(progress.dibuat)}
        </div>
        <div className="progress-actions">
          <button className="edit-btn" onClick={onEdit} title="Edit">
            ✏️
          </button>
          <button 
            className="delete-btn" 
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="progress-card-body">
        {progress.catatan && (
          <div className="progress-note">
            <p>{progress.catatan}</p>
          </div>
        )}

        {progress.gambar && progress.gambar.length > 0 && (
          <div className="progress-images">
            {progress.gambar.map((imgPath, index) => (
              <div 
                key={index} 
                className="progress-image-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(`http://localhost:5000${imgPath}`);
                }}
              >
                <img 
                  src={`http://localhost:5000${imgPath}`} 
                  alt={`Progress ${index + 1}`}
                />
                <div className="image-overlay">
                  <span className="zoom-icon">🔍</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-box">
            <p>Yakin ingin menghapus progress ini?</p>
            <div className="delete-confirm-actions">
              <button 
                className="confirm-cancel-btn" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Batal
              </button>
              <button 
                className="confirm-delete-btn" 
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <ImagePreview 
          imageUrl={previewImage} 
          onClose={() => setPreviewImage(null)} 
        />
      )}
    </div>
  );
}

export default ProgressCard;
