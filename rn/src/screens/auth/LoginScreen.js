import { useSignIn, useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeSlash } from 'iconsax-react-native';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPickerSheet from '../../components/CountryPickerSheet';
import PrimaryButton from '../../components/PrimaryButton';
import { COUNTRIES } from '../../data/countries';
import { useTheme } from '../../theme/ThemeContext';

const defaultCountry = COUNTRIES[0];

function isValidEmail(value) {
  const t = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, isLoaded, setActive } = useSignIn();
  const { signOut } = useClerkAuth();
  const navigation = useNavigation();
  const [contact, setContact] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canLogin = useMemo(() => {
    if (!contact.trim()) return false;
    if (isEmailMode) return isValidEmail(contact);
    return password.trim().length >= 8;
  }, [contact, password, isEmailMode]);

  const handleLogin = async () => {
    if (!isLoaded) return;
    if (!canLogin) {
      Alert.alert('Error', isEmailMode ? 'Enter a valid email address.' : 'Please enter your phone number and password');
      return;
    }

    setLoading(true);
    try {
      try {
        await signOut();
      } catch (e) {
        // ignore
      }

      if (isEmailMode) {
        const email = contact.trim().toLowerCase();
        const result = await signIn.create({ identifier: email });
        const factor = result.supportedFirstFactors?.find((f) => f.strategy === 'email_code');

        if (!factor?.emailAddressId) {
          Alert.alert('Login Failed', 'Email OTP login is not available for this account.');
          return;
        }

        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: factor.emailAddressId,
        });

        navigation.navigate('OtpVerification', {
          contact: email,
          mode: 'signin',
          verificationMethod: 'email',
        });
      } else {
        const identifier = `${selectedCountry.dialCode}${contact.replace(/^0+/, '')}`;
        const result = await signIn.create({ identifier, password });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });

          const first = result.userData?.firstName;
          const last = result.userData?.lastName;
          const name = [first, last].filter(Boolean).join(' ') || result.userData?.username || 'User';
          const email = result.userData?.emailAddresses?.[0]?.emailAddress || `${identifier}@rexipay.com`;

          navigation.navigate('LoginBiometricsSetup', {
            userPayload: {
              contact: identifier,
              name,
              clerkUserId: result.createdUserId,
              email,
            },
          });
        } else {
          Alert.alert('Login Incomplete', 'Further steps are required to complete login. Please contact support.');
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Login Failed', err.errors?.[0]?.longMessage || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: colors.textPrimary }]}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Log in to RexiPay</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {isEmailMode
            ? 'Enter your registered email and we will send a login code to your inbox.'
            : 'Enter your registered phone number and password to log in.'}
        </Text>

        <Text style={[styles.label, { color: colors.textPrimary }]}> 
          {isEmailMode ? 'Email' : 'Phone number'}
        </Text>
        {isEmailMode ? (
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            value={contact}
            onChangeText={setContact}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
        ) : (
          <View style={styles.phoneRow}>
            <TouchableOpacity
              style={[styles.countryBox, { borderColor: colors.border }]}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={[styles.countryText, { color: colors.textPrimary }]}> 
                {selectedCountry.flag} {selectedCountry.dialCode}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={[
                styles.input,
                styles.phoneInput,
                { color: colors.textPrimary, borderColor: colors.border },
              ]}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textSecondary}
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />
          </View>
        )}
        {isEmailMode ? (
          <View style={styles.hintRow}>
            <Text style={[styles.hintMuted, { color: colors.textSecondary }]}>Or </Text>
            <TouchableOpacity
              onPress={() => {
                setIsEmailMode(false);
                setContact('');
              }}
              hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel="Switch to phone number login"
            >
              <Text style={[styles.hintLink, { color: colors.primary }]}>phone number</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.hintRow}>
            <Text style={[styles.hintMuted, { color: colors.textSecondary }]}> 
              Tip: use email to receive a secure login code.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsEmailMode(true);
                setContact('');
              }}
              hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel="Switch to email login"
            >
              <Text style={[styles.hintLink, { color: colors.primary }]}>Email</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isEmailMode && (
          <>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={[styles.input, styles.passwordInput, { color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye size={22} color={colors.textSecondary} />
                ) : (
                  <EyeSlash size={22} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => navigation.navigate('ForgotPasswordPhone')}
            >
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />
          </>
        )}

        {/* Submit Button */}
        <PrimaryButton
          text={loading ? 'Please wait...' : isEmailMode ? 'Send code' : 'Login'}
          onPress={handleLogin}
          style={styles.btn}
          disabled={loading || !canLogin}
        />

        {/* Navigation to Signup Screen */}
        <TouchableOpacity
          style={styles.linkWrap}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <Text style={[styles.linkText, { color: colors.primary, fontWeight: '600' }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <CountryPickerSheet
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={setSelectedCountry}
        selectedCountry={selectedCountry}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  back: { marginTop: 20 },
  backText: { fontSize: 16, fontWeight: '500' },
  title: { fontSize: 28, fontWeight: '700', marginTop: 40 },
  subtitle: { fontSize: 15, marginTop: 10 },
  label: { fontSize: 15, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  phoneRow: { flexDirection: 'row', gap: 12 },
  countryBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  countryText: { fontSize: 15 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, fontSize: 15 },
  phoneInput: { flex: 1 },
  hintRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
  },
  hintMuted: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  hintLink: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  spacer: { flex: 1, minHeight: 120 },
  btn: { marginTop: 20 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { fontSize: 15, fontWeight: '500' },
  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  linkWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText: { fontSize: 15 },
});
