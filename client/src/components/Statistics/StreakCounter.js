import React from 'react';
import './StreakCounter.css';

/**
 * StreakCounter Component
 * Display current and longest streak with flame animation
 * 
 * Props:
 * - currentStreak: number - Current consecutive days
 * - longestStreak: number - All-time longest streak
 * - onStreakClick: function (optional) - Handler when clicked
 */
const StreakCounter = ({ currentStreak, longestStreak, onStreakClick }) => {
  const isActive = currentStreak > 0;
  
  return (
    <div 
      className={`streak-counter ${isActive ? 'active' : ''}`}
      onClick={onStreakClick}
    >
      <div className="streak-current">
        <div className="streak-flame">
          {isActive ? '🔥' : '💨'}
        </div>
        <div className="streak-info">
          <h3 className="streak-title">Current Streak</h3>
          <p className="streak-value">{currentStreak} days</p>
        </div>
      </div>
      
      <div className="streak-divider"></div>
      
      <div className="streak-longest">
        <div className="streak-trophy">🏆</div>
        <div className="streak-info">
          <h3 className="streak-title">Longest Streak</h3>
          <p className="streak-value">{longestStreak} days</p>
        </div>
      </div>
      
      {currentStreak >= 7 && (
        <div className="streak-badge">
          <span>Week Warrior! 🎉</span>
        </div>
      )}
    </div>
  );
};

export default StreakCounter;
