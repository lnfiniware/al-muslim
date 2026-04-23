#!/bin/bash
# Al-Muslim App Quick Setup Script

echo "================================"
echo "Al-Muslim App - Quick Setup"
echo "================================"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "================================"
echo "Setup Complete! 🎉"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Start the development server:"
echo "   npm start"
echo ""
echo "2. Choose your platform:"
echo "   - Press 'i' for iOS Simulator (macOS only)"
echo "   - Press 'a' for Android Emulator"
echo "   - Press 'w' for Web Browser"
echo ""
echo "3. Or use shortcut commands:"
echo "   npm run ios      # iOS Simulator"
echo "   npm run android  # Android Emulator"
echo "   npm run web      # Web Browser"
echo ""
echo "Happy coding! 🚀"
