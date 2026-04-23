import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, I18nManager } from 'react-native';
import {
  Text,
  Switch,
  Divider,
  Snackbar,
  Menu,
} from 'react-native-paper';
import { storageService, UserSettings } from '@core/storage';
import { locationService } from '@services/locationService';
import { i18n, type Language } from '@core/i18n';
import { themeService, type ThemeMode } from '@theme/themeService';
import { useLanguage } from '@hooks/useLanguage';
import { useTheme } from '@hooks/useTheme';

export default function SettingsScreen() {
  const { language, isArabic, setLanguage, t } = useLanguage();
  const { colors, isDark, toggleTheme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    theme: 'system',
    notificationsEnabled: true,
    prayerMethod: 'SHAFI',
    userLocation: null,
  });
  const [snackbar, setSnackbar] = useState('');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loaded = await storageService.getUserSettings();
    setSettings(loaded);
    i18n.setLanguage(loaded.language as Language);
    themeService.setTheme(loaded.theme as ThemeMode);
  };

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await storageService.updateUserSettings({ [key]: value });
    setSnackbar('Settings updated');
  };

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    await updateSetting('language', lang);
    setLanguageMenuOpen(false);
    I18nManager.forceRTL(lang === 'ar');
  };

  const handleThemeChange = async (theme: ThemeMode) => {
    setTheme(theme);
    await updateSetting('theme', theme);
    setThemeMenuOpen(false);
  };

  const handleLocationRefresh = async () => {
    try {
      locationService.clearCache();
      const location = await locationService.getCurrentLocation();
      if (location) {
        await updateSetting('userLocation', {
          city: location.city,
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
        });
        setSnackbar('Location updated');
      }
    } catch (error) {
      setSnackbar('Failed to update location');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Location Section */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          📍 {t('settings.location')}
        </Text>
        <View style={styles.settingItem}>
          <View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('settings.currentLocation')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
              {settings.userLocation?.city || t('settings.autoDetect')}
            </Text>
          </View>
        </View>
        <Text
          style={[styles.actionText, { color: colors.primary }]}
          onPress={handleLocationRefresh}
        >
          {t('settings.refreshLocation')}
        </Text>
      </View>

      <Divider />

      {/* Prayer Settings Section */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          🕌 {t('settings.prayer')}
        </Text>
        <View style={styles.settingItem}>
          <View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('settings.calculationMethod')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
              {settings.prayerMethod === 'SHAFI'
                ? t('settings.shafi')
                : t('settings.hanafi')}
            </Text>
          </View>
        </View>
      </View>

      <Divider />

      {/* Notification Settings */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          🔔 {t('settings.notifications')}
        </Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            {t('settings.prayerReminders')}
          </Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={value =>
              updateSetting('notificationsEnabled', value)
            }
            color={colors.primary}
          />
        </View>
      </View>

      <Divider />

      {/* Theme Settings */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          🎨 {t('settings.appearance')}
        </Text>
        <Menu
          visible={themeMenuOpen}
          onDismiss={() => setThemeMenuOpen(false)}
          anchor={
            <Pressable
              onPress={() => setThemeMenuOpen(true)}
              style={styles.settingItem}
            >
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('settings.theme')}
                </Text>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  {settings.theme === 'light'
                    ? t('settings.light')
                    : settings.theme === 'dark'
                    ? t('settings.dark')
                    : t('settings.system')}
                </Text>
              </View>
            </Pressable>
          }
        >
          <Menu.Item
            onPress={() => handleThemeChange('light')}
            title={t('settings.light')}
          />
          <Menu.Item
            onPress={() => handleThemeChange('dark')}
            title={t('settings.dark')}
          />
          <Menu.Item
            onPress={() => handleThemeChange('system')}
            title={t('settings.system')}
          />
        </Menu>
      </View>

      <Divider />

      {/* Language Settings */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          🌐 {t('settings.language')}
        </Text>
        <Menu
          visible={languageMenuOpen}
          onDismiss={() => setLanguageMenuOpen(false)}
          anchor={
            <Pressable
              onPress={() => setLanguageMenuOpen(true)}
              style={styles.settingItem}
            >
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('settings.appLanguage')}
                </Text>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  {settings.language === 'en' ? 'English' : 'العربية'}
                </Text>
              </View>
            </Pressable>
          }
        >
          <Menu.Item
            onPress={() => handleLanguageChange('en')}
            title="English"
          />
          <Menu.Item
            onPress={() => handleLanguageChange('ar')}
            title="العربية"
          />
        </Menu>
      </View>

      <Divider />

      {/* About Section */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          ℹ️ {t('settings.about')}
        </Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          Al-Muslim v0.1.0
        </Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          {t('app.description')}
        </Text>
      </View>

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={2000}
      >
        {snackbar}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 13,
    marginTop: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
  },
  aboutText: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 20,
  },
});
