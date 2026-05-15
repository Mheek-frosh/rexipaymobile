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

function clerkFirstError(err) {
  if (!err) return null;
  return err.errors?.[0] || err.clerkError?.errors?.[0] || null;
}

function isAlreadyVerifiedClerkError(err) {
  const e = clerkFirstError(err);
  if (!e) return false;
  const code = String(e.code || '').toLowerCase();
  const msg = String(e.longMessage || e.message || '').toLowerCase();
  return (
    (code.includes('already') && (code.includes('verif') || code.includes('completed'))) ||
    msg.includes('already been verified') ||
    msg.includes('already verified') ||
    msg.includes('verification has already') ||
    msg.includes('has already been verified')
  );
}

function missingHas(missing, snake, camel) {
  return missing.some((m) => m === snake || m === camel);
}

/**
 * Clerk often returns `missing_requirements` after OTP (e.g. username, legal).
 * Apply common patches so sign-up can complete without a second Verify tap.
 */
async function satisfyClerkSignupMissing(signUp, { pendingUser, displayContact }) {
  let s = signUp;
  for (let attempt = 0; attempt < 8; attempt++) {
    if (s.status === 'complete' && s.createdSessionId) {
      return s;
    }
    const missing = s.missingFields || [];
    if (!missing.length) {
      return s;
    }
    const patch = {};
    if (missingHas(missing, 'legal_accepted', 'legalAccepted')) {
      patch.legalAccepted = true;
    }
    if (missingHas(missing, 'username', 'username')) {
      const raw = String(pendingUser?.email || displayContact || 'user')
        .split('@')[0]
        .replace(/[^a-z0-9_]/gi, '')
        .slice(0, 14);
      patch.username = `${raw || 'user'}_${Math.random().toString(36).slice(2, 8)}`;
    }
    if (missingHas(missing, 'first_name', 'firstName') && pendingUser?.firstName) {
      patch.firstName = pendingUser.firstName;
    }
    if (missingHas(missing, 'last_name', 'lastName')) {
      patch.lastName = pendingUser?.lastName ?? '';
    }
    if (Object.keys(patch).length === 0) {
      return s;
    }
    s = await signUp.update(patch);
  }
  return s;
}

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
  const verificationLockRef = useRef(false);

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
    if (otp.length !== 6 || verificationLockRef.current || loading) return;
    Keyboard.dismiss();
    inputRef.current?.blur?.();
    verificationLockRef.current = true;
    setLoading(true);

    const finalizeSignup = async (sessionId, userId) => {
      if (!sessionId) {
        Alert.alert('Verification Failed', 'No session was created. Please try signing up again.');
        return;
      }
      await setActiveSignUp({ session: sessionId });
      const userPayload = {
        ...(pendingUser || {}),
        id: userId,
      };
      navigation.reset({
        index: 0,
        routes: [{ name: 'AccountSuccess', params: { user: userPayload } }],
      });
    };

    const tryRecoverSignupAfterAlreadyVerified = async () => {
      let sessionId = signUp.createdSessionId;
      let userId = signUp.createdUserId;
      if (signUp.status === 'complete' && sessionId) {
        try {
          await finalizeSignup(sessionId, userId);
          return true;
        } catch (finalizeErr) {
          console.error(finalizeErr);
        }
      }
      try {
        if (typeof signUp.reload === 'function') {
          await signUp.reload();
        }
      } catch (_) {
        /* ignore */
      }
      sessionId = signUp.createdSessionId;
      userId = signUp.createdUserId;
      if (signUp.status === 'complete' && sessionId) {
        try {
          await finalizeSignup(sessionId, userId);
          return true;
        } catch (finalizeErr) {
          console.error(finalizeErr);
        }
      }
      return false;
    };

    try {
      if (mode === 'signup') {
        if (!isSignUpLoaded) return;

        let result;
        try {
          result =
            verificationMethod === 'email'
              ? await signUp.attemptEmailAddressVerification({ code: otp })
              : await signUp.attemptPhoneNumberVerification({ code: otp });
        } catch (attemptErr) {
          if (isAlreadyVerifiedClerkError(attemptErr)) {
            const recovered = await tryRecoverSignupAfterAlreadyVerified();
            if (recovered) return;
          }
          throw attemptErr;
        }

        let sessionId = result.createdSessionId || signUp.createdSessionId;
        let userId = result.createdUserId || signUp.createdUserId;

        if (result.status === 'complete' && sessionId) {
          await finalizeSignup(sessionId, userId);
          return;
        }

        if (result.status === 'missing_requirements') {
          try {
            await satisfyClerkSignupMissing(signUp, { pendingUser, displayContact });
          } catch (patchErr) {
            console.error(patchErr);
          }
          sessionId = signUp.createdSessionId;
          userId = signUp.createdUserId;
          if (signUp.status === 'complete' && sessionId) {
            await finalizeSignup(sessionId, userId);
            return;
          }
        }

        if (signUp.status === 'complete' && (signUp.createdSessionId || sessionId)) {
          await finalizeSignup(signUp.createdSessionId || sessionId, signUp.createdUserId || userId);
          return;
        }

        const stillMissing = signUp.missingFields || result.missingFields || [];
        Alert.alert(
          'Finish sign-up in Clerk',
          stillMissing.length
            ? `Your Clerk project still requires: ${stillMissing.join(', ')}. In the Clerk dashboard open User & authentication → Email, phone, username and either collect these in your app or turn them off as required for sign-up.`
            : 'Sign-up could not be completed. Check Clerk dashboard settings for required fields.',
        );
        return;
      } else {
        if (!isSignInLoaded) return;
        const result = await signIn.attemptFirstFactor({
          strategy: verificationMethod === 'email' ? 'email_code' : 'phone_code',
          code: otp,
        });

        if (result.status === 'complete') {
          await setActiveSignIn({ session: result.createdSessionId });
          const first = result.userData?.firstName;
          const last = result.userData?.lastName;
          const name = [first, last].filter(Boolean).join(' ') || result.userData?.username || 'User';
          const email = verificationMethod === 'email' 
            ? displayContact.trim().toLowerCase() 
            : result.userData?.emailAddresses?.[0]?.emailAddress || `${displayContact}@rexipay.com`;

          navigation.navigate('LoginBiometricsSetup', {
            userPayload: {
              contact: displayContact,
              name,
              clerkUserId: result.createdUserId,
              email,
            },
          });
        } else {
          Alert.alert('Verification Failed', 'Invalid or expired code');
        }
      }
    } catch (err) {
      console.error(err);
      if (mode === 'signup') {
        if (isAlreadyVerifiedClerkError(err)) {
          const recovered = await tryRecoverSignupAfterAlreadyVerified();
          if (recovered) return;
        }
        const e0 = clerkFirstError(err);
        Alert.alert('Verification Error', e0?.longMessage || e0?.message || 'An error occurred during verification');
      } else {
        const e0 = clerkFirstError(err);
        Alert.alert('Verification Error', e0?.longMessage || e0?.message || 'An error occurred during verification');
      }
    } finally {
      setLoading(false);
      verificationLockRef.current = false;
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
        if (verificationMethod === 'email') {
          const factor = supportedFirstFactors.find((f) => f.strategy === 'email_code');
          if (!factor?.emailAddressId) {
            Alert.alert('Error', 'Could not resend email code.');
            return;
          }
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: factor.emailAddressId,
          });
        } else {
          const factor = supportedFirstFactors.find((f) => f.strategy === 'phone_code');
          if (!factor?.phoneNumberId) {
            Alert.alert('Error', 'Could not resend SMS code.');
            return;
          }
          await signIn.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId: factor.phoneNumberId,
          });
        }
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
