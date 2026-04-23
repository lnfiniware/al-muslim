// Advanced Notification Service with Prayer Times and Adhkar Reminders
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PrayerNotification {
  prayerName: string;
  time: Date;
  enabled: boolean;
}

export const notificationService = {
  /**
   * Initialize notifications
   */
  async initialize() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  },

  /**
   * Schedule prayer time notification
   */
  async schedulePrayerNotification(prayerName: string, prayerTime: Date) {
    try {
      // Schedule notification 5 minutes before prayer time
      const notificationTime = new Date(prayerTime.getTime() - 5 * 60 * 1000);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${prayerName} Adhan`,
          body: `It's time to prepare for ${prayerName} prayer`,
          sound: 'default',
          badge: 1,
          data: {
            type: 'prayer',
            prayerName,
          },
        },
        trigger: {
          date: notificationTime,
        },
      });
    } catch (error) {
      console.error('Error scheduling prayer notification:', error);
    }
  },

  /**
   * Schedule adhkar notification
   */
  async scheduleAdhkarNotification(adhkarType: 'morning' | 'evening' | 'night', time: Date) {
    const titles = {
      morning: '🌅 Morning Adhkar',
      evening: '🌙 Evening Adhkar',
      night: '🛌 Nighttime Adhkar',
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: titles[adhkarType],
          body: `Time for your daily ${adhkarType} remembrances`,
          sound: 'default',
          badge: 1,
          data: {
            type: 'adhkar',
            adhkarType,
          },
        },
        trigger: {
          date: time,
        },
      });
    } catch (error) {
      console.error('Error scheduling adhkar notification:', error);
    }
  },

  /**
   * Schedule Islamic date reminders (Ramadan, Eid, etc.)
   */
  async scheduleIslamicDateReminder(eventName: string, hijriDate: Date) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 ${eventName}`,
          body: `Today is ${eventName}`,
          sound: 'default',
          badge: 1,
          data: {
            type: 'islamicDate',
            event: eventName,
          },
        },
        trigger: {
          date: hijriDate,
        },
      });
    } catch (error) {
      console.error('Error scheduling Islamic date reminder:', error);
    }
  },

  /**
   * Send instant notification (for immediate alerts)
   */
  async sendInstantNotification(title: string, body: string, soundName: string = 'default') {
    try {
      await Notifications.presentNotificationAsync({
        title,
        body,
        sound: soundName,
        badge: 1,
      });
    } catch (error) {
      console.error('Error sending instant notification:', error);
    }
  },

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  },

  /**
   * Cancel specific notification
   */
  async cancelNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  },

  /**
   * Play adhan sound
   */
  async playAdhan(adhanType: 'fajr' | 'regular' = 'regular') {
    try {
      // Note: You'll need to add actual adhan audio files to the assets
      const sound = new Audio.Sound();
      const audioPath =
        adhanType === 'fajr'
          ? require('@assets/sounds/adhan-fajr.mp3')
          : require('@assets/sounds/adhan.mp3');

      await sound.loadAsync(audioPath);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing adhan:', error);
    }
  },

  /**
   * Request notification permissions
   */
  async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  /**
   * Setup prayer time notifications for a full day
   */
  async setupDailyPrayerNotifications(prayerTimes: any) {
    try {
      const prayers = [
        { name: 'Fajr', time: prayerTimes.fajr },
        { name: 'Sunrise', time: prayerTimes.sunrise },
        { name: 'Dhuhr', time: prayerTimes.dhuhr },
        { name: 'Asr', time: prayerTimes.asr },
        { name: 'Maghrib', time: prayerTimes.maghrib },
        { name: 'Isha', time: prayerTimes.isha },
      ];

      for (const prayer of prayers) {
        await this.schedulePrayerNotification(prayer.name, new Date(prayer.time));
      }
    } catch (error) {
      console.error('Error setting up daily prayer notifications:', error);
    }
  },

  /**
   * Setup adhkar notifications
   */
  async setupAdhkarNotifications() {
    try {
      const today = new Date();

      // Morning adhkar at 6 AM
      const morningTime = new Date(today);
      morningTime.setHours(6, 0, 0);
      await this.scheduleAdhkarNotification('morning', morningTime);

      // Evening adhkar at 6 PM
      const eveningTime = new Date(today);
      eveningTime.setHours(18, 0, 0);
      await this.scheduleAdhkarNotification('evening', eveningTime);

      // Night adhkar at 9 PM
      const nightTime = new Date(today);
      nightTime.setHours(21, 0, 0);
      await this.scheduleAdhkarNotification('night', nightTime);
    } catch (error) {
      console.error('Error setting up adhkar notifications:', error);
    }
  },

  /**
   * Listen to notification responses
   */
  onNotificationResponse(callback: (response: any) => void) {
    const subscription = Notifications.addNotificationResponseReceivedListener(callback);
    return () => subscription.remove();
  },

  /**
   * Listen to notifications when app is in foreground
   */
  onNotificationReceived(callback: (notification: any) => void) {
    const subscription = Notifications.addNotificationReceivedListener(callback);
    return () => subscription.remove();
  },
};
