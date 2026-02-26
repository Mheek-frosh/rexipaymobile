import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';
import { verifyPinResetAndSetPin } from '../services/authService';

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'back'];

export default function ForgotPinSetPinScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { phone, countryCode = '+234', otp } = route.params || {};

  const [step, setStep] = useState(1);
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [loading, setLoading] = useState(false);

  const pin = step === 1 ? pin1 : pin2;
  const setPin = step === 1 ? setPin1 : setPin2;

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    setPin((p) => p + d);
  };

  const handleBackspace = () => setPin((p) => p.slice(0, -1));

  const handleKey = (key) => {
    if (key === 'back') handleBackspace();
    else if (typeof key === 'number') handleDigit(String(key));
  };

  const handleNext = () => {
    if (step === 1 && pin1.length === 4) {
      setStep(2);
    }
  };

  const handleSetPin = async () => {
    if (pin1 !== pin2) {
      Alert.alert('PINs do not match', 'Please make sure both PINs are the same.');
      return;
    }
    if (pin1.length !== 4) return;
    setLoading(true);
    try {
      const result = await verifyPinResetAndSetPin(phone, otp, pin1, countryCode);
      if (result.success) {
        Alert.alert(
          'PIN updated',
          'Your transaction PIN has been reset. You can now use it to view card details and complete transactions.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'MainTabs',
                      state: {
                        routes: [
                          { name: 'Home' },
                          { name: 'Cards' },
                          { name: 'Stats' },
                          { name: 'More' },
                        ],
                        index: 1,
                      },
                    },
                  ],
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Could not set PIN. Please check your code and try again.');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = pin1.length === 4;
  const canProceedStep2 = pin2.length === 4 && pin1 === pin2;

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
        <TouchableOpacity style={styles.back} onPress={() => (step === 1 ? navigation.goBack() : setStep(1))}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
          <MaterialIcons name="lock" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {step === 1 ? 'Create new PIN' : 'Confirm PIN'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {step === 1
            ? 'Enter a 4-digit PIN you\'ll use for transactions.'
            : 'Enter the same PIN again to confirm.'}
        </Text>

        <View style={styles.pinRow}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.pinBox,
                { borderColor: i < pin.length ? colors.primary : colors.border },
              ]}
            >
              {i < pin.length && (
                <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.keypad}>
          {KEYS.map((key, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.key, { backgroundColor: colors.surfaceVariant }]}
              onPress={() => key !== null && handleKey(key)}
              activeOpacity={0.8}
              disabled={key === null}
            >
              {key === 'back' ? (
                <MaterialIcons name="backspace" size={26} color={colors.textPrimary} />
              ) : key !== null ? (
                <Text style={[styles.keyText, { color: colors.textPrimary }]}>{key}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacer} />
        {step === 1 ? (
          <PrimaryButton
            text="Continue"
            onPress={handleNext}
            disabled={!canProceedStep1}
            style={styles.btn}
          />
        ) : (
          <PrimaryButton
            text={loading ? 'Setting PIN...' : 'Set PIN'}
            onPress={handleSetPin}
            disabled={!canProceedStep2 || loading}
            loading={loading}
            style={styles.btn}
          />
        )}
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
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  pinBox: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: { width: 12, height: 12, borderRadius: 6 },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontSize: 24, fontWeight: '600' },
  spacer: { flex: 1, minHeight: 40 },
  btn: { marginTop: 20 },
});
