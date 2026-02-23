import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function PinEntryModal({ visible, onSuccess, onCancel, title = 'Enter PIN' }) {
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <View style={styles.dots}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i < pin.length ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'back'].map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.key, { backgroundColor: colors.surfaceVariant }]}
                onPress={() =>
                  d === 'back' ? handleBackspace() : d !== '' ? handleDigit(String(d)) : null
                }
                disabled={d === ''}
              >
                {d === 'back' ? (
                  <MaterialIcons name="backspace" size={28} color={colors.textPrimary} />
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
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: '30%',
    aspectRatio: 1.5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontSize: 24, fontWeight: '600' },
  cancel: { alignItems: 'center', marginTop: 24 },
  cancelText: { fontSize: 16 },
});
