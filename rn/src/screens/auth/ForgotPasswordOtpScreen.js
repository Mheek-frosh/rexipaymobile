import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  const inputRef = useRef(null);

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

  const renderOtpBoxes = () => {
    return (
      <Pressable style={styles.otpContainer} onPress={() => inputRef.current?.focus()}>
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const digit = otp[index] || '';
          const isCurrent = otp.length === index;
          const isActive = isCurrent || (otp.length === 6 && index === 5);

          return (
            <View
              key={index}
              style={[
                styles.otpBox,
                { backgroundColor: '#FFFFFF' },
                isActive && styles.otpBoxActive,
                digit && styles.otpBoxFilled,
              ]}
            >
              <Text style={[styles.otpText, { color: colors.textPrimary || '#1A1A1A' }]}>
                {digit}
              </Text>
            </View>
          );
        })}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={otp}
          onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus={true}
          caretHidden={true}
        />
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>Enter verification code</Text>
      
      <View style={styles.phoneDisplayRow}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We sent a 6-digit code to {formattedPhone}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.editIconBtn}>
          <MaterialIcons name="edit" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {renderOtpBoxes()}

      {resendSeconds > 0 ? (
        <Text style={[styles.resend, { color: colors.textSecondary }]}>
          Resend code in {resendSeconds}s
        </Text>
      ) : (
        <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
          <Text style={[styles.resendActive, { color: colors.primary }]}>
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
  phoneDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: { fontSize: 15 },
  editIconBtn: {
    padding: 4,
    marginLeft: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    position: 'relative',
    paddingHorizontal: 4,
  },
  otpBox: {
    width: 52,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  otpBoxActive: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  otpBoxFilled: {},
  otpText: {
    fontSize: 26,
    fontWeight: '700',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  resendBtn: {
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 8,
  },
  resend: { fontSize: 14, marginTop: 20, textAlign: 'center' },
  resendActive: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  spacer: { flex: 1 },
  btn: { marginTop: 20 },
});
