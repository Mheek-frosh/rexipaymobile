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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';
import CountryPickerSheet from '../../components/CountryPickerSheet';
import { COUNTRIES } from '../../data/countries';

const defaultCountry = COUNTRIES[0];

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Handles the login submission.
  // In a real app, this would validate the phone number format and authenticate via an API.
  // Currently, it triggers the `login` function from AuthContext to set authentication state.
  const handleLogin = () => {
    login(phone.trim() || '9034448700', phone.trim() ? 'User' : 'User');
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
          Enter your registered mobile number
        </Text>

        {/* Mobile Number Input Section */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>Phone</Text>
        <View style={styles.phoneRow}>
          {/* Country Code Picker: Opens a bottom sheet to select the country code */}
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
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotWrap}
          onPress={() => navigation.navigate('ForgotPasswordPhone')}
        >
          <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        {/* Submit Button */}
        <PrimaryButton text="Login" onPress={handleLogin} style={styles.btn} />

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
  spacer: { flex: 1, minHeight: 120 },
  btn: { marginTop: 20 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { fontSize: 15, fontWeight: '500' },
  linkWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText: { fontSize: 15 },
});
