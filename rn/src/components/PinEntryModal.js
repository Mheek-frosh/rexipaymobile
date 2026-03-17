import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../theme/ThemeContext';

export default function PinEntryModal({
  visible,
  onSuccess,
  onCancel,
  onForgotPin,
  title = 'Enter Transaction PIN',
  /**
   * Layout style:
   * - 'dialog' (centered card – default)
   * - 'sheet'  (bottom sheet)
   */
  variant = 'dialog',
  /**
   * Optional context line, e.g. masked phone or account number.
   * Shown inside a small card above the PIN boxes.
   */
  contextText,
}) {
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'bio', 0, 'back'];

  useEffect(() => {
    if (!visible) setPin('');
  }, [visible]);

  useEffect(() => {
    let mounted = true;
    LocalAuthentication.getEnrolledLevelAsync().then((level) => {
      if (mounted) setBiometricAvailable(level !== LocalAuthentication.SecurityLevel.NONE);
    });
    return () => { mounted = false; };
  }, [visible]);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(() => onSuccess(), 300);
    }
  };

  const handleBackspace = () => setPin((p) => p.slice(0, -1));

  const handleBiometric = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
      });
      if (success) onSuccess();
    } catch (_) {}
  };

  const handleKeyPress = (d) => {
    if (d === 'back') handleBackspace();
    else if (d === 'bio' && biometricAvailable) handleBiometric();
    else if (typeof d === 'number') handleDigit(String(d));
  };

  const handleForgotPin = () => {
    onCancel?.();
    onForgotPin?.();
  };

  const isDialog = variant === 'dialog';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, isDialog && styles.overlayCenter]}>
        <View
          style={[
            styles.modal,
            isDialog ? styles.modalDialog : styles.modalSheet,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
            <TouchableOpacity
              onPress={onCancel}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <MaterialIcons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {contextText ? (
            <View style={[styles.contextCard, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.contextLabel, { color: colors.textSecondary }]}>
                For
              </Text>
              <Text style={[styles.contextValue, { color: colors.textPrimary }]} numberOfLines={1}>
                {contextText}
              </Text>
            </View>
          ) : null}

          <View style={styles.pinRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.pinBox,
                  {
                    borderColor: colors.primary,
                    backgroundColor: i < pin.length ? colors.primary + '10' : 'transparent',
                  },
                ]}
              >
                {i < pin.length && (
                  <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
                )}
              </View>
            ))}
          </View>

          {onForgotPin != null ? (
            <TouchableOpacity style={styles.forgot} onPress={handleForgotPin}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot PIN?</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.keypad}>
            {KEYS.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.key,
                  { backgroundColor: colors.surfaceVariant },
                  d === 'bio' && !biometricAvailable && styles.keyDisabled,
                ]}
                onPress={() => handleKeyPress(d)}
                activeOpacity={0.8}
                disabled={d === 'bio' && !biometricAvailable}
              >
                {d === 'back' ? (
                  <MaterialIcons name="backspace" size={26} color={colors.textPrimary} />
                ) : d === 'bio' ? (
                  Platform.OS === 'ios' ? (
                    <MaterialIcons name="face" size={28} color={colors.textPrimary} />
                  ) : (
                    <MaterialIcons name="fingerprint" size={32} color={colors.textPrimary} />
                  )
                ) : (
                  <Text style={[styles.keyText, { color: colors.textPrimary }]}>{d}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  overlayCenter: {
    justifyContent: 'center',
  },
  modal: {
    maxWidth: 420,
    alignSelf: 'center',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalDialog: {
    borderRadius: 24,
    padding: 24,
    paddingBottom: 32,
    marginHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  contextCard: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  contextLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  contextValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pinBox: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  forgot: { alignItems: 'center', marginBottom: 24 },
  forgotText: { fontSize: 14, fontWeight: '500' },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontSize: 24, fontWeight: '600' },
  keyDisabled: { opacity: 0.4 },
});
