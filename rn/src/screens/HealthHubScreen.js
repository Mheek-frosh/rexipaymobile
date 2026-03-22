import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const OPTIONS = [
  { id: '1', title: 'HMO & plans', desc: 'Compare health cover (coming soon)', icon: 'local-hospital' },
  { id: '2', title: 'Pharmacy & labs', desc: 'Pay partner pharmacies with RexiPay', icon: 'local-pharmacy' },
  { id: '3', title: 'Telehealth', desc: 'Book virtual consultations', icon: 'videocam' },
];

export default function HealthHubScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Health</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Health payments and benefits — expand your wellness in one place.
        </Text>

        {OPTIONS.map((o) => (
          <TouchableOpacity
            key={o.id}
            style={[styles.row, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            activeOpacity={0.85}
          >
            <View style={[styles.rowIcon, { backgroundColor: '#E8F5E9' }]}>
              <MaterialIcons name={o.icon} size={24} color="#2E7D32" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{o.title}</Text>
              <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{o.desc}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}

        <View style={[styles.note, { backgroundColor: colors.surfaceVariant }]}>
          <MaterialIcons name="health-and-safety" size={20} color={colors.primary} />
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>
            Medical bill payments and provider integrations will roll out in phases.
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
    paddingBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  rowIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  rowDesc: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  noteText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
