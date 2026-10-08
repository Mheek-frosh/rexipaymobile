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
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { formatNairaBalance, useWallet } from '../../context/WalletContext';

const PENDING_ORANGE = '#F59E0B';

const TIME_RANGE_OPTIONS = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

const PERIOD_OPTIONS = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

// Chart: spending per period. Today=1, 7D=7 days, 3M=3 months, 6M=6 months, Custom=6 months.
const CHART_DATA_BY_RANGE = {
  day: [{ label: 'Today', total: 150000 }],
  week: [
    { label: 'Mon', total: 45000 },
    { label: 'Tue', total: 62000 },
    { label: 'Wed', total: 38000 },
    { label: 'Thu', total: 71000 },
    { label: 'Fri', total: 89000 },
    { label: 'Sat', total: 54000 },
    { label: 'Sun', total: 31000 },
  ],
  month: [
    { label: 'Apr', total: 73000 },
    { label: 'May', total: 118000 },
    { label: 'Jun', total: 90500 },
  ],
  year: [
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

const RING_START = 198;
const CATEGORY_LEGEND = [
  { label: 'Airtimes', color: '#3DDC6E', degrees: 50 },
  { label: 'Others', color: '#7A3FF2', degrees: 78 },
  { label: 'ATM card', color: '#FF4D4D', degrees: 68 },
  { label: 'Bills', color: '#3B82F6', degrees: 38 },
  { label: 'Transfers', color: '#F5B400', degrees: 126 },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DONUT_DISPLAY_SIZE = Math.min(SCREEN_WIDTH - 28, 360);

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

const createRingArc = (startAngle, endAngle) => {
  const center = 150;
  const radius = 104;
  const gap = 30;
  const start = startAngle + gap / 2;
  const end = endAngle - gap / 2;
  const arcStart = polarPoint(center, radius, start);
  const arcEnd = polarPoint(center, radius, end);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`;
};

function InteractiveDonutChart({ total, colors }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  let runningAngle = RING_START;
  const slices = CATEGORY_LEGEND.map((item) => {
    const startAngle = runningAngle;
    const endAngle = runningAngle + item.degrees;
    runningAngle = endAngle;
    return {
      ...item,
      percent: Math.round((item.degrees / 360) * 100),
      startAngle,
      endAngle,
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
              <G key={`slice-${item.label}`} opacity={faded ? 0.35 : 1}>
                <Path
                  accessibilityLabel={`${item.label}, ${item.percent} percent`}
                  accessible
                  d={createRingArc(item.startAngle, item.endAngle)}
                  fill="none"
                  onPress={() => selectCategory(index)}
                  stroke={item.color}
                  strokeLinecap="round"
                  strokeWidth={selected ? 34 : 30}
                />
              </G>
            );
          })}
        </Svg>

        <View pointerEvents="none" style={styles.donutCenter}>
          <Text
            style={[styles.donutCenterLabel, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {selectedCategory ? selectedCategory.label : 'Spent this month'}
          </Text>
          <Text
            style={[styles.donutCenterAmount, { color: colors.textPrimary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatNaira(centerAmount, true)}
          </Text>
          {selectedCategory ? (
            <Text style={[styles.donutCenterPercent, { color: selectedCategory.color }]}>
              {selectedCategory.percent}% of spending
            </Text>
          ) : null}
        </View>
      </View>
    </>
  );
}

export default function StatsScreen() {
  const { colors, isDark } = useTheme();
  const { ngnBalance } = useWallet();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  const chartData = useMemo(
    () => CHART_DATA_BY_RANGE[selectedTimeRange] || CHART_DATA_BY_RANGE.month,
    [selectedTimeRange],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        <View style={styles.balanceCopy}>
          <Text style={[styles.currentBalanceLabel, { color: colors.textSecondary }]}>Current balance</Text>
          <Text style={[styles.currentBalanceAmount, { color: colors.textPrimary }]}>
            {formatNairaBalance(ngnBalance)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.dateChip, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => setShowPeriodModal(true)}
          accessibilityLabel={`Period, ${selectedPeriod}`}
        >
          <MaterialIcons name="calendar-today" size={16} color={colors.textPrimary} />
          <Text style={[styles.dateChipText, { color: colors.textPrimary }]}>{selectedPeriod}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <InteractiveDonutChart
          key={selectedTimeRange}
          colors={colors}
          total={chartData.reduce((sum, item) => sum + item.total, 0)}
        />

        <View style={[styles.timeRangeRow, { backgroundColor: isDark ? '#2A2A2C' : '#ECEDEF' }]}>
          {TIME_RANGE_OPTIONS.map((opt) => {
            const isSelected = selectedTimeRange === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.timeRangePill,
                  isSelected && { backgroundColor: isDark ? '#3A3A3C' : '#FFFFFF' },
                ]}
                onPress={() => setSelectedTimeRange(opt.key)}
              >
                <Text
                  style={[
                    styles.timeRangePillText,
                    { color: isSelected ? colors.textPrimary : colors.textSecondary },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.txSheet, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <View style={styles.transactionsHeader}>
            <Text style={[styles.transactionsTitle, { color: colors.textPrimary }]}>Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={[styles.seeAll, { color: colors.accentText }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
            {selectedTimeRange === 'day' && 'TODAY'}
            {selectedTimeRange === 'week' && 'THIS WEEK'}
            {selectedTimeRange === 'month' && 'THIS MONTH'}
            {selectedTimeRange === 'year' && 'THIS YEAR'}
          </Text>
          {RECENT_TRANSACTIONS.map((tx, index) => {
            const incoming = tx.type === 'received';
            const pending = tx.statusDisplay === 'Pending';
            const amountColor = incoming ? '#3DDC84' : pending ? PENDING_ORANGE : colors.textPrimary;
            return (
              <TouchableOpacity
                key={tx.id}
                style={[
                  styles.txRow,
                  index < RECENT_TRANSACTIONS.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
                ]}
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
                  <MaterialIcons name={getTransactionIcon(tx.type)} size={20} color={getIconColor(tx.type, colors)} />
                </View>
                <View style={styles.txContent}>
                  <Text style={[styles.txName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {tx.name}
                  </Text>
                  <Text style={[styles.txMeta, { color: colors.textSecondary }]} numberOfLines={1}>
                    {tx.statusDisplay} · {tx.dateTime?.split(' | ')[0]}
                  </Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, { color: amountColor }]}>
                    {incoming ? '+' : '−'}₦{tx.amount}
                  </Text>
                  <Text style={[styles.txTime, { color: colors.textSecondary }]}>
                    {tx.dateTime?.split(' | ')[1]}
                  </Text>
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
    paddingTop: 8,
    paddingBottom: 4,
  },
  balanceCopy: { flex: 1, paddingRight: 12 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  currentBalanceLabel: { fontSize: 12, fontWeight: '500' },
  currentBalanceAmount: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateChipText: { fontSize: 13, fontWeight: '600' },
  timeRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 14,
    padding: 4,
    marginTop: 6,
    marginBottom: 22,
    width: '100%',
    maxWidth: 340,
  },
  timeRangePill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 9,
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
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  donutCenterAmount: {
    width: '100%',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 4,
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
  txSheet: {
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionsTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  txAmount: { fontSize: 15, fontWeight: '700' },
  txTime: { fontSize: 12, marginTop: 3 },

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
