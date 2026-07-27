import { MaterialIcons } from '@expo/vector-icons';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import SHA256 from 'crypto-js/sha256';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  AppState,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

const PASSCODE_NAMESPACE = 'rexipay-app-lock-v1';
const SEEDED_PASSCODE_HASHES = {
  'm.usidamen@gmail.com': '05159c33bed9a90f99054804565f150825903abb975db5f850fc90ac0d583c6e',
};
const KEYPAD_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'biometric', 0, 'backspace'];

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function accountStorageSuffix(email) {
  return normalizeEmail(email).replace(/[^a-z0-9]/g, '_');
}

function passcodeHash(email, passcode) {
  return SHA256(`${PASSCODE_NAMESPACE}|${normalizeEmail(email)}|${passcode}`).toString();
}

function pinHashKey(email) {
  return `rexipay_app_lock_pin_${accountStorageSuffix(email)}`;
}

function lockRequiredKey(email) {
  return `rexipay_app_lock_required_${accountStorageSuffix(email)}`;
}

function FaceIdIcon({ color, size = 34 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M15 4H10a6 6 0 0 0-6 6v5M33 4h5a6 6 0 0 1 6 6v5M15 44H10a6 6 0 0 1-6-6v-5M33 44h5a6 6 0 0 0 6-6v-5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Path
        d="M16 17v4M32 17v4M24 16v9.5c0 2-1.2 3.2-3.2 3.2M17.5 34c1.8 2 4 3 6.5 3s4.7-1 6.5-3"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AppLockScreen({
  displayName,
  email,
  pin,
  error,
  biometricAvailable,
  verifying,
  shakeValue,
  onKeyPress,
  onLogout,
}) {
  const { width, height } = useWindowDimensions();
  const compact = height < 720;

  const lightTheme = {
    background: '#FFFFFF',
    textPrimary: '#1F2937', // Dark gray/black for main text
    textSecondary: '#6B7280', // Gray for subtitle
    surfaceVariant: '#E5E7EB', // Light gray for avatar background
    border: '#E5E7EB', // Light gray for pin boxes
    error: '#EF4444',
    cardBackground: '#FFFFFF',
  };

  const horizontalPadding = 40;
  const pinGap = 12;
  const pinSize = 60;
  const pinHeight = 65;
  const keyHeight = compact ? 65 : 75;

  const nameParts = String(displayName || email || 'User')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
  const firstName = nameParts[0] || 'there';

  return (
    <SafeAreaView
      style={[
        styles.lockScreen,
        { backgroundColor: lightTheme.background, paddingHorizontal: horizontalPadding },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: lightTheme.surfaceVariant,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarInitial,
              { color: lightTheme.textPrimary },
            ]}
          >
            {initials}
          </Text>
        </View>
        <Text
          style={[styles.welcome, { color: lightTheme.textPrimary }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          Welcome Back {firstName}
        </Text>
        <Text
          style={[
            styles.instruction,
            { color: lightTheme.textSecondary },
          ]}
        >
          Enter your 4-Digit PIN
        </Text>
      </View>

      <Animated.View
        style={[
          styles.pinArea,
          {
            transform: [{ translateX: shakeValue }],
          },
        ]}
      >
        <View style={[styles.pinRow, { gap: pinGap }]}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.pinBox,
                {
                  width: pinSize,
                  height: pinHeight,
                  borderColor: error ? lightTheme.error : lightTheme.border,
                  backgroundColor: lightTheme.cardBackground,
                },
              ]}
            >
              {index < pin.length ? (
                <View
                  style={[
                    styles.pinDot,
                    { backgroundColor: error ? lightTheme.error : lightTheme.textPrimary },
                  ]}
                />
              ) : null}
            </View>
          ))}
        </View>
        <Text
          style={[
            styles.errorText,
            { color: error ? lightTheme.error : 'transparent' },
          ]}
        >
          {error || 'Passcode'}
        </Text>
      </Animated.View>

      <View style={styles.keypad}>
        {KEYPAD_KEYS.map((key) => {
          const isBiometric = key === 'biometric';
          const isBackspace = key === 'backspace';
          const disabled = verifying;

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                { height: keyHeight },
                disabled && styles.keyDisabled,
              ]}
              activeOpacity={0.65}
              disabled={disabled}
              onPress={() => onKeyPress(key)}
              accessibilityRole="button"
              accessibilityLabel={
                isBiometric
                  ? 'Unlock with biometrics'
                  : isBackspace
                    ? 'Delete digit'
                    : `Digit ${key}`
              }
            >
              {isBiometric ? (
                <FaceIdIcon color={lightTheme.textPrimary} size={32} />
              ) : isBackspace ? (
                <MaterialIcons
                  name="chevron-left"
                  size={36}
                  color={lightTheme.error}
                />
              ) : (
                <Text
                  style={[
                    styles.keyText,
                    { color: lightTheme.textPrimary },
                  ]}
                >
                  {key}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.logoutRow}>
        <Text
          style={[
            styles.logoutPrompt,
            { color: lightTheme.textPrimary },
          ]}
        >
          Not your account?
        </Text>
        <TouchableOpacity
          onPress={onLogout}
          activeOpacity={0.65}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text
            style={[
              styles.logoutLink,
              { color: lightTheme.textPrimary },
            ]}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function AppLockGate({ children }) {
  const { colors } = useTheme();
  const {
    isAuthenticated,
    userName,
    userPhone,
    userEmail,
    login,
    logout,
  } = useAuth();
  const {
    isLoaded: isClerkLoaded,
    isSignedIn,
    user: clerkUser,
  } = useUser();
  const { signOut } = useClerkAuth();

  const [sessionChecked, setSessionChecked] = useState(false);
  const [lockConfigurationReady, setLockConfigurationReady] = useState(false);
  const [lockEnabled, setLockEnabled] = useState(false);
  const [expectedHash, setExpectedHash] = useState('');
  const [locked, setLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const checkedInitialSessionRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);
  const shakeValue = useRef(new Animated.Value(0)).current;

  const clerkEmail = normalizeEmail(clerkUser?.primaryEmailAddress?.emailAddress);
  const email = normalizeEmail(userEmail || clerkEmail);
  const displayName =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
    userName ||
    email.split('@')[0] ||
    'User';

  useEffect(() => {
    if (!isClerkLoaded || checkedInitialSessionRef.current) return;
    checkedInitialSessionRef.current = true;

    if (isSignedIn && clerkUser && !isAuthenticated) {
      const restoredEmail = normalizeEmail(clerkUser.primaryEmailAddress?.emailAddress);
      const restoredPhone = clerkUser.primaryPhoneNumber?.phoneNumber || '';
      const restoredName =
        clerkUser.fullName ||
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
        'User';

      login(restoredPhone || restoredEmail, restoredName, {
        clerkUserId: clerkUser.id,
        email: restoredEmail,
      });
    }

    setSessionChecked(true);
  }, [clerkUser, isAuthenticated, isClerkLoaded, isSignedIn, login]);

  useEffect(() => {
    let mounted = true;

    const loadLockConfiguration = async () => {
      if (!isAuthenticated || !email) {
        if (mounted) {
          setLockEnabled(false);
          setExpectedHash('');
          setLocked(false);
          setLockConfigurationReady(true);
        }
        return;
      }

      setLockConfigurationReady(false);
      const seededHash = SEEDED_PASSCODE_HASHES[email];

      if (!seededHash) {
        if (mounted) {
          setLockEnabled(false);
          setExpectedHash('');
          setLocked(false);
          setLockConfigurationReady(true);
        }
        return;
      }

      try {
        let storedHash = await SecureStore.getItemAsync(pinHashKey(email));
        if (!storedHash) {
          storedHash = seededHash;
          await SecureStore.setItemAsync(pinHashKey(email), storedHash);
        }
        const shouldLock =
          (await SecureStore.getItemAsync(lockRequiredKey(email))) === 'true';

        if (mounted) {
          setExpectedHash(storedHash);
          setLockEnabled(true);
          setLocked(shouldLock);
        }
      } catch (loadError) {
        console.error('Could not initialize app lock', loadError);
        if (mounted) {
          setExpectedHash(seededHash);
          setLockEnabled(true);
          setLocked(false);
        }
      } finally {
        if (mounted) setLockConfigurationReady(true);
      }
    };

    loadLockConfiguration();
    return () => {
      mounted = false;
    };
  }, [email, isAuthenticated]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ])
      .then(([hasHardware, isEnrolled]) => {
        if (mounted) setBiometricAvailable(hasHardware && isEnrolled);
      })
      .catch(() => {
        if (mounted) setBiometricAvailable(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const isLeaving = nextState === 'inactive' || nextState === 'background';
      const isReturning =
        appStateRef.current.match(/inactive|background/) && nextState === 'active';

      if (isAuthenticated && lockEnabled && email && isLeaving) {
        setPin('');
        setError('');
        setLocked(true);
        SecureStore.setItemAsync(lockRequiredKey(email), 'true').catch(() => { });
      }

      if (isAuthenticated && lockEnabled && email && isReturning) {
        setLocked(true);
      }

      appStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, [email, isAuthenticated, lockEnabled]);

  const unlock = useCallback(async () => {
    setPin('');
    setError('');
    setLocked(false);
    try {
      await SecureStore.setItemAsync(lockRequiredKey(email), 'false');
    } catch (_) {
      // The in-memory lock can still be released for the current session.
    }
  }, [email]);

  const showIncorrectPasscode = useCallback(() => {
    setError('Incorrect passcode. Please try again.');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => { });
    Animated.sequence([
      Animated.timing(shakeValue, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: -7, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 7, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start(() => {
      setPin('');
      setVerifying(false);
    });
  }, [shakeValue]);

  const verifyPasscode = useCallback(
    async (candidate) => {
      setVerifying(true);
      const candidateHash = passcodeHash(email, candidate);

      if (candidateHash === expectedHash) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
        await unlock();
        setVerifying(false);
        return;
      }

      showIncorrectPasscode();
    },
    [email, expectedHash, showIncorrectPasscode, unlock],
  );

  const handleBiometricUnlock = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Unlock RexiPay for ${displayName}`,
        cancelLabel: 'Use passcode',
        disableDeviceFallback: true,
      });
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
        await unlock();
      } else {
        setError(result.error || 'Biometric authentication failed.');
      }
    } catch (err) {
      setError(err.message || 'Biometric authentication was not completed.');
    }
  }, [displayName, unlock]);

  const handleKeyPress = useCallback(
    (key) => {
      if (verifying) return;
      setError('');

      if (key === 'biometric') {
        handleBiometricUnlock();
        return;
      }

      if (key === 'backspace') {
        setPin((current) => current.slice(0, -1));
        return;
      }

      Haptics.selectionAsync().catch(() => { });
      const nextPin = `${pin}${key}`.slice(0, 4);
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPasscode(nextPin);
      }
    },
    [handleBiometricUnlock, pin, verifying, verifyPasscode],
  );

  const handleLogout = useCallback(async () => {
    setPin('');
    setError('');
    setLocked(false);
    try {
      if (email) {
        await SecureStore.setItemAsync(lockRequiredKey(email), 'false');
      }
      await signOut();
    } catch (logoutError) {
      console.error('Could not sign out from the lock screen', logoutError);
    } finally {
      logout();
    }
  }, [email, logout, signOut]);

  const gateLoading = !sessionChecked || (isAuthenticated && !lockConfigurationReady);
  const contentStyle = useMemo(
    () => [styles.content, { backgroundColor: colors.background }],
    [colors.background],
  );

  if (gateLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={contentStyle}>
      {children}
      {locked && lockEnabled ? (
        <AppLockScreen
          displayName={displayName}
          email={email}
          pin={pin}
          error={error}
          biometricAvailable={biometricAvailable}
          verifying={verifying}
          shakeValue={shakeValue}
          onKeyPress={handleKeyPress}
          onLogout={handleLogout}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 32,
    marginLeft: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 32,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '500',
  },
  welcome: {
    maxWidth: '100%',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  instruction: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  pinArea: {
    alignItems: 'flex-start',
    marginTop: 40,
    marginLeft: 12,
  },
  pinRow: {
    flexDirection: 'row',
  },
  pinBox: {
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  errorText: {
    width: '100%',
    height: 20,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'left',
  },
  keypad: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  key: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
  },
  keyDisabled: {
    opacity: 0.3,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingBottom: 24,
  },
  logoutPrompt: {
    fontSize: 16,
    fontWeight: '400',
  },
  logoutLink: {
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
