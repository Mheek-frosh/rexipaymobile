import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, DARK_COLORS } from './theme';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeOverride, setThemeOverride] = useState(null);
  const isDark =
    themeOverride === null ? systemScheme === 'dark' : themeOverride === 'dark';

  const colors = isDark ? DARK_COLORS : COLORS;

  const toggleTheme = useCallback(() => {
    setThemeOverride((currentOverride) => {
      const currentlyDark =
        currentOverride === null
          ? systemScheme === 'dark'
          : currentOverride === 'dark';

      return currentlyDark ? 'light' : 'dark';
    });
  }, [systemScheme]);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors,
        toggleTheme,
        themeMode: themeOverride ?? 'system',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
