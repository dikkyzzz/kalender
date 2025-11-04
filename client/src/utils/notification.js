/**
 * Notification Utilities
 * Handle browser notifications for reminders
 */

/**
 * Request notification permission from user
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Send a browser notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 */
export const sendNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  const defaultOptions = {
    icon: '/logo192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    ...options
  };

  const notification = new Notification(title, defaultOptions);

  // Auto close after 5 seconds
  setTimeout(() => notification.close(), 5000);

  return notification;
};

/**
 * Schedule daily reminder
 * @param {string} time - Time in HH:MM format (24-hour)
 * @param {Function} callback - Optional callback when reminder fires
 */
export const scheduleDailyReminder = (time = '20:00', callback) => {
  const [hours, minutes] = time.split(':').map(Number);
  
  const scheduleNext = () => {
    const now = new Date();
    const reminderTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime - now;

    return setTimeout(() => {
      sendNotification('⏰ Progress Reminder', {
        body: 'Jangan lupa catat progress hari ini!',
        tag: 'daily-reminder',
        requireInteraction: true
      });

      if (callback) callback();

      // Schedule next day's reminder
      scheduleNext();
    }, timeUntilReminder);
  };

  return scheduleNext();
};

/**
 * Send streak reminder when user hasn't logged progress
 * @param {number} currentStreak - Current streak count
 */
export const sendStreakReminder = (currentStreak) => {
  if (currentStreak === 0) {
    sendNotification('🔥 Start Your Streak!', {
      body: 'Begin tracking your progress today!',
      tag: 'streak-reminder'
    });
  } else if (currentStreak >= 7) {
    sendNotification(`🔥 ${currentStreak} Day Streak!`, {
      body: "Don't break your amazing streak! Log your progress.",
      tag: 'streak-reminder'
    });
  } else {
    sendNotification('🔥 Keep It Going!', {
      body: `You're on a ${currentStreak} day streak. Keep it up!`,
      tag: 'streak-reminder'
    });
  }
};

/**
 * Cancel scheduled notifications
 * @param {number} timerId - Timer ID returned by scheduleDailyReminder
 */
export const cancelReminder = (timerId) => {
  if (timerId) {
    clearTimeout(timerId);
  }
};

export default {
  requestNotificationPermission,
  sendNotification,
  scheduleDailyReminder,
  sendStreakReminder,
  cancelReminder
};
