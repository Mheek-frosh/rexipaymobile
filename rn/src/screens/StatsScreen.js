import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const PERIOD_OPTIONS = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

const LEGEND_ITEMS = [
  { label: 'Salary', color: '#5B86FC' },
  { label: 'Food & Drink', color: '#FF6B6B' },
  { label: 'E-Wallet', color: '#7B61FF' },
  { label: 'Internet', color: '#2EC4B6' },
  { label: 'Shopping', color: '#FFD166' },
];

export default function StatsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Statistics Graph</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Period Dropdown - under title, filter-like */}
        <View style={styles.dropdownSection}>
          <Text style={[styles.dropdownLabel, { color: colors.textSecondary }]}>Filter by</Text>
          <TouchableOpacity
            style={[
              styles.dropdown,
              { backgroundColor: colors.cardBackground, borderColor: colors.primary },
            ]}
            onPress={() => setShowPeriodModal(true)}
          >
            <MaterialIcons name="filter-list" size={18} color={colors.primary} />
            <Text style={[styles.dropdownText, { color: colors.primary }]}>{selectedPeriod}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Pie Chart Placeholder */}
        <View style={styles.chartContainer}>
          <View style={[styles.donutOuter, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.donutInner, { backgroundColor: colors.background }]}>
              <Text style={[styles.chartCenterText, { color: colors.textSecondary }]}>40%</Text>
              <Text style={[styles.chartCenterLabel, { color: colors.textSecondary }]}>Salary</Text>
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {LEGEND_ITEMS.map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Income / Expense Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.summaryIcon, { backgroundColor: '#E8F0FE' }]}>
              <MaterialIcons name="arrow-downward" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={[styles.summaryAmount, { color: colors.textPrimary }]}>$2670.40</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Income</Text>
            </View>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.summaryIcon, { backgroundColor: '#FFEBEE' }]}>
              <MaterialIcons name="arrow-upward" size={20} color={colors.error} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={[styles.summaryAmount, { color: colors.textPrimary }]}>$1265.70</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Expense</Text>
            </View>
          </View>
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsHeader}>
          <Text style={[styles.transactionsTitle, { color: colors.textPrimary }]}>Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.transactionItem, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.txAvatar, { backgroundColor: colors.surfaceVariant }]}>
            <MaterialIcons name="person" size={24} color={colors.textSecondary} />
          </View>
          <View style={styles.txInfo}>
            <Text style={[styles.txName, { color: colors.textPrimary }]}>Isaac Folarin</Text>
            <Text style={[styles.txDate, { color: colors.textSecondary }]}>
              March 24, 2025 | 11:36 AM
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </View>
      </ScrollView>

      {/* Period Filter Modal */}
      <Modal visible={showPeriodModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.background }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Period</Text>
            {PERIOD_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.modalOption,
                  {
                    backgroundColor: selectedPeriod === opt ? colors.primaryLight : 'transparent',
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => {
                  setSelectedPeriod(opt);
                  setShowPeriodModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color: selectedPeriod === opt ? colors.primary : colors.textPrimary,
                      fontWeight: selectedPeriod === opt ? '600' : '400',
                    },
                  ]}
                >
                  {opt}
                </Text>
                {selectedPeriod === opt && (
                  <MaterialIcons name="check" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  content: { padding: 20, paddingBottom: 40 },
  dropdownSection: { marginBottom: 20 },
  dropdownLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dropdownText: { flex: 1, fontSize: 14, fontWeight: '600' },
  chartContainer: { alignItems: 'center', marginVertical: 20 },
  donutOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterText: { fontSize: 18, fontWeight: '700' },
  chartCenterLabel: { fontSize: 12, marginTop: 4 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendLabel: { fontSize: 12, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', gap: 15 },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: { flex: 1 },
  summaryAmount: { fontSize: 16, fontWeight: '800' },
  summaryLabel: { fontSize: 12, marginTop: 2 },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionsTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 15,
  },
  txAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: { flex: 1 },
  txName: { fontSize: 16, fontWeight: '600' },
  txDate: { fontSize: 12, marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: { fontSize: 16 },
});
