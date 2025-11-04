import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Calendar from '../components/Calendar';
import DayViewModal from '../components/DayViewModal';
import StatsCard from '../components/Statistics/StatsCard';
import StreakCounter from '../components/Statistics/StreakCounter';
import SearchBar from '../components/Search/SearchBar';
import ExportButton from '../components/Export/ExportButton';
import { getAllProgress, getProgressByMonth } from '../services/api';
import useStatistics from '../hooks/useStatistics';
import { useSearch } from '../hooks/useSearch';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [allProgressData, setAllProgressData] = useState([]); // For statistics
  const [monthProgressData, setMonthProgressData] = useState([]); // For calendar
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics from ALL data
  const stats = useStatistics(allProgressData);
  
  // Get ACTUAL current month name (for statistics display)
  const actualCurrentMonth = new Date().getMonth() + 1;
  const actualCurrentYear = new Date().getFullYear();
  const actualMonthName = new Date(actualCurrentYear, actualCurrentMonth - 1).toLocaleString('default', { month: 'long' });
  
  // Get calendar month name (for export - based on calendar view)
  const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });

  // Load ALL progress data once on mount (for statistics)
  React.useEffect(() => {
    loadAllProgressData();
  }, []);

  // Load monthly progress data when month changes (for calendar)
  React.useEffect(() => {
    loadMonthProgressData();
  }, [currentMonth, currentYear]);

  const loadAllProgressData = async () => {
    try {
      const data = await getAllProgress();
      setAllProgressData(data || []);
    } catch (error) {
      console.error('Error loading all progress data:', error);
      setAllProgressData([]);
    }
  };

  const loadMonthProgressData = async () => {
    try {
      const data = await getProgressByMonth(currentMonth, currentYear);
      setMonthProgressData(data || []);
    } catch (error) {
      console.error('Error loading month progress data:', error);
      setMonthProgressData([]);
    }
  };

  const handleDateClick = (dateInfo) => {
    setSelectedDate(dateInfo.dateStr);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  const handleSaveSuccess = () => {
    loadAllProgressData(); // Reload all data for statistics
    loadMonthProgressData(); // Reload month data for calendar
  };

  const handleMonthChange = (info) => {
    // IMPORTANT: Use view.currentStart, not info.start!
    // info.start = first day of first WEEK (can be previous month if month starts mid-week)
    // view.currentStart = first day of actual MONTH (correct for month detection)
    const viewDate = info.view.currentStart;
    const date = new Date(viewDate);
    const newMonth = date.getMonth() + 1;
    const newYear = date.getFullYear();
    
    if (newMonth !== currentMonth || newYear !== currentYear) {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>✏️ Progres Tracker</h1>
            <p>Track your daily progress</p>
          </div>
          <div className="header-right">
            <button onClick={toggleTheme} className="theme-toggle" title="Toggle Dark Mode">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user?.username}</span>
            </div>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        {/* Statistics Section */}
        <div className="dashboard-stats">
          <div className="stats-row">
            <StatsCard
              title="Total Progress"
              value={stats.total}
              icon="📊"
              color="#FF9F7F"
              subtitle="All time"
            />
            <StatsCard
              title="This Month"
              value={stats.thisMonth}
              icon="📅"
              color="#A8E6CF"
              subtitle={actualMonthName}
            />
            <StatsCard
              title="This Week"
              value={stats.thisWeek}
              icon="📈"
              color="#FFB88C"
              subtitle="Last 7 days"
            />
            <StatsCard
              title="Today"
              value={stats.today}
              icon="⭐"
              color="#667eea"
              subtitle="Current day"
            />
          </div>
          
          <StreakCounter
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
          />
        </div>

        {/* Controls Section */}
        <div className="dashboard-controls">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search progress notes..."
          />
          <ExportButton
            progressData={monthProgressData}
            month={monthName}
            year={currentYear}
            calendarElementId="calendar-container"
          />
        </div>

        {/* Calendar Section */}
        <div id="calendar-container">
          <div className="calendar-header-info">
            <span className="viewing-month">📅 Viewing: <strong>{monthName} {currentYear}</strong></span>
            <span className="data-count">({monthProgressData.length} progress entries)</span>
          </div>
          <Calendar 
            onDateClick={handleDateClick}
            progressData={monthProgressData}
            onMonthChange={handleMonthChange}
          />
        </div>
      </main>

      {modalOpen && (
        <DayViewModal
          date={selectedDate}
          onClose={handleCloseModal}
          onUpdate={handleSaveSuccess}
        />
      )}
    </div>
  );
}

export default Dashboard;
