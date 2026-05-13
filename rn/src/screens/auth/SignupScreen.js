import { useSignUp } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeSlash } from 'iconsax-react-native';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPickerSheet from '../../components/CountryPickerSheet';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';
import { useAuth } from '../../context/AuthContext';
import { COUNTRIES } from '../../data/countries';
import { useTheme } from '../../theme/ThemeContext';

const defaultCountry = COUNTRIES[0];

function isValidEmail(value) {
  const t = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

export default function SignupScreen() {
  const { colors } = useTheme();
  const { setPendingSignupUser } = useAuth();
  const { signUp, isLoaded } = useSignUp();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);

  const canSubmit = useMemo(() => {
    if (!name.trim() || password.trim().length < 8) return false;
    if (!contact.trim()) return false;
    if (isEmailMode) return isValidEmail(contact);
    return true;
  }, [name, password, contact, isEmailMode]);

  const handleSignUp = async () => {
    if (!isLoaded || !canSubmit) return;
    
    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || '';

      if (isEmailMode) {
        const email = contact.trim();
        if (!isValidEmail(email)) {
          Alert.alert('Invalid email', 'Enter a valid email address.');
          return;
        }

        await signUp.create({
          emailAddress: email,
          password,
          firstName,
          lastName,
        });

        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

        setPendingSignupUser({
          name: name.trim(),
          email,
          firstName,
          lastName,
        });

        navigation.navigate('OtpVerification', {
          contact: email,
          mode: 'signup',
          verificationMethod: 'email',
        });
      } else {
        const fullPhone = `${selectedCountry.dialCode}${contact.replace(/^0+/, '')}`;

        await signUp.create({
          phoneNumber: fullPhone,
          password,
          firstName,
          lastName,
        });

        await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });

        setPendingSignupUser({
          name: name.trim(),
          phone: fullPhone,
          firstName,
          countryCode: selectedCountry.dialCode,
        });

        navigation.navigate('OtpVerification', {
          contact: fullPhone,
          mode: 'signup',
          verificationMethod: 'phone',
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Signup Error', err.errors?.[0]?.longMessage || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SegmentedProgressBar totalSteps={4} currentStep={1} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your phone number or email—we will send a code to verify your account
          </Text>

          <Text style={[styles.label, { color: colors.textPrimary }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

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
                accessibilityLabel="Switch to phone number sign up"
              >
                <Text style={[styles.hintLink, { color: colors.primary }]}>phone number</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.hintRow}>
              <Text style={[styles.hintMuted, { color: colors.textSecondary }]}>
                Tip: use your mobile number, or{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsEmailMode(true);
                  setContact('');
                }}
                hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
                accessibilityRole="button"
                accessibilityLabel="Switch to email sign up"
              >
                <Text style={[styles.hintLink, { color: colors.primary }]}>Email</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styles.label, { color: colors.textPrimary }]}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="Minimum 8 characters"
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

          <View style={styles.spacer} />

          <PrimaryButton
            text="Sign Up"
            onPress={handleSignUp}
            disabled={!canSubmit || loading}
            loading={loading}
            style={styles.btn}
          />

          <TouchableOpacity
            style={styles.linkWrap}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.linkText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <Text style={[styles.linkText, { color: colors.primary, fontWeight: '600' }]}>
              Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <CountryPickerSheet
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={setSelectedCountry}
        selectedCountry={selectedCountry}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 24 },
  subtitle: { fontSize: 15, marginTop: 10 },
  label: { fontSize: 15, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
  },
  phoneRow: { flexDirection: 'row', gap: 12 },
  countryBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  countryText: { fontSize: 15 },
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
  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  spacer: { flex: 1, minHeight: 120 },
  btn: { marginTop: 20 },
  linkWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText: { fontSize: 15 },
});
