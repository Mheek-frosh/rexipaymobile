import React from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';

export default function TransactionProcessingModal({
  visible,
  label = 'Processing transaction...',
  subtext = 'Please wait while RexiPay completes this securely.',
}) {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View
        style={styles.overlay}
        accessibilityViewIsModal
        accessibilityRole="progressbar"
        accessibilityLabel={label}
      >
        <BlurView
          intensity={18}
          tint={isDark ? 'dark' : 'light'}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isDark ? 'rgba(4, 8, 20, 0.20)' : 'rgba(255, 255, 255, 0.10)' },
          ]}
        />

        <View style={styles.content}>
          <Image
            source={require('../../assets/rexiloading.gif')}
            style={styles.image}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>{subtext}</Text>
          <View
            style={[
              styles.securityPill,
              {
                backgroundColor: isDark
                  ? 'rgba(3, 29, 91, 0.24)'
                  : 'rgba(255, 255, 255, 0.62)',
              },
            ]}
          >
            <MaterialIcons name="lock-outline" size={14} color={colors.primary} />
            <Text style={[styles.securityText, { color: colors.primary }]}>Secure transaction</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  content: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  image: {
    width: 132,
    height: 132,
    marginBottom: 18,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtext: {
    maxWidth: 260,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  securityText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
