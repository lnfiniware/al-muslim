import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { useLocation } from '@hooks/useLocation';
import { prayerTimesService } from '@services/prayerTimesService';
import { PrayerCard } from '@components/PrayerCard';
import { addDays, format } from 'date-fns';

interface DayPrayers {
  date: string;
  day: string;
  prayers: any[];
}

export default function PrayerScreen() {
  const { location, loading: locationLoading } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [daysData, setDaysData] = useState<DayPrayers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationLoading && location) {
      generatePrayerTimes();
    }
  }, [location, locationLoading]);

  const generatePrayerTimes = async () => {
    try {
      setLoading(true);
      const days: DayPrayers[] = [];

      // Generate prayer times for next 30 days
      for (let i = 0; i < 30; i++) {
        const date = addDays(new Date(), i);
        const prayers = prayerTimesService.getPrayerTimes(
          date,
          location!.coordinates.latitude,
          location!.coordinates.longitude
        );

        days.push({
          date: format(date, 'yyyy-MM-dd'),
          day: format(date, 'EEE, MMM d'),
          prayers: prayerTimesService.getPrayerList(prayers),
        });
      }

      setDaysData(days);
    } catch (error) {
      console.error('Error generating prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  if (locationLoading || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#006a4e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by date or prayer..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={daysData}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <View style={styles.daySection}>
            <Text style={styles.dayTitle}>{item.day}</Text>
            {item.prayers.map(prayer => (
              <PrayerCard key={prayer.name} prayer={prayer} />
            ))}
          </View>
        )}
        scrollEnabled={true}
      />
    </View>
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
  searchbar: {
    margin: 8,
    backgroundColor: '#fff',
  },
  daySection: {
    marginVertical: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#006a4e',
    marginHorizontal: 16,
    marginVertical: 12,
  },
});
