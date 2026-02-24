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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import PrimaryButton from '../../components/PrimaryButton';
import SegmentedProgressBar from '../../components/SegmentedProgressBar';
import { MaterialIcons } from '@expo/vector-icons';

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

export default function PersonalInfoScreen() {
  const { colors } = useTheme();
  const { pendingUser } = useAuth();
  const navigation = useNavigation();
  const [fullName, setFullName] = useState(pendingUser?.name || '');
  const [username, setUsername] = useState(pendingUser?.firstName || '');
  const [dobDate, setDobDate] = useState(null);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const onDobChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDobPicker(false);
    if (selectedDate) setDobDate(selectedDate);
  };

  const handleContinue = () => {
    const updatedUser = {
      ...pendingUser,
      name: fullName || pendingUser?.name,
      firstName: username || fullName?.split(' ')[0] || pendingUser?.firstName,
      dob: dobDate ? dobDate.toISOString() : null,
    };
    navigation.navigate('NINAndFace', { user: updatedUser });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <SegmentedProgressBar totalSteps={5} currentStep={3} />
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
      <TouchableOpacity
        style={[styles.input, styles.dateTouch, { borderColor: colors.border }]}
        onPress={() => setShowDobPicker(true)}
      >
        <Text style={[styles.dateText, { color: dobDate ? colors.textPrimary : colors.textSecondary }]}>
          {dobDate ? formatDate(dobDate) : 'MM/DD/YYYY'}
        </Text>
        <MaterialIcons name="calendar-today" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {showDobPicker && (
        <DateTimePicker
          value={dobDate || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDobChange}
          maximumDate={new Date()}
        />
      )}
      {Platform.OS === 'ios' && showDobPicker && (
        <TouchableOpacity style={styles.iosDateDone} onPress={() => setShowDobPicker(false)}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Done</Text>
        </TouchableOpacity>
      )}

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
  dateTouch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateText: { fontSize: 16 },
  iosDateDone: { marginTop: 12, alignItems: 'flex-end' },
  spacer: { flex: 1, minHeight: 40 },
  btn: { marginTop: 20 },
});
