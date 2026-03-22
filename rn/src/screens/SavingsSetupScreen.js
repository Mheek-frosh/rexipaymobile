import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly'];

export default function SavingsSetupScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [goalName, setGoalName] = useState('');
  const [target, setTarget] = useState('');
  const [contribution, setContribution] = useState('');
  const [frequency, setFrequency] = useState('Monthly');

  const submit = () => {
    const name = goalName.trim();
    if (!name) {
      Alert.alert('Goal name', 'Please enter a name for this savings goal.');
      return;
    }
    if (!target.trim() || !contribution.trim()) {
      Alert.alert('Amounts', 'Please enter target amount and how much you want to save per period.');
      return;
    }
    Alert.alert(
      'Savings goal created',
      `"${name}" is set up. You can fund it anytime from your wallet.`,
      [{ text: 'View savings', onPress: () => navigation.navigate('SavingsHome') }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>New goal</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.label, { color: colors.textSecondary }]}>Goal name</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
          placeholder="e.g. Rent, Laptop, Trip"
          placeholderTextColor={colors.textSecondary}
          value={goalName}
          onChangeText={setGoalName}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Target amount (₦)</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
          placeholder="500000"
          placeholderTextColor={colors.textSecondary}
          keyboardType="decimal-pad"
          value={target}
          onChangeText={setTarget}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Save per period (₦)</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
          placeholder="10000"
          placeholderTextColor={colors.textSecondary}
          keyboardType="decimal-pad"
          value={contribution}
          onChangeText={setContribution}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Frequency</Text>
        <View style={styles.freqRow}>
          {FREQUENCIES.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.freqChip,
                {
                  borderColor: frequency === f ? colors.primary : colors.border,
                  backgroundColor: frequency === f ? colors.primaryLight : colors.cardBackground,
                },
              ]}
              onPress={() => setFrequency(f)}
            >
              <Text
                style={[
                  styles.freqChipText,
                  { color: frequency === f ? colors.primary : colors.textSecondary },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={submit}
          activeOpacity={0.9}
        >
          <Text style={styles.submitBtnText}>Create goal</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  freqChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  freqChipText: { fontSize: 14, fontWeight: '600' },
  submitBtn: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
