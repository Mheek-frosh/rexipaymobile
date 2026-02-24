import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { sendOtp } from '../../services/authService';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';
import CountryPickerSheet from '../../components/CountryPickerSheet';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { COUNTRIES } from '../../data/countries';

const defaultCountry = COUNTRIES[0];

export default function SignupScreen() {
  const { colors } = useTheme();
  const { setPendingSignupUser } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const canSubmit = name.trim() && phone.trim();

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      // For now: skip OTP and go directly to PersonalInfo - logic will be added later
      const userData = {
        name: name.trim(),
        phone: phone.trim(),
        firstName: name.trim().split(' ')[0] || 'User',
        countryCode: selectedCountry.dialCode,
      };
      setPendingSignupUser(userData);
      navigation.navigate('PersonalInfo', { skipOtp: true });
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong');
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
          Enter your mobile number to verify your account
        </Text>

        <Text style={[styles.label, { color: colors.textPrimary }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="e.g. Michael Ozeluah"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={[styles.label, { color: colors.textPrimary }]}>Phone</Text>
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
            placeholder="90 3444 8700"
            placeholderTextColor={colors.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={[styles.label, { color: colors.textPrimary }]}>Password</Text>
        <View style={styles.passwordWrap}>
          <TextInput
            style={[styles.input, styles.passwordInput, { color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="••••••••••"
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
          disabled={!canSubmit}
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
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 40 },
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
  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  spacer: { flex: 1, minHeight: 40 },
  btn: { marginTop: 20 },
  linkWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText: { fontSize: 15 },
});
