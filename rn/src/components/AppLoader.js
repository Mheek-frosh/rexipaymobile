import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * Reusable professional loading indicator across screens.
 * - mode="inline": compact loader for cards/sections
 * - mode="fullscreen": centered loader for full-screen fetch states
 */
export default function AppLoader({ label = 'Loading...', mode = 'inline' }) {
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
        <LottieView
          source={require('../../assets/lottie/onboarding-track.json')}
          autoPlay
          loop
          style={styles.anim}
        />
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
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
    width: 96,
    height: 96,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  anim: {
    width: 96,
    height: 96,
  },
  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
  },
});
