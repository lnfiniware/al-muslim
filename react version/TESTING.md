# 📱 Al-Muslim App - Testing Guide

## 🚀 Quick Start with Expo Go

### Prerequisites
- **Expo CLI** installed: `npm install -g expo-cli`
- **Expo Go app** installed on your phone (iOS App Store or Google Play)
- **Node.js** and **npm** installed
- Same WiFi network for your computer and device

### Starting the Dev Server

1. **Navigate to project directory:**
   ```bash
   cd "e:\Zyad\Scripts\Ma shitty projects\almuslimphone"
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   expo start
   ```
   or
   ```bash
   npx expo start
   ```

4. **You'll see a QR code in terminal and a menu:**
   ```
   ┌─────────────────────────────────────────────────────────┐
   │  Expo Go                                                 │
   │                                                          │
   │  ► Press 'a' for Android                                │
   │  ► Press 'i' for iOS (macOS only)                       │
   │  ► Press 'w' for web                                    │
   │  ► Press 'r' to restart                                 │
   │  ► Press 'm' for menu                                   │
   │  ► Press 'q' to quit                                    │
   │                                                          │
   │  Scan the QR code above with your phone camera          │
   └─────────────────────────────────────────────────────────┘
   ```

---

## 📲 Testing on Physical Device

### Option 1: Scan QR Code (Recommended)
1. Open **Expo Go app** on your phone
2. Tap the **QR Scanner** (camera icon at bottom)
3. Point your phone camera at the **QR code** displayed in terminal
4. Wait for the app to load (first load takes 30-60 seconds)

### Option 2: Tunnel Connection (Works over internet)
1. In terminal, press `m` to open menu
2. Select **Tunnel** option
3. Scan the new QR code from any network

### Option 3: Manual URL Entry
1. Press `m` for menu in terminal
2. Copy the displayed URL
3. In Expo Go, tap **Scan QR code** and manually type the URL

---

## 📋 Testing Checklist

### ✅ Core Features
- [ ] **Onboarding Screen**
  - [ ] Location permission request works
  - [ ] Notification permission request works
  - [ ] "Get Started" button completes onboarding
  - [ ] Skip button works

- [ ] **Home Screen**
  - [ ] Prayer times display correctly
  - [ ] Countdown timer updates (if next prayer within 24 hours)
  - [ ] Current prayer highlighting works
  - [ ] Location shows your city name
  - [ ] Pull-to-refresh works

- [ ] **Prayer Schedule (Prayer Tab)**
  - [ ] 30-day calendar loads
  - [ ] All prayer times visible
  - [ ] Search/filter by date works
  - [ ] Swipe navigation between days works

- [ ] **Quran (Quran Tab)**
  - [ ] Surah list displays all 114 surahs
  - [ ] Search by surah name works
  - [ ] Selecting surah opens full Mushaf view
  - [ ] Arabic verses display properly
  - [ ] Navigation between surahs works
  - [ ] Go back to list button works

- [ ] **Adhkar (Adhkar Tab)**
  - [ ] All three categories visible (Morning, Evening, Sleep)
  - [ ] Counter increments on tap
  - [ ] Progress saves between sessions
  - [ ] Dark mode counter visibility

- [ ] **Qiblah (Qiblah Tab)**
  - [ ] Compass displays
  - [ ] Needle points to Kaaba direction
  - [ ] Direction angle updates with device rotation
  - [ ] Location shows latitude/longitude
  - [ ] Instructions display clearly

- [ ] **Calendar (Calendar Tab)**
  - [ ] 30-day calendar visible
  - [ ] Gregorian and Hijri dates show
  - [ ] All prayer times for each day displayed
  - [ ] Today highlighted

- [ ] **Settings (Settings Tab)**
  - [ ] Language switcher works (English ↔ Arabic)
  - [ ] Theme switcher works (Light ↔ Dark)
  - [ ] Settings persist after restart
  - [ ] Prayer calculation method selector works
  - [ ] Notification toggle works

