import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { hijriService, type HijriDate } from '@services/hijriService';
import { colors } from '@theme/colors';
import { i18n } from '@core/i18n';

interface HijriCalendarProps {
  onPress?: () => void;
}

export function HijriCalendar({ onPress }: HijriCalendarProps) {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const isArabic = i18n.isArabic();

  useEffect(() => {
    // Set initial hijri date
    setHijriDate(hijriService.getCurrentHijriDate());

    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isArabic]);

  if (!hijriDate) return null;

  const isRamadan = hijriDate.month === 9;

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Pressable onPress={onPress} style={{ width: '100%' }}>
        <LinearGradient
          colors={[
            isRamadan ? '#8B4513' : colors.primary,
            isRamadan ? '#654321' : colors.primaryDark,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.header}>
            <Text style={styles.title}>📅 Islamic Calendar</Text>
            {isRamadan && <Text style={styles.ramadanBadge}>🌙 Ramadan</Text>}
          </View>

          <View style={styles.content}>
            <View style={styles.dateSection}>
              <Text style={styles.hijriDay}>{hijriDate.day}</Text>
              <View style={styles.monthYearSection}>
                <Text style={styles.hijriMonth}>
                  {isArabic ? hijriDate.monthNameArabic : hijriDate.monthName}
                </Text>
                <Text style={styles.hijriYear}>{hijriDate.year} AH</Text>
              </View>
            </View>

            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Current Time</Text>
              <Text style={styles.time}>{currentTime}</Text>
            </View>
          </View>

          {isRamadan && (
            <View style={styles.ramadanInfo}>
              <Text style={styles.ramadanText}>
                Days remaining in Ramadan: {hijriService.getDaysInRamadan()}
              </Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  ramadanBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hijriDay: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginRight: 12,
  },
  monthYearSection: {
    justifyContent: 'center',
  },
  hijriMonth: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  hijriYear: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  timeSection: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  ramadanInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  ramadanText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});
