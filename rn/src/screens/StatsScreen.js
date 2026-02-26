import React, { useState, useEffect, useRef, useMemo } from 'react';
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

// Chart: spending per period. Today=1, 7D=7 days, 3M=3 months, 6M=6 months, Custom=6 months.
const CHART_DATA_BY_RANGE = {
  today: [{ label: 'Today', total: 150000 }],
  '7d': [
    { label: 'Mon', total: 45000 },
    { label: 'Tue', total: 62000 },
    { label: 'Wed', total: 38000 },
    { label: 'Thu', total: 71000 },
    { label: 'Fri', total: 89000 },
    { label: 'Sat', total: 54000 },
    { label: 'Sun', total: 31000 },
  ],
  '3m': [
    { label: 'Apr', total: 73000 },
    { label: 'May', total: 118000 },
    { label: 'Jun', total: 90500 },
  ],
  '6m': [
    { label: 'Jan', total: 82000 },
    { label: 'Feb', total: 64000 },
    { label: 'Mar', total: 95500 },
    { label: 'Apr', total: 73000 },
    { label: 'May', total: 118000 },
    { label: 'Jun', total: 90500 },
  ],
  custom: [
    { label: 'Jan', total: 82000 },
    { label: 'Feb', total: 64000 },
    { label: 'Mar', total: 95500 },
    { label: 'Apr', total: 73000 },
    { label: 'May', total: 118000 },
    { label: 'Jun', total: 90500 },
  ],
};

// Legend: categories with colors for infographics
const CATEGORY_LEGEND = [
  { label: 'Transfers', color: '#5B86FC', percent: 42 },
  { label: 'Airtimes', color: '#FFD166', percent: 26 },
  { label: 'ATM card debit', color: '#FF6B6B', percent: 20 },
  { label: 'Others', color: '#7B61FF', percent: 12 },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Chart spans most of width and ~half visible height (image proportions)
const CONTENT_PADDING = 40;
const CHART_BLOCK_PADDING = 32; // 16 each side
const CHART_WIDTH = SCREEN_WIDTH - CONTENT_PADDING - CHART_BLOCK_PADDING;

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

function formatNaira(value, withDecimals = false) {
  return '₦' + Number(value).toLocaleString('en-NG', {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  });
}

// Professional spending chart: clean bars, no tooltip, single theme color
function SpendingChart({ data, colors }) {
  const CHART_AREA_HEIGHT = 200;
  const LABEL_HEIGHT = 24;
  const maxValue = Math.max(...data.map((d) => d.total), 1);
  const maxBars = 7;
  const animValues = useRef(Array.from({ length: maxBars }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      80,
      animValues.slice(0, data.length).map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 480,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, []);

  const chartWidth = CHART_WIDTH;
  const barGroupWidth = chartWidth / data.length;
  const barWidth = Math.max(20, barGroupWidth - 10);

  return (
    <View style={[styles.chartOuter, { width: chartWidth }]}>
      <View style={[styles.chartGridWrap, { width: chartWidth, height: CHART_AREA_HEIGHT }]} pointerEvents="none">
        <Svg width={chartWidth} height={CHART_AREA_HEIGHT} style={StyleSheet.absoluteFill}>
          {[0, 1, 2, 3].map((i) => {
            const y = 8 + (i / 3) * (CHART_AREA_HEIGHT - 16);
            return (
              <Line
                key={i}
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="3 4"
                strokeOpacity={0.6}
              />
            );
          })}
        </Svg>
      </View>

      <View style={[styles.chartBarsRow, { height: CHART_AREA_HEIGHT + LABEL_HEIGHT }]}>
        {data.map((item, index) => {
          const barHeight = (item.total / maxValue) * (CHART_AREA_HEIGHT - 12);
          const height = animValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, barHeight],
          });
          return (
            <View key={`${item.label}-${index}`} style={[styles.chartBarCol, { width: barGroupWidth }]}>
              <View style={[styles.chartBarSlot, { height: CHART_AREA_HEIGHT }]}>
                <Animated.View
                  style={[
                    styles.chartBar,
                    {
                      width: barWidth,
                      height,
                      backgroundColor: colors.primary,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.chartBarLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.label}
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

  const chartData = useMemo(
    () => CHART_DATA_BY_RANGE[selectedTimeRange] || CHART_DATA_BY_RANGE['6m'],
    [selectedTimeRange],
  );

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

        {/* Time range pills */}
        <View style={styles.timeRangeRow}>
          {TIME_RANGE_OPTIONS.map((opt) => {
            const isSelected = selectedTimeRange === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.timeRangePill,
                  isSelected
                    ? { backgroundColor: colors.textPrimary }
                    : { backgroundColor: colors.surfaceVariant || colors.cardBackground },
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

        {/* Spending overview – professional chart section */}
        <View style={[styles.chartBlock, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.chartSectionTitle, { color: colors.textPrimary }]}>Spending overview</Text>
          <View style={styles.chartTimeRow}>
            <Text style={[styles.chartTimeLabel, { color: colors.textSecondary }]}>
              {selectedTimeRange === 'today' && 'Today'}
              {selectedTimeRange === '7d' && 'Last 7 days'}
              {selectedTimeRange === '3m' && 'Last 3 months'}
              {(selectedTimeRange === '6m' || selectedTimeRange === 'custom') && 'Last 6 months'}
            </Text>
            <Text style={[styles.chartTotalLabel, { color: colors.textPrimary }]}>
              Total spent: {formatNaira(chartData.reduce((sum, d) => sum + d.total, 0))}
            </Text>
          </View>
          <SpendingChart key={selectedTimeRange} data={chartData} colors={colors} />
          <View style={[styles.legendRow, { borderTopColor: colors.border }]}>
            {CATEGORY_LEGEND.map((item) => (
              <View key={item.label} style={styles.legendChip}>
                <View style={[styles.legendChipDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendChipText, { color: colors.textSecondary }]}>{item.label} {item.percent}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transactions */}
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
                onPress={() =>
                  navigation.navigate('TransactionDetail', {
                    transaction: {
                      ...tx,
                      date: tx.dateTime?.split(' | ')[0],
                      time: tx.dateTime?.split(' | ')[1],
                      ref: 'RXP' + tx.id,
                      status: tx.statusDisplay,
                      bank: '',
                      account: '',
                    },
                  })
                }
                activeOpacity={0.7}
              >
                <View style={[styles.txIconWrap, { backgroundColor: getIconBg(tx.type, colors) }]}>
                  <MaterialIcons name={getTransactionIcon(tx.type)} size={24} color={getIconColor(tx.type, colors)} />
                </View>
                <View style={styles.txContent}>
                  <Text style={[styles.txName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {tx.name}
                  </Text>
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
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPeriodModal(false)}>
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
                    {
                      color: selectedPeriod === opt ? colors.primary : colors.textPrimary,
                      fontWeight: selectedPeriod === opt ? '600' : '400',
                    },
                  ]}
                >
                  {opt}
                </Text>
                {selectedPeriod === opt && <MaterialIcons name="check" size={24} color={colors.primary} />}
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

  // Chart – professional spending overview
  chartBlock: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
  },
  chartSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  chartTimeRow: {
    marginBottom: 16,
  },
  chartTimeLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  chartTotalLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  chartOuter: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  chartGridWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  chartBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  chartBarCol: {
    alignItems: 'center',
  },
  chartBarSlot: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBar: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  chartBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },

  // Legend – compact horizontal chips
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendChipText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Transactions
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

  // Modal
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