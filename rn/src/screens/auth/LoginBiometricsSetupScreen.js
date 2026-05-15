import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function LoginBiometricsSetupScreen() {
  const { colors } = useTheme();
  const { user: clerkUser } = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  const { userPayload } = route.params || {};
  const { login } = useAuth();
  
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const finishLogin = () => {
    // Priority: clerkUser details > userPayload > "User"
    const finalName = 
      clerkUser?.fullName || 
      clerkUser?.firstName || 
      userPayload?.name || 
      'User';

    if (userPayload) {
      login(userPayload.contact, finalName, {
        clerkUserId: clerkUser?.id || userPayload.clerkUserId,
        email: clerkUser?.primaryEmailAddress?.emailAddress || userPayload.email,
      });
    } else {
      // Fallback
      login('user', finalName, {});
    }
  };

  const handleEnableBiometrics = async () => {
    setLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometrics',
        fallbackLabel: 'Use passcode',
      });
      if (result.success) {
        await AsyncStorage.setItem('biometricsEnabled', 'true');
        finishLogin();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    finishLogin();
  };

  const canUseBiometrics = hasHardware && isEnrolled;
  const iconName = canUseBiometrics ? 'fingerprint' : 'lock-outline';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.spacer} />
        
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
          <MaterialIcons name={iconName} size={80} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Secure Your App</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Would you like to use Face ID or your phone's lock pin to log in securely and faster next time?
        </Text>

        <View style={styles.spacer} />

        <PrimaryButton 
          text="Enable Biometrics" 
          onPress={handleEnableBiometrics} 
          disabled={!canUseBiometrics || loading}
          loading={loading}
          style={styles.btn} 
        />
        
        {!canUseBiometrics && (
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            Biometrics are not set up or supported on this device.
          </Text>
        )}

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} disabled={loading}>
          <Text style={[styles.skipText, { color: colors.primary }]}>Skip for now</Text>
        </TouchableOpacity>
        
        <View style={{ flex: 0.5 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: { flex: 1 },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  warningText: {
    marginTop: 10,
    fontSize: 13,
    textAlign: 'center',
  },
  btn: { width: '100%' },
  skipBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
