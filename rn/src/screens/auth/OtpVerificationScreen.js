import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { verifyOtp, sendOtp, getResendStatus } from '../../services/authService';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';

export default function OtpVerificationScreen() {
  const { colors } = useTheme();
  const { signupComplete, setPendingSignupUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { isSignup, name, phone, countryCode = '+234' } = route.params || {};

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);

  useEffect(() => {
    let t;
    if (resendSeconds > 0) {
      t = setInterval(() => setResendSeconds((s) => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(t);
  }, [resendSeconds]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const result = await verifyOtp(phone, otp, countryCode, name);
      if (result.success && result.user) {
        if (isSignup) {
          setPendingSignupUser(result.user);
          navigation.navigate('PersonalInfo');
        } else {
          signupComplete(result.user);
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        }
      } else {
        Alert.alert('Verification Failed', result.error || 'Invalid or expired code');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0) return;
    const result = await sendOtp(phone, countryCode);
    if (result.success) {
      setResendSeconds(60);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const formattedPhone = `${countryCode} ${phone}`;
  const isComplete = otp.length === 6;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SegmentedProgressBar totalSteps={4} currentStep={2} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>Confirm your phone</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        We sent a 6-digit code to {formattedPhone}
      </Text>

      <TextInput
        style={[styles.otpInput, { color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="000000"
        placeholderTextColor={colors.textSecondary}
        value={otp}
        onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
      />

      {resendSeconds > 0 ? (
        <Text style={[styles.resend, { color: colors.textSecondary }]}>
          Resend code in {resendSeconds}s
        </Text>
      ) : (
        <TouchableOpacity onPress={handleResend}>
          <Text style={[styles.resend, { color: colors.primary, fontWeight: '600' }]}>
            Didn't get a code? Resend
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.spacer} />
      <PrimaryButton
        text={loading ? 'Verifying...' : 'Verify Number'}
        onPress={handleVerify}
        disabled={!isComplete}
        loading={loading}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 40 },
  subtitle: { fontSize: 15, marginTop: 10 },
  otpInput: {
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 50,
    textAlign: 'center',
    letterSpacing: 8,
  },
  resend: { fontSize: 14, marginTop: 24, textAlign: 'center' },
  spacer: { flex: 1 },
  btn: { marginTop: 20 },
});
