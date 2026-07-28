import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import IosSpinner from './IosSpinner';

/**
 * Reusable professional loading indicator across screens.
 * Uses custom 12-tick iOS spinner in RexiPay navy #172FC7.
 */
export default function AppLoader({ label = 'Loading...', mode = 'inline', color = '#172FC7', size = 38 }) {
  const { colors } = useTheme();
  const fullscreen = mode === 'fullscreen';

  return (
    <View
      style={[
        styles.wrap,
        fullscreen ? styles.fullscreen : styles.inline,
        fullscreen && { backgroundColor: colors.background },
      ]}
    >
      <View
        style={[
          styles.animBox,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <IosSpinner size={size} color={color} />
      </View>
      {label ? <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inline: {
    paddingVertical: 20,
  },
  animBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
  },
});
