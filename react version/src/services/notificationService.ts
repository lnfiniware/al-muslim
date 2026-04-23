import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface PrayerNotification {
  prayerName: string;
  time: string;
}

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        return newStatus === 'granted';
      }
      return true;
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  },

  async schedulePrayerNotification(
    prayer: PrayerNotification,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${prayer.prayerName} Prayer`,
          body: `It's time for ${prayer.prayerName} prayer at ${prayer.time}`,
          sound: 'default',
          priority: 'high',
          badge: 1,
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Schedule notification error:', error);
      return null;
    }
  },

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Cancel notification error:', error);
    }
  },

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Cancel all notifications error:', error);
    }
  },

  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Get scheduled notifications error:', error);
      return [];
    }
  },

  async sendTestNotification(): Promise<void> {
    try {
      await Notifications.presentNotificationAsync({
        title: '🎉 Al-Muslim Test',
        body: 'Notifications are working correctly!',
        sound: 'default',
        badge: 1,
      });
    } catch (error) {
      console.error('Send test notification error:', error);
    }
  },
};
