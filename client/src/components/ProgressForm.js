import React, { useState, useEffect } from 'react';
import { 
  createProgress, 
  updateProgress
} from '../services/api';
import './ProgressForm.css';

function ProgressForm({ date, existingProgress, onClose, onSave }) {
  const [catatan, setCatatan] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingProgress) {
      setCatatan(existingProgress.catatan || '');
      setExistingImages(existingProgress.gambar || []);
    }
  }, [existingProgress]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (imagePath) => {
    setImagesToRemove(prev => [...prev, imagePath]);
    setExistingImages(prev => prev.filter(img => img !== imagePath));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('tanggal', date);
      formData.append('catatan', catatan);
      
      if (imagesToRemove.length > 0) {
        formData.append('removeImages', JSON.stringify(imagesToRemove));
      }
      
      newImages.forEach(file => {
        formData.append('gambar', file);
      });

      if (existingProgress) {
        await updateProgress(existingProgress.id, formData);
      } else {
        await createProgress(formData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Gagal menyimpan progress. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{existingProgress ? 'Edit Progress' : 'Tambah Progress'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Catatan Progress</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tulis progress hari ini..."
              rows="6"
            />
          </div>

          <div className="form-group">
            <label>Dokumentasi Gambar</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input"
            />
          </div>

          {existingImages.length > 0 && (
            <div className="image-preview-section">
              <h3>Gambar yang Ada</h3>
              <div className="image-grid">
                {existingImages.map((imgPath, index) => (
                  <div key={index} className="image-item">
                    <img 
                      src={`http://localhost:5000${imgPath}`} 
                      alt={`Preview ${index}`} 
                    />
                    <button
                      className="remove-image-button"
                      onClick={() => handleRemoveExistingImage(imgPath)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newImages.length > 0 && (
            <div className="image-preview-section">
              <h3>Gambar Baru</h3>
              <div className="image-grid">
                {newImages.map((file, index) => (
                  <div key={index} className="image-item">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`New ${index}`} 
                    />
                    <button
                      className="remove-image-button"
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={saving}
          >
            Batal
          </button>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgressForm;
