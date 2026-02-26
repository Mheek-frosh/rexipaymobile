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
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function ForgotPasswordSetPasswordScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (password.length < 6) {
      Alert.alert('Invalid password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please make sure both passwords are the same.');
      return;
    }
    Alert.alert(
      'Password updated',
      'Your password has been reset. You can now log in with your new password.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  };

  const isValid = password.length >= 6 && password === confirmPassword;

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
          <MaterialIcons name="lock" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Set new password</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose a new password. Use at least 6 characters.
        </Text>

        <Text style={[styles.label, { color: colors.textPrimary }]}>New password</Text>
        <View style={[styles.inputWrap, { borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Enter password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: colors.textPrimary }]}>Confirm password</Text>
        <TextInput
          style={[styles.input, styles.inputFull, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Confirm password"
          placeholderTextColor={colors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.spacer} />
        <PrimaryButton
          text="Reset password"
          onPress={handleSubmit}
          disabled={!isValid}
          style={styles.btn}
        />
      </ScrollView>
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
  label: { fontSize: 15, fontWeight: '600', marginBottom: 10, marginTop: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  inputFull: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16 },
  spacer: { flex: 1, minHeight: 60 },
  btn: { marginTop: 20 },
});
