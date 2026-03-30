import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
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
  const inputRef = useRef(null);

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
          try {
            await signupComplete(result.user);
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
          } catch (err) {
            console.error(err);
          }
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

  // Render the 6 digit boxes
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
                {
                  backgroundColor: colors.surface || '#FAFAFA',
                  borderColor: isActive ? colors.primary : colors.border,
                },
                isActive && { borderWidth: 2, transform: [{ scale: 1.05 }] },
                digit && { borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.otpText, { color: colors.textPrimary }]}>{digit}</Text>
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SegmentedProgressBar totalSteps={4} currentStep={2} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>Confirm your phone</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        We sent a 6-digit code to {formattedPhone}
      </Text>

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
        text={loading ? 'Verifying...' : 'Verify Number'}
        onPress={handleVerify}
        disabled={!isComplete || loading}
        loading={loading}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 40 },
  subtitle: { fontSize: 15, marginTop: 10, lineHeight: 22 },
  
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    position: 'relative',
    paddingHorizontal: 5,
  },
  otpBox: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  otpText: {
    fontSize: 24,
    fontWeight: '700',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  
  resendBtn: {
    marginTop: 32,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 8,
  },
  resend: { fontSize: 15, marginTop: 32, textAlign: 'center', fontWeight: '500' },
  resendActive: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  
  spacer: { flex: 1 },
  btn: { marginTop: 20, marginBottom: 20 },
});
