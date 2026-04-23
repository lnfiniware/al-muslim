import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocation } from '@hooks/useLocation';
import { hijriService } from '@services/hijriService';
import { prayerTimesService } from '@services/prayerTimesService';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { getDate } from 'date-fns';

export default function CalendarScreen() {
  const { location, loading: locationLoading } = useLocation();
  const [hijriData, setHijriData] = useState<any>(null);
  const [prayerDays, setPrayerDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location?.coordinates) {
      loadCalendarData();
    }
  }, [location]);

  const loadCalendarData = async () => {
    try {
      // Get current Hijri date
      const today = new Date();
      const hijri = hijriService.gregorianToHijri(today);
      setHijriData(hijri);

      // Get prayer times for next 30 days
      const days = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        const hijriDate = hijriService.gregorianToHijri(date);
        const prayerTimes = prayerTimesService.getPrayerTimes(
          date,
          location?.coordinates.latitude || 0,
          location?.coordinates.longitude || 0,
          'SHAFI'
        );

        days.push({
          gregorianDate: date,
          hijriDate,
          prayerTimes,
          dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        });
      }
      setPrayerDays(days);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };;

  if (locationLoading || loading || !hijriData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Calendar...</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>📅 Prayer Calendar</Text>
          <Text style={styles.headerSubtitle}>Next 30 Days</Text>
        </LinearGradient>

        {/* Current Date Info */}
        <View style={styles.currentDateSection}>
          <LinearGradient
            colors={[colors.secondary, '#d4a82e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.currentDateCard}
          >
            <Text style={styles.currentDateLabel}>Today</Text>
            <Text style={styles.currentDateGregorian}>
              {prayerDays[0]?.gregorianDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <Text style={styles.currentDateHijri}>
              {hijriData.day} {hijriData.month} {hijriData.year} AH
            </Text>
          </LinearGradient>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarSection}>
          <Text style={styles.calendarTitle}>Prayer Times for Next 30 Days</Text>

          <View style={styles.daysContainer}>
            {prayerDays.map((day, index) => (
              <View key={index} style={styles.dayCard}>
                {/* Date Header */}
                <LinearGradient
                  colors={
                    index === 0
                      ? [colors.primary, colors.primaryDark]
                      : ['rgba(0, 106, 78, 0.05)', 'rgba(0, 106, 78, 0.02)']
                  }
                  style={styles.dayHeader}
                >
                  <Text style={[styles.dayName, index === 0 && styles.todayDayName]}>
                    {day.dayOfWeek}
                  </Text>
                  <Text style={[styles.dayDate, index === 0 && styles.todayDayDate]}>
                    {getDate(day.gregorianDate)}
                  </Text>
                  <Text style={[styles.dayHijri, index === 0 && styles.todayHijri]}>
                    {day.hijriDate.day}/{day.hijriDate.month}
                  </Text>
                </LinearGradient>

                {/* Prayer Times */}
                <View style={styles.prayersGrid}>
                  {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => {
                    const prayerData = day.prayerTimes[prayer];
                    const timeString = prayerData?.timeString || '--:--';
                    return (
                      <View key={prayer} style={styles.prayerItem}>
                        <Text style={styles.prayerName}>
                          {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                        </Text>
                        <Text style={styles.prayerTime}>{timeString}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendSection}>
          <LinearGradient
            colors={['rgba(25, 118, 210, 0.08)', 'rgba(25, 118, 210, 0.04)']}
            style={styles.legendCard}
          >
            <Text style={styles.legendTitle}>ℹ️ About This Calendar</Text>
            <Text style={styles.legendText}>
              • Prayer times are calculated for your location{'\n'}
              • Times update based on your current position{'\n'}
              • Hijri dates shown for Islamic reference{'\n'}
              • Based on Shafi'i calculation method
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.gray,
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  currentDateSection: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  currentDateCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  currentDateLabel: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 4,
  },
  currentDateGregorian: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  currentDateHijri: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  calendarSection: {
    paddingHorizontal: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  daysContainer: {
    gap: 12,
    marginBottom: 24,
  },
  dayCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray,
    flex: 1,
  },
  todayDayName: {
    color: colors.white,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    flex: 0.8,
  },
  todayDayDate: {
    color: colors.white,
  },
  dayHijri: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '600',
    flex: 0.8,
  },
  todayHijri: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  prayersGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 106, 78, 0.1)',
  },
  prayerItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 106, 78, 0.05)',
  },
  prayerName: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 3,
  },
  prayerTime: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'monospace',
  },
  legendSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  legendCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.2)',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  legendText: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 18,
  },
});
