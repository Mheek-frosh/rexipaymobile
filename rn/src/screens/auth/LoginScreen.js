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

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');

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

        <Text style={[styles.label, { color: colors.textPrimary }]}>Phone</Text>
        <View style={styles.phoneRow}>
          <View style={[styles.countryBox, { borderColor: colors.border }]}>
            <Text style={[styles.countryText, { color: colors.textPrimary }]}>🇳🇬 +234</Text>
          </View>
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

        <View style={styles.spacer} />
        <PrimaryButton text="Login" onPress={handleLogin} style={styles.btn} />
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
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
  spacer: { flex: 1, minHeight: 40 },
  btn: { marginTop: 20 },
  linkWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText: { fontSize: 15 },
});
