import { useState, useEffect, useCallback } from 'react';
import { themeService } from '@theme/themeService';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  tertiary: string;
  tertiaryDark: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  white: string;
  black: string;
  gray: string;
  grayLight: string;
  grayDark: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  onBackground: string;
  onSurface: string;
  outline: string;
  text: string;
  textSecondary: string;
  textInverse: string;
}

export const useTheme = () => {
  const [colors, setColors] = useState<ThemeColors>(themeService.getColors());
  const [isDark, setIsDark] = useState(themeService.isDarkMode());

  const toggleTheme = useCallback(() => {
    themeService.toggleTheme();
    setColors(themeService.getColors());
    setIsDark(themeService.isDarkMode());
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    themeService.setTheme(theme);
    setColors(themeService.getColors());
    setIsDark(themeService.isDarkMode());
  }, []);

  return {
    colors,
    isDark,
    toggleTheme,
    setTheme,
  };
};
