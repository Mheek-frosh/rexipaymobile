import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';

export default function OtpVerificationScreen() {
  const { colors } = useTheme();
  const { signupComplete, pendingUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { mode, phone, contact, verificationMethod: verificationMethodParam } = route.params || {};
  const displayContact = contact || phone || '';
  const verificationMethod =
    verificationMethodParam || (displayContact.includes('@') ? 'email' : 'phone');

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

  useEffect(() => {
    if (otp.length === 6) {
      Keyboard.dismiss();
      inputRef.current?.blur?.();
    }
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    Keyboard.dismiss();
    inputRef.current?.blur?.();
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!isSignUpLoaded) return;
        const result =
          verificationMethod === 'email'
            ? await signUp.attemptEmailAddressVerification({ code: otp })
            : await signUp.attemptPhoneNumberVerification({ code: otp });

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
            phone: displayContact,
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
    Keyboard.dismiss();
    inputRef.current?.blur?.();
    try {
      if (mode === 'signup') {
        if (verificationMethod === 'email') {
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        } else {
          await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });
        }
      } else {
        const { supportedFirstFactors } = await signIn.create({ identifier: displayContact });
        const factor = supportedFirstFactors.find((f) => f.strategy === 'phone_code');
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
              pointerEvents="none"
              style={[
                styles.otpBox,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: isActive ? colors.primary : colors.border,
                },
                isActive && styles.otpBoxActive,
                digit ? styles.otpBoxFilled : null,
              ]}
            >
              <Text style={[styles.otpText, { color: colors.textPrimary }]}>
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
          textContentType="oneTimeCode"
          maxLength={6}
          autoFocus
          caretHidden
          importantForAutofill="yes"
          underlineColorAndroid="transparent"
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {verificationMethod === 'email' ? 'Confirm your email' : 'Confirm your phone'}
          </Text>

          <View style={styles.phoneDisplayRow}>
            <Text style={[styles.subtitle, { color: colors.textSecondary, marginTop: 0 }]}>
              We sent a 6-digit code to {displayContact}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                navigation.goBack();
              }}
              style={styles.editIconBtn}
            >
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
            text={loading ? 'Verifying...' : verificationMethod === 'email' ? 'Verify email' : 'Verify number'}
            onPress={handleVerify}
            disabled={!isComplete || loading}
            loading={loading}
            style={styles.btn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: { fontSize: 28, fontWeight: '700', marginTop: 8 },
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
    borderWidth: 1,
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
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.02,
    color: 'transparent',
    zIndex: 10,
    fontSize: 1,
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
