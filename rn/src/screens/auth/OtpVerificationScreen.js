import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';

export default function OtpVerificationScreen() {
  const { colors } = useTheme();
  const { signupComplete, setPendingSignupUser, pendingUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { mode, phone } = route.params || {};

  const { signIn, setActive: setActiveSignIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: isSignUpLoaded } = useSignUp();

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
      if (mode === 'signup') {
        if (!isSignUpLoaded) return;
        const result = await signUp.attemptPhoneNumberVerification({
          code: otp,
        });

        if (result.status === 'complete') {
          await setActiveSignUp({ session: result.createdSessionId });
          // After setting session, we might want to update our local context
          await signupComplete({
            ...pendingUser,
            id: result.createdUserId,
          });
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } else {
          Alert.alert('Verification Failed', 'Verification could not be completed.');
        }
      } else {
        if (!isSignInLoaded) return;
        const result = await signIn.attemptFirstFactor({
          strategy: 'phone_code',
          code: otp,
        });

        if (result.status === 'complete') {
          await setActiveSignIn({ session: result.createdSessionId });
          // Update local context
          await signupComplete({
            phone: phone,
            name: result.userData?.firstName || 'User',
          });
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } else {
          Alert.alert('Verification Failed', 'Invalid or expired code');
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Verification Error', err.errors?.[0]?.longMessage || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0) return;
    try {
      if (mode === 'signup') {
        await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });
      } else {
        const { supportedFirstFactors } = await signIn.create({ identifier: phone });
        const factor = supportedFirstFactors.find(f => f.strategy === 'phone_code');
        await signIn.prepareFirstFactor({ strategy: 'phone_code', phoneNumberId: factor.phoneNumberId });
      }
      setResendSeconds(60);
      setOtp('');
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.longMessage || 'Failed to resend code');
    }
  };

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SegmentedProgressBar totalSteps={4} currentStep={2} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>Confirm your phone</Text>
      
      <View style={styles.phoneDisplayRow}>
        <Text style={[styles.subtitle, { color: colors.textSecondary, marginTop: 0 }]}>
          We sent a 6-digit code to {phone}
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
  phoneDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  subtitle: { fontSize: 15, lineHeight: 22 },
  editIconBtn: {
    padding: 4,
    marginLeft: 8,
  },
  
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
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
  otpBoxFilled: {
    // Optionally style filled boxes
  },
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
