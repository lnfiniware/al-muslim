import * as Notifications from 'expo-notifications';
import { PrayerTime } from '@services/prayerTimesService';

// Configure notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationPayload {
  type: 'prayer' | 'adhkar' | 'quran' | 'reminder';
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'azan' | 'chime' | 'bell' | 'default';
}

export const notificationService = {
  // Initialize notifications
  async initialize() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.warn('Failed to request notification permissions:', error);
      return false;
    }
  },

  // Send local notification
  async sendNotification(payload: NotificationPayload) {
    try {
      // Send notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          sound: true,
          badge: 1,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.warn('Failed to send notification:', error);
    }
  },

  // Schedule prayer time notification
  async schedulePrayerNotification(prayer: PrayerTime, minutesBefore: number = 5) {
    try {
      const triggerTime = new Date(prayer.time.getTime() - minutesBefore * 60 * 1000);

      if (triggerTime.getTime() <= Date.now()) {
        return; // Don't schedule if time has passed
      }

      const seconds = Math.floor((triggerTime.getTime() - Date.now()) / 1000);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.name} Prayer Reminder`,
          body: `Time to prepare for ${prayer.name} prayer at ${prayer.timeString}`,
          sound: 'azan',
          badge: 1,
          data: {
            type: 'prayer',
            prayerName: prayer.name,
            prayerTime: prayer.timeString,
          },
        },
        trigger: { seconds },
      });

      console.log(`Prayer notification scheduled for ${prayer.name} in ${seconds} seconds`);
    } catch (error) {
      console.warn('Failed to schedule prayer notification:', error);
    }
  },

  // Schedule all daily prayer notifications
  async scheduleAllPrayerNotifications(prayers: PrayerTime[], minutesBefore: number = 5) {
    try {
      // Clear existing notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule each prayer
      for (const prayer of prayers) {
        if (['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(prayer.name)) {
          await this.schedulePrayerNotification(prayer, minutesBefore);
        }
      }

      console.log('All prayer notifications scheduled');
    } catch (error) {
      console.warn('Failed to schedule all prayer notifications:', error);
    }
  },

  // Schedule Adhkar reminder
  async scheduleAdhkarNotification(time: Date, adhkarType: 'morning' | 'evening' | 'night') {
    try {
      const labels: Record<string, { title: string; body: string }> = {
        morning: {
          title: 'Morning Adhkar',
          body: 'Time to recite your morning remembrances. Alhamdulillah! 🤲',
        },
        evening: {
          title: 'Evening Adhkar',
          body: 'Time to recite your evening remembrances. Subhanallah! 🌙',
        },
        night: {
          title: 'Night Adhkar',
          body: 'Time to recite before sleep. May Allah grant you peaceful sleep. 😴',
        },
      };

      const label = labels[adhkarType];
      const seconds = Math.floor((time.getTime() - Date.now()) / 1000);

      if (seconds <= 0) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: label.title,
          body: label.body,
          sound: 'bell',
          data: {
            type: 'adhkar',
            adhkarType,
          },
        },
        trigger: { seconds },
      });
    } catch (error) {
      console.warn('Failed to schedule adhkar notification:', error);
    }
  },

  // Schedule Quran reading reminder
  async scheduleQuranReminder(time: Date, surahIndex: number) {
    try {
      const quranMessages = [
        'Time to read the Quran. "Read in the name of your Lord!" 📖',
        'Let\' open the Quran today. Every letter is a reward! ✨',
        'Spend time with the word of Allah. Juz your next read! 📚',
        'The Quran awaits you. May Allah bless your recitation! 🤲',
      ];

      const randomMessage = quranMessages[Math.floor(Math.random() * quranMessages.length)];
      const seconds = Math.floor((time.getTime() - Date.now()) / 1000);

      if (seconds <= 0) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Quran Reading Time',
          body: randomMessage,
          sound: 'chime',
          data: {
            type: 'quran',
            surahIndex,
          },
        },
        trigger: { seconds },
      });
    } catch (error) {
      console.warn('Failed to schedule quran reminder:', error);
    }
  },

  // Add notification event listener
  setupNotificationListeners(callback: (notification: Notifications.Notification) => void) {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      callback(response.notification);
    });

    return subscription;
  },
};
