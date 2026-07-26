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
  colors,
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
  const medium = height >= 720 && height < 840;
  const horizontalPadding = width < 360 ? 18 : 24;
  const pinGap = width < 360 ? 10 : 14;
  const pinSize = Math.min(
    compact ? 64 : medium ? 70 : 74,
    Math.floor((width - horizontalPadding * 2 - pinGap * 3) / 4),
  );
  const keyHeight = compact ? 61 : medium ? 72 : 82;
  const avatarSize = compact ? 52 : medium ? 58 : 62;
  const responsiveStyles = {
    screen: { paddingHorizontal: horizontalPadding },
    header: { marginTop: compact ? 10 : medium ? 18 : 25 },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      marginBottom: compact ? 24 : medium ? 34 : 48,
    },
    avatarInitial: { fontSize: compact ? 20 : 23 },
    welcome: {
      fontSize: compact ? 25 : medium ? 28 : 30,
      lineHeight: compact ? 31 : medium ? 34 : 36,
    },
    instruction: {
      fontSize: compact ? 17 : medium ? 18 : 20,
      lineHeight: compact ? 22 : medium ? 24 : 27,
    },
    pinArea: { marginTop: compact ? 25 : medium ? 36 : 49 },
    pinRow: { gap: pinGap },
    pinBox: { width: pinSize, height: pinSize },
    key: { height: keyHeight },
    logoutRow: {
      marginTop: compact ? 7 : 14,
      paddingBottom: compact ? 7 : 16,
    },
    logoutText: { fontSize: compact ? 16 : 18 },
  };
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
        responsiveStyles.screen,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={[styles.header, responsiveStyles.header]}>
        <View
          style={[
            styles.avatar,
            responsiveStyles.avatar,
            {
              backgroundColor: colors.surfaceVariant,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarInitial,
              responsiveStyles.avatarInitial,
              { color: colors.textPrimary },
            ]}
          >
            {initials}
          </Text>
        </View>
        <Text
          style={[styles.welcome, responsiveStyles.welcome, { color: colors.textPrimary }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          Welcome Back {firstName}
        </Text>
        <Text
          style={[
            styles.instruction,
            responsiveStyles.instruction,
            { color: colors.textSecondary },
          ]}
        >
          Enter your 4-Digit PIN
        </Text>
      </View>

      <Animated.View
        style={[
          styles.pinArea,
          responsiveStyles.pinArea,
          {
            transform: [{ translateX: shakeValue }],
          },
        ]}
      >
        <View style={[styles.pinRow, responsiveStyles.pinRow]}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.pinBox,
                responsiveStyles.pinBox,
                {
                  borderColor: error ? colors.error : colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              {index < pin.length ? (
                <View
                  style={[
                    styles.pinDot,
                    { backgroundColor: error ? colors.error : colors.textPrimary },
                  ]}
                />
              ) : null}
            </View>
          ))}
        </View>
        <Text
          style={[
            styles.errorText,
            { color: error ? colors.error : 'transparent' },
          ]}
        >
          {error || 'Passcode'}
        </Text>
      </Animated.View>

      <View style={styles.keypad}>
        {KEYPAD_KEYS.map((key) => {
          const isBiometric = key === 'biometric';
          const isBackspace = key === 'backspace';
          const disabled = verifying || (isBiometric && !biometricAvailable);

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                responsiveStyles.key,
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
                <FaceIdIcon color={colors.textPrimary} size={compact ? 31 : 34} />
              ) : isBackspace ? (
                <MaterialIcons name="chevron-left" size={37} color={colors.error} />
              ) : (
                <Text style={[styles.keyText, { color: colors.textPrimary }]}>{key}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.logoutRow, responsiveStyles.logoutRow]}>
        <Text
          style={[
            styles.logoutPrompt,
            responsiveStyles.logoutText,
            { color: colors.textPrimary },
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
              responsiveStyles.logoutText,
              { color: colors.textPrimary },
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
        SecureStore.setItemAsync(lockRequiredKey(email), 'true').catch(() => {});
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        await unlock();
      }
    } catch (_) {
      setError('Biometric authentication was not completed.');
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

      Haptics.selectionAsync().catch(() => {});
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
          colors={colors}
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 25,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 48,
  },
  avatarInitial: {
    fontSize: 23,
    fontWeight: '400',
  },
  welcome: {
    maxWidth: '100%',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  instruction: {
    fontSize: 20,
    lineHeight: 27,
    marginTop: 5,
  },
  pinArea: {
    alignItems: 'flex-start',
    marginTop: 49,
  },
  pinRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 14,
  },
  pinBox: {
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  errorText: {
    width: '100%',
    height: 17,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 7,
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
    width: '27%',
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 25,
    fontWeight: '700',
  },
  keyDisabled: {
    opacity: 0.3,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingBottom: 16,
  },
  logoutPrompt: {
    fontSize: 18,
    fontWeight: '400',
  },
  logoutLink: {
    fontSize: 18,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
