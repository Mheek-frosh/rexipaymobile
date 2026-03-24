import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import {
  addToSavingsGoal,
  deleteSavingsGoal,
  formatNaira,
  getSavingsGoalById,
  updateSavingsGoal,
} from '../services/savingsService';
import AppLoader from '../components/AppLoader';

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly'];

export default function SavingsGoalDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const goalId = route.params?.goalId;
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [editContribution, setEditContribution] = useState('');
  const [editFrequency, setEditFrequency] = useState('Monthly');

  const loadGoal = useCallback(async () => {
    setLoading(true);
    const g = await getSavingsGoalById(goalId);
    setGoal(g);
    if (g) {
      setEditName(g.name);
      setEditTarget(String(g.targetAmount || ''));
      setEditContribution(String(g.contributionAmount || ''));
      setEditFrequency(g.frequency || 'Monthly');
    }
    setLoading(false);
  }, [goalId]);

  useFocusEffect(
    useCallback(() => {
      loadGoal();
    }, [loadGoal])
  );

  const onAddFunds = async () => {
    const amount = Number(String(fundAmount).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Amount', 'Enter a valid amount to add.');
      return;
    }
    if (!goal) return;
    setSaving(true);
    const updated = await addToSavingsGoal(goal.id, amount);
    setSaving(false);
    if (!updated) {
      Alert.alert('Error', 'Could not update this goal. Please try again.');
      return;
    }
    setGoal(updated);
    setFundAmount('');
  };

  const onSaveEdit = async () => {
    if (!goal) return;
    const name = editName.trim();
    if (!name) {
      Alert.alert('Goal name', 'Please enter a goal name.');
      return;
    }
    const updated = await updateSavingsGoal(goal.id, {
      name,
      targetAmount: Number(editTarget) || goal.targetAmount,
      contributionAmount: Number(editContribution) || goal.contributionAmount,
      frequency: editFrequency,
    });
    if (!updated) {
      Alert.alert('Error', 'Could not update this goal.');
      return;
    }
    setGoal(updated);
    setEditing(false);
  };

  const onDeleteGoal = () => {
    if (!goal) return;
    Alert.alert('Delete goal', 'This goal and its history will be removed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSavingsGoal(goal.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const toggleAutoSave = async (value) => {
    if (!goal) return;
    const updated = await updateSavingsGoal(goal.id, { autoSaveEnabled: value });
    if (updated) setGoal(updated);
  };

  if (loading) {
    return <AppLoader mode="fullscreen" label="Loading savings goal..." />;
  }

  if (!goal) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Goal not found.</Text>
      </View>
    );
  }

  const amountLeft = Math.max(0, (goal.targetAmount || 0) - (goal.savedAmount || 0));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {goal.name}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroLabel}>Saved so far</Text>
          <Text style={styles.heroAmount}>{formatNaira(goal.savedAmount)}</Text>
          <Text style={styles.heroSub}>
            Target {formatNaira(goal.targetAmount)} · {goal.frequency}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            onPress={() => setEditing((v) => !v)}
          >
            <MaterialIcons name="edit" size={16} color={colors.primary} />
            <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>{editing ? 'Cancel edit' : 'Edit goal'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            onPress={onDeleteGoal}
          >
            <MaterialIcons name="delete-outline" size={16} color={colors.error} />
            <Text style={[styles.secondaryBtnText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>

        {editing ? (
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Goal name</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
              value={editName}
              onChangeText={setEditName}
            />
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Target amount (₦)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
              keyboardType="decimal-pad"
              value={editTarget}
              onChangeText={setEditTarget}
            />
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Autosave amount (₦)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
              keyboardType="decimal-pad"
              value={editContribution}
              onChangeText={setEditContribution}
            />
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Frequency</Text>
            <View style={styles.freqRow}>
              {FREQUENCIES.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.freqChip,
                    {
                      borderColor: editFrequency === f ? colors.primary : colors.border,
                      backgroundColor: editFrequency === f ? colors.primaryLight : colors.background,
                    },
                  ]}
                  onPress={() => setEditFrequency(f)}
                >
                  <Text style={[styles.freqChipText, { color: editFrequency === f ? colors.primary : colors.textSecondary }]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary }]} onPress={onSaveEdit}>
              <Text style={styles.ctaText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Progress</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{goal.percent}%</Text>
          </View>
          <View style={[styles.track, { backgroundColor: colors.surfaceVariant }]}>
            <View style={[styles.fill, { width: `${goal.percent}%`, backgroundColor: colors.primary }]} />
          </View>

          <View style={[styles.rowBetween, { marginTop: 14 }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Amount left</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{formatNaira(amountLeft)}</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 14 }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Autosave</Text>
            <Switch value={!!goal.autoSaveEnabled} onValueChange={toggleAutoSave} />
          </View>
          <Text style={[styles.nextAuto, { color: colors.textSecondary }]}>
            Next autosave: {goal.nextAutoSaveAt ? new Date(goal.nextAutoSaveAt).toLocaleString() : 'Not scheduled'}
          </Text>
        </View>

        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Add funds to this goal (₦)</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.cardBackground }]}
          placeholder="10000"
          placeholderTextColor={colors.textSecondary}
          keyboardType="decimal-pad"
          value={fundAmount}
          onChangeText={setFundAmount}
        />

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
          onPress={onAddFunds}
          disabled={saving}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>{saving ? 'Updating...' : 'Add to savings'}</Text>
        </TouchableOpacity>

        <Text style={[styles.historyTitle, { color: colors.textPrimary }]}>Contribution history</Text>
        {(goal.history || []).length ? (
          goal.history.map((h) => (
            <View key={h.id} style={[styles.historyRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View>
                <Text style={[styles.historyType, { color: colors.textPrimary }]}>
                  {h.type === 'auto' ? 'Auto contribution' : 'Manual top up'}
                </Text>
                <Text style={[styles.historyMeta, { color: colors.textSecondary }]}>
                  {new Date(h.createdAt).toLocaleString()}
                </Text>
              </View>
              <Text style={[styles.historyAmount, { color: colors.primary }]}>+ {formatNaira(h.amount)}</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.historyEmpty, { color: colors.textSecondary }]}>No contributions yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  hero: { borderRadius: 20, padding: 22, marginBottom: 18 },
  heroLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500' },
  heroAmount: { color: '#FFF', fontSize: 30, fontWeight: '800', marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 8 },
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  secondaryBtnText: { fontSize: 13, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 20 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 13, fontWeight: '600' },
  value: { fontSize: 15, fontWeight: '700' },
  track: { height: 10, borderRadius: 6, overflow: 'hidden', marginTop: 10 },
  fill: { height: '100%' },
  nextAuto: { marginTop: 8, fontSize: 12, lineHeight: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  cta: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  ctaText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  freqChip: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  freqChipText: { fontSize: 12, fontWeight: '600' },
  historyTitle: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  historyRow: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyType: { fontSize: 14, fontWeight: '600' },
  historyMeta: { fontSize: 12, marginTop: 2 },
  historyAmount: { fontSize: 14, fontWeight: '700' },
  historyEmpty: { fontSize: 13 },
});
