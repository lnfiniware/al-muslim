// Comprehensive Theme System with Dark Mode Support
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

const lightTheme = {
  colors: {
    // Primary - Deep Islamic Green
    primary: '#1B5E4A',
    primaryLight: '#2D8659',
    primaryDark: '#0D3E2F',

    // Secondary - Warm Gold
    secondary: '#D4A574',
    secondaryLight: '#E8C19A',
    secondaryDark: '#A67C52',

    // Tertiary - Soft Cream
    tertiary: '#F5EFE7',
    tertiaryDark: '#E8DFD5',

    // Accent
    accent: '#C97B5C',

    // Status
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    info: '#2196F3',

    // Neutral
    white: '#FFFFFF',
    black: '#1A1A1A',
    gray: '#757575',
    grayLight: '#E8E8E8',
    grayDark: '#424242',

    // Backgrounds
    background: '#FFFFFF',
    surface: '#FAFAFA',
    surfaceVariant: '#F5F5F5',
    onBackground: '#1A1A1A',
    onSurface: '#424242',
    outline: '#757575',

    // Text
    text: '#1A1A1A',
    textSecondary: '#757575',
    textInverse: '#FFFFFF',
  },
  dark: false,
};

const darkTheme = {
  colors: {
    // Primary - Deep Islamic Green (slightly lighter for dark mode)
    primary: '#2D8659',
    primaryLight: '#3FA670',
    primaryDark: '#1B5E4A',

    // Secondary - Warm Gold
    secondary: '#D4A574',
    secondaryLight: '#E8C19A',
    secondaryDark: '#A67C52',

    // Tertiary - Dark background
    tertiary: '#1E1E1E',
    tertiaryDark: '#121212',

    // Accent
    accent: '#FFB399',

    // Status
    success: '#66BB6A',
    warning: '#FFA726',
    danger: '#EF5350',
    info: '#42A5F5',

    // Neutral
    white: '#FFFFFF',
    black: '#1A1A1A',
    gray: '#B0B0B0',
    grayLight: '#404040',
    grayDark: '#E0E0E0',

    // Backgrounds
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
    onBackground: '#FFFFFF',
    onSurface: '#E0E0E0',
    outline: '#787878',

    // Text
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textInverse: '#1A1A1A',
  },
  dark: true,
};

let currentTheme: ThemeMode = 'system';
let forceTheme: 'light' | 'dark' | null = null;

export const themeService = {
  /**
   * Set theme mode
   */
  setTheme(mode: ThemeMode) {
    currentTheme = mode;
    if (mode === 'system') {
      forceTheme = null;
    }
  },

  /**
   * Get current theme mode
   */
  getTheme(): ThemeMode {
    return currentTheme;
  },

  /**
   * Get actual theme (light or dark)
   */
  getActualTheme(): 'light' | 'dark' {
    if (forceTheme) return forceTheme;
    if (currentTheme !== 'system') {
      return currentTheme as 'light' | 'dark';
    }
    // Return system theme or default to light
    return 'light';
  },

  /**
   * Get colors for current theme
   */
  getColors() {
    const theme = this.getActualTheme();
    return theme === 'dark' ? darkTheme.colors : lightTheme.colors;
  },

  /**
   * Get full theme object
   */
  getFullTheme() {
    const theme = this.getActualTheme();
    return theme === 'dark' ? darkTheme : lightTheme;
  },

  /**
   * Toggle between light and dark
   */
  toggleTheme() {
    const current = this.getActualTheme();
    forceTheme = current === 'dark' ? 'light' : 'dark';
    currentTheme = forceTheme;
  },

  /**
   * Check if dark mode
   */
  isDarkMode(): boolean {
    return this.getActualTheme() === 'dark';
  },

  /**
   * Create gradient colors for dark mode
   */
  getGradientColors() {
    if (this.isDarkMode()) {
      return {
        primary: [darkTheme.colors.primary, darkTheme.colors.primaryDark],
        secondary: [darkTheme.colors.secondary, darkTheme.colors.secondaryDark],
        background: [darkTheme.colors.surface, darkTheme.colors.tertiaryDark],
      };
    }
    return {
      primary: [lightTheme.colors.primary, lightTheme.colors.primaryDark],
      secondary: [lightTheme.colors.secondary, lightTheme.colors.secondaryDark],
      background: [lightTheme.colors.surface, lightTheme.colors.tertiaryDark],
    };
  },
};

// Export themes
export { lightTheme, darkTheme };

// Backward compatibility - export colors object
export const colors = themeService.getColors();
