import React from 'react';
import { ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function PrimaryButton({ text, onPress, disabled, loading, style, spinnerColor }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: disabled ? colors.border : colors.primary,
          borderRadius: colors.buttonRadius,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor || colors.onPrimary} />
      ) : (
        <Text style={[styles.text, { color: colors.onPrimary }]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});
