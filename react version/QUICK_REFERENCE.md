# Al-Muslim App - Quick Reference

## 🚀 Quick Commands

### Setup
```bash
npm install              # Install all dependencies
npm start                # Start development server
```

### Development
```bash
npm run android          # Run on Android Emulator
npm run ios              # Run on iOS Simulator
npm run web              # Run in web browser
npm run lint             # Check code quality
npm run type-check       # TypeScript validation
```

### Build
```bash
eas build --platform android    # Build for Android
eas build --platform ios        # Build for iOS
```

## 📁 File Locations

| Component | Location |
|-----------|----------|
| Home Screen | `app/(tabs)/index.tsx` |
| Prayer Screen | `app/(tabs)/prayer.tsx` |
| Quran Screen | `app/(tabs)/quran.tsx` |
| Adhkar Screen | `app/(tabs)/adhkar.tsx` |
| Settings Screen | `app/(tabs)/settings.tsx` |
| Prayer Service | `src/services/prayerTimesService.ts` |
| Location Service | `src/services/locationService.ts` |
| Quran Service | `src/services/quranService.ts` |
| Adhkar Service | `src/services/adhkarService.ts` |
| Storage Util | `src/core/storage.ts` |
| Custom Hooks | `src/hooks/useNextPrayer.ts`, `useLocation.ts` |
| Quran Data | `src/data/quran_full.json` |
| Adhkar Data | `src/data/adhkar.json` |

## 🎨 Component Guide

### Prayer Countdown Timer
**Location**: `src/components/CountdownTimer.tsx`
```tsx
<CountdownTimer 
  hours={1}
  minutes={30}
  seconds={45}
  prayerName="Dhuhr"
/>
```

### Prayer Card
**Location**: `src/components/PrayerCard.tsx`
```tsx
<PrayerCard 
  prayer={prayerObject}
  isUpcoming={true}
  isCurrentPrayer={false}
/>
```

### Adhkar Card
**Location**: `src/components/AdhkarCard.tsx`
```tsx
<AdhkarCard
  id="adhkar_1"
  arabicText="..."
  englishText="..."
  targetCount={33}
  currentCount={10}
  onIncrement={handleIncrement}
  onReset={handleReset}
/>
```

## 🔧 Service APIs

### Prayer Times Service
```typescript
import { prayerTimesService } from '@services/prayerTimesService';

// Get daily prayers
const prayers = prayerTimesService.getPrayerTimes(
  date,
  latitude,
  longitude,
  'SHAFI', // or 'HANAFI'
  'MIDDLE_OF_THE_NIGHT'
);

// Get next prayer
const nextPrayer = prayerTimesService.getNextPrayer(prayers);

// Calculate countdown
const timeUntil = prayerTimesService.calculateTimeUntil(prayerTime);

// Format countdown
const display = prayerTimesService.formatCountdown(h, m, s);
```

### Location Service
```typescript
import { locationService } from '@services/locationService';

// Get current location
const location = await locationService.getCurrentLocation();

// Get location by city
const coords = await locationService.getLocationByCity('Cairo');

// Clear cached location
locationService.clearCache();
```

### Quran Service
```typescript
import { quranService } from '@services/quranService';

// Get all Surahs
const surahs = quranService.getAllSurahs();

// Get specific Surah
const surah = quranService.getSurah(1); // Al-Fatiha

// Search Ayahs
const results = quranService.searchAyahs('prayer');

// Search Surahs
const found = quranService.searchSurahs('Muhammad');

// Random Ayah
const random = quranService.getRandomAyah();
```

### Adhkar Service
```typescript
import { adhkarService } from '@services/adhkarService';

// Get all categories
const all = adhkarService.getAllAdhkar();

// Get by category
const morning = adhkarService.getAdhkarByCategory('morning');

// Search
const results = adhkarService.searchAdhkar('sleep');

// Random
const random = adhkarService.getRandomAdhkar();
```

### Storage Service
```typescript
import { storageService } from '@core/storage';

// User settings
const settings = await storageService.getUserSettings();
await storageService.updateUserSettings({ language: 'ar' });

// Bookmarks
const bookmarks = await storageService.getBookmarkedVerses();
await storageService.addBookmark('1:1');
await storageService.removeBookmark('1:1');

// Adhkar Progress
const progress = await storageService.getAdhkarProgress();
await storageService.updateAdhkarProgress('adhkar_1', 33);

// First Launch
const isFirst = await storageService.isFirstLaunch();
await storageService.markLaunched();
```

## 🪝 Hook Usage

