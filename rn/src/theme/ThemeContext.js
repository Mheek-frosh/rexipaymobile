import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPaletteColors } from './theme';

const STORAGE_KEY = 'rexipay.appearance';
const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [palette, setPaletteState] = useState('bamboo');
  const [themeOverride, setThemeOverride] = useState(null);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        const saved = JSON.parse(raw);
        if (saved.palette === 'blue' || saved.palette === 'bamboo') {
          setPaletteState(saved.palette);
        }
        if (saved.mode === 'light' || saved.mode === 'dark') {
          setThemeOverride(saved.mode);
        } else if (saved.mode === 'system') {
          setThemeOverride(null);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback((nextPalette, nextOverride) => {
    const mode = nextOverride == null ? 'system' : nextOverride;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ palette: nextPalette, mode })).catch(() => {});
  }, []);

  const isDark = themeOverride === null ? systemScheme === 'dark' : themeOverride === 'dark';
  const colors = getPaletteColors(palette, isDark);

  const setPalette = useCallback((next) => {
    setPaletteState(next);
    setThemeOverride((current) => {
      persist(next, current);
      return current;
    });
  }, [persist]);

  const setThemeMode = useCallback((mode) => {
    const override = mode === 'system' ? null : mode;
    setThemeOverride(override);
    persist(palette, override);
  }, [palette, persist]);

  const toggleTheme = useCallback(() => {
    setThemeOverride((currentOverride) => {
      const currentlyDark =
        currentOverride === null ? systemScheme === 'dark' : currentOverride === 'dark';
      const next = currentlyDark ? 'light' : 'dark';
      persist(palette, next);
      return next;
    });
  }, [palette, persist, systemScheme]);

  const value = useMemo(
    () => ({
      isDark,
      colors,
      palette,
      setPalette,
      toggleTheme,
      setThemeMode,
      themeMode: themeOverride ?? 'system',
    }),
    [colors, isDark, palette, setPalette, setThemeMode, themeOverride, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
