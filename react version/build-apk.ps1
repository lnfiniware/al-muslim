#!/usr/bin/env pwsh
# Almuslim APK Build Script - Copy & Paste Commands

# Color codes for output
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

Write-Host "${Blue}╔════════════════════════════════════════════════════════════╗${Reset}"
Write-Host "${Blue}║          🌙 ALMUSLIM APK BUILD SCRIPT                     ║${Reset}"
Write-Host "${Blue}╚════════════════════════════════════════════════════════════╝${Reset}"
Write-Host ""

# Step 1: Install EAS CLI
Write-Host "${Yellow}[STEP 1]${Reset} Installing EAS CLI..."
Write-Host "${Green}Command:${Reset} npm install -g eas-cli"
Write-Host ""
Write-Host "Run this command in your terminal and wait for completion."
Write-Host ""

# Step 2: Login
Write-Host "${Yellow}[STEP 2]${Reset} Login to Expo..."
Write-Host "${Green}Command:${Reset} eas login"
Write-Host ""
Write-Host "Enter your Expo credentials when prompted."
Write-Host "Don't have an account? Create one at https://expo.dev"
Write-Host ""

# Step 3: Navigate to project
Write-Host "${Yellow}[STEP 3]${Reset} Navigate to project directory..."
Write-Host "${Green}Command:${Reset} cd 'e:\Zyad\Scripts\Ma shitty projects\almuslimphone'"
Write-Host ""

# Step 4: Build APK
Write-Host "${Yellow}[STEP 4]${Reset} Build the APK (this takes 10-20 minutes)..."
Write-Host "${Green}Command:${Reset} eas build --platform android --profile production"
Write-Host ""
Write-Host "The build will:"
Write-Host "  ✅ Compile your app"
Write-Host "  ✅ Optimize for Android"
Write-Host "  ✅ Sign the APK"
Write-Host "  ✅ Show you a download link"
Write-Host ""

Write-Host "${Blue}╔════════════════════════════════════════════════════════════╗${Reset}"
Write-Host "${Blue}║                    COPY & PASTE BELOW                      ║${Reset}"
Write-Host "${Blue}╚════════════════════════════════════════════════════════════╝${Reset}"
Write-Host ""

Write-Host "${Green}# ALL COMMANDS IN ORDER:${Reset}"
Write-Host ""
Write-Host "npm install -g eas-cli"
Write-Host ""
Write-Host "eas login"
Write-Host ""
Write-Host "cd 'e:\Zyad\Scripts\Ma shitty projects\almuslimphone'"
Write-Host ""
Write-Host "eas build --platform android --profile production"
Write-Host ""

Write-Host "${Blue}╔════════════════════════════════════════════════════════════╗${Reset}"
Write-Host "${Blue}║                     INSTALLATION                           ║${Reset}"
Write-Host "${Blue}╚════════════════════════════════════════════════════════════╝${Reset}"
Write-Host ""
Write-Host "After build completes:"
Write-Host ""
Write-Host "1. ${Yellow}Download${Reset} the APK file from the link shown"
Write-Host "2. ${Yellow}Transfer${Reset} APK to your Android phone"
Write-Host "3. On phone: ${Yellow}Enable${Reset} 'Unknown sources' in Settings"
Write-Host "4. ${Yellow}Tap${Reset} the APK file to install"
Write-Host "5. ${Yellow}Grant${Reset} Location & Notification permissions"
Write-Host "6. ${Yellow}Launch${Reset} the app and enjoy! 🎉"
Write-Host ""

Write-Host "${Green}═══════════════════════════════════════════════════════════${Reset}"
Write-Host "${Green}           ✅ APK READY FOR BUILDING!${Reset}"
Write-Host "${Green}═══════════════════════════════════════════════════════════${Reset}"
Write-Host ""
