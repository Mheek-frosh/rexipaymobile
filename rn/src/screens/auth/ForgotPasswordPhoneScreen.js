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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';
import CountryPickerSheet from '../../components/CountryPickerSheet';
import { COUNTRIES } from '../../data/countries';
import { sendPasswordResetOtp } from '../../services/authService';

const defaultCountry = COUNTRIES[0];

export default function ForgotPasswordPhoneScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const trimmed = phone.trim().replace(/\D/g, '');
    if (!trimmed || trimmed.length < 10) {
      Alert.alert('Invalid number', 'Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      const result = await sendPasswordResetOtp(trimmed, selectedCountry.dialCode);
      if (result.success) {
        navigation.navigate('ForgotPasswordOtp', {
          phone: trimmed,
          countryCode: selectedCountry.dialCode,
        });
      } else {
        Alert.alert('Error', result.error || 'Could not send OTP.');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong.');
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
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
          <MaterialIcons name="lock-reset" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Reset password</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your registered phone number. We'll send you a one-time code to reset your password.
        </Text>

        <Text style={[styles.label, { color: colors.textPrimary }]}>Phone number</Text>
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
            placeholder="801 234 5678"
            placeholderTextColor={colors.textSecondary}
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>

        <View style={styles.spacer} />
        <PrimaryButton
          text={loading ? 'Sending...' : 'Send OTP'}
          onPress={handleSendOtp}
          loading={loading}
          disabled={!phone.trim() || loading}
          style={styles.btn}
        />
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
  back: { marginTop: 50, marginBottom: 20 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  phoneRow: { flexDirection: 'row', gap: 12 },
  countryBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  countryText: { fontSize: 15 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16 },
  phoneInput: { flex: 1 },
  spacer: { flex: 1, minHeight: 80 },
  btn: { marginTop: 20 },
});
