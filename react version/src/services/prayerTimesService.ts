// Load adhan library synchronously
let Adhan: any;
try {
  // @ts-ignore
  Adhan = require('adhan');
  console.log('Adhan library loaded successfully');
} catch (error) {
  console.warn('Adhan library not available, using fallback times');
}

const getAdhan = () => {
  if (!Adhan) {
    try {
      // @ts-ignore
      Adhan = require('adhan');
    } catch (e) {
      return null;
    }
  }
  return Adhan;
};

export interface PrayerTime {
  name: string;
  time: Date;
  timeString: string;
}

export interface DailyPrayers {
  fajr: PrayerTime;
  sunrise: PrayerTime;
  dhuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
  date: Date;
}

export type MadhabType = 'SHAFI' | 'HANAFI';
export type HighLatitudeRuleType = 'MIDDLE_OF_THE_NIGHT' | 'SEVENTH_OF_THE_NIGHT' | 'TWILIGHT_ANGLE';

// Fallback mock prayer times
const getMockPrayerTimes = (date: Date): DailyPrayers => {
  const createPrayerTime = (name: string, hour: number, minute: number): PrayerTime => {
    const time = new Date(date);
    time.setHours(hour, minute, 0, 0);
    return {
      name,
      time,
      timeString: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    };
  };

  return {
    fajr: createPrayerTime('Fajr', 5, 30),
    sunrise: createPrayerTime('Sunrise', 6, 45),
    dhuhr: createPrayerTime('Dhuhr', 12, 0),
    asr: createPrayerTime('Asr', 15, 30),
    maghrib: createPrayerTime('Maghrib', 18, 0),
    isha: createPrayerTime('Isha', 19, 30),
    date,
  };
};

// Calculate prayer times using adhan or fallback
const calculatePrayerTimes = (
  date: Date,
  latitude: number,
  longitude: number,
  madhab: MadhabType = 'SHAFI'
): DailyPrayers => {
  try {
    const adhanLib = getAdhan();
    console.log('Calculating prayer times for:', { latitude, longitude, date });
    
    if (adhanLib && adhanLib.Coordinates && adhanLib.PrayerTimes) {
      const { Coordinates, PrayerTimes, CalculationMethod, Madhab } = adhanLib;
      
      const coordinates = new Coordinates(latitude, longitude);
      const params = CalculationMethod.MuslimWorldLeague();
      params.madhab = madhab === 'HANAFI' ? Madhab.Hanafi : Madhab.Shafi;

      const prayerTimes = new PrayerTimes(coordinates, date, params);

      console.log('Prayer times calculated:', {
        fajr: prayerTimes.fajr,
        dhuhr: prayerTimes.dhuhr,
        maghrib: prayerTimes.maghrib,
      });

      const formatTime = (time: Date): string => {
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      return {
        fajr: {
          name: 'Fajr',
          time: prayerTimes.fajr,
          timeString: formatTime(prayerTimes.fajr),
        },
        sunrise: {
          name: 'Sunrise',
          time: prayerTimes.sunrise,
          timeString: formatTime(prayerTimes.sunrise),
        },
        dhuhr: {
          name: 'Dhuhr',
          time: prayerTimes.dhuhr,
          timeString: formatTime(prayerTimes.dhuhr),
        },
        asr: {
          name: 'Asr',
          time: prayerTimes.asr,
          timeString: formatTime(prayerTimes.asr),
        },
        maghrib: {
          name: 'Maghrib',
          time: prayerTimes.maghrib,
          timeString: formatTime(prayerTimes.maghrib),
        },
        isha: {
          name: 'Isha',
          time: prayerTimes.isha,
          timeString: formatTime(prayerTimes.isha),
        },
        date,
      };
    }
  } catch (error) {
    console.warn('Error calculating prayer times with adhan:', error);
  }

  console.log('Using mock prayer times as fallback');
  return getMockPrayerTimes(date);
};

export const prayerTimesService = {
  async initializeAdhan() {
    getAdhan();
    return Adhan;
  },

  getPrayerTimes(
    date: Date,
    latitude: number,
    longitude: number,
    madhab: MadhabType = 'SHAFI',
    highLatitudeRule: HighLatitudeRuleType = 'MIDDLE_OF_THE_NIGHT'
  ): DailyPrayers {
    // Calculate using adhan if available, fallback to mock
    return calculatePrayerTimes(date, latitude, longitude, madhab);
  },

  getPrayerList(dailyPrayers: DailyPrayers): PrayerTime[] {
    return [
      dailyPrayers.fajr,
      dailyPrayers.sunrise,
      dailyPrayers.dhuhr,
      dailyPrayers.asr,
      dailyPrayers.maghrib,
      dailyPrayers.isha,
    ];
  },

  getNextPrayer(dailyPrayers: DailyPrayers, currentTime?: Date): PrayerTime | null {
    const now = currentTime || new Date();
    const prayers = [
      dailyPrayers.fajr,
      dailyPrayers.dhuhr,
      dailyPrayers.asr,
      dailyPrayers.maghrib,
      dailyPrayers.isha,
    ];

    for (const prayer of prayers) {
      if (prayer.time > now) {
        return prayer;
      }
    }

    return null;
  },

  getCurrentPrayer(dailyPrayers: DailyPrayers, currentTime?: Date): PrayerTime | null {
    const now = currentTime || new Date();
    const prayers = [
      dailyPrayers.fajr,
      dailyPrayers.dhuhr,
      dailyPrayers.asr,
      dailyPrayers.maghrib,
      dailyPrayers.isha,
    ];

    for (let i = 0; i < prayers.length; i++) {
      const current = prayers[i];
      const next = prayers[i + 1];

      if (now >= current.time && (!next || now < next.time)) {
        return current;
      }
    }

    return null;
  },

  calculateTimeUntil(targetTime: Date, fromTime?: Date): { hours: number; minutes: number; seconds: number } {
    const now = fromTime || new Date();
    let diff = targetTime.getTime() - now.getTime();

    if (diff < 0) {
      diff = 0;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  },

  formatCountdown(hours: number, minutes: number, seconds: number): string {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },
};
