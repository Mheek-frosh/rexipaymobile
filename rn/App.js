import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';

Text.defaultProps = { ...(Text.defaultProps || {}), maxFontSizeMultiplier: 1.15 };
TextInput.defaultProps = { ...(TextInput.defaultProps || {}), maxFontSizeMultiplier: 1.15 };
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { WalletProvider } from './src/context/WalletContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { startNetworkMonitoring } from './src/services/offlineSyncService';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/splash/SplashScreen';
import AppLockGate from './src/components/AppLockGate';
import ScreenTransitionSkeleton from './src/components/ScreenTransitionSkeleton';

const ROUTE_SKELETON_DURATION = 1200;
const TAB_ROUTES_WITH_SKELETON = new Set(['Cards', 'Stats', 'More']);
const AUTH_ENTRY_ROUTES = new Set(['Onboarding', 'Login']);

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Set it in rn/.env (see Clerk dashboard).');
}

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics} style={{ flex: 1 }}>
        <ThemeProvider>
          <ThemedStatusBar />
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { colors, isDark } = useTheme();
  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.cardBackground,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [colors, isDark]);
  const [splashDone, setSplashDone] = useState(false);
  const [showRouteSkeleton, setShowRouteSkeleton] = useState(false);
  const [routeSkeletonName, setRouteSkeletonName] = useState(null);
  const navigationRef = useNavigationContainerRef();
  const routeSkeletonTimerRef = useRef(null);
  const shownTabSkeletonsRef = useRef(new Set());

  useEffect(() => {
    const unsub = startNetworkMonitoring();
    return () => unsub?.();
  }, []);

  useEffect(() => {
    return () => clearTimeout(routeSkeletonTimerRef.current);
  }, []);

  const handleNavigationStateChange = () => {
    const routeName = navigationRef.getCurrentRoute()?.name;
    clearTimeout(routeSkeletonTimerRef.current);

    if (AUTH_ENTRY_ROUTES.has(routeName)) {
      shownTabSkeletonsRef.current.clear();
    }

    if (
      !routeName ||
      !TAB_ROUTES_WITH_SKELETON.has(routeName) ||
      shownTabSkeletonsRef.current.has(routeName)
    ) {
      setShowRouteSkeleton(false);
      setRouteSkeletonName(null);
      return;
    }

    shownTabSkeletonsRef.current.add(routeName);
    setRouteSkeletonName(routeName);
    setShowRouteSkeleton(true);
    routeSkeletonTimerRef.current = setTimeout(() => {
      setShowRouteSkeleton(false);
    }, ROUTE_SKELETON_DURATION);
  };

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>
        <WalletProvider>
          <AppLockGate>
            <NotificationProvider>
              <View style={{ flex: 1, backgroundColor: colors.background }}>
                <NavigationContainer
                  ref={navigationRef}
                  theme={navigationTheme}
                  onStateChange={handleNavigationStateChange}
                >
                  <ThemedStatusBar />
                  <RootNavigator />
                </NavigationContainer>
                {showRouteSkeleton && (
                  <ScreenTransitionSkeleton routeName={routeSkeletonName} />
                )}
              </View>
            </NotificationProvider>
          </AppLockGate>
        </WalletProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
