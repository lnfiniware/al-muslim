# 🚀 Al-Muslim App - Production Build Guide

## Prerequisites

1. **EAS CLI installed:**
   ```bash
   npm install -g eas-cli
   ```

2. **Expo Account:**
   - Create account at https://expo.dev
   - Login in terminal: `eas login`

3. **App Credentials:**
   - iOS signing certificates
   - Android keystore

---

## 📦 Building for Production

### Step 1: Update Version

Edit `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "plugins": [
      ["expo-build-properties", {...}]
    ]
  }
}
```

### Step 2: Build Android APK/AAB

#### Internal Testing Build (APK)
```bash
eas build --platform android --profile preview
```

#### Production Build (AAB for Google Play)
```bash
eas build --platform android --profile production
```

**Output:** Download link in terminal after build completes (takes 10-20 minutes)

### Step 3: Build iOS (macOS only)

#### Internal Testing Build
```bash
eas build --platform ios --profile preview
```

#### Production Build (for App Store)
```bash
eas build --platform ios --profile production
```

**First-time setup:**
- Will prompt for Apple Team ID
- Request signing credentials
- Create provisioning profiles automatically

---

## 📱 Testing Builds Before Production

### Android APK Testing
1. Download APK from build link
2. Install on device: `adb install app.apk`
3. Or share APK via email/cloud
4. Users can sideload directly

### iOS Testing
1. Use TestFlight for internal testing
2. Or create Ad-Hoc distribution builds

---

## 🔐 Securing Production Build

### 1. Update Credentials
```bash
eas credentials
```

### 2. Enable Google Play Security
- Use Android App Signing by Google Play
- Don't share your release keystore

### 3. Apple Security
- Use App Store provisioning
- Enable 2-factor authentication on Apple ID

---

## 📲 Submitting to App Stores

### Option 1: Automatic Submission (via EAS)
```bash
eas submit --platform android
eas submit --platform ios
```

### Option 2: Manual Submission

#### Google Play Store
1. Visit https://play.google.com/console
2. Upload AAB file
3. Set store listing (screenshots, description)
4. Submit for review (takes 2-4 hours)

#### Apple App Store
1. Visit https://appstoreconnect.apple.com
2. Create app record
3. Upload build via Xcode or Transporter
4. Set app details (screenshots, description)
5. Submit for review (takes 24-48 hours)

---

## 📋 Pre-Release Checklist

- [ ] Version updated in `app.json`
- [ ] App icon set correctly
- [ ] Splash screen configured
- [ ] All permissions declared in `app.json`
- [ ] Privacy policy URL ready
- [ ] App screenshots prepared (3-5 per platform)
- [ ] Store description written
- [ ] Keywords/categories selected
- [ ] All features tested on real devices
- [ ] No console errors in production build
- [ ] Analytics/crash reporting configured (optional)

---

## 🎨 Store Listing Requirements

### Google Play Store
**Required:**
- App title (50 chars max)
- Short description (80 chars max)
- Full description (4000 chars max)
- Screenshots (2-8, at least 2)
- Feature graphic (1024x500)
- App icon (512x512, PNG)
- Content rating questionnaire

**Recommended:**
- Trailer video
- Multiple language versions

### Apple App Store
**Required:**
- App name (30 chars max)
- Subtitle (30 chars max)
- Description (4000 chars max)
- Keywords (100 chars, comma-separated)
- Screenshots (at least 2, max 10 per device)
- App icon (1024x1024)
- Preview video (optional)

---

## 🌍 Localization for Store

### App Store Screenshots (Multiple Languages)
Prepare screenshots in:
- English
- Arabic
- Other major languages

**Tools:**
- Figma for design
- Screenshot generators for device frames

### Description Translations
Translate to:
- Arabic (العربية) - Primary
- English - Primary
- French (Français) - Optional
- Spanish (Español) - Optional

---

## 📊 Analytics & Monitoring

### Post-Release Setup
1. **Firebase Analytics** (optional)
   - Track app usage patterns
   - Monitor crash reports

2. **Google Play Console**
   - Monitor ratings
   - Track downloads
   - View reviews

3. **App Store Connect**
   - Monitor downloads
   - Track revenue (if paid)
   - View customer reviews

---

## 🔄 Update Process

### Publishing Minor Updates
```bash
# Update version in app.json (e.g., 1.0.1)
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Phased Rollout (Recommended for first release)
1. Push to 10% of users first
2. Monitor for crashes/issues
3. Gradually increase to 100%

---

## 🐛 Troubleshooting

### Build fails with "No credentials found"
```bash
eas credentials --platform android
eas credentials --platform ios
```

### "App already exists" on App Store
- Use different bundle ID: `com.yourdomain.almuslim`
- Or contact Apple Support

### Reviews rejected
Common reasons:
- Crash on launch
- Missing privacy policy
- Misleading screenshots
- Inappropriate content

Solution: Read reviewer feedback → Fix issue → Resubmit

### Build size too large
Solution:
- Enable code minification
- Remove unused assets
- Use lazy loading for screens

---

## 📈 Post-Release Strategy

### Week 1-2 (Soft Launch)
- 10% rollout
- Monitor crash reports
- Fix critical bugs immediately

### Week 3-4 (Increase Rollout)
- 50% rollout
- Iterate on user feedback
- Plan next update

### Month 2+ (Full Release)
- 100% rollout
- Regular bug fixes
- Feature updates

---

## 💾 Build Artifacts

Store builds in:
```
project-root/
├── builds/
│   ├── 1.0.0/
│   │   ├── app-release.aab (Android)
│   │   ├── app.ipa (iOS)
│   │   └── release-notes.md
```

---

## 🔗 Useful Links

- **EAS Build Docs:** https://docs.expo.dev/build/
- **EAS Submit Docs:** https://docs.expo.dev/submit/introduction/
- **Google Play Console:** https://play.google.com/console
- **App Store Connect:** https://appstoreconnect.apple.com
- **Expo Dashboard:** https://expo.dev/dashboard

---

## 📝 Release Notes Template

```markdown
# Al-Muslim v1.0.0 - Release Notes

## ✨ New Features
- Prayer time notifications
- Qiblah compass with live direction
- 30-day prayer calendar
- Arabic & English support
- Dark mode support

## 🐛 Bug Fixes
- Fixed RTL text alignment in Quran
- Improved notification scheduling
- Better location handling

## 🚀 Performance
- Faster app startup
- Optimized bundle size
- Smoother animations

## 📱 Compatibility
- iOS 12.0+
- Android 8.0+

## 🙏 Thanks
Special thanks to all beta testers!
```

---

**Last Updated:** November 24, 2025
**Status:** Ready for Production
