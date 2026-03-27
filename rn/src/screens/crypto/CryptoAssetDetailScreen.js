import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { fetchCoinDetail, formatUsd, formatCompactUsd } from '../../services/coingeckoService';
import SparklineChart from '../../components/SparklineChart';
import AppLoader from '../../components/AppLoader';

const { width: W } = Dimensions.get('window');
const CHART_H = 160;

export default function CryptoAssetDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const coinId = route.params?.coinId;

  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!coinId) {
      setError('Missing asset');
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const data = await fetchCoinDetail(coinId);
      setCoin(data);
    } catch (e) {
      setError(e.message || 'Failed to load asset');
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const md = coin?.market_data;
  const spark = md?.sparkline_7d?.price;
  const price = md?.current_price?.usd;
  const change24 = md?.price_change_percentage_24h;
  const up = change24 >= 0;
  const chartColor = up ? '#10B981' : '#EF4444';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {coin?.name || 'Asset'}
        </Text>
        {coin?.links?.homepage?.[0] ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(coin.links.homepage[0])}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MaterialIcons name="open-in-new" size={22} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {loading ? (
        <AppLoader mode="fullscreen" label="Loading live data..." />
      ) : error ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={[styles.muted, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity style={[styles.retry, { backgroundColor: colors.primary }]} onPress={() => { setLoading(true); load(); }}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroRow}>
            <Image source={{ uri: coin?.image?.large || coin?.image?.small }} style={styles.heroIcon} />
            <View style={styles.heroText}>
              <Text style={[styles.name, { color: colors.textPrimary }]}>{coin?.name}</Text>
              <Text style={[styles.sym, { color: colors.textSecondary }]}>{coin?.symbol?.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={[styles.bigPrice, { color: colors.textPrimary }]}>{formatUsd(price)}</Text>
          <Text style={[styles.change24, { color: up ? '#10B981' : '#EF4444' }]}>
            24h {change24 != null ? `${up ? '+' : ''}${change24.toFixed(2)}%` : '—'}
          </Text>

          <View style={[styles.chartDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.chartCaption, { color: colors.textSecondary }]}>7-day price trend</Text>
          {spark && spark.length > 2 ? (
            <View style={styles.chartBleed}>
              <SparklineChart data={spark} width={W} height={CHART_H} color={chartColor} strokeWidth={2} />
            </View>
          ) : null}
          <Text style={[styles.chartFoot, { color: colors.textSecondary }]}>
            Prices from CoinGecko · indicative only
          </Text>

          <View style={[styles.statsGrid, { borderColor: colors.border }]}>
            <View style={[styles.statCell, { borderColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Market cap</Text>
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>
                {formatCompactUsd(md?.market_cap?.usd)}
              </Text>
            </View>
            <View style={[styles.statCell, { borderColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h volume</Text>
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>
                {formatCompactUsd(md?.total_volume?.usd)}
              </Text>
            </View>
            <View style={[styles.statCell, { borderColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h high</Text>
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>{formatUsd(md?.high_24h?.usd)}</Text>
            </View>
            <View style={[styles.statCell, { borderColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h low</Text>
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>{formatUsd(md?.low_24h?.usd)}</Text>
            </View>
          </View>

          {coin?.description?.en ? (
            <Text style={[styles.about, { color: colors.textSecondary }]} numberOfLines={6}>
              {coin.description.en.replace(/<[^>]+>/g, ' ').trim()}
            </Text>
          ) : null}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('SendCrypto')}
              activeOpacity={0.9}
            >
              <MaterialIcons name="north-east" size={20} color="#FFF" />
              <Text style={styles.actionBtnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#2E63F6' }]}
              onPress={() => navigation.navigate('CryptoReceive')}
              activeOpacity={0.9}
            >
              <MaterialIcons name="south-west" size={20} color="#FFF" />
              <Text style={styles.actionBtnText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FF9800' }]}
              onPress={() => navigation.navigate('CryptoSell')}
              activeOpacity={0.9}
            >
              <MaterialIcons name="sell" size={20} color="#FFF" />
              <Text style={styles.actionBtnText}>Sell</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
    paddingBottom: 12,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', textAlign: 'center', marginHorizontal: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  muted: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  retry: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: '#FFF', fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  heroIcon: { width: 56, height: 56, borderRadius: 28 },
  heroText: { flex: 1 },
  name: { fontSize: 22, fontWeight: '800' },
  sym: { fontSize: 14, marginTop: 2 },
  bigPrice: { fontSize: 32, fontWeight: '800', marginTop: 8 },
  change24: { fontSize: 16, fontWeight: '700', marginTop: 4, marginBottom: 12 },
  chartDivider: { height: StyleSheet.hairlineWidth, width: '100%', marginTop: 4, marginBottom: 10 },
  chartCaption: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4, marginBottom: 6, textTransform: 'uppercase' },
  chartBleed: { marginHorizontal: -20, marginBottom: 6 },
  chartFoot: { fontSize: 10, lineHeight: 14, marginBottom: 18 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  statCell: {
    width: '50%',
    padding: 14,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  statVal: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  about: { fontSize: 13, lineHeight: 20, marginBottom: 20 },
  actions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  actionBtn: {
    flex: 1,
    minWidth: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
