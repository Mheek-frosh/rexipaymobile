import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';

const PIN_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'biometric', 0, 'backspace'];

function FaceIdIcon({ color, size = 32 }) {
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

export default function TransactionPinBottomSheet({
  visible,
  title,
  amount,
  recipient,
  onSuccess,
  onCancel,
}) {
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const completionTimer = useRef(null);
  const authorizationStartedRef = useRef(false);
  const heading = title || `Confirm ${amount} transfer to ${recipient}`;

  useEffect(() => {
    if (!visible) {
      setPin('');
      setError('');
      setVerifying(false);
      authorizationStartedRef.current = false;
      return undefined;
    }

    let mounted = true;
    setBiometricAvailable(false);
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
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
        completionTimer.current = null;
      }
    };
  }, [visible]);

  const completeAuthorization = () => {
    if (authorizationStartedRef.current) return;
    authorizationStartedRef.current = true;
    setVerifying(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    completionTimer.current = setTimeout(() => {
      completionTimer.current = null;
      onSuccess();
    }, 180);
  };

  const handleBiometric = async () => {
    if (!biometricAvailable || authorizationStartedRef.current) return;
    authorizationStartedRef.current = true;
    setError('');
    setVerifying(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: heading,
        cancelLabel: 'Use PIN',
        disableDeviceFallback: true,
      });
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        onSuccess();
        return;
      }
      setError('Face ID was not completed. Enter your PIN instead.');
    } catch (_) {
      setError('Face ID is unavailable. Enter your PIN instead.');
    } finally {
      authorizationStartedRef.current = false;
      setVerifying(false);
    }
  };

  const handleKeyPress = (key) => {
    if (authorizationStartedRef.current) return;
    setError('');

    if (key === 'biometric') {
      handleBiometric();
      return;
    }

    if (key === 'backspace') {
      Haptics.selectionAsync().catch(() => {});
      setPin((current) => current.slice(0, -1));
      return;
    }

    Haptics.selectionAsync().catch(() => {});
    const nextPin = `${pin}${key}`.slice(0, 4);
    setPin(nextPin);
    if (nextPin.length === 4) completeAuthorization();
  };

  const handleCancel = () => {
    if (authorizationStartedRef.current) return;
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleCancel}
        accessibilityRole="button"
        accessibilityLabel="Close transaction PIN sheet"
      >
        <View
          style={[styles.sheet, { backgroundColor: colors.background }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{heading}</Text>
            <TouchableOpacity
              style={[styles.close, { backgroundColor: colors.surfaceVariant }]}
              onPress={handleCancel}
              disabled={verifying}
              accessibilityRole="button"
              accessibilityLabel="Cancel transaction authorization"
            >
              <MaterialIcons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.pinBoxes}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.pinBox,
                  {
                    borderColor: error ? colors.error : colors.border,
                    backgroundColor: colors.cardBackground,
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

          <Text style={[styles.error, { color: error ? colors.error : 'transparent' }]}>
            {error || 'Secure authorization'}
          </Text>

          <View style={styles.keypad}>
            {PIN_KEYS.map((key) => {
              const isBiometric = key === 'biometric';
              const isBackspace = key === 'backspace';
              const biometricDisabled = isBiometric && !biometricAvailable;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.key,
                    (verifying || biometricDisabled) && styles.keyDisabled,
                  ]}
                  activeOpacity={0.6}
                  disabled={verifying || biometricDisabled}
                  onPress={() => handleKeyPress(key)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isBiometric
                      ? 'Confirm with Face ID'
                      : isBackspace
                        ? 'Delete digit'
                        : `Digit ${key}`
                  }
                >
                  {isBiometric ? (
                    <FaceIdIcon color={colors.textPrimary} size={32} />
                  ) : isBackspace ? (
                    <MaterialIcons name="chevron-left" size={36} color={colors.error} />
                  ) : (
                    <Text style={[styles.keyText, { color: colors.textPrimary }]}>{key}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    alignSelf: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 28,
  },
  pinBox: {
    flex: 1,
    maxWidth: 64,
    height: 62,
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
  error: {
    minHeight: 20,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  key: {
    width: '30%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
  },
  keyDisabled: { opacity: 0.3 },
});
