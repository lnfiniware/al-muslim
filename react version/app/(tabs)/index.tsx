import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { useLocation } from '@hooks/useLocation';
import { useNextPrayer } from '@hooks/useNextPrayer';
import { prayerTimesService } from '@services/prayerTimesService';
import { storageService } from '@core/storage';
import { CountdownTimer } from '@components/CountdownTimer';
import { PrayerCard } from '@components/PrayerCard';
import { OnboardingScreen } from '@components/OnboardingScreen';

export default function HomeScreen() {
  const { location, loading: locationLoading } = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [madhab, setMadhab] = useState<'SHAFI' | 'HANAFI'>('SHAFI');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const prayerState = useNextPrayer(
    location?.coordinates.latitude || 0,
    location?.coordinates.longitude || 0,
    madhab
  );

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    // Schedule prayer notifications when prayer times are available
    if (prayerState.dailyPrayers && location) {
      schedulePrayerNotifications();
    }
  }, [prayerState.dailyPrayers, location]);

  const loadSettings = async () => {
    const settings = await storageService.getUserSettings();
    setMadhab((settings.prayerMethod as 'SHAFI' | 'HANAFI') || 'SHAFI');
    
    // Check if onboarding is complete
    const isFirstLaunch = await storageService.isFirstLaunch();
    if (isFirstLaunch) {
      setShowOnboarding(true);
      await storageService.markLaunched();
    }
  };

  const schedulePrayerNotifications = async () => {
    try {
      const settings = await storageService.getUserSettings();
      if (!settings.notificationsEnabled) return;

      const prayerList = prayerTimesService.getPrayerList(prayerState.dailyPrayers!);
      
      // Schedule notifications for each prayer today
      for (const prayer of prayerList) {
        const [hours, minutes] = prayer.timeString.split(':').map(Number);
        const today = new Date();
        const prayerTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

        // Only schedule if prayer time is in the future
        if (prayerTime > new Date()) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `🕌 ${prayer.name} Prayer`,
              body: `Time for ${prayer.name} prayer at ${prayer.timeString}`,
              sound: 'default',
              badge: 1,
            },
            trigger: {
              date: prayerTime,
            },
          });
        }
      }
    } catch (error) {
      console.warn('Error scheduling prayer notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  if (locationLoading || prayerState.loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#006a4e" />
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
      </View>
    );
  }

  const prayerList = prayerTimesService.getPrayerList(prayerState.dailyPrayers);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with Gradient Background */}
      <View style={styles.headerGradient}>
        <Text style={styles.headerSubtitle}>
          {location?.city || 'Current Location'}
        </Text>
        <Text style={styles.headerTitle}>Prayer Times</Text>
        <Text style={styles.headerCountry}>
          {location?.country || 'Location'}
        </Text>
      </View>

      {/* Countdown Timer */}
      {prayerState.nextPrayer && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.countdownSection}>
            <CountdownTimer
              hours={0}
              minutes={0}
              seconds={0}
              prayerName={prayerState.nextPrayer.name}
            />
            <Text style={styles.countdownSubtext}>
              Prayer at {prayerState.nextPrayer.timeString}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Current Prayer Highlight */}
      {prayerState.currentPrayer && (
        <View style={styles.currentPrayerSection}>
          <Card style={styles.currentCard}>
            <View style={styles.currentCardContent}>
              <Text style={styles.currentLabel}>🕌 Currently Active Prayer</Text>
              <Text style={styles.currentPrayerName}>
                {prayerState.currentPrayer.name}
              </Text>
              <Text style={styles.currentTime}>
                Until {prayerState.currentPrayer.timeString}
              </Text>
            </View>
          </Card>
        </View>
      )}

      {/* Today's Prayer Schedule */}
      <View style={styles.scheduleSection}>
        <Text style={styles.scheduleTitle}>Today's Prayer Times</Text>
        <View style={styles.prayerCardsContainer}>
          {prayerList.map((prayer, index) => (
            <View key={prayer.name} style={styles.prayerCardWrapper}>
              <Card
                style={[
                  styles.prayerCardSmall,
                  prayerState.nextPrayer?.name === prayer.name &&
                    styles.nextPrayerHighlight,
                ]}
              >
                <View style={styles.prayerCardSmallContent}>
                  <Text
                    style={[
                      styles.prayerCardTime,
                      prayerState.nextPrayer?.name === prayer.name &&
                        styles.nextPrayerText,
                    ]}
                  >
                    {prayer.timeString}
                  </Text>
                  <Text
                    style={[
                      styles.prayerCardName,
                      prayerState.nextPrayer?.name === prayer.name &&
                        styles.nextPrayerText,
                    ]}
                  >
                    {prayer.name}
                  </Text>
                </View>
              </Card>
            </View>
          ))}
        </View>
      </View>

      {/* Location Info Footer */}
      <View style={styles.footerInfo}>
        <Card style={styles.infoCard}>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>📍 Your Location</Text>
            <Text style={styles.infoCoordinates}>
              {location?.coordinates.latitude.toFixed(4)}° N
            </Text>
            <Text style={styles.infoCoordinates}>
              {location?.coordinates.longitude.toFixed(4)}° E
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#006a4e',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0f2f1',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerCountry: {
    fontSize: 12,
    color: '#b59410',
    fontWeight: '600',
  },
  countdownSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  countdownSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },
  currentPrayerSection: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  currentCard: {
    backgroundColor: '#f0f7f6',
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50',
    borderRadius: 16,
  },
  currentCardContent: {
    padding: 16,
  },
  currentLabel: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  currentPrayerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006a4e',
    marginBottom: 4,
  },
  currentTime: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  scheduleSection: {
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  prayerCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  prayerCardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  prayerCardSmall: {
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  nextPrayerHighlight: {
    backgroundColor: '#f0f7f6',
    borderColor: '#006a4e',
    borderWidth: 2,
  },
  prayerCardSmallContent: {
    padding: 14,
    alignItems: 'center',
  },
  prayerCardTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006a4e',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  nextPrayerText: {
    color: '#006a4e',
    fontWeight: '800',
  },
  prayerCardName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footerInfo: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#b59410',
  },
  infoContent: {
    padding: 16,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#b59410',
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  infoCoordinates: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
});
