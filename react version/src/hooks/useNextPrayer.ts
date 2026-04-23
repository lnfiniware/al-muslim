import { useEffect, useState, useRef } from 'react';
import { prayerTimesService, PrayerTime, DailyPrayers } from '@services/prayerTimesService';

export interface NextPrayerState {
  nextPrayer: PrayerTime | null;
  currentPrayer: PrayerTime | null;
  countdown: string;
  dailyPrayers: DailyPrayers | null;
  loading: boolean;
  error: string | null;
}

export const useNextPrayer = (
  latitude: number,
  longitude: number,
  madhab: 'SHAFI' | 'HANAFI' = 'SHAFI',
  highLatitudeRule: 'MIDDLE_OF_THE_NIGHT' | 'SEVENTH_OF_THE_NIGHT' | 'TWILIGHT_ANGLE' = 'MIDDLE_OF_THE_NIGHT'
): NextPrayerState => {
  const [state, setState] = useState<NextPrayerState>({
    nextPrayer: null,
    currentPrayer: null,
    countdown: '00:00:00',
    dailyPrayers: null,
    loading: true,
    error: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Location not available',
      }));
      return;
    }

    const updatePrayerTimes = () => {
      try {
        const today = new Date();
        const dailyPrayers = prayerTimesService.getPrayerTimes(
          today,
          latitude,
          longitude,
          madhab,
          highLatitudeRule
        );

        const nextPrayer = prayerTimesService.getNextPrayer(dailyPrayers);
        const currentPrayer = prayerTimesService.getCurrentPrayer(dailyPrayers);

        let countdown = '00:00:00';
        if (nextPrayer) {
          const timeUntil = prayerTimesService.calculateTimeUntil(nextPrayer.time);
          countdown = prayerTimesService.formatCountdown(
            timeUntil.hours,
            timeUntil.minutes,
            timeUntil.seconds
          );
        }

        setState({
          nextPrayer,
          currentPrayer,
          countdown,
          dailyPrayers,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      }
    };

    // Initial update
    updatePrayerTimes();

    // Update every second
    intervalRef.current = setInterval(updatePrayerTimes, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [latitude, longitude, madhab, highLatitudeRule]);

  return state;
};
