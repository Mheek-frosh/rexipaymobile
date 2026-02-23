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

const CRYPTO_ASSETS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: '#FF9800', icon: 'currency-bitcoin', balance: '0.5', rate: 95000 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', icon: 'token', balance: '2.5', rate: 3500 },
  { id: 'usdt', name: 'USDT', symbol: 'USDT', color: '#26A17B', icon: 'attach-money', balance: '5000', rate: 1 },
];

export default function CryptoSellScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [amount, setAmount] = useState('');
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  const asset = CRYPTO_ASSETS.find((c) => c.id === selectedCrypto);
  const numAmount = parseFloat(amount) || 0;
  const usdValue = asset ? numAmount * asset.rate : 0;

  const handleSell = () => {
    if (!amount || numAmount <= 0) return;
    navigation.navigate('PaymentSuccess', {
      amount: usdValue.toFixed(2),
      recipient: `Sold ${asset?.symbol}`,
      type: 'transfer',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Sell Crypto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Select Asset</Text>
          <TouchableOpacity
            style={[styles.assetSelect, { borderColor: colors.border }]}
            onPress={() => setShowCryptoModal(true)}
          >
            <View style={[styles.assetIcon, { backgroundColor: `${asset?.color}20` }]}>
              <MaterialIcons name={asset?.icon} size={24} color={asset?.color} />
            </View>
            <View style={styles.assetInfo}>
              <Text style={[styles.assetName, { color: colors.textPrimary }]}>
                {asset?.name}
              </Text>
              <Text style={[styles.assetBalance, { color: colors.textSecondary }]}>
                Balance: {asset?.balance} {asset?.symbol}
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={[styles.label, { color: colors.textPrimary }]}>Amount to sell</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
          />
          <Text style={[styles.unit, { color: colors.textSecondary }]}>
            {asset?.symbol}
          </Text>

          <View style={[styles.previewBox, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
              You will receive
            </Text>
            <Text style={[styles.previewAmount, { color: colors.primary }]}>
              ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.sellBtn, { backgroundColor: colors.primary }]}
            onPress={handleSell}
            disabled={!amount || numAmount <= 0}
          >
            <Text style={styles.sellBtnText}>Sell {asset?.symbol}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showCryptoModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCryptoModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Select Crypto
            </Text>
            {CRYPTO_ASSETS.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.modalOption, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setSelectedCrypto(c.id);
                  setShowCryptoModal(false);
                }}
              >
                <View style={[styles.assetIcon, { backgroundColor: `${c.color}20` }]}>
                  <MaterialIcons name={c.icon} size={24} color={c.color} />
                </View>
                <View style={styles.assetInfo}>
                  <Text style={[styles.modalOptionText, { color: colors.textPrimary }]}>
                    {c.name}
                  </Text>
                  <Text style={[styles.assetBalance, { color: colors.textSecondary }]}>
                    {c.balance} {c.symbol}
                  </Text>
                </View>
                {selectedCrypto === c.id && (
                  <MaterialIcons name="check-circle" size={24} color={colors.primary} />
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
  card: { borderRadius: 20, padding: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  assetSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetInfo: { flex: 1 },
  assetName: { fontSize: 16, fontWeight: '600' },
  assetBalance: { fontSize: 12, marginTop: 2 },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    marginBottom: 8,
  },
  unit: { fontSize: 14, marginBottom: 20 },
  previewBox: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  previewLabel: { fontSize: 14 },
  previewAmount: { fontSize: 24, fontWeight: '700', marginTop: 8 },
  sellBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sellBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
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
  modalOptionText: { fontSize: 16, fontWeight: '600' },
});
