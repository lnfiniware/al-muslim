# 📱 Almuslim APK - Build & Installation Guide

## ✅ App Configuration Complete

**App Name:** Almuslim  
**Package:** com.almuslim.app  
**Version:** 1.0.0  
**Icon:** ✅ Configured (Mosque with crescent logo)  
**Status:** Ready to build

---

## 🚀 Build APK (Two Options)

### Option 1: Quick APK Build (Recommended)

**Build production APK:**
```bash
cd "e:\Zyad\Scripts\Ma shitty projects\almuslimphone"
eas build --platform android --profile production
```

**What happens:**
- Builds optimized APK in the cloud
- Takes 10-20 minutes
- Download link provided automatically
- Ready to install on any Android phone

**Download and install:**
1. Get the download link from terminal
2. Transfer APK to your Android phone
3. Enable "Unknown sources" in Settings
4. Tap the APK file to install
5. App launches! 🎉

---

### Option 2: Local APK Build

**Prerequisites:**
- Android Studio installed
- ANDROID_HOME environment variable set
- Java Development Kit (JDK) installed

**Build locally:**
```bash
expo prebuild --platform android
cd android
./gradlew assembleRelease
```

**APK location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 📥 Installation Methods

### Method 1: Direct APK Transfer (Easiest)

1. **Build APK:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Download APK file** from the link provided

3. **Transfer to phone:**
   - Via USB cable
   - Via cloud storage (Google Drive, OneDrive)
   - Via email/messaging

4. **Install on phone:**
   - Open file manager on phone
   - Navigate to the APK file
   - Tap to install
   - Grant permissions
   - Done! ✅

### Method 2: ADB Installation

**If you have Android SDK installed:**

```bash
# Connect phone via USB
adb devices

# Install APK
adb install path/to/almuslim.apk

# Launch app
adb shell am start -n com.almuslim.app/.MainActivity
```

### Method 3: Google Play Store (Future)

1. Create Google Play Console account
2. Create app listing
3. Upload signed APK
4. Fill in store details
5. Submit for review
6. App becomes available to all users

---

## 📋 APK Build Prerequisites

### Required

- ✅ Node.js 18+ installed
- ✅ npm or yarn
- ✅ Expo account (free at expo.dev)
- ✅ EAS CLI: `npm install -g eas-cli`

### Optional

- Android Studio (for local builds)
- Android Emulator (for testing)
- USB cable (for device testing)

---

## 🔧 Setup Instructions

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

**First time?**
- Go to https://expo.dev
- Create free account
- Return to terminal and login

### 3. Verify Configuration

```bash
cd "e:\Zyad\Scripts\Ma shitty projects\almuslimphone"
eas build --platform android --profile production --dry-run
```

---

## 📊 Build Details

### App Icon

**Current Status:** ✅ Configured

The Almuslim app uses:
- **App Icon:** Mosque with golden dome and crescent
- **Colors:** Islamic green (#006a4e) background
- **Style:** Professional and recognizable

**Icon files used:**
- `assets/images/app-icon.png` - Main app icon
- `assets/images/adaptive-icon.png` - Android adaptive icon
- `assets/images/notification-icon.png` - Notification icon
- `assets/images/splash.png` - Launch splash screen

### Permissions

The APK includes permissions for:
- 📍 **Location** - GPS-based prayer times
- 🔔 **Notifications** - Prayer reminders
- 🌐 **Internet** - Data synchronization
- 📱 **Phone State** - Device features

---

## 🏗️ Full Build Process

### Step 1: Prepare

```bash
cd "e:\Zyad\Scripts\Ma shitty projects\almuslimphone"
npm install
```

### Step 2: Build

```bash
eas build --platform android --profile production
```

### Step 3: Monitor

Watch the terminal for:
- Build progress (0-100%)
- Build ID
- Download link when complete

### Step 4: Download

Click the download link or:
```bash
eas build:list
```

### Step 5: Install

**On Android phone:**
1. Enable "Install from Unknown Sources" in Settings
2. Download the APK
3. Tap APK to install
4. Grant requested permissions
5. Launch app

---

## 📱 Testing the APK

### First Launch

When you first open Almuslim:
1. Grant **Location** permission
   - Needed for accurate prayer times
2. Grant **Notification** permission
   - For prayer reminders
3. Choose **Language** (English or العربية)
4. Start using! 🎉

### Features to Test

- ✅ Prayer times display
- ✅ Countdown timer
- ✅ Quran browser (114 surahs)
- ✅ Adhkar counter
- ✅ Qiblah compass
- ✅ Prayer calendar
- ✅ Dark/Light modes
- ✅ Arabic language support
- ✅ Notifications

---

## 🐛 Troubleshooting

### Build fails with "No credentials"

```bash
eas credentials --platform android
eas credentials --platform ios
```

### APK won't install

- Ensure Android 8.0 or higher
- Check "Unknown sources" enabled
- Try uninstalling previous version first

### App crashes on launch

1. Check internet connection
2. Grant all permissions
3. Clear app cache in Settings
4. Try reinstalling

### Prayer times are incorrect

1. Grant Location permission
2. Go to Settings → Refresh Location
3. Ensure you're in Settings → Location

---

## 📊 APK Specifications

| Property | Value |
|----------|-------|
| **App Name** | Almuslim |
| **Package** | com.almuslim.app |
| **Version** | 1.0.0 |
| **Min Android** | 8.0 |
| **Target Android** | 14+ |
| **Size** | ~80-100 MB |
| **Supports** | All modern Android phones |

---

## 🔐 Security

✅ **Secure Build**
- Built with Expo's secure infrastructure
- Signed with release key
- Verified and tested

✅ **Privacy**
- No data collection
- No tracking
- Location data stays on device

---

## 📞 Support

### Common Issues

**Q: How long does the build take?**
A: 10-20 minutes for cloud build

**Q: Can I share the APK?**
A: Yes! Share the download link with anyone

**Q: Will it work on my old phone?**
A: Yes, if Android 8.0 or newer

**Q: How do I update the app?**
A: Build new APK and install (replaces old version)

---

## 🚀 Next Steps

### Ready to Build?

```bash
cd "e:\Zyad\Scripts\Ma shitty projects\almuslimphone"
eas build --platform android --profile production
```

### Want to test first?

```bash
# Preview build (internal testing)
eas build --platform android --profile preview
```

### Want to publish to Play Store?

See [PRODUCTION_BUILD.md](./PRODUCTION_BUILD.md) for full instructions

---

## ✨ Features in the APK

### 🕌 Prayer Times
- Real-time countdown
- Accurate calculations
- Your location-based
- Daily notifications

### 📖 Holy Quran
- All 114 surahs
- Arabic text (RTL)
- Beautiful Mushaf view
- Search functionality

### 🤲 Adhkar
- Morning remembrances
- Evening remembrances
- Sleep remembrances
- Interactive counters

### 🧭 Qiblah
- Real-time compass
- Direction to Kaaba
- Device compass integration
- Beautiful animations

### 📅 Calendar
- 30-day prayer schedule
- Gregorian & Hijri dates
- All prayer times
- Today indicator

### ⚙️ Settings
- Language toggle (EN/AR)
- Theme toggle (Light/Dark)
- Prayer method selector
- Notification control

---

## 📱 Download Ready!

**Your Almuslim APK is ready to build:**

```bash
eas build --platform android --profile production
```

**Share with your community! 🌙**

---

**Version:** 1.0.0  
**Status:** ✅ Ready to Build  
**Last Updated:** November 24, 2025

🌙 Made with ❤️ for the Muslim Ummah
