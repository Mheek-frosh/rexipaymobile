import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { formatNairaBalance, useWallet } from '../../context/WalletContext';

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
  {
    label: 'Transfers',
    color: '#173BDA',
    endColor: '#102ABF',
    percent: 42,
    labelRadius: 91,
  },
  { label: 'Airtimes', color: '#FFB321', endColor: '#FFC94D', percent: 26 },
  {
    label: 'ATM card',
    color: '#FF4148',
    endColor: '#FF696D',
    percent: 20,
    labelRadius: 91,
    labelOffsetX: -15,
  },
  { label: 'Others', color: '#8554DA', endColor: '#A66DF0', percent: 12 },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DONUT_DISPLAY_SIZE = Math.min(SCREEN_WIDTH - 80, 320);

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

const polarPoint = (center, radius, angle) => {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
};

const createDonutSlice = (startAngle, endAngle) => {
  const center = 150;
  const outerRadius = 124;
  const innerRadius = 72;
  const gap = 1.4;
  const start = startAngle + gap / 2;
  const end = endAngle - gap / 2;
  const outerStart = polarPoint(center, outerRadius, start);
  const outerEnd = polarPoint(center, outerRadius, end);
  const innerEnd = polarPoint(center, innerRadius, end);
  const innerStart = polarPoint(center, innerRadius, start);
  const largeArc = end - start > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
};

function InteractiveDonutChart({ total, colors }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  let runningAngle = 0;
  const slices = CATEGORY_LEGEND.map((item) => {
    const startAngle = runningAngle;
    const endAngle = runningAngle + item.percent * 3.6;
    runningAngle = endAngle;
    const middleAngle = (startAngle + endAngle) / 2;
    const labelPoint = polarPoint(150, item.labelRadius || 99, middleAngle);
    labelPoint.x += item.labelOffsetX || 0;

    return {
      ...item,
      startAngle,
      endAngle,
      labelPoint,
    };
  });
  const selectedCategory = selectedIndex === null ? null : slices[selectedIndex];
  const centerAmount = selectedCategory
    ? Math.round((total * selectedCategory.percent) / 100)
    : total;

  const selectCategory = (index) => {
    setSelectedIndex((current) => (current === index ? null : index));
  };

  return (
    <>
      <View
        style={[
          styles.donutWrap,
          { width: DONUT_DISPLAY_SIZE, height: DONUT_DISPLAY_SIZE },
        ]}
      >
        <Svg
          width={DONUT_DISPLAY_SIZE}
          height={DONUT_DISPLAY_SIZE}
          viewBox="0 0 300 300"
        >
          <Defs>
            {slices.map((item, index) => (
              <LinearGradient
                id={`donut-gradient-${index}`}
                key={item.label}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <Stop offset="0" stopColor={item.color} />
                <Stop offset="1" stopColor={item.endColor} />
              </LinearGradient>
            ))}
          </Defs>

          {slices.map((item, index) => {
            const selected = selectedIndex === index;
            const faded = selectedIndex !== null && !selected;

            return (
              <G key={`slice-${item.label}`} opacity={faded ? 0.48 : 1}>
                <Path
                  accessibilityLabel={`${item.label}, ${item.percent} percent`}
                  accessible
                  d={createDonutSlice(item.startAngle, item.endAngle)}
                  fill={`url(#donut-gradient-${index})`}
                  onPress={() => selectCategory(index)}
                  stroke={colors.cardBackground}
                  strokeLinejoin="round"
                  strokeWidth={3}
                />
              </G>
            );
          })}

          {slices.map((item, index) => {
            const selected = selectedIndex === index;
            const faded = selectedIndex !== null && !selected;

            return (
              <G key={`label-${item.label}`} opacity={faded ? 0.6 : 1}>
                <SvgText
                  x={item.labelPoint.x}
                  y={item.labelPoint.y}
                  dy="5"
                  fill="#FFFFFF"
                  fontSize="16"
                  fontWeight="800"
                  textAnchor="middle"
                  onPress={() => selectCategory(index)}
                >
                  {item.percent}%
                </SvgText>
              </G>
            );
          })}
        </Svg>

        <View pointerEvents="none" style={styles.donutCenter}>
          <Text
            style={[styles.donutCenterLabel, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {selectedCategory ? selectedCategory.label : 'Total spent'}
          </Text>
          <Text
            style={[styles.donutCenterAmount, { color: colors.textPrimary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatNaira(centerAmount)}
          </Text>
          {selectedCategory ? (
            <Text style={[styles.donutCenterPercent, { color: selectedCategory.color }]}>
              {selectedCategory.percent}% of spending
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.legendGrid}>
        {slices.map((item, index) => {
          const selected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${item.label}, ${item.percent} percent`}
              onPress={() => selectCategory(index)}
              style={[
                styles.legendCard,
                {
                  backgroundColor: selected ? `${item.color}12` : colors.cardBackground,
                  borderColor: selected ? item.color : colors.border,
                },
              ]}
            >
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text
                style={[styles.legendLabel, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <Text style={[styles.legendPercent, { color: colors.textPrimary }]}>
                {item.percent}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const { ngnBalance } = useWallet();
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
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Statistics</Text>
        <View style={{ width: 24 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <Text style={[styles.currentBalanceLabel, { color: colors.textSecondary }]}>Current Balance</Text>
        <Text style={[styles.currentBalanceAmount, { color: colors.textPrimary }]}>
          {formatNairaBalance(ngnBalance)}
        </Text>

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
          <Text style={[styles.chartTimeLabel, { color: colors.textSecondary }]}>
            {selectedTimeRange === 'today' && 'Today'}
            {selectedTimeRange === '7d' && 'Last 7 days'}
            {selectedTimeRange === '3m' && 'Last 3 months'}
            {(selectedTimeRange === '6m' || selectedTimeRange === 'custom') && 'Last 6 months'}
          </Text>
          <InteractiveDonutChart
            key={selectedTimeRange}
            colors={colors}
            total={chartData.reduce((sum, item) => sum + item.total, 0)}
          />
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
                      ref: tx.id === '2' ? 'RXP982341823' : 'RXP' + tx.id,
                      status: tx.statusDisplay || 'Completed',
                      bank: tx.bank || (tx.id === '2' ? 'Access Bank' : 'GTBank'),
                      account: tx.account || (tx.id === '2' ? '0987654321' : '0123456789'),
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
    paddingTop: 12,
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
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 18,
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 2,
  },
  chartSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
  },
  chartTimeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  donutWrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutCenter: {
    position: 'absolute',
    width: '44%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterLabel: {
    maxWidth: '100%',
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
  donutCenterAmount: {
    width: '100%',
    fontSize: 22,
    lineHeight: 29,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 3,
    textAlign: 'center',
  },
  donutCenterPercent: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginTop: 10,
  },
  legendCard: {
    width: '48.5%',
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 9,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  legendPercent: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 5,
  },
  // Legend – compact horizontal chips
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
