import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const PENDING_ORANGE = '#F59E0B';
const PENDING_ORANGE_LIGHT = 'rgba(245, 158, 11, 0.15)';

const TIME_RANGE_OPTIONS = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7D' },
  { key: '3m', label: '3M' },
  { key: '6m', label: '6M' },
  { key: 'custom', label: 'Custom' },
];

const PERIOD_OPTIONS = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

// Monthly spending (for bar chart) – values in Naira
const BAR_DATA = [
  { month: 'Jan', total: 82000 },
  { month: 'Feb', total: 64000 },
  { month: 'Mar', total: 95500 },
  { month: 'Apr', total: 73000 },
  { month: 'May', total: 118000 },
  { month: 'Jun', total: 90500 },
];

const CHART_HEIGHT = 180;
const CHART_WIDTH = Dimensions.get('window').width - 88; // padding + margins
const GRID_LINES = 4;

// Category legend for what money was spent on
const CATEGORY_LEGEND = [
  { label: 'Transfers', color: '#5B86FC', percent: 42 },
  { label: 'Airtimes', color: '#FFD166', percent: 26 },
  { label: 'ATM card debit', color: '#FF6B6B', percent: 20 },
  { label: 'Others', color: '#7B61FF', percent: 12 },
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

function formatNaira(value) {
  return '₦' + Number(value).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function AnimatedBarChart({ data, colors }) {
  const MAX_BAR_HEIGHT = CHART_HEIGHT - 36;
  const maxValue = Math.max(...data.map((d) => d.total));
  const animValues = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      120,
      animValues.map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [animValues]);

  const maxIndex = data.reduce(
    (idx, item, i) => (item.total > data[idx].total ? i : idx),
    0,
  );

  const barWidth = 20;
  const chartWidth = CHART_WIDTH - 40;
  const barGroupWidth = chartWidth / data.length;

  return (
    <View style={styles.chartOuter}>
      {/* Dashed horizontal grid lines */}
      <View style={[styles.gridWrap, { height: CHART_HEIGHT - 28 }]} pointerEvents="none">
        <Svg width={chartWidth + 24} height={CHART_HEIGHT - 28} style={styles.gridSvg}>
          {Array.from({ length: GRID_LINES }).map((_, i) => {
            const y = 12 + (i / (GRID_LINES - 1)) * (CHART_HEIGHT - 28 - 24);
            return (
              <Line
                key={i}
                x1={0}
                y1={y}
                x2={chartWidth + 24}
                y2={y}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}
        </Svg>
      </View>

      <View style={[styles.barChartContainer, { height: CHART_HEIGHT }]}>
        {data.map((item, index) => {
          const barHeight = (item.total / maxValue) * MAX_BAR_HEIGHT;
          const height = animValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, barHeight],
          });
          const isMax = index === maxIndex;
          return (
            <View key={item.month} style={[styles.barWrapper, { width: barGroupWidth }]}>
              <View style={[styles.barColumn, { height: MAX_BAR_HEIGHT }]}>
                {isMax && (
                  <View style={styles.tooltipWrap}>
                    <View style={[styles.tooltip, { backgroundColor: colors.textPrimary }]}>
                      <Text style={styles.tooltipText}>{formatNaira(item.total)}</Text>
                    </View>
                    <View style={[styles.tooltipDot, { backgroundColor: colors.textPrimary }]} />
                  </View>
                )}
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      width: barWidth,
                      height,
                      backgroundColor: isMax ? colors.primary : colors.primaryLight,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barMonth, { color: colors.textSecondary }]}>
                {item.month}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Statistics</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <Text style={[styles.currentBalanceLabel, { color: colors.textSecondary }]}>Current Balance</Text>
        <Text style={[styles.currentBalanceAmount, { color: colors.textPrimary }]}>₦250,000</Text>

        {/* Time range pills: Today, 7D, 3M, 6M, Custom */}
        <View style={styles.timeRangeRow}>
          {TIME_RANGE_OPTIONS.map((opt) => {
            const isSelected = selectedTimeRange === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.timeRangePill,
                  isSelected && { backgroundColor: colors.textPrimary },
                  !isSelected && { backgroundColor: colors.surfaceVariant || colors.cardBackground },
                ]}
                onPress={() => setSelectedTimeRange(opt.key)}
              >
                <Text
                  style={[
                    styles.timeRangePillText,
                    { color: isSelected ? '#FFF' : colors.textPrimary },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spending by month - animated bar chart with grid & tooltip */}
        <View style={[styles.chartBlock, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.chartBlockTitle, { color: colors.textPrimary }]}>
            Spending by month
          </Text>
          <AnimatedBarChart data={BAR_DATA} colors={colors} />
          <View style={styles.legend}>
            {CATEGORY_LEGEND.map((item, i) => (
              <View
                key={item.label}
                style={[
                  styles.legendItem,
                  { borderBottomColor: colors.border },
                  i === CATEGORY_LEGEND.length - 1 && styles.legendItemLast,
                ]}
              >
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendLabel, { color: colors.textPrimary }]}>
                    {item.label}
                  </Text>
                </View>
                <View style={styles.legendRight}>
                  <Text style={[styles.legendPercent, { color: colors.textSecondary }]}>
                    {item.percent}%
                  </Text>
                </View>
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
  chartBlockTitle: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
  chartOuter: { width: '100%', marginBottom: 16, position: 'relative' },
  gridWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 0,
  },
  gridSvg: { position: 'absolute', left: 0, top: 0 },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  tooltipWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },
  tooltip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tooltipText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  bar: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  barMonth: { fontSize: 11, marginTop: 6 },
  currentBalanceLabel: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  currentBalanceAmount: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  timeRangeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  timeRangePill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  timeRangePillText: { fontSize: 13, fontWeight: '600' },
  legend: { width: '100%' },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  legendLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendLabel: { fontSize: 14, fontWeight: '600' },
  legendRight: { alignItems: 'flex-end' },
  legendPercent: { fontSize: 12 },
  legendAmount: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  legendItemLast: { borderBottomWidth: 0 },
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
