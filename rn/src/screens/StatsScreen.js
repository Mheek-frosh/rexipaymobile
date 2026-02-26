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
import Svg, { Line, Polygon } from 'react-native-svg';
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Chart spans most of width and ~half visible height (image proportions)
const CONTENT_PADDING = 40;
const CHART_BLOCK_PADDING = 32; // 16 each side
const CHART_WIDTH = SCREEN_WIDTH - CONTENT_PADDING - CHART_BLOCK_PADDING;
const CHART_HEIGHT = Math.round(Math.min(380, Math.max(280, SCREEN_HEIGHT * 0.42)));
const GRID_LINES = 4;
const BAR_GAP = 14; // noticeable spacing between bars (image)

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

function AnimatedBarChart({ data, colors, legendColors }) {
  // Room for tooltip, arrow, dot, and labels (image proportions)
  const TOOLTIP_LABELS_HEIGHT = 58;
  const MONTH_LABEL_HEIGHT = 28;
  const MAX_BAR_HEIGHT = CHART_HEIGHT - TOOLTIP_LABELS_HEIGHT - MONTH_LABEL_HEIGHT;
  const maxValue = Math.max(...data.map((d) => d.total), 1);
  const maxBars = 7;
  const animValues = useRef(Array.from({ length: maxBars }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      100,
      animValues.slice(0, data.length).map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 550,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, []);

  const maxIndex = data.reduce(
    (idx, item, i) => (item.total > data[idx].total ? i : idx),
    0,
  );

  // Thick bars with noticeable spacing (image: "relatively thick with noticeable spacing")
  const chartWidth = CHART_WIDTH;
  const barGroupWidth = chartWidth / data.length;
  // So gap between bars = BAR_GAP: barWidth = barGroupWidth - BAR_GAP/2 (each side BAR_GAP/2)
  const barWidth = Math.max(28, barGroupWidth - BAR_GAP / 2);

  // Tooltip dimensions for layout (image)
  const TOOLTIP_HEIGHT = 36;
  const ARROW_HEIGHT = 8;
  const DOT_SIZE = 10;

  return (
    <View style={[styles.chartOuter, { width: chartWidth }]}>
      {/* Dashed horizontal grid lines across full chart */}
      <View
        style={[
          styles.gridWrap,
          {
            width: chartWidth,
            height: MAX_BAR_HEIGHT,
            top: TOOLTIP_HEIGHT + ARROW_HEIGHT + DOT_SIZE,
          },
        ]}
        pointerEvents="none"
      >
        <Svg width={chartWidth} height={MAX_BAR_HEIGHT} style={StyleSheet.absoluteFill}>
          {Array.from({ length: GRID_LINES }).map((_, i) => {
            const y = (i / (GRID_LINES - 1)) * (MAX_BAR_HEIGHT - 4);
            return (
              <Line
                key={i}
                x1={0}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="4 5"
                strokeOpacity={0.7}
              />
            );
          })}
        </Svg>
      </View>

      {/* Bar chart */}
      <View style={[styles.barChartContainer, { height: CHART_HEIGHT }]}>
        {data.map((item, index) => {
          const barHeight = (item.total / maxValue) * MAX_BAR_HEIGHT;
          const height = animValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, barHeight],
          });
          const isMax = index === maxIndex;
          // Each bar uses a legend color so the infographic is clear (cycles Transfers, Airtimes, ATM, Others)
          const barColor = (legendColors && legendColors[index % legendColors.length]) || (isMax ? colors.primary : colors.primaryLight);

          return (
            <View key={`${item.label}-${index}`} style={[styles.barWrapper, { width: barGroupWidth }]}>
              {/* Tooltip above the highest bar */}
              <View style={styles.barColumn}>
                {isMax ? (
                  <View style={styles.tooltipContainer}>
                    {/* Tooltip: dark bubble with pointer from bottom-right (image) */}
                    <View style={[styles.tooltipBubbleWrap, { marginRight: barGroupWidth / 2 - 22 }]}>
                      <View style={[styles.tooltipBubble, { backgroundColor: colors.textPrimary }]}>
                        <Text style={styles.tooltipText}>{formatNaira(item.total, true)}</Text>
                      </View>
                      {/* Triangular pointer from bottom-right edge, pointing to indicator */}
                      <View style={styles.tooltipPointerWrap}>
                        <Svg width={12} height={7} viewBox="0 0 12 7" style={styles.tooltipPointerSvg}>
                          <Polygon points="0,0 12,0 6,7" fill={colors.textPrimary} />
                        </Svg>
                      </View>
                    </View>
                    {/* Circular indicator on bar – solid, no white ring */}
                    <View
                      style={[
                        styles.tooltipDot,
                        {
                          width: DOT_SIZE,
                          height: DOT_SIZE,
                          borderRadius: DOT_SIZE / 2,
                          backgroundColor: colors.textPrimary,
                        },
                      ]}
                    />
                  </View>
                ) : (
                  // Spacer so all bars align to the same bottom
                  <View style={styles.tooltipSpacer} />
                )}

                {/* The actual bar – no figure inside */}
                <View style={[styles.barBase, { height: MAX_BAR_HEIGHT, justifyContent: 'flex-end' }]}>
                  <Animated.View
                    style={[
                      {
                        width: barWidth,
                        height,
                        backgroundColor: barColor,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* X-axis label */}
              <Text style={[styles.barMonth, { color: colors.textSecondary }]}>{item.label}</Text>
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

        {/* Bar chart block – data changes by Today / 7D / 3M / 6M / Custom */}
        <View style={[styles.chartBlock, { backgroundColor: colors.cardBackground }]}>
          <AnimatedBarChart
            key={selectedTimeRange}
            data={chartData}
            colors={colors}
            legendColors={CATEGORY_LEGEND.map((c) => c.color)}
          />
          <View style={[styles.legend, { borderTopColor: colors.border }]}>
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
                  <Text style={[styles.legendLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                </View>
                <Text style={[styles.legendPercent, { color: colors.textSecondary }]}>{item.percent}%</Text>
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

  // Chart – full width, enough vertical space (image proportions)
  chartBlock: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  chartOuter: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  gridWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  barWrapper: {
    alignItems: 'center',
  },
  barColumn: {
    alignItems: 'center',
  },

  // Tooltip – bubble with pointer from bottom-right (image)
  tooltipContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  tooltipBubbleWrap: {
    position: 'relative',
    alignSelf: 'flex-end',
  },
  tooltipBubble: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    paddingRight: 18,
    borderRadius: 10,
  },
  tooltipText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  tooltipPointerWrap: {
    position: 'absolute',
    right: 10,
    bottom: -6,
  },
  tooltipPointerSvg: {},
  tooltipDot: {
    marginTop: 4,
  },
  // Spacer to align non-max bars (bubble + pointer + dot + gap)
  tooltipSpacer: {
    height: 36 + 7 + 10 + 6,
  },
  barBase: {
    alignItems: 'center',
  },
  barMonth: {
    fontSize: 13,
    marginTop: 10,
    fontWeight: '500',
  },

  // Legend under chart – infographics (Transfers, Airtimes, ATM, Others)
  legend: {
    width: '100%',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  legendLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendLabel: { fontSize: 14, fontWeight: '600' },
  legendPercent: { fontSize: 13 },
  legendItemLast: { borderBottomWidth: 0 },

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