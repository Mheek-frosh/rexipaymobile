import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function SendCryptoAssetScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { asset } = route.params || {};
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  if (!asset) return null;

  const handleSend = () => {
    if (!address || !amount || parseFloat(amount) <= 0) return;
    navigation.navigate('PaymentSuccess', {
      amount: amount,
      recipient: address.slice(0, 12) + '...',
      type: 'crypto',
      ref: 'TX' + Date.now(),
      asset: asset.symbol,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Send {asset.symbol}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.balanceCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available</Text>
          <Text style={[styles.balanceValue, { color: colors.textPrimary }]}>
            {asset.balance} {asset.symbol}
          </Text>
        </View>

        <Text style={[styles.label, { color: colors.textPrimary }]}>Recipient Address</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder={`Enter ${asset.symbol} address`}
          placeholderTextColor={colors.textSecondary}
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <Text style={[styles.label, { color: colors.textPrimary }]}>Amount ({asset.symbol})</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="0.00"
          placeholderTextColor={colors.textSecondary}
          value={amount}
          onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: asset.color || colors.primary }]}
          onPress={handleSend}
          disabled={!address || !amount || parseFloat(amount) <= 0}
        >
          <Text style={styles.sendBtnText}>Send {asset.symbol}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  balanceLabel: { fontSize: 14 },
  balanceValue: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  sendBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  sendBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
