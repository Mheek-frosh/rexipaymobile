import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';

export default function PersonalInfoScreen() {
  const { colors } = useTheme();
  const { pendingUser } = useAuth();
  const navigation = useNavigation();
  const [fullName, setFullName] = useState(pendingUser?.name || '');
  const [username, setUsername] = useState(pendingUser?.firstName || '');
  const [dob, setDob] = useState('');

  const handleContinue = () => {
    const updatedUser = {
      ...pendingUser,
      name: fullName || pendingUser?.name,
      firstName: username || fullName?.split(' ')[0] || pendingUser?.firstName,
    };
    navigation.navigate('AccountSuccess', { user: updatedUser });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <SegmentedProgressBar totalSteps={4} currentStep={3} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>Personal Info</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        This info needs to be accurate with your ID document.
      </Text>

      <Text style={[styles.label, { color: colors.textPrimary }]}>Full Name</Text>
      <TextInput
        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="Michael Usidamen"
        placeholderTextColor={colors.textSecondary}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={[styles.label, { color: colors.textPrimary }]}>Username</Text>
      <TextInput
        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="Mheek Frosh"
        placeholderTextColor={colors.textSecondary}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={[styles.label, { color: colors.textPrimary }]}>Date of Birth</Text>
      <TextInput
        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="MM/DD/YYYY"
        placeholderTextColor={colors.textSecondary}
        value={dob}
        onChangeText={setDob}
      />

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
  label: { fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
  },
  spacer: { flex: 1, minHeight: 40 },
  btn: { marginTop: 20 },
});
