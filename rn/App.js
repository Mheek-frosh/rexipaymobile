import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider } from './src/theme/ThemeContext';
import { startNetworkMonitoring } from './src/services/offlineSyncService';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/splash/SplashScreen';
import AppLockGate from './src/components/AppLockGate';
import ScreenTransitionSkeleton from './src/components/ScreenTransitionSkeleton';

const ROUTE_SKELETON_DURATION = 1200;
const ROUTES_WITHOUT_TRANSITION_SKELETON = new Set([
  'Home',
  'MainTabs',
  'PaymentSuccess',
  'BankStatementSuccess',
  'Onboarding',
  'Signup',
  'Login',
  'OtpVerification',
  'PersonalInfo',
  'NINAndFace',
  'AccountSuccess',
  'LoginBiometricsSetup',
  'ForgotPasswordPhone',
  'ForgotPasswordOtp',
  'ForgotPasswordSetPassword',
]);

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

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [showRouteSkeleton, setShowRouteSkeleton] = useState(false);
  const navigationRef = useNavigationContainerRef();
  const routeSkeletonTimerRef = useRef(null);

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

    if (!routeName || ROUTES_WITHOUT_TRANSITION_SKELETON.has(routeName)) {
      setShowRouteSkeleton(false);
      return;
    }

    setShowRouteSkeleton(true);
    routeSkeletonTimerRef.current = setTimeout(() => {
      setShowRouteSkeleton(false);
    }, ROUTE_SKELETON_DURATION);
  };

  if (!splashDone) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <StatusBar style="light" />
          <SplashScreen onFinish={() => setSplashDone(true)} />
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <AuthProvider>
              <AppLockGate>
                <NotificationProvider>
                  <View style={{ flex: 1 }}>
                    <NavigationContainer
                      ref={navigationRef}
                      onStateChange={handleNavigationStateChange}
                    >
                      <StatusBar style="auto" />
                      <RootNavigator />
                    </NavigationContainer>
                    {showRouteSkeleton && <ScreenTransitionSkeleton />}
                  </View>
                </NotificationProvider>
              </AppLockGate>
            </AuthProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
