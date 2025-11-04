import React from 'react';
import './StatsCard.css';

/**
 * StatsCard Component
 * Display individual statistic with icon and value
 * 
 * Props:
 * - title: string - Card title
 * - value: number/string - Main value to display
 * - icon: string - Emoji or icon
 * - color: string - Background color for icon
 * - subtitle: string (optional) - Additional info
 */
const StatsCard = ({ title, value, icon, color = '#FF9F7F', subtitle }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        {subtitle && <span className="stats-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatsCard;
