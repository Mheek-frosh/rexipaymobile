import React from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.imageShell, { backgroundColor: isDark ? '#151D31' : '#F2F6FF' }]}>
            <Image
              source={require('../../assets/rexiloading.gif')}
              style={styles.image}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>
          <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>{subtext}</Text>
          <View style={[styles.securityPill, { backgroundColor: colors.primaryLight }]}>
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
    backgroundColor: 'rgba(5, 10, 25, 0.64)',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 26,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  imageShell: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: 112,
    height: 112,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
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
