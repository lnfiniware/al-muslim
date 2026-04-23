import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme, I18nManager } from 'react-native';
import { notificationService } from '@services/notificationService';
import { storageService } from '@core/storage';
import { i18n, type Language } from '@core/i18n';
import { themeService, type ThemeMode } from '@theme/themeService';

SplashScreen.preventAutoHideAsync();

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#006a4e',
    secondary: '#b59410',
    background: '#f8f9fa',
    surface: '#ffffff',
    error: '#d32f2f',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#00d084',
    secondary: '#e5c77f',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    error: '#f44336',
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({});
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [appTheme, setAppTheme] = useState<ThemeMode>('light');
  const colorScheme = useColorScheme();
  const isDark = appTheme === 'dark';

  // Initialize language and theme on app launch
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load saved settings
        const settings = await storageService.getUserSettings();

        // Set language
        if (settings.language) {
          i18n.setLanguage(settings.language as Language);
          // Apply RTL for Arabic
          if (settings.language === 'ar') {
            I18nManager.forceRTL(true);
          } else {
            I18nManager.forceRTL(false);
          }
        } else {
          i18n.setLanguage('en');
          I18nManager.forceRTL(false);
        }

        // Set theme
        if (settings.theme && settings.theme !== 'system') {
          setAppTheme(settings.theme as ThemeMode);
          themeService.setTheme(settings.theme as ThemeMode);
        } else {
          // Use system preference
          const systemTheme = colorScheme === 'dark' ? 'dark' : 'light';
          setAppTheme(systemTheme);
          themeService.setTheme(systemTheme);
        }

        setOnboardingComplete(settings.onboardingComplete || false);
      } catch (e) {
        console.warn('Error initializing app:', e);
        setAppTheme('light');
        i18n.setLanguage('en');
        setOnboardingComplete(false);
      }
    };

    if (loaded) {
      initializeApp();
    }
  }, [loaded, colorScheme]);

  useEffect(() => {
    if (loaded && onboardingComplete !== null) {
      SplashScreen.hideAsync();
    }
  }, [loaded, onboardingComplete]);

  useEffect(() => {
    // Request notification permissions
    notificationService.requestPermissions();

    // Listen for notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification response:', response);
      }
    );

    return () => subscription.remove();
  }, []);

  if (!loaded || onboardingComplete === null) {
    return null;
  }

  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <Stack>
        {!onboardingComplete ? (
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack>
    </PaperProvider>
  );
}
