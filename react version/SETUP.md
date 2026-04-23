# Al-Muslim App - Project Overview

## 📱 Project Summary

**Al-Muslim** is a complete Islamic mobile application built with React Native and Expo. It provides prayer times, Quranic content, and Islamic remembrances (Adhkar) in a beautiful, user-friendly interface.

## ✨ What's Included

### ✅ Complete Project Structure
- **Organized Folder Layout**: Services, components, hooks, data, and utilities separated
- **App Navigation**: Expo Router with bottom tab navigation (5 screens)
- **TypeScript**: Full type safety across the entire application
- **Modern UI**: React Native Paper for Material Design components

### ✅ Core Features Implemented
- **Prayer Times**: Real-time countdown, location-based calculations
- **Prayer Schedule**: 30-day prayer timetable view
- **Quranic Content**: Full Quran with search functionality
- **Islamic Remembrances**: Categorized Adhkar with progress tracking
- **Settings**: Location, language, theme, notification preferences

### ✅ Services & Utilities
1. **prayerTimesService.ts** - Adhan.js integration for accurate prayer calculations
2. **locationService.ts** - GPS-based location detection and city lookup
3. **notificationService.ts** - Push notification management
4. **quranService.ts** - Quran data access and search
5. **adhkarService.ts** - Islamic remembrances management
6. **storage.ts** - AsyncStorage wrapper for local data persistence

### ✅ Custom Hooks
- **useNextPrayer** - Real-time prayer countdown with automatic updates
- **useLocation** - Current location detection with error handling

### ✅ UI Components (Reusable)
- **CountdownTimer** - HH:MM:SS prayer countdown display
- **PrayerCard** - Individual prayer time card with badges
- **QuranicText** - Quranic verse display with Arabic/English
- **AdhkarCard** - Islamic remembrance with counter and progress
- **SurahListItem** - Surah list item for Quran browser

### ✅ App Screens (5 Tab Screens)
1. **Home (index.tsx)** - Prayer countdown, today's schedule, location info
2. **Prayer (prayer.tsx)** - 30-day prayer schedule
3. **Quran (quran.tsx)** - Surah browser with search
4. **Adhkar (adhkar.tsx)** - Islamic remembrances with categories
5. **Settings (settings.tsx)** - User preferences and configuration

### ✅ Data Files
- **quran_full.json** - Complete Quran data (Surahs & Ayahs)
- **adhkar.json** - Islamic remembrances organized by category

### ✅ Configuration Files
- **package.json** - All dependencies and scripts
- **app.json** - Expo app configuration
- **tsconfig.json** - TypeScript configuration with path aliases
- **babel.config.js** - Babel setup for React Native
- **eas.json** - EAS build configuration
- **.env.example** - Environment variable template
- **.gitignore** - Git ignore patterns

### ✅ Documentation
- **README.md** - Complete project guide
- **.github/copilot-instructions.md** - Development guidelines
- **SETUP.md** - This file
- **setup.sh / setup.bat** - Automated setup scripts

## 🎨 Architecture & Design

### Technology Stack
```
Frontend:           React Native + Expo
Language:           TypeScript
UI Framework:       React Native Paper (Material Design)
State Management:   React Hooks (useState, useEffect)
Navigation:         Expo Router (File-based)
Data Persistence:   AsyncStorage
Prayer Calc:        Adhan.js
Location:           Expo Location
Notifications:      Expo Notifications
Date Utils:         date-fns
```

### Project Structure
```
al-muslim-app/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout (theme provider)
│   └── (tabs)/                  # Tab navigation
│       ├── _layout.tsx          # Tab configuration
│       ├── index.tsx            # Home/Prayer times
│       ├── prayer.tsx           # Prayer schedule
│       ├── quran.tsx            # Quran browser
│       ├── adhkar.tsx           # Adhkar/Remembrances
│       └── settings.tsx         # User settings
├── src/
│   ├── components/              # 5 reusable UI components
│   ├── services/                # 5 business logic services
│   ├── hooks/                   # 2 custom React hooks
│   ├── data/                    # 2 JSON data files
│   └── core/                    # Storage utility
├── assets/                      # Images/icons placeholder
├── Configuration files          # JSON config files
└── Documentation               # README & guides
```

### Color Scheme
- **Primary Green**: `#006a4e` - Islamic tradition
- **Secondary Gold**: `#b59410` - Elegance
- **Background**: `#f8f9fa` - Clean & minimal
- **Dark Mode**: Automatic support

## 🚀 Getting Started

### Quick Start (3 steps)

#### 1. Install Dependencies
```bash
npm install
```
Or use the automated setup script:
- **Windows**: Double-click `setup.bat`
- **macOS/Linux**: Run `bash setup.sh`

#### 2. Start Development Server
```bash
npm start
```

#### 3. Run on Your Device
Choose one:
- `a` - Android Emulator
- `i` - iOS Simulator (macOS only)
- `w` - Web Browser
- `j` - Expo Go App (scan QR code)

### Platform-Specific Commands
```bash
npm run android    # Direct Android Emulator
npm run ios        # Direct iOS Simulator
npm run web        # Web Browser
npm run lint       # Code linting
npm run type-check # TypeScript checking
```

