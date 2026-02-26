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

const PENDING_ORANGE = '#F59E0B';
const PENDING_ORANGE_LIGHT = 'rgba(245, 158, 11, 0.15)';

const PERIOD_OPTIONS = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

const LEGEND_ITEMS = [
  { label: 'Salary', color: '#5B86FC' },
  { label: 'Food & Drink', color: '#FF6B6B' },
  { label: 'E-Wallet', color: '#7B61FF' },
  { label: 'Internet', color: '#2EC4B6' },
  { label: 'Shopping', color: '#FFD166' },
];

const RECENT_TRANSACTIONS = [
  { id: '1', name: 'Divine Chiamaka', amount: '25,000', type: 'sent', dateTime: 'Today | 2:30 PM', statusDisplay: 'Success' },
  { id: '2', name: 'John Doe', amount: '50,000', type: 'received', dateTime: 'Yesterday | 10:15 AM', statusDisplay: 'Success' },
  { id: '3', name: 'Airtime Purchase', amount: '1,000', type: 'airtime', dateTime: '2 days ago | 4:45 PM', statusDisplay: 'Pending' },
];

function getTransactionIcon(type) {
  if (type === 'airtime') return 'phone-android';
  if (type === 'sent') return 'arrow-upward';
  return 'arrow-downward';
}

function getIconColor(type, colors) {
  if (type === 'sent') return colors.error;
  if (type === 'received') return colors.success;
  return colors.primary;
}

function getIconBg(type, colors) {
  if (type === 'sent') return colors.error + '20';
  if (type === 'received') return colors.success + '20';
  return colors.primaryLight;
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Statistics</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period filter - compact pill */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.periodPill,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            onPress={() => setShowPeriodModal(true)}
          >
            <Text style={[styles.periodPillText, { color: colors.textPrimary }]}>{selectedPeriod}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Summary cards - modern horizontal */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.summaryIconWrap, { backgroundColor: colors.success + '18' }]}>
              <MaterialIcons name="arrow-downward" size={22} color={colors.success} />
            </View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Income</Text>
            <Text style={[styles.summaryAmount, { color: colors.textPrimary }]}>₦267,040</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.summaryIconWrap, { backgroundColor: colors.error + '18' }]}>
              <MaterialIcons name="arrow-upward" size={22} color={colors.error} />
            </View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Expense</Text>
            <Text style={[styles.summaryAmount, { color: colors.textPrimary }]}>₦126,570</Text>
          </View>
        </View>

        {/* Donut + legend - clean block */}
        <View style={[styles.chartBlock, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.donutOuter, { borderColor: colors.border }]}>
            <View style={[styles.donutInner, { backgroundColor: colors.background }]}>
              <Text style={[styles.chartCenterValue, { color: colors.textPrimary }]}>40%</Text>
              <Text style={[styles.chartCenterLabel, { color: colors.textSecondary }]}>Salary</Text>
            </View>
          </View>
          <View style={styles.legend}>
            {LEGEND_ITEMS.map((item, i) => (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transactions section - moved down, matches Transaction screen */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.transactionsTitle, { color: colors.textPrimary }]}>Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {RECENT_TRANSACTIONS.map((tx) => {
            const isSuccess = tx.statusDisplay === 'Success';
            const amountColor = isSuccess ? colors.success : PENDING_ORANGE;
            const pillBg = isSuccess ? colors.success + '20' : PENDING_ORANGE_LIGHT;
            const pillColor = isSuccess ? colors.success : PENDING_ORANGE;
            return (
              <TouchableOpacity
                key={tx.id}
                style={[styles.txCard, { backgroundColor: colors.cardBackground }]}
                onPress={() => navigation.navigate('TransactionDetail', { transaction: { ...tx, type: tx.type, amount: tx.amount, date: tx.dateTime?.split(' | ')[0], time: tx.dateTime?.split(' | ')[1], ref: 'RXP' + tx.id, status: tx.statusDisplay, bank: '', account: '' } })}
                activeOpacity={0.7}
              >
                <View style={[styles.txIconWrap, { backgroundColor: getIconBg(tx.type, colors) }]}>
                  <MaterialIcons
                    name={getTransactionIcon(tx.type)}
                    size={24}
                    color={getIconColor(tx.type, colors)}
                  />
                </View>
                <View style={styles.txContent}>
                  <Text style={[styles.txName, { color: colors.textPrimary }]} numberOfLines={1}>{tx.name}</Text>
                  <Text style={[styles.txMeta, { color: colors.textSecondary }]}>{tx.dateTime}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, { color: amountColor }]}>
                    {tx.type === 'sent' ? '-' : '+'}₦{tx.amount}
                  </Text>
                  <View style={[styles.pill, { backgroundColor: pillBg }]}>
                    <Text style={[styles.pillText, { color: pillColor }]}>{tx.statusDisplay}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={showPeriodModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select period</Text>
            {PERIOD_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.modalOption,
                  { backgroundColor: selectedPeriod === opt ? colors.primaryLight : 'transparent' },
                ]}
                onPress={() => {
                  setSelectedPeriod(opt);
                  setShowPeriodModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    { color: selectedPeriod === opt ? colors.primary : colors.textPrimary, fontWeight: selectedPeriod === opt ? '600' : '400' },
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
    paddingBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  filterRow: { marginBottom: 20 },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  periodPillText: { fontSize: 14, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  summaryCard: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
  },
  summaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 13, fontWeight: '500' },
  summaryAmount: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  chartBlock: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  donutOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  donutInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterValue: { fontSize: 20, fontWeight: '700' },
  chartCenterLabel: { fontSize: 12, marginTop: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 12, fontWeight: '500' },
  transactionsSection: { marginTop: 8 },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  transactionsTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  txIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  txContent: { flex: 1 },
  txName: { fontSize: 16, fontWeight: '600' },
  txMeta: { fontSize: 13, marginTop: 4 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 16, fontWeight: '700' },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  pillText: { fontSize: 12, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  modalOptionText: { fontSize: 16 },
});
