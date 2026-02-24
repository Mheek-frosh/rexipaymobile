import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { House2 } from 'iconsax-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';

export default function AccountSuccessScreen() {
  const { colors } = useTheme();
  const { signupComplete, pendingUser } = useAuth();
  const route = useRoute();
  const user = route.params?.user || pendingUser;

  const handleGoHome = () => {
    signupComplete(user);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SegmentedProgressBar totalSteps={4} currentStep={4} />
      <View style={styles.illustration}>
        <Text style={styles.emoji}>🎉</Text>
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Congratulations!{'\n'}Welcome to RexiPay
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        We are happy to have you. It's time to send, receive and track your expense.
      </Text>
      <View style={styles.spacer} />
      <TouchableOpacity style={[styles.homeBtn, { backgroundColor: colors.cardBackground }]} onPress={handleGoHome}>
        <House2 size={32} color="#FF8A65" />
        <Text style={[styles.homeBtnText, { color: colors.textPrimary }]}>Navigate home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  illustration: { alignItems: 'center', marginTop: 80 },
  emoji: { fontSize: 120 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginTop: 40 },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  spacer: { flex: 1 },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  homeBtnText: { fontSize: 16, fontWeight: '600' },
});
