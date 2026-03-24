import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { getSavingsSummary } from '../services/savingsService';

export default function SavingsHomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [goals, setGoals] = useState([]);
  const [totalSaved, setTotalSaved] = useState('₦0');

  const load = async () => {
    const data = await getSavingsSummary();
    setGoals(Array.isArray(data?.goals) ? data.goals : []);
    setTotalSaved(data?.totalSaved || '₦0');
  };

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Savings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroLabel}>Total saved</Text>
          <Text style={styles.heroAmount}>{totalSaved}</Text>
          <View style={styles.heroPills}>
            <View style={styles.pill}>
              <MaterialIcons name="percent" size={14} color="#FFF" />
              <Text style={styles.pillText}>Up to 12% p.a.</Text>
            </View>
            <View style={styles.pill}>
              <MaterialIcons name="shield" size={14} color="#FFF" />
              <Text style={styles.pillText}>Secure & flexible</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Your goals</Text>
        {goals.map((g) => (
          <TouchableOpacity
            key={g.id}
            onPress={() => navigation.navigate('SavingsGoalDetail', { goalId: g.id })}
            activeOpacity={0.85}
            style={[styles.goalCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          >
            <View style={styles.goalTop}>
              <Text style={[styles.goalName, { color: colors.textPrimary }]}>{g.name}</Text>
              <Text style={[styles.goalMeta, { color: colors.textSecondary }]}>
                {g.saved} of {g.target}
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.surfaceVariant }]}>
              <View style={[styles.progressFill, { width: `${g.percent}%`, backgroundColor: colors.primary }]} />
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('SavingsSetup')}
          activeOpacity={0.9}
        >
          <MaterialIcons name="add-circle-outline" size={22} color="#FFF" />
          <Text style={styles.primaryBtnText}>Create new savings goal</Text>
        </TouchableOpacity>

        <View style={[styles.tipCard, { backgroundColor: colors.surfaceVariant }]}>
          <MaterialIcons name="lightbulb-outline" size={22} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            Tip: Set automatic deductions on payday so you save before you spend.
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  hero: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
  },
  heroLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500' },
  heroAmount: { color: '#FFF', fontSize: 32, fontWeight: '800', marginTop: 6 },
  heroPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  goalCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  goalTop: { marginBottom: 10 },
  goalName: { fontSize: 16, fontWeight: '700' },
  goalMeta: { fontSize: 13, marginTop: 4 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
