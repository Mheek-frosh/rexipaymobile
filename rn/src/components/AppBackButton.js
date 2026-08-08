import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function AppBackButton({ onPress, style, hitSlop, accessibilityLabel = 'Go back' }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.75}
      hitSlop={hitSlop}
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.cardBackground }, style]}
    >
      <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
