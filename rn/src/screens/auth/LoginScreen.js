import { useSignIn } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
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
  const { signIn, isLoaded } = useSignIn();
  const navigation = useNavigation();
  const [contact, setContact] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const canLogin = useMemo(() => {
    if (!contact.trim()) return false;
    if (isEmailMode) return isValidEmail(contact);
    return true;
  }, [contact, isEmailMode]);

  const handleLogin = async () => {
    if (!isLoaded) return;
    if (!canLogin) {
      Alert.alert('Error', isEmailMode ? 'Enter a valid email address.' : 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      if (isEmailMode) {
        const email = contact.trim().toLowerCase();
        const { supportedFirstFactors } = await signIn.create({
          identifier: email,
        });

        const emailFactor = supportedFirstFactors.find((f) => f.strategy === 'email_code');
        if (!emailFactor?.emailAddressId) {
          Alert.alert('Error', 'Email code login is not available for this account.');
          return;
        }

        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: emailFactor.emailAddressId,
        });

        navigation.navigate('OtpVerification', {
          contact: email,
          verificationMethod: 'email',
          mode: 'login',
        });
      } else {
        const fullPhone = `${selectedCountry.dialCode}${contact.replace(/^0+/, '')}`;

        const { supportedFirstFactors } = await signIn.create({
          identifier: fullPhone,
        });

        const phoneFactor = supportedFirstFactors.find((f) => f.strategy === 'phone_code');

        if (!phoneFactor?.phoneNumberId) {
          Alert.alert('Error', 'Phone number login is not supported for this account.');
          return;
        }

        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId: phoneFactor.phoneNumberId,
        });

        navigation.navigate('OtpVerification', {
          contact: fullPhone,
          verificationMethod: 'phone',
          mode: 'login',
        });
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
          Enter your registered phone number or email
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
              Tip: use your registered number, or{' '}
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

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotWrap}
          onPress={() => navigation.navigate('ForgotPasswordPhone')}
        >
          <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        {/* Submit Button */}
        <PrimaryButton
          text={loading ? 'Please wait...' : 'Login'}
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
  linkWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText: { fontSize: 15 },
});
