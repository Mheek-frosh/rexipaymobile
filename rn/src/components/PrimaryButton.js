import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import IosSpinner from './IosSpinner';

export default function PrimaryButton({ text, onPress, disabled, loading, style, spinnerColor = '#FFFFFF' }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: disabled ? colors.border : colors.primary },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <IosSpinner size={22} color={spinnerColor} />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
