import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function ForgotPasswordOtpScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { phone, countryCode = '+234' } = route.params || {};

  const [otp, setOtp] = useState('');
  const [resendSeconds, setResendSeconds] = useState(60);

  useEffect(() => {
    let t;
    if (resendSeconds > 0) {
      t = setInterval(() => setResendSeconds((s) => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(t);
  }, [resendSeconds]);

  const handleContinue = () => {
    if (otp.length !== 6) return;
    navigation.navigate('ForgotPasswordSetPassword', { phone, countryCode, otp });
  };

  const handleResend = () => {
    if (resendSeconds > 0) return;
    setResendSeconds(60);
  };

  const formattedPhone = `${countryCode} ${phone}`;
  const isComplete = otp.length === 6;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>Enter verification code</Text>
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
        autoFocus
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
        text="Continue"
        onPress={handleContinue}
        disabled={!isComplete}
        style={styles.btn}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  back: { marginTop: 50, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, marginBottom: 32 },
  otpInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 10,
  },
  resend: { fontSize: 14, marginTop: 20, textAlign: 'center' },
  spacer: { flex: 1 },
  btn: { marginTop: 20 },
});
