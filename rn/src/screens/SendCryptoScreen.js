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

const CRYPTO_ASSETS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: '#FF9800', icon: 'currency-bitcoin', balance: '0.5' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', icon: 'token', balance: '2.5' },
  { id: 'usdt', name: 'USDT', symbol: 'USDT', color: '#26A17B', icon: 'attach-money', balance: '5000' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', color: '#78909C', icon: 'payments', balance: '10' },
];

export default function SendCryptoScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const preselected = route.params?.asset;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Send Crypto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Select asset to send
        </Text>
        {CRYPTO_ASSETS.map((asset) => (
          <TouchableOpacity
            key={asset.id}
            style={[styles.assetCard, { backgroundColor: colors.cardBackground }]}
            onPress={() =>
              navigation.navigate('SendCryptoAsset', { asset })
            }
          >
            <View style={[styles.assetIcon, { backgroundColor: `${asset.color}20` }]}>
              <MaterialIcons name={asset.icon} size={28} color={asset.color} />
            </View>
            <View style={styles.assetInfo}>
              <Text style={[styles.assetName, { color: colors.textPrimary }]}>{asset.name}</Text>
              <Text style={[styles.assetBalance, { color: colors.textSecondary }]}>
                Balance: {asset.balance} {asset.symbol}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
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
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
  },
  assetIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetInfo: { flex: 1 },
  assetName: { fontSize: 16, fontWeight: '600' },
  assetBalance: { fontSize: 13, marginTop: 4 },
});