### 🌐 Language & Localization
- [ ] **English Mode**
  - [ ] All text displays in English
  - [ ] Text direction is LTR (left-to-right)
  - [ ] Menus and buttons readable

- [ ] **Arabic Mode**
  - [ ] All text displays in Arabic
  - [ ] Text direction is RTL (right-to-left)
  - [ ] Quranic verses properly aligned RTL
  - [ ] Settings labels in Arabic
  - [ ] Navigation preserved in RTL mode

### 🌓 Theme Testing
- [ ] **Light Theme**
  - [ ] All text readable
  - [ ] Colors contrast properly
  - [ ] Cards and buttons visible

- [ ] **Dark Theme**
  - [ ] Dark background applies globally
  - [ ] Text visible (not too dark)
  - [ ] Cards readable
  - [ ] No glaring white areas

### 🔔 Notifications (if enabled)
- [ ] First prayer notification shows
- [ ] Notification title shows prayer name
- [ ] Notification body shows prayer time
- [ ] Tapping notification opens app

### 📍 Location Services
- [ ] Grant location permission on first launch
- [ ] Prayer times calculate for your location
- [ ] "Refresh Location" button updates location
- [ ] App works without location (shows error gracefully)

### 🔄 App State
- [ ] Settings persist after closing/reopening app
- [ ] Language preference saved
- [ ] Theme preference saved
- [ ] Adhkar counter progress saved
- [ ] Onboarding not shown again

### ⚡ Performance
- [ ] App loads within 5 seconds
- [ ] Scrolling is smooth (no stutters)
- [ ] Screen transitions are smooth
- [ ] No crashes during normal use
- [ ] Pull-to-refresh completes quickly

---

## 🐛 Troubleshooting

### App won't load
```bash
# Clear cache and reinstall
expo prebuild --clean
npm install
expo start
```

### QR code not scanning
- Ensure good lighting
- Try bringing phone closer/further
- Try tunnel mode instead: press `m` then select Tunnel

### Prayer times incorrect
- Grant location permission
- Go to Settings → Location → turn on "Allow Location"
- Tap "Refresh Location" button

### Language didn't change
- Go to Settings
- Toggle Language to Arabic, then back to English
- Restart app: press `r` in terminal

### Dark theme not applying
- Go to Settings → Theme → select Dark
- If still not working, restart app

### Notifications not showing
- Go to Settings → enable "Prayer Reminders"
- Grant notification permission
- Ensure next prayer is within 24 hours

---

## 📊 Testing Report Template

```
Date: [Date]
Tester: [Your Name]
Device: [Phone Model & OS]
App Version: 1.0.0

✅ Features Working:
- [Feature name]

⚠️ Issues Found:
- [Issue description]
- [Steps to reproduce]

💡 Suggestions:
- [Improvement idea]
```

---

## 🎯 Common Testing Scenarios

### Scenario 1: First-time User
1. Fresh app install
2. Grant permissions
3. Complete onboarding
4. Verify all tabs accessible
5. Check prayer times load

### Scenario 2: Switching Languages
1. Start in English
2. Go to Settings → Language → Arabic
3. App should become RTL
4. Switch back to English
5. Verify layout changes back

### Scenario 3: Testing Notifications
1. Enable notifications in Settings
2. Check app at time before next prayer
3. Verify notification appears
4. Tap notification to open app

### Scenario 4: Dark Mode Usage
1. Switch to Dark theme
2. Browse all screens
3. Check text contrast
4. Verify no readability issues

---

## 📞 Support

If you encounter issues:

1. **Check terminal output** - Look for error messages
2. **Check device logs** - Expo Go shows app output
3. **Try restarting** - Press `r` in terminal
4. **Clear cache** - Use `expo prebuild --clean`
5. **Reinstall** - Run `npm install && expo start`

---

## ✅ Testing Completion

Once all tests pass, the app is ready for:
- ✅ Expo Go public sharing
- ✅ Production build via EAS
- ✅ App Store/Play Store submission

**Last Updated:** November 24, 2025
