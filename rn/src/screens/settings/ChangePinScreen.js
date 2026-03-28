import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import * as LocalAuthentication from 'expo-local-authentication';
import PinEntryModal from '../../components/PinEntryModal';

export default function ChangePinScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [showPinModal, setShowPinModal] = useState(false);

  const handleOpen = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const canUseBiometrics = hasHardware && enrolled;

      if (canUseBiometrics) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to change PIN',
          fallbackLabel: 'Use current PIN',
        });
        if (result.success) {
          handlePinSuccess();
          return;
        }
      }
      setShowPinModal(true);
    } catch {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    Alert.alert(
      'PIN updated',
      'Your 4‑digit transaction PIN has been changed successfully.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Change PIN</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
          <MaterialIcons name="lock-reset" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          Enter 4‑digit PIN
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Use your current 4‑digit transaction PIN. You’ll use this same style of PIN
          entry whenever you approve transfers, airtime purchases, or offline payments.
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={handleOpen}
        >
          <Text style={styles.primaryBtnText}>Change PIN</Text>
        </TouchableOpacity>

        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          Forgot your PIN? Use the{' '}
          <Text style={[styles.helperStrong, { color: colors.primary }]}>
            Forgot PIN
          </Text>{' '}
          flow to reset it with OTP.
        </Text>
      </View>

      <PinEntryModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onCancel={() => setShowPinModal(false)}
        title="Enter 4‑digit PIN"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  primaryBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  helper: { fontSize: 13, lineHeight: 20, marginTop: 16 },
  helperStrong: { fontWeight: '600' },
});

