import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import SHA256 from 'crypto-js/sha256';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  AppState,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

function AppLockScreen({
  colors,
  displayName,
  email,
  imageUrl,
  pin,
  error,
  biometricAvailable,
  verifying,
  shakeValue,
  onKeyPress,
}) {
  const initial = String(displayName || email || 'U').trim().charAt(0).toUpperCase();

  return (
    <SafeAreaView style={[styles.lockScreen, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <View style={[styles.brandMark, { backgroundColor: colors.primary }]}>
          <Text style={styles.brandMarkText}>R</Text>
        </View>
        <Text style={[styles.brandName, { color: colors.textPrimary }]}>RexiPay</Text>
      </View>

      <View style={styles.identitySection}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colors.primaryLight,
              borderColor: colors.cardBackground,
            },
          ]}
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarInitial, { color: colors.primary }]}>{initial}</Text>
          )}
        </View>
        <Text style={[styles.welcome, { color: colors.textSecondary }]}>Welcome back</Text>
        <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          Enter your 4-digit passcode to continue
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
        <View style={styles.pinRow}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.pinCircle,
                {
                  borderColor: error ? colors.error : colors.border,
                  backgroundColor:
                    index < pin.length
                      ? error
                        ? colors.error
                        : colors.primary
                      : colors.cardBackground,
                },
              ]}
            >
              {index < pin.length ? <View style={styles.pinDot} /> : null}
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
                {
                  backgroundColor:
                    isBiometric || isBackspace
                      ? 'transparent'
                      : colors.cardBackground,
                  borderColor: colors.border,
                },
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
                <MaterialIcons name="fingerprint" size={32} color={colors.primary} />
              ) : isBackspace ? (
                <MaterialIcons name="backspace" size={25} color={colors.textPrimary} />
              ) : (
                <Text style={[styles.keyText, { color: colors.textPrimary }]}>{key}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.securityNote}>
        <MaterialIcons name="lock-outline" size={15} color={colors.textSecondary} />
        <Text style={[styles.securityText, { color: colors.textSecondary }]}>
          Your session is securely locked
        </Text>
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
  } = useAuth();
  const {
    isLoaded: isClerkLoaded,
    isSignedIn,
    user: clerkUser,
  } = useUser();

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
          imageUrl={clerkUser?.imageUrl}
          pin={pin}
          error={error}
          biometricAvailable={biometricAvailable}
          verifying={verifying}
          shakeValue={shakeValue}
          onKeyPress={handleKeyPress}
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
    paddingHorizontal: 28,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  brandName: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  identitySection: {
    alignItems: 'center',
    marginTop: 38,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 30,
    fontWeight: '800',
  },
  welcome: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  userName: {
    maxWidth: '92%',
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  pinArea: {
    alignItems: 'center',
    marginTop: 30,
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  pinCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    height: 18,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  keypad: {
    width: '100%',
    maxWidth: 330,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 24,
    rowGap: 13,
    marginTop: 8,
  },
  key: {
    width: 72,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '700',
  },
  keyDisabled: {
    opacity: 0.3,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingBottom: 12,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
});
