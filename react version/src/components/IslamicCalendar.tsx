import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@theme/colors';

interface HijriDate {
  year: number;
  month: number;
  day: number;
}

interface IslamicHoliday {
  name: string;
  date: string;
  description: string;
  icon: string;
}

export function IslamicCalendar() {
  const [hijriDate, setHijriDate] = useState<HijriDate>({ year: 0, month: 0, day: 0 });
  const [holidays, setHolidays] = useState<IslamicHoliday[]>([]);

  useEffect(() => {
    calculateHijriDate();
    loadHolidays();
  }, []);

  const calculateHijriDate = () => {
    // Simplified Gregorian to Hijri conversion
    const today = new Date();
    const jd =
      Math.floor((today.getTime() - new Date(1970, 0, 1).getTime()) / 86400000) + 2440587.5;
    const l = jd + 68569;
    const n = Math.floor((4 * l) / 146097);
    const l2 = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (l2 + 1)) / 1461001);
    const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
    const j = Math.floor((80 * l3) / 2447);
    const day = l3 - Math.floor((2447 * j) / 80);
    const l4 = Math.floor(j / 11);
    const month = j + 2 - 12 * l4;
    const year = 100 * (n - 49) + i + l4;

    const hijri = gregorianToHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
    setHijriDate(hijri);
  };

  const gregorianToHijri = (g_y: number, g_m: number, g_d: number): HijriDate => {
    const jd =
      Math.floor(
        (1461 * (g_y + 4800 + Math.floor((g_m - 14) / 12))) / 4 +
          Math.floor((367 * (g_m - 2 - 12 * Math.floor((g_m - 14) / 12))) / 12) -
          Math.floor(
            (3 * Math.floor((g_y + 4900 + Math.floor((g_m - 14) / 12)) / 100)) / 4
          ) +
          g_d -
          32045
      );

    let h_y, h_m, h_d;
    const l = jd + 1948440 + 0.5;
    const n = Math.floor((l / 36524.25) * 100);
    const jd2 = l - Math.floor((36524.25 * n) / 100);
    const k = Math.floor((jd2 / 365.2422) * 100);
    const jd3 = jd2 - Math.floor((365.2422 * k) / 100);
    const j = Math.floor((jd3 / 30.6001) * 100);
    h_d = Math.floor(jd3 - Math.floor((30.6001 * j) / 100));
    h_m = j - 1;
    if (h_m > 12) {
      h_m = h_m - 12;
    }
    h_y = n - 43 + Math.floor((h_m - 1) / 12);

    return { year: h_y, month: h_m, day: h_d };
  };

  const loadHolidays = () => {
    const currentYear = new Date().getFullYear();
    setHolidays([
      {
        name: 'Muharram 1',
        date: 'Islamic New Year',
        description: 'First day of the Islamic calendar',
        icon: '🌙',
      },
      {
        name: 'Ashura',
        date: 'Muharram 9-10',
        description: 'Day of remembrance and voluntary fasting',
        icon: '💪',
      },
      {
        name: 'Eid al-Fitr',
        date: 'Shawwal 1',
        description: 'Festival celebrating the end of Ramadan',
        icon: '🎉',
      },
      {
        name: 'Arafat Day',
        date: 'Dhul-Hijjah 9',
        description: 'The most important day of Hajj',
        icon: '⛺',
      },
      {
        name: 'Eid al-Adha',
        date: 'Dhul-Hijjah 10',
        description: 'Festival of Sacrifice',
        icon: '🐑',
      },
      {
        name: 'Mawlid al-Nabi',
        date: 'Rabi al-awwal 12',
        description: 'Birthday of Prophet Muhammad (PBUH)',
        icon: '🕌',
      },
    ]);
  };

  const monthNames = [
    'Muharram',
    'Safar',
    'Rabi al-awwal',
    'Rabi al-thani',
    'Jumada al-awwal',
    'Jumada al-thani',
    'Rajab',
    'Sha\'ban',
    'Ramadan',
    'Shawwal',
    'Dhul-Qi\'dah',
    'Dhul-Hijjah',
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Islamic Calendar</Text>
        <View style={styles.currentDate}>
          <Text style={styles.hijriDate}>
            {hijriDate.day} {hijriDate.month > 0 ? monthNames[hijriDate.month - 1] : ''}{' '}
            {hijriDate.year} H
          </Text>
          <Text style={styles.gregorianDate}>
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Hijri Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hijri Day</Text>
          <Text style={styles.infoValue}>{hijriDate.day}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hijri Month</Text>
          <Text style={styles.infoValue}>
            {hijriDate.month > 0 ? monthNames[hijriDate.month - 1] : ''}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hijri Year</Text>
          <Text style={styles.infoValue}>{hijriDate.year}</Text>
        </View>
      </View>

      {/* Islamic Holidays */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Islamic Holidays</Text>

        {holidays.map((holiday, index) => (
          <View key={index} style={styles.holidayCard}>
            <Text style={styles.holidayIcon}>{holiday.icon}</Text>
            <View style={styles.holidayContent}>
              <Text style={styles.holidayName}>{holiday.name}</Text>
              <Text style={styles.holidayDate}>{holiday.date}</Text>
              <Text style={styles.holidayDescription}>{holiday.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Hijri Months Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hijri Months</Text>
        <View style={styles.monthsGrid}>
          {monthNames.map((month, index) => (
            <View
              key={index}
              style={[
                styles.monthCard,
                index + 1 === hijriDate.month && styles.monthCardActive,
              ]}
            >
              <Text
                style={[
                  styles.monthNumber,
                  index + 1 === hijriDate.month && styles.monthNumberActive,
                ]}
              >
                {index + 1}
              </Text>
              <Text
                style={[
                  styles.monthName,
                  index + 1 === hijriDate.month && styles.monthNameActive,
                ]}
              >
                {month.substring(0, 3)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.tertiary,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  currentDate: {
    alignItems: 'center',
  },
  hijriDate: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  gregorianDate: {
    fontSize: 14,
    color: colors.gray,
  },
  infoCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  holidayCard: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  holidayIcon: {
    fontSize: 24,
  },
  holidayContent: {
    flex: 1,
  },
  holidayName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  holidayDate: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  holidayDescription: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 18,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  monthCard: {
    flex: 0.31,
    aspectRatio: 1,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  monthCardActive: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  monthNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  monthNumberActive: {
    color: colors.white,
  },
  monthName: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.gray,
    textAlign: 'center',
  },
  monthNameActive: {
    color: colors.white,
  },
  spacing: {
    height: 40,
  },
});
