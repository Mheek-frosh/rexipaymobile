import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../theme/ThemeContext';

export default function BiometricsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const hw = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (mounted) {
          setHasHardware(hw);
          setIsEnrolled(enrolled);
        }
      } catch {
        if (mounted) {
          setHasHardware(false);
          setIsEnrolled(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleTest = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with biometrics',
        fallbackLabel: 'Use device passcode',
      });
      setLastResult(result.success ? 'success' : 'failed');
    } catch {
      setLastResult('error');
    }
  };

  const statusText = !hasHardware
    ? 'This device does not support Face ID or fingerprint.'
    : !isEnrolled
    ? 'Biometrics supported, but no Face ID / fingerprint is enrolled yet.'
    : 'Biometrics are available and enrolled on this device.';

  const statusIcon = !hasHardware ? 'phone-android' : 'verified-user';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Biometrics</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
            <MaterialIcons name={statusIcon} size={32} color={colors.primary} />
          </View>
          <Text style={[styles.heading, { color: colors.textPrimary }]}>
            Use Face ID or fingerprint
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{statusText}</Text>
          <Text style={[styles.note, { color: colors.textSecondary }]}>
            When enabled, Rexipay will prefer biometrics (Face ID / Touch ID or fingerprint){' '}
            on supported phones, and fall back to your 4‑digit PIN where needed
            (for example, when buying airtime or confirming payments).
          </Text>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: hasHardware ? colors.primary : colors.border },
            ]}
            onPress={handleTest}
            disabled={!hasHardware}
          >
            <Text
              style={[
                styles.primaryBtnText,
                { color: hasHardware ? '#FFF' : colors.textSecondary },
              ]}
            >
              {hasHardware ? 'Test biometrics' : 'Not supported on this device'}
            </Text>
          </TouchableOpacity>

          {lastResult && (
            <Text
              style={[
                styles.result,
                {
                  color:
                    lastResult === 'success'
                      ? colors.success
                      : lastResult === 'failed'
                      ? colors.error
                      : colors.textSecondary,
                },
              ]}
            >
              {lastResult === 'success'
                ? 'Authentication successful.'
                : lastResult === 'failed'
                ? 'Authentication failed or was cancelled.'
                : 'There was an error starting biometric auth.'}
            </Text>
          )}
        </View>
      </View>
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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  card: {
    borderRadius: 20,
    padding: 20,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  note: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  primaryBtn: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '600' },
  result: { marginTop: 16, fontSize: 13 },
});

