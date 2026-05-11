import { useSignIn } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
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

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!isLoaded) return;
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `${selectedCountry.dialCode}${phone.replace(/^0+/, '')}`;
      
      const { supportedFirstFactors } = await signIn.create({
        identifier: fullPhone,
      });

      const isPhoneCodeSupported = supportedFirstFactors.find(
        (f) => f.strategy === 'phone_code'
      );

      if (isPhoneCodeSupported) {
        await signIn.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId: isPhoneCodeSupported.phoneNumberId,
        });

        navigation.navigate('OtpVerification', {
          phone: fullPhone,
          strategy: 'phone_code',
          mode: 'login'
        });
      } else {
        Alert.alert('Error', 'Phone number login is not supported for this account.');
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
        <PrimaryButton text={loading ? "Please wait..." : "Login"} onPress={handleLogin} style={styles.btn} disabled={loading} />

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
