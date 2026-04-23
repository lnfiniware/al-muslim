import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_LOCATION: '@al_muslim:user_location',
  PRAYER_METHOD: '@al_muslim:prayer_method',
  LANGUAGE: '@al_muslim:language',
  THEME: '@al_muslim:theme',
  NOTIFICATIONS_ENABLED: '@al_muslim:notifications_enabled',
  BOOKMARKED_VERSES: '@al_muslim:bookmarked_verses',
  ADHKAR_PROGRESS: '@al_muslim:adhkar_progress',
  FIRST_LAUNCH: '@al_muslim:first_launch',
  ONBOARDING_COMPLETE: '@al_muslim:onboarding_complete',
};

export interface UserSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  prayerMethod: string;
  onboardingComplete?: boolean;
  userLocation: {
    city: string;
    latitude: number;
    longitude: number;
  } | null;
}

export const storageService = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // User Settings
  async getUserSettings(): Promise<UserSettings> {
    try {
      const language = await this.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
      const theme = (await this.getItem(STORAGE_KEYS.THEME)) as 'light' | 'dark' | 'system' | null || 'system';
      const notificationsEnabled = (await this.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED)) !== 'false';
      const prayerMethod = await this.getItem(STORAGE_KEYS.PRAYER_METHOD) || 'SHAFI';
      const onboardingComplete = (await this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE)) === 'true';
      const locationStr = await this.getItem(STORAGE_KEYS.USER_LOCATION);
      
      let userLocation = null;
      if (locationStr) {
        try {
          userLocation = JSON.parse(locationStr);
        } catch (e) {
          console.warn('Failed to parse user location:', e);
        }
      }

      return {
        language,
        theme,
        notificationsEnabled,
        prayerMethod,
        onboardingComplete,
        userLocation,
      };
    } catch (error) {
      console.error('Error getting user settings:', error);
      return {
        language: 'en',
        theme: 'system',
        notificationsEnabled: true,
        prayerMethod: 'SHAFI',
        onboardingComplete: false,
        userLocation: null,
      };
    }
  },

  async setSetting(key: string, value: any): Promise<void> {
    try {
      if (key === 'onboardingComplete') {
        await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, String(value));
      } else if (key === 'locationEnabled') {
        // Just a flag, will be managed
        await this.setItem('@al_muslim:location_enabled', String(value));
      } else if (key === 'notificationsEnabled') {
        await this.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, String(value));
      }
    } catch (error) {
      console.error('Error setting preference:', error);
    }
  },

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    try {
      if (settings.language) {
        await this.setItem(STORAGE_KEYS.LANGUAGE, settings.language);
      }
      if (settings.theme) {
        await this.setItem(STORAGE_KEYS.THEME, settings.theme);
      }
      if (settings.notificationsEnabled !== undefined) {
        await this.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, String(settings.notificationsEnabled));
      }
      if (settings.prayerMethod) {
        await this.setItem(STORAGE_KEYS.PRAYER_METHOD, settings.prayerMethod);
      }
      if (settings.onboardingComplete !== undefined) {
        await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, String(settings.onboardingComplete));
      }
      if (settings.userLocation) {
        await this.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(settings.userLocation));
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  },

  // Bookmarked Verses
  async getBookmarkedVerses(): Promise<string[]> {
    try {
      const verses = await this.getItem(STORAGE_KEYS.BOOKMARKED_VERSES);
      return verses ? JSON.parse(verses) : [];
    } catch (error) {
      console.error('Error getting bookmarked verses:', error);
      return [];
    }
  },

  async addBookmark(verseId: string): Promise<void> {
    try {
      const verses = await this.getBookmarkedVerses();
      if (!verses.includes(verseId)) {
        verses.push(verseId);
        await this.setItem(STORAGE_KEYS.BOOKMARKED_VERSES, JSON.stringify(verses));
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  },

  async removeBookmark(verseId: string): Promise<void> {
    try {
      const verses = await this.getBookmarkedVerses();
      const filtered = verses.filter(v => v !== verseId);
      await this.setItem(STORAGE_KEYS.BOOKMARKED_VERSES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  },

  // Adhkar Progress
  async getAdhkarProgress(): Promise<Record<string, number>> {
    try {
      const progress = await this.getItem(STORAGE_KEYS.ADHKAR_PROGRESS);
      return progress ? JSON.parse(progress) : {};
    } catch (error) {
      console.error('Error getting adhkar progress:', error);
      return {};
    }
  },

  async updateAdhkarProgress(adhkarId: string, count: number): Promise<void> {
    try {
      const progress = await this.getAdhkarProgress();
      progress[adhkarId] = count;
      await this.setItem(STORAGE_KEYS.ADHKAR_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error updating adhkar progress:', error);
    }
  },

  // First Launch
  async isFirstLaunch(): Promise<boolean> {
    try {
      const launched = await this.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      return !launched;
    } catch (error) {
      console.error('Error checking first launch:', error);
      return true;
    }
  },

  async markLaunched(): Promise<void> {
    try {
      await this.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'true');
    } catch (error) {
      console.error('Error marking launched:', error);
    }
  },
};
