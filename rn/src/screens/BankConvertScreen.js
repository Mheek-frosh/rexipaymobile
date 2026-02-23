import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const CURRENCIES = [
  { id: 'ngn', name: 'Naira', code: 'NGN', flag: '🇳🇬', rate: 1 },
  { id: 'usd', name: 'US Dollar', code: 'USD', flag: '🇺🇸', rate: 0.00067 },
  { id: 'gbp', name: 'British Pound', code: 'GBP', flag: '🇬🇧', rate: 0.00053 },
];

export default function BankConvertScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [fromCurrency, setFromCurrency] = useState('ngn');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState('');
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);

  const fromCur = CURRENCIES.find((c) => c.id === fromCurrency);
  const toCur = CURRENCIES.find((c) => c.id === toCurrency);

  const numAmount = parseFloat(amount) || 0;
  const convertedAmount = fromCur && toCur
    ? (numAmount * toCur.rate) / fromCur.rate
    : 0;

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = () => {
    if (!amount || numAmount <= 0) return;
    navigation.navigate('PaymentSuccess', {
      amount: convertedAmount.toFixed(2),
      recipient: `Converted to ${toCur?.name}`,
      type: 'transfer',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Convert</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>From</Text>
          <TouchableOpacity
            style={[styles.currencySelect, { borderColor: colors.border }]}
            onPress={() => setShowFromModal(true)}
          >
            <Text style={styles.flag}>{fromCur?.flag}</Text>
            <Text style={[styles.currencyName, { color: colors.textPrimary }]}>
              {fromCur?.name} ({fromCur?.code})
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TextInput
            style={[styles.amountInput, { color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
            <View style={[styles.swapIcon, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="swap-vert" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.label, { color: colors.textPrimary }]}>To</Text>
          <TouchableOpacity
            style={[styles.currencySelect, { borderColor: colors.border }]}
            onPress={() => setShowToModal(true)}
          >
            <Text style={styles.flag}>{toCur?.flag}</Text>
            <Text style={[styles.currencyName, { color: colors.textPrimary }]}>
              {toCur?.name} ({toCur?.code})
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.resultBox, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>
              You will receive
            </Text>
            <Text style={[styles.resultAmount, { color: colors.primary }]}>
              {toCur?.flag} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.convertBtn, { backgroundColor: colors.primary }]}
            onPress={handleConvert}
            disabled={!amount || numAmount <= 0}
          >
            <Text style={styles.convertBtnText}>Convert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CurrencyModal
        visible={showFromModal}
        onClose={() => setShowFromModal(false)}
        selected={fromCurrency}
        onSelect={(c) => { setFromCurrency(c.id); setShowFromModal(false); }}
        colors={colors}
      />
      <CurrencyModal
        visible={showToModal}
        onClose={() => setShowToModal(false)}
        selected={toCurrency}
        onSelect={(c) => { setToCurrency(c.id); setShowToModal(false); }}
        colors={colors}
      />
    </View>
  );
}

function CurrencyModal({ visible, onClose, selected, onSelect, colors }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Currency</Text>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => onSelect(c)}
            >
              <Text style={styles.flag}>{c.flag}</Text>
              <Text style={[styles.modalOptionText, { color: colors.textPrimary }]}>
                {c.name} ({c.code})
              </Text>
              {selected === c.id && (
                <MaterialIcons name="check" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
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
  card: { borderRadius: 20, padding: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  currencySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  flag: { fontSize: 24 },
  currencyName: { fontSize: 16 },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    marginBottom: 16,
  },
  swapBtn: { alignItems: 'center', marginVertical: 8 },
  swapIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBox: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  resultLabel: { fontSize: 14 },
  resultAmount: { fontSize: 24, fontWeight: '700', marginTop: 8 },
  convertBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  convertBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  modalOptionText: { flex: 1, fontSize: 16 },
});
