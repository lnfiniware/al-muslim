@echo off
REM Al-Muslim App Quick Setup Script for Windows

echo ================================
echo Al-Muslim App - Quick Setup
echo ================================
echo.

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo + Node.js version: %NODE_VERSION%
echo + npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo Downloading packages...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)

echo + Dependencies installed successfully
echo.

echo ================================
echo Setup Complete! 
echo ================================
echo.
echo Next steps:
echo 1. Start the development server:
echo    npm start
echo.
echo 2. Choose your platform:
echo    - Press 'a' for Android Emulator
echo    - Press 'w' for Web Browser
echo    - Press 'i' for iOS Simulator (macOS only)
echo.
echo 3. Or use shortcut commands:
echo    npm run android  - Android Emulator
echo    npm run web      - Web Browser
echo.
echo Happy coding!
echo.
pause
