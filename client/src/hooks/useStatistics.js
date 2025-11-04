import { useMemo } from 'react';

/**
 * useStatistics Hook
 * Calculate various statistics from progress data
 * 
 * @param {Array} progressData - Array of progress objects
 * @returns {Object} Statistics object
 */
export const useStatistics = (progressData) => {
  return useMemo(() => {
    if (!progressData || progressData.length === 0) {
      return {
        total: 0,
        thisMonth: 0,
        thisWeek: 0,
        today: 0,
        currentStreak: 0,
        longestStreak: 0,
        avgPerDay: 0,
        totalImages: 0,
        monthlyData: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed, but we need 1-12
    const currentYear = now.getFullYear();
    
    // Format today as YYYY-MM-DD
    const todayStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // Start of week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Basic counts
    const total = progressData.length;
    
    // This Month: Filter by YYYY-MM prefix
    const thisMonth = progressData.filter(p => {
      if (!p.tanggal) return false;
      const [year, month] = p.tanggal.split('-');
      return parseInt(year) === currentYear && parseInt(month) === currentMonth;
    }).length;

    // This Week: Compare date strings
    const thisWeek = progressData.filter(p => {
      if (!p.tanggal) return false;
      const progressDate = new Date(p.tanggal + 'T00:00:00');
      return progressDate >= startOfWeek;
    }).length;

    // Today: Direct string comparison
    const todayCount = progressData.filter(p => p.tanggal === todayStr).length;

    // Calculate streaks
    const sortedDates = [...new Set(progressData.map(p => p.tanggal))].sort().reverse();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    sortedDates.forEach((date, index) => {
      const currentDate = new Date(date + 'T00:00:00'); // Add time to avoid timezone issues
      
      if (index === 0) {
        // Check if most recent date is today or yesterday
        const todayDate = new Date(todayStr + 'T00:00:00');
        const daysDiff = Math.floor((todayDate - currentDate) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          currentStreak = 1;
          tempStreak = 1;
          lastDate = currentDate;
        }
      } else if (lastDate) {
        const daysDiff = Math.floor((lastDate - currentDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak++;
        } else {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          tempStreak = 1;
        }
        
        lastDate = currentDate;
      }
    });

    if (tempStreak > longestStreak) longestStreak = tempStreak;
    if (currentStreak === 0 && longestStreak > 0) longestStreak = Math.max(longestStreak, tempStreak);

    // Average per day (since first progress)
    const firstDate = new Date(Math.min(...progressData.map(p => new Date(p.tanggal + 'T00:00:00'))));
    const todayDate = new Date(todayStr + 'T00:00:00');
    const daysSinceFirst = Math.ceil((todayDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
    const avgPerDay = (total / daysSinceFirst).toFixed(1);

    // Total images
    const totalImages = progressData.reduce((sum, p) => sum + (p.gambar?.length || 0), 0);

    // Monthly data for charts (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      // Calculate target month (JavaScript Date uses 0-indexed months)
      const targetMonth = currentMonth - i;
      const targetYear = targetMonth <= 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = targetMonth <= 0 ? targetMonth + 12 : targetMonth;
      
      const targetDate = new Date(targetYear, adjustedMonth - 1, 1);
      const month = targetDate.toLocaleString('default', { month: 'short' });
      
      const count = progressData.filter(p => {
        if (!p.tanggal) return false;
        const [year, month] = p.tanggal.split('-');
        return parseInt(year) === targetYear && parseInt(month) === adjustedMonth;
      }).length;
      
      monthlyData.push({ month, count });
    }

    return {
      total,
      thisMonth,
      thisWeek,
      today: todayCount,
      currentStreak,
      longestStreak,
      avgPerDay,
      totalImages,
      monthlyData
    };
  }, [progressData]);
};

export default useStatistics;
