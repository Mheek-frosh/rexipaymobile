import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';

export default function NINAndFaceScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user || {};
  const [ninUploaded, setNinUploaded] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);

  const handleUploadNIN = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to photos to upload NIN.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) setNinUploaded(true);
  };

  const handleScanFace = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (hasHardware && enrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your face to verify identity',
        fallbackLabel: 'Use PIN',
      });
      if (result.success) setFaceScanned(true);
    } else {
      setFaceScanned(true);
    }
  };

  const handleContinue = () => {
    if (!ninUploaded || !faceScanned) {
      Alert.alert('Required', 'Please upload your NIN and complete face scan to continue.');
      return;
    }
    navigation.navigate('AccountSuccess', { user: { ...user, ninUploaded, faceVerified: faceScanned } });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <SegmentedProgressBar totalSteps={4} currentStep={3} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>Verify Identity</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Upload your NIN and scan your face to complete verification.
      </Text>

      <Text style={[styles.label, { color: colors.textPrimary }]}>NIN Document</Text>
      <TouchableOpacity
        style={[styles.uploadBox, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
        onPress={handleUploadNIN}
      >
        {ninUploaded ? (
          <View style={styles.uploaded}>
            <MaterialIcons name="check-circle" size={40} color={colors.success} />
            <Text style={[styles.uploadedText, { color: colors.textPrimary }]}>NIN uploaded</Text>
          </View>
        ) : (
          <>
            <MaterialIcons name="cloud-upload" size={48} color={colors.textSecondary} />
            <Text style={[styles.uploadText, { color: colors.textPrimary }]}>Tap to upload NIN</Text>
            <Text style={[styles.uploadHint, { color: colors.textSecondary }]}>Image or PDF</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={[styles.label, { color: colors.textPrimary }]}>Face verification</Text>
      <TouchableOpacity
        style={[
          styles.uploadBox,
          { borderColor: colors.border, backgroundColor: colors.cardBackground },
          faceScanned && { borderColor: colors.success },
        ]}
        onPress={handleScanFace}
      >
        {faceScanned ? (
          <View style={styles.uploaded}>
            <MaterialIcons name="face-retouching-natural" size={40} color={colors.success} />
            <Text style={[styles.uploadedText, { color: colors.textPrimary }]}>Face verified</Text>
          </View>
        ) : (
          <>
            <MaterialIcons name="face" size={48} color={colors.textSecondary} />
            <Text style={[styles.uploadText, { color: colors.textPrimary }]}>Tap to scan face</Text>
            <Text style={[styles.uploadHint, { color: colors.textSecondary }]}>Uses device camera / Face ID</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.spacer} />
      <PrimaryButton text="Continue" onPress={handleContinue} style={styles.btn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 40 },
  subtitle: { fontSize: 15, marginTop: 10 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  uploadBox: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  uploadText: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  uploadHint: { fontSize: 13, marginTop: 4 },
  uploaded: { alignItems: 'center' },
  uploadedText: { fontSize: 15, fontWeight: '600', marginTop: 8 },
  spacer: { flex: 1, minHeight: 40 },
  btn: { marginTop: 20 },
});
