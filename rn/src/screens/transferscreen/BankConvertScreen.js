import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { formatNairaBalance, useWallet } from '../../context/WalletContext';
import TransactionProcessingModal from '../../components/TransactionProcessingModal';

const CURRENCIES = [
  { id: 'ngn', name: 'Nigerian Naira', code: 'NGN', symbol: '\u20A6', flag: '\uD83C\uDDF3\uD83C\uDDEC', rate: 1 },
  { id: 'usd', name: 'US Dollar', code: 'USD', symbol: '$', flag: '\uD83C\uDDFA\uD83C\uDDF8', rate: 0.00067 },
  { id: 'gbp', name: 'British Pound', code: 'GBP', symbol: '\u00A3', flag: '\uD83C\uDDEC\uD83C\uDDE7', rate: 0.00053 },
];

const MAX_DECIMALS = 2;

function sanitizeAmount(value) {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const [whole = '', ...decimalParts] = cleaned.split('.');
  const normalizedWhole = whole.replace(/^0+(?=\d)/, '') || (cleaned.startsWith('.') ? '0' : '');

  if (decimalParts.length === 0) return normalizedWhole;
  return `${normalizedWhole}.${decimalParts.join('').slice(0, MAX_DECIMALS)}`;
}

function formatMoney(value, currency) {
  return `${currency.symbol}${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatRate(value) {
  if (value >= 1) return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

export default function BankConvertScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { creditNgn, debitNgn, isWalletReady, ngnBalance } = useWallet();
  const [fromCurrency, setFromCurrency] = useState('ngn');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState('');
  const [activePicker, setActivePicker] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fromCur = CURRENCIES.find((currency) => currency.id === fromCurrency);
  const toCur = CURRENCIES.find((currency) => currency.id === toCurrency);
  const numericAmount = Number(amount) || 0;
  const convertedAmount = (numericAmount * toCur.rate) / fromCur.rate;
  const conversionRate = toCur.rate / fromCur.rate;
  const isInsufficient = fromCurrency === 'ngn' && numericAmount > ngnBalance;
  const canConvert = isWalletReady && numericAmount > 0 && !isInsufficient && !processing;

  const helperText = useMemo(() => {
    if (fromCurrency === 'ngn') return `Balance: ${formatNairaBalance(ngnBalance)}`;
    return `Converting from your ${fromCur.code} balance`;
  }, [fromCurrency, fromCur.code, ngnBalance]);

  const selectCurrency = (currency) => {
    if (activePicker === 'from') {
      if (currency.id === toCurrency) setToCurrency(fromCurrency);
      setFromCurrency(currency.id);
    } else {
      if (currency.id === fromCurrency) setFromCurrency(toCurrency);
      setToCurrency(currency.id);
    }
    setActivePicker(null);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount('');
  };

  const handleMax = () => {
    if (fromCurrency === 'ngn') setAmount(ngnBalance.toFixed(2));
  };

  const handleConvert = async () => {
    if (!canConvert) return;

    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const result =
        fromCurrency === 'ngn'
          ? await debitNgn(numericAmount)
          : toCurrency === 'ngn'
            ? await creditNgn(convertedAmount)
            : { success: true };

      if (!result.success) {
        Alert.alert('Conversion failed', result.error || 'Please try again.');
        return;
      }

      navigation.navigate('PaymentSuccess', {
        amount: convertedAmount.toFixed(2),
        recipient: `Converted ${fromCur.code} to ${toCur.code}`,
        type: 'transfer',
      });
    } catch (error) {
      Alert.alert('Conversion failed', 'We could not complete your conversion. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          accessibilityRole="button"
          activeOpacity={0.75}
          style={[styles.headerButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Convert</Text>
        <View style={styles.headerButtonPlaceholder} />
      </View>

      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 126 + insets.bottom }]}
      >
        <Text style={[styles.introTitle, { color: colors.textPrimary }]}>Convert your money</Text>
        <Text style={[styles.introText, { color: colors.textSecondary }]}>Fast exchange between your balances.</Text>

        <View style={[styles.converterCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>You send</Text>
            <Text style={[styles.balanceText, { color: isInsufficient ? colors.error : colors.textSecondary }]}>
              {isInsufficient ? 'Insufficient balance' : helperText}
            </Text>
          </View>

          <View style={styles.amountRow}>
            <TextInput
              accessibilityLabel={`Amount in ${fromCur.code}`}
              autoFocus={false}
              keyboardType="decimal-pad"
              maxLength={14}
              placeholder="0.00"
              placeholderTextColor={isDark ? '#5F6472' : '#B4B8C4'}
              selectionColor={colors.primary}
              style={[styles.amountInput, { color: colors.textPrimary }]}
              value={amount}
              onChangeText={(value) => setAmount(sanitizeAmount(value))}
            />
            <CurrencyButton currency={fromCur} colors={colors} onPress={() => setActivePicker('from')} />
          </View>

          <View style={styles.maxRow}>
            <Text style={[styles.currencyNameHint, { color: colors.textSecondary }]}>{fromCur.name}</Text>
            {fromCurrency === 'ngn' && (
              <TouchableOpacity accessibilityRole="button" onPress={handleMax} hitSlop={8}>
                <Text style={[styles.maxText, { color: colors.primary }]}>Use max</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.swapRow}>
            <View style={[styles.rule, { backgroundColor: colors.border }]} />
            <TouchableOpacity
              accessibilityLabel="Swap currencies"
              accessibilityRole="button"
              activeOpacity={0.8}
              style={[styles.swapButton, { backgroundColor: colors.primary, borderColor: colors.cardBackground }]}
              onPress={handleSwap}
            >
              <MaterialIcons name="swap-vert" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={[styles.rule, { backgroundColor: colors.border }]} />
          </View>

          <Text style={[styles.sectionLabel, styles.receiveLabel, { color: colors.textSecondary }]}>You receive</Text>
          <View style={styles.amountRow}>
            <Text
              accessibilityLabel={`You receive ${formatMoney(convertedAmount, toCur)}`}
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.resultAmount, { color: colors.textPrimary }]}
            >
              {formatMoney(convertedAmount, toCur)}
            </Text>
            <CurrencyButton currency={toCur} colors={colors} onPress={() => setActivePicker('to')} />
          </View>
          <Text style={[styles.currencyNameHint, { color: colors.textSecondary }]}>{toCur.name}</Text>
        </View>

        <View style={[styles.rateCard, { backgroundColor: colors.primaryLight }]}>
          <View style={[styles.rateIcon, { backgroundColor: colors.cardBackground }]}>
            <MaterialIcons name="currency-exchange" size={19} color={colors.primary} />
          </View>
          <View style={styles.rateCopy}>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>Exchange rate</Text>
            <Text style={[styles.rateValue, { color: colors.textPrimary }]}>
              1 {fromCur.code} = {formatRate(conversionRate)} {toCur.code}
            </Text>
          </View>
          <View style={[styles.feePill, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.feeText, { color: colors.primary }]}>No fee</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 14),
          },
        ]}
      >
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          disabled={!canConvert}
          style={[
            styles.convertButton,
            { backgroundColor: canConvert ? colors.primary : (isDark ? '#343844' : '#D8DAE1') },
          ]}
          onPress={handleConvert}
        >
          <Text style={[styles.convertButtonText, { color: canConvert ? '#FFFFFF' : colors.textSecondary }]}>Review conversion</Text>
          <MaterialIcons name="arrow-forward" size={20} color={canConvert ? '#FFFFFF' : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <CurrencyPicker
        colors={colors}
        selected={activePicker === 'from' ? fromCurrency : toCurrency}
        visible={Boolean(activePicker)}
        onClose={() => setActivePicker(null)}
        onSelect={selectCurrency}
      />

      <TransactionProcessingModal
        visible={processing}
        label="Converting currency..."
        subtext="Please wait while we confirm your conversion securely."
      />
    </KeyboardAvoidingView>
  );
}

function CurrencyButton({ currency, colors, onPress }) {
  return (
    <TouchableOpacity
      accessibilityLabel={`Select currency, currently ${currency.code}`}
      accessibilityRole="button"
      activeOpacity={0.75}
      style={[styles.currencyButton, { backgroundColor: colors.surfaceVariant }]}
      onPress={onPress}
    >
      <Text style={styles.flag}>{currency.flag}</Text>
      <Text style={[styles.currencyCode, { color: colors.textPrimary }]}>{currency.code}</Text>
      <MaterialIcons name="keyboard-arrow-down" size={21} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function CurrencyPicker({ visible, onClose, selected, onSelect, colors }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close currency picker" style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select currency</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Choose a balance to convert</Text>
            </View>
            <TouchableOpacity
              accessibilityLabel="Close"
              accessibilityRole="button"
              style={[styles.closeButton, { backgroundColor: colors.surfaceVariant }]}
              onPress={onClose}
            >
              <MaterialIcons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {CURRENCIES.map((currency) => {
            const isSelected = selected === currency.id;
            return (
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.7}
                key={currency.id}
                style={[
                  styles.modalOption,
                  { borderColor: isSelected ? colors.primary : colors.border },
                  isSelected && { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => onSelect(currency)}
              >
                <View style={[styles.flagCircle, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={styles.modalFlag}>{currency.flag}</Text>
                </View>
                <View style={styles.modalCurrencyCopy}>
                  <Text style={[styles.modalCurrencyCode, { color: colors.textPrimary }]}>{currency.code}</Text>
                  <Text style={[styles.modalCurrencyName, { color: colors.textSecondary }]}>{currency.name}</Text>
                </View>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingHorizontal: 18,
  },
  headerButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerButtonPlaceholder: { height: 40, width: 40 },
  title: { fontSize: 19, fontWeight: '700', letterSpacing: -0.25 },
  content: { paddingHorizontal: 18, paddingTop: 12 },
  introTitle: { fontSize: 27, fontWeight: '800', letterSpacing: -0.65 },
  introText: { fontSize: 14, lineHeight: 21, marginTop: 5 },
  converterCard: {
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 22,
    padding: 20,
  },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionLabel: { fontSize: 13, fontWeight: '600' },
  receiveLabel: { marginBottom: 13 },
  balanceText: { fontSize: 12, fontWeight: '500' },
  amountRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  amountInput: {
    flex: 1,
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: -0.8,
    minHeight: 55,
    paddingHorizontal: 0,
    paddingVertical: 5,
  },
  resultAmount: { flex: 1, fontSize: 31, fontWeight: '700', letterSpacing: -0.8, lineHeight: 46 },
  currencyButton: {
    alignItems: 'center',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  flag: { fontSize: 20 },
  currencyCode: { fontSize: 14, fontWeight: '800' },
  maxRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  currencyNameHint: { fontSize: 12, fontWeight: '500', marginTop: 3 },
  maxText: { fontSize: 12, fontWeight: '700' },
  swapRow: { alignItems: 'center', flexDirection: 'row', marginVertical: 17 },
  rule: { flex: 1, height: StyleSheet.hairlineWidth },
  swapButton: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 5,
    height: 48,
    justifyContent: 'center',
    marginHorizontal: 8,
    width: 48,
  },
  rateCard: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: 14,
    padding: 14,
  },
  rateIcon: { alignItems: 'center', borderRadius: 12, height: 40, justifyContent: 'center', width: 40 },
  rateCopy: { flex: 1, marginLeft: 11 },
  rateLabel: { fontSize: 11, fontWeight: '500' },
  rateValue: { fontSize: 13, fontWeight: '700', marginTop: 3 },
  feePill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7 },
  feeText: { fontSize: 11, fontWeight: '800' },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    left: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  convertButton: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    minHeight: 56,
  },
  convertButtonText: { fontSize: 16, fontWeight: '700' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { backgroundColor: 'rgba(5, 8, 20, 0.56)', ...StyleSheet.absoluteFillObject },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 30,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  modalHandle: { alignSelf: 'center', borderRadius: 3, height: 5, marginBottom: 20, width: 42 },
  modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 19 },
  modalTitle: { fontSize: 21, fontWeight: '800', letterSpacing: -0.3 },
  modalSubtitle: { fontSize: 13, marginTop: 4 },
  closeButton: { alignItems: 'center', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  modalOption: {
    alignItems: 'center',
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 72,
    paddingHorizontal: 14,
  },
  flagCircle: { alignItems: 'center', borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  modalFlag: { fontSize: 22 },
  modalCurrencyCopy: { flex: 1, marginLeft: 12 },
  modalCurrencyCode: { fontSize: 15, fontWeight: '800' },
  modalCurrencyName: { fontSize: 12, marginTop: 3 },
  checkCircle: { alignItems: 'center', borderRadius: 11, height: 22, justifyContent: 'center', width: 22 },
});