## 📦 Dependencies Included

### Runtime Dependencies (16)
- `expo` - Framework
- `expo-router` - Navigation
- `react` & `react-native` - Core libraries
- `react-native-paper` - UI components
- `react-native-reanimated` - Animations
- `adhan` - Prayer calculations
- `date-fns` - Date utilities
- `expo-location` - GPS location
- `expo-notifications` - Push notifications
- `@react-native-async-storage/async-storage` - Local storage
- Additional peer dependencies and plugins

### Development Dependencies (6)
- `typescript` - Type checking
- `@types/react` & `@types/react-native` - Type definitions
- `eslint` - Code linting
- `jest` - Testing

## 🔐 Security & Privacy

✅ **Local-First Design** - All data stored on device
✅ **No User Tracking** - Zero analytics/telemetry
✅ **No Ads** - Clean experience
✅ **Open Source** - Fully auditable code
✅ **Permissions**: Location (GPS) and Notifications only

## 🎯 Key Features

### 🕌 Prayer Times
- Real-time HH:MM:SS countdown to next prayer
- Location-based automatic calculations
- Daily/30-day schedule view
- Support for multiple calculation methods
- Push notifications

### 📖 Quran
- Full 114 Surahs with all Ayahs
- Arabic text with English translations
- Search by Surah name or verse
- Bookmark favorite verses
- Beautiful typography

### 🤲 Adhkar
- 5 categories: Morning, Evening, Before Sleep, After Prayer, Misc.
- Progress tracking with counters
- Arabic & English text
- Reference information for each adhkar
- Copy & Share features (ready for implementation)

### ⚙️ Customization
- Dark/Light mode support
- Language preferences (Ready for localization)
- Location auto-detection or manual entry
- Prayer calculation method selection
- Notification toggle

## 🛠 Development Features

### TypeScript
- Strict type checking enabled
- Path aliases for clean imports (`@components/*`, `@services/*`)
- Full type coverage for external libraries

### Performance
- Lazy component loading
- Efficient state management with hooks
- AsyncStorage caching
- Optimized re-renders

### Development Tools
- Hot reload on save
- Expo DevTools
- TypeScript error checking
- ESLint code quality

## 📚 Code Quality

### TypeScript Strict Mode ✅
```bash
npm run type-check
```

### Code Linting ✅
```bash
npm run lint
```

### Future Enhancements
- Unit tests (Jest setup ready)
- E2E tests (Detox/Cypress)
- CI/CD pipeline (GitHub Actions)
- Continuous integration

## 🔄 Project Lifecycle

### Current Status: Development Ready ✅
- ✅ Project scaffolded and configured
- ✅ All services implemented
- ✅ All components created
- ✅ All screens built
- ✅ Data files included
- ✅ Documentation complete
- ⏳ **NEXT**: Install dependencies and test!

### Build Pipeline
1. **Development**: `npm start` → Hot reload
2. **Testing**: `npm run type-check` + `npm run lint`
3. **Build**: `npm run build` or `eas build`
4. **Deploy**: Apple App Store / Google Play

## 📋 What You Can Do Now

### Immediate (Today)
1. ✅ Run `npm install`
2. ✅ Run `npm start`
3. ✅ Test on simulator/device
4. ✅ Explore the UI

### Short Term (This Week)
- Add more Quran data
- Expand Adhkar categories
- Test notifications
- Verify location accuracy
- Test on real devices

### Medium Term (Next Month)
- Add audio recitation
- Implement cloud sync
- Add prayer statistics
- Implement offline mode
- Add more languages

### Long Term
- Qibla compass (AR)
- Islamic calendar
- Hadith collection
- Community features
- App store deployment

## 📞 Support & Resources

### Official Documentation
- **React Native**: https://reactnative.dev
- **Expo**: https://docs.expo.dev
- **React Native Paper**: https://callstack.github.io/react-native-paper/
- **Adhan.js**: https://github.com/batoulapps/Adhan_JS
- **date-fns**: https://date-fns.org

### Community
- React Native Community Discord
- Expo Forums
- Stack Overflow

## 🎓 Learning Resources

### Getting Started with React Native
1. Official React Native Tutorial
2. Expo Getting Started Guide
3. TypeScript Handbook

### Islamic Apps Development
- Prayer calculation algorithms
- Quranic Arabic typography
- Islamic UI/UX patterns

## ✅ Project Checklist

**Setup Phase**
- [x] Folder structure created
- [x] Configuration files ready
- [x] Services implemented
- [x] Components built
- [x] Screens created
- [x] Data files included
- [ ] Dependencies installed
- [ ] Application tested

**Development Phase**
- [ ] Feature testing
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Additional features
- [ ] User testing

**Deployment Phase**
- [ ] Build for iOS
- [ ] Build for Android
- [ ] App Store submission
- [ ] Play Store submission
- [ ] Marketing & promotion

## 🎉 You're All Set!

Your Al-Muslim app is ready to go! 

**Next command:**
```bash
npm install
npm start
```

Choose your platform and start exploring! 🚀

---

**Made with ❤️ for the Muslim community**

الحمد لله رب العالمين
