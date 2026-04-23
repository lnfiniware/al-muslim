# Al-Muslim

A free, open-source Islamic companion app built with privacy, simplicity, speed, and trust in mind.

**Version**: 1.2.1  
**Developer**: Zyad Mohamed  
**Organization**: Infiniware

## Features

- **Prayer Times** -- Accurate calculation for all 5 daily prayers using the adhan library, supporting multiple calculation methods (MWL, ISNA, Umm Al-Qura, etc.) and madhabs (Shafi'i, Hanafi)
- **Holy Quran** -- Full 114-surah Quran reader with proper Arabic typography (Amiri font), UTF-8 encoding, search, and bookmarks
- **Adhkar** -- Morning, evening, before-sleep, after-prayer, and general remembrances with counter, progress tracking, and haptic feedback
- **Qiblah Compass** -- Real-time Qiblah direction using great-circle bearing calculation
- **Islamic Calendar** -- Hijri/Gregorian dual calendar with 30-day view
- **Onboarding** -- Privacy-focused onboarding with location and notification setup
- **Settings** -- Theme (Light/Dark/AMOLED/System), language (EN/AR), madhab, 24h format, haptics, screen-awake

## Architecture

### Android (Kotlin + Jetpack Compose)

```
android-app/
  app/src/main/java/com/almuslim/app/
    di/          -- Hilt dependency injection modules
    data/        -- Room database, DataStore, Retrofit API
    domain/      -- Business models (PrayerTime, Surah, Adhkar, etc.)
    service/     -- Prayer, Qiblah, Hijri, Location services
    ui/          -- Compose screens, navigation, theme
    worker/      -- WorkManager for prayer notifications
    util/        -- Constants, extensions
```

**Stack**: Kotlin 2.0, Jetpack Compose (Material 3), Hilt, Room, DataStore, Navigation Compose, Retrofit, adhan2, WorkManager

### Backend (Python + Django)

```
backend-django/
  config/        -- Django settings (base/dev/prod), URLs, WSGI
  apps/
    accounts/    -- Custom user model, JWT auth, device sessions
    sync/        -- Cross-device sync for preferences, bookmarks, progress
    notifications/ -- FCM token registration, notification logs
    feedback/    -- User feedback submission
    core/        -- Audit logging middleware
  docker/        -- Dockerfile, docker-compose, Nginx
  requirements/  -- Python dependencies (base/dev/prod)
```

**Stack**: Django 5, DRF, PostgreSQL, JWT (SimpleJWT), Docker, Nginx, Gunicorn

## Quick Start

### Android

1. Open `android-app/` in Android Studio (Hedgehog or newer)
2. Sync Gradle
3. Add fonts to `app/src/main/res/font/` (Inter, Amiri, Noto Naskh Arabic)
4. Run on device/emulator (API 26+)

### Backend

```bash
cd backend-django
pip install -r requirements/development.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Docker Deployment

```bash
cd backend-django/docker
docker-compose up -d
```

## Bug Fixes (v1.2.1)

| Bug | Description | Fix |
|-----|------------|-----|
| #1  | Adaptive icon misalignment | Proper foreground/background layers with correct padding |
| #2  | Adhkar category tabs clipping | `ScrollableTabRow` replacing `SegmentedButtons` |
| #3  | Theme not propagating globally | Theme state flows from `SettingsViewModel` at root level |
| #4  | Settings button layout issues | Proper `fillMaxWidth` constraints on all interactive elements |
| #8  | Landscape support breaking layout | Portrait locked via `AndroidManifest.xml` |
| #11 | Quran encoding (mojibake) | UTF-8 throughout + Amiri font with full Arabic Unicode coverage |

## License

Open source. See LICENSE file for details.
