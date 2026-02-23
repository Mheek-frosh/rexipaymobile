import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const CRYPTO_ASSETS = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    color: '#FF9800',
    icon: 'currency-bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    icon: 'token',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  },
  {
    id: 'usdt',
    name: 'USDT',
    symbol: 'USDT',
    color: '#26A17B',
    icon: 'attach-money',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  },
];

export default function CryptoReceiveScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [selectedCrypto, setSelectedCrypto] = useState('btc');

  const asset = CRYPTO_ASSETS.find((c) => c.id === selectedCrypto);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My ${asset?.name} address: ${asset?.address}`,
      });
    } catch (e) {}
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Receive Crypto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.tabs, { backgroundColor: colors.surfaceVariant }]}>
          {CRYPTO_ASSETS.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.tab,
                selectedCrypto === c.id && {
                  backgroundColor: colors.cardBackground,
                },
              ]}
              onPress={() => setSelectedCrypto(c.id)}
            >
              <MaterialIcons
                name={c.icon}
                size={20}
                color={selectedCrypto === c.id ? c.color : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selectedCrypto === c.id ? colors.textPrimary : colors.textSecondary,
                    fontWeight: selectedCrypto === c.id ? '600' : '500',
                  },
                ]}
              >
                {c.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.qrPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
            <MaterialIcons name="qr-code-2" size={120} color={asset?.color} />
          </View>
          <Text style={[styles.assetName, { color: colors.textPrimary }]}>
            {asset?.name} ({asset?.symbol})
          </Text>
          <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={2}>
            {asset?.address}
          </Text>
          <TouchableOpacity
            style={[styles.copyBtn, { backgroundColor: colors.primaryLight }]}
            onPress={() => Clipboard.setStringAsync(asset?.address || '')}
          >
            <MaterialIcons name="content-copy" size={20} color={colors.primary} />
            <Text style={[styles.copyBtnText, { color: colors.primary }]}>Copy Address</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.primary }]}
            onPress={handleShare}
          >
            <MaterialIcons name="share" size={20} color="#FFF" />
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.warning, { color: colors.textSecondary }]}>
          Only send {asset?.symbol} to this address. Sending any other asset may result in permanent
          loss.
        </Text>
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
  tabs: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 12,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabText: { fontSize: 14 },
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetName: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  address: {
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  copyBtnText: { fontSize: 16, fontWeight: '600' },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  shareText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  warning: {
    fontSize: 12,
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 18,
  },
});
