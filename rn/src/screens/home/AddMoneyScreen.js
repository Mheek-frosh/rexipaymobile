import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import AppBackButton from '../../components/AppBackButton';
import BankTransferBottomSheet from '../../components/BankTransferBottomSheet';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import TransactionProcessingModal from '../../components/TransactionProcessingModal';

const METHODS = [
  { id: 'card', icon: 'credit-card', label: 'Debit/Credit Card', desc: 'Instant' },
  { id: 'bank', icon: 'account-balance', label: 'Bank Transfer', desc: 'Instant transfer' },
  { id: 'ussd', icon: 'phone', label: 'USSD', desc: 'Instant' },
];

export default function AddMoneyScreen() {
  const { colors } = useTheme();
  const { userAccountNumber, userName } = useAuth();
  const { creditNgn } = useWallet();
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [bankTransferVisible, setBankTransferVisible] = useState(false);

  const completeFunding = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setProcessing(false);
    const creditResult = await creditNgn(amount);
    if (!creditResult.success) return;
    navigation.navigate('PaymentSuccess', {
      amount: amount,
      recipient: 'Add Money',
      type: 'transfer',
      ref: 'REF' + Date.now(),
    });
  };

  const handleAdd = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    Keyboard.dismiss();
    if (selectedMethod === 'bank') {
      setBankTransferVisible(true);
      return;
    }
    completeFunding();
  };

  const confirmBankTransfer = () => {
    setBankTransferVisible(false);
    completeFunding();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Add Money</Text>
        <View style={{ width: 24 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Amount (NGN)</Text>
        <TextInput
          style={[styles.amountInput, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="0.00"
          placeholderTextColor={colors.textSecondary}
          value={amount}
          onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
        />

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Payment Method
        </Text>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.methodCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: selectedMethod === m.id ? colors.primary : colors.border,
                borderWidth: selectedMethod === m.id ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedMethod(m.id)}
          >
            <View style={[styles.methodIcon, { backgroundColor: colors.primaryLight }]}>
              <MaterialIcons name={m.icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodLabel, { color: colors.textPrimary }]}>{m.label}</Text>
              <Text style={[styles.methodDesc, { color: colors.textSecondary }]}>{m.desc}</Text>
            </View>
            {selectedMethod === m.id && (
              <MaterialIcons name="check-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={handleAdd}
          disabled={processing || !amount || parseFloat(amount) <= 0}
        >
          <Text style={styles.addBtnText}>Add ₦{amount ? Number(amount).toLocaleString() : '0'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <BankTransferBottomSheet
        visible={bankTransferVisible}
        accountName={`${userName || 'RexiPay User'} / RexiPay`}
        accountNumber={userAccountNumber || '0123456789'}
        amount={amount}
        fee={50}
        onClose={() => setBankTransferVisible(false)}
        onConfirm={confirmBankTransfer}
      />

      <TransactionProcessingModal
        visible={processing}
        label="Adding money..."
        subtext="Please wait while we confirm your funding transaction securely."
      />
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
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    marginBottom: 32,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 16, fontWeight: '600' },
  methodDesc: { fontSize: 12, marginTop: 4 },
  addBtn: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
