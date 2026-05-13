import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';
import { buildRexipayAccountNumber } from '../../utils/rexipayAccount';
import { MaterialIcons } from '@expo/vector-icons';

export default function AccountSuccessScreen() {
  const { colors, isDark } = useTheme();
  const { signupComplete, pendingUser } = useAuth();
  const route = useRoute();
  const user = route.params?.user || pendingUser;

  const { name, email, accountNumber } = useMemo(() => {
    const n = user?.name || user?.firstName || 'User';
    const syntheticEmail = user?.phone
      ? `${String(user.phone).replace(/\D/g, '')}@rexipay.com`
      : '';
    const e = user?.email?.trim() || syntheticEmail || 'user@rexipay.com';
    const a = buildRexipayAccountNumber({
      clerkUserId: user?.id,
      phone: user?.phone,
      email: e,
    });
    return { name: n, email: e, accountNumber: a };
  }, [user]);

  // Finalizes the signup flow by saving the user payload to AuthContext (`signupComplete`)
  // This causes RootNavigator to switch from the Auth Stack -> MainTabs
  const handleContinue = () => {
    signupComplete(user);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SegmentedProgressBar totalSteps={4} currentStep={4} />
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: '#10B981' }]}>
              <MaterialIcons name="check" size={50} color="#FFF" />
            </View>
          </View>
          
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Account Created!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Welcome to RexiPay. Your account is ready and you can now send, receive and track your expenses.
          </Text>

          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Account Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{name}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Email Address</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{email}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Account Number</Text>
              <View style={styles.accountNumberWrapper}>
                <Text style={[styles.accountNumberText, { color: colors.primary }]}>{accountNumber}</Text>
                <MaterialIcons name="content-copy" size={16} color={colors.primary} style={{ marginLeft: 6 }} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
        <PrimaryButton text="Continue to Dashboard" onPress={handleContinue} style={styles.btn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'column',
    gap: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  accountNumberWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountNumberText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    marginVertical: 16,
  },
  spacer: { flex: 1, minHeight: 40 },
  btn: { marginTop: 20 },
});
