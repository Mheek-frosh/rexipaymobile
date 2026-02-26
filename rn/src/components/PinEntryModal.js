import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function PinEntryModal({ visible, onSuccess, onCancel, title = 'Enter PIN' }) {
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'face', 0, 'back'];

  useEffect(() => {
    if (!visible) setPin('');
  }, [visible]);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);
    if (newPin.length === 4) {
      // Simulate PIN verification - in real app would verify
      setTimeout(() => onSuccess(), 300);
    }
  };

  const handleBackspace = () => setPin((p) => p.slice(0, -1));

  const handleKeyPress = (d) => {
    if (d === 'back') {
      handleBackspace();
    } else if (d === 'face') {
      // In a real app this would trigger biometric auth
      onSuccess();
    } else if (typeof d === 'number') {
      handleDigit(String(d));
    }
  };

  const handleShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
            <TouchableOpacity
              onPress={onCancel}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <MaterialIcons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.pinRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.pinBox,
                  {
                    borderColor: i < pin.length ? colors.primary : colors.border,
                  },
                ]}
              >
                {i < pin.length && (
                  <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.forgot} onPress={onCancel}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot PIN?</Text>
          </TouchableOpacity>

          <View style={styles.keypad}>
            {KEYS.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.key, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleKeyPress(d)}
                activeOpacity={0.8}
              >
                {d === 'back' ? (
                  <MaterialIcons name="backspace" size={28} color={colors.textPrimary} />
                ) : d === 'face' ? (
                  <MaterialIcons name="tag-faces" size={32} color={colors.textPrimary} />
                ) : (
                  <Text style={[styles.keyText, { color: colors.textPrimary }]}>{d}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={onCancel} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
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
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: { fontSize: 18, fontWeight: '700' },
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
  cancel: { alignItems: 'center', marginTop: 24 },
  cancelText: { fontSize: 16 },
});
