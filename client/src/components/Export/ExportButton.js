import React, { useState } from 'react';
import { exportToPDF, exportToExcel, exportAsImage, exportToCSV } from '../../utils/export';
import './ExportButton.css';

/**
 * ExportButton Component
 * Dropdown menu with export options
 * 
 * Props:
 * - progressData: array - Data to export
 * - month: string - Current month
 * - year: number - Current year
 * - calendarElementId: string - DOM ID for screenshot
 */
const ExportButton = ({ progressData, month, year, calendarElementId = 'calendar' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (type) => {
    // Check if there's data to export (except for image type)
    if (type !== 'image' && (!progressData || progressData.length === 0)) {
      alert(`⚠️ No progress data found for ${month} ${year}.\n\nPlease navigate to a month that has data to export.`);
      setShowMenu(false);
      return;
    }

    setLoading(true);
    setShowMenu(false);

    try {
      let result;
      
      switch (type) {
        case 'pdf':
          result = await exportToPDF(progressData, month, year);
          break;
        case 'excel':
          result = await exportToExcel(progressData);
          break;
        case 'csv':
          result = exportToCSV(progressData);
          break;
        case 'image':
          result = await exportAsImage(calendarElementId);
          break;
        default:
          throw new Error('Unknown export type');
      }

      if (result.success) {
        alert(`✅ Exported successfully: ${result.filename}`);
      } else {
        alert(`❌ Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`❌ Export failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-button-container">
      <button
        className="export-button"
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        title={progressData.length === 0 ? 'No data to export for this month' : `Export ${progressData.length} items`}
      >
        {loading ? '⏳ Exporting...' : `📥 Export${progressData.length > 0 ? ` (${progressData.length})` : ''}`}
      </button>

      {showMenu && (
        <div className="export-menu">
          <button
            className="export-option"
            onClick={() => handleExport('pdf')}
          >
            <span className="export-icon">📄</span>
            <div>
              <strong>Export as PDF</strong>
              <p>Professional report format</p>
            </div>
          </button>

          <button
            className="export-option"
            onClick={() => handleExport('excel')}
          >
            <span className="export-icon">📊</span>
            <div>
              <strong>Export as Excel</strong>
              <p>Spreadsheet with data</p>
            </div>
          </button>

          <button
            className="export-option"
            onClick={() => handleExport('csv')}
          >
            <span className="export-icon">📋</span>
            <div>
              <strong>Export as CSV</strong>
              <p>Simple comma-separated</p>
            </div>
          </button>

          <button
            className="export-option"
            onClick={() => handleExport('image')}
          >
            <span className="export-icon">📸</span>
            <div>
              <strong>Export as Image</strong>
              <p>Calendar screenshot</p>
            </div>
          </button>
        </div>
      )}

      {showMenu && (
        <div 
          className="export-overlay" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ExportButton;
