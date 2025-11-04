import React, { useState, useEffect } from 'react';
import ProgressForm from './ProgressForm';
import ProgressCard from './ProgressCard';
import { getProgressByDate } from '../services/api';
import './DayViewModal.css';

function DayViewModal({ date, onClose, onUpdate }) {
  const [progressList, setProgressList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, [date]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const data = await getProgressByDate(date);
      setProgressList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading progress:', error);
      setProgressList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingProgress(null);
    setShowForm(true);
  };

  const handleEdit = (progress) => {
    setEditingProgress(progress);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProgress(null);
  };

  const handleFormSuccess = async () => {
    await loadProgressData();
    handleFormClose();
    onUpdate();
  };

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  if (showForm) {
    return (
      <ProgressForm
        date={date}
        existingProgress={editingProgress}
        onClose={handleFormClose}
        onSave={handleFormSuccess}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="day-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="day-view-header">
          <h2>{formatDate(date)}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="day-view-body">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {progressList.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>Belum ada progress untuk hari ini</p>
                  <button className="add-progress-button-big" onClick={handleAddNew}>
                    + Tambah Progress
                  </button>
                </div>
              ) : (
                <>
                  <div className="progress-list">
                    {progressList.map((progress) => (
                      <ProgressCard
                        key={progress.id}
                        progress={progress}
                        onEdit={() => handleEdit(progress)}
                        onUpdate={handleFormSuccess}
                      />
                    ))}
                  </div>
                  <button className="add-progress-button" onClick={handleAddNew}>
                    + Tambah Progress Lagi
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DayViewModal;