### useNextPrayer
```typescript
import { useNextPrayer } from '@hooks/useNextPrayer';

const prayerState = useNextPrayer(latitude, longitude);

// Access:
// - prayerState.nextPrayer (PrayerTime object)
// - prayerState.currentPrayer (PrayerTime object)
// - prayerState.countdown (formatted string)
// - prayerState.dailyPrayers (all prayers)
// - prayerState.loading (boolean)
// - prayerState.error (string)
```

### useLocation
```typescript
import { useLocation } from '@hooks/useLocation';

const { location, loading, error } = useLocation();

// Access:
// - location.city (string)
// - location.country (string)
// - location.coordinates.latitude (number)
// - location.coordinates.longitude (number)
```

## 🎨 Color References

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#006a4e` | Primary actions, headers |
| Secondary Gold | `#b59410` | Secondary actions |
| Background | `#f8f9fa` | Screen backgrounds |
| Surface | `#ffffff` | Cards, containers |
| Success | `#4caf50` | Completed state |
| Warning | `#ff9800` | In-progress state |
| Error | `#d32f2f` | Errors, important alerts |
| Text Primary | `#121212` | Main text |
| Text Secondary | `#666666` | Secondary text |
| Border | `#e0e0e0` | Dividers, borders |

## 📱 Screen Structure

### Home Screen (`index.tsx`)
- Location info header
- Prayer countdown (next prayer)
- Current prayer indicator
- Today's prayer schedule
- Coordinates display

### Prayer Screen (`prayer.tsx`)
- Search bar
- 30-day prayer schedule
- Daily prayer cards
- Expandable day sections

### Quran Screen (`quran.tsx`)
- Search bar
- Surah list (114 items)
- Surah details view
- Verse display

### Adhkar Screen (`adhkar.tsx`)
- Category selector (5 categories)
- Adhkar cards with counters
- Progress tracking per adhkar
- Increment and reset buttons

### Settings Screen (`settings.tsx`)
- Location settings
- Prayer calculation method
- Notification toggle
- Theme selection
- Language settings
- About section

## 🔄 State Management Pattern

All screens use React Hooks:
- `useState` - Local component state
- `useEffect` - Side effects & data loading
- Custom hooks - Reusable logic

Example:
```typescript
const [data, setData] = useState(null);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  // Load from service
};
```

## 📚 Data Structures

### Prayer Object
```typescript
interface PrayerTime {
  name: string;           // "Fajr", "Dhuhr", etc.
  time: Date;            // JavaScript Date object
  timeString: string;    // "05:30"
}
```

### Adhkar Object
```typescript
interface Adhkar {
  id: string;
  text: string;          // Arabic text
  englishTranslation: string;
  count: number;         // Target count
  reference?: string;    // Hadith reference
}
```

### Surah Object
```typescript
interface Surah {
  number: number;
  name: string;          // Arabic name
  englishName: string;
  numberOfAyahs: number;
  revelationType: string; // "Meccan" or "Medinan"
  ayahs: Ayah[];        // Array of verses
}
```

## ✨ Tips & Tricks

1. **Hot Reload**: Save files → changes appear instantly
2. **Debug**: Use React DevTools in Expo
3. **Logs**: Check terminal for console.logs
4. **Storage**: All data persists in AsyncStorage
5. **Location**: Requires permission grant on first use
6. **Notifications**: Test with `notificationService.sendTestNotification()`

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install` |
| TypeScript errors | Run `npm run type-check` |
| Port already in use | Kill process on port 8081 |
| Permissions denied | Grant app permissions in settings |
| Stale cache | Run `npm start -c` |
| Blank screen | Check console for errors |

## 📖 File Import Guide

```typescript
// Components
import { CountdownTimer } from '@components/CountdownTimer';
import { PrayerCard } from '@components/PrayerCard';

// Services
import { prayerTimesService } from '@services/prayerTimesService';
import { locationService } from '@services/locationService';
import { quranService } from '@services/quranService';
import { adhkarService } from '@services/adhkarService';
import { notificationService } from '@services/notificationService';

// Hooks
import { useNextPrayer } from '@hooks/useNextPrayer';
import { useLocation } from '@hooks/useLocation';

// Core
import { storageService } from '@core/storage';

// Data
import quranData from '@data/quran_full.json';
import adhkarData from '@data/adhkar.json';
```

## 🔗 Navigation

All navigation is file-based (Expo Router):
- Add file in `app/(tabs)/` → auto-creates tab
- Rename file → route name changes
- Folder structure = URL structure

---

**Ready to code? Start with `npm start`!** 🚀
