import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  I18nManager,
} from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useLocation } from '@hooks/useLocation';
import { useNextPrayer } from '@hooks/useNextPrayer';
import { prayerTimesService } from '@services/prayerTimesService';
import { notificationService } from '@services/enhancedNotificationService';
import { storageService } from '@core/storage';
import { colors } from '@theme/colors';
import { i18n } from '@core/i18n';
import { CountdownTimer } from '@components/CountdownTimer';
import { PrayerCard } from '@components/PrayerCard';
import { AppLogo } from '@components/AppLogo';

export default function HomeScreenPremium() {
  const { location, loading: locationLoading } = useLocation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [madhab, setMadhab] = React.useState<'SHAFI' | 'HANAFI'>('SHAFI');
  const slideIn = useSharedValue(0);

  const prayerState = useNextPrayer(
    location?.coordinates.latitude || 0,
    location?.coordinates.longitude || 0,
    madhab
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: slideIn.value,
    transform: [{ translateY: (1 - slideIn.value) * 20 }],
  }));

  useEffect(() => {
    slideIn.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    loadSettings();
    setupNotifications();
  }, []);

  const loadSettings = async () => {
    const settings = await storageService.getUserSettings();
    setMadhab((settings.prayerMethod as 'SHAFI' | 'HANAFI') || 'SHAFI');
  };

  const setupNotifications = async () => {
    const initialized = await notificationService.initialize();
    if (initialized && prayerState.dailyPrayers) {
      const prayers = prayerTimesService.getPrayerList(prayerState.dailyPrayers);
      await notificationService.scheduleAllPrayerNotifications(prayers, 5);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const isArabic = i18n.isArabic();

  if (locationLoading || prayerState.loading) {
    return (
      <View style={styles.centerContainer}>
        <AppLogo size={150} />
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 24 }}
        />
        <Text style={styles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }

  if (prayerState.error || !prayerState.dailyPrayers) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {prayerState.error || 'Unable to load prayer times'}
        </Text>
        <Pressable onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const prayerList = prayerTimesService.getPrayerList(prayerState.dailyPrayers);
  const prayersTodayText = i18n.t('home.prayerSchedule');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Premium Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            <AppLogo size={80} />
          </View>

          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>{i18n.t('home.greeting')}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Location Badge */}
        {location && (
          <View style={styles.locationBadge}>
            <Text style={styles.locationEmoji}>📍</Text>
            <Text style={styles.locationText}>
              {location.city || 'Current Location'}
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Next Prayer Section */}
      <Animated.View style={[styles.nextPrayerSection, animatedStyle]}>
        {prayerState.nextPrayer && (
          <View>
            <Text style={styles.sectionLabel}>
              {i18n.t('prayers.nextPrayer')}
            </Text>

            <View style={styles.nextPrayerCard}>
              <LinearGradient
                colors={['rgba(211, 180, 140, 0.1)', 'rgba(212, 165, 116, 0.05)']}
                style={styles.gradientOverlay}
              />

              <View style={styles.nextPrayerInfo}>
                <Text style={styles.nextPrayerName}>
                  {prayerState.nextPrayer.name}
                </Text>
                <Text style={styles.nextPrayerTime}>
                  {prayerState.nextPrayer.timeString}
                </Text>
              </View>

              <View style={styles.countdownSection}>
                <Text style={styles.countdownLabel}>
                  {i18n.t('prayers.timeUntil')}
                </Text>
                <Text style={styles.countdown}>{prayerState.countdown}</Text>
              </View>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Today's Prayer Schedule */}
      <View style={styles.schedulesection}>
        <Text style={styles.sectionLabel}>{prayersTodayText}</Text>

        <View style={styles.prayersList}>
          {prayerList.map((prayer, index) => (
            <PrayerCard
              key={prayer.name}
              prayer={prayer}
              isCurrentPrayer={prayer.name === prayerState.currentPrayer?.name}
              isUpcoming={prayer.name === prayerState.nextPrayer?.name}
            />
          ))}
        </View>
      </View>

      {/* Islamic Quote Section */}
      <View style={styles.quoteSection}>
        <Text style={styles.quoteIcon}>💭</Text>
        <Text style={styles.quoteText}>
          "Indeed, the Quran is a guide, light, and healing for the believers."
        </Text>
        <Text style={styles.quoteArabic}>إِنَّ هَذَا الْقُرْآنَ يَهْدِي</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsGrid}>
        <Pressable style={styles.actionCard}>
          <Text style={styles.actionIcon}>📖</Text>
          <Text style={styles.actionText}>Read Quran</Text>
        </Pressable>

        <Pressable style={styles.actionCard}>
          <Text style={styles.actionIcon}>🤲</Text>
          <Text style={styles.actionText}>Adhkar</Text>
        </Pressable>

        <Pressable style={styles.actionCard}>
          <Text style={styles.actionIcon}>🧭</Text>
          <Text style={styles.actionText}>Qiblah</Text>
        </Pressable>

        <Pressable style={styles.actionCard}>
          <Text style={styles.actionIcon}>📅</Text>
          <Text style={styles.actionText}>Calendar</Text>
        </Pressable>
      </View>

      {/* Spacing */}
      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  logoSection: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  locationEmoji: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: 12,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
  nextPrayerSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 12,
  },
  nextPrayerCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  nextPrayerTime: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  countdownSection: {
    alignItems: 'flex-end',
  },
  countdownLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '600',
  },
  countdown: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  schedulesection: {
    paddingTop: 12,
    marginBottom: 24,
  },
  prayersList: {
    gap: 10,
  },
  quoteSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.tertiary,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    alignItems: 'center',
  },
  quoteIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteArabic: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 0.5,
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  spacing: {
    height: 40,
  },
});
