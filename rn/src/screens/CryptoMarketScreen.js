import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { fetchMarkets, formatUsd } from '../services/coingeckoService';

export default function CryptoMarketScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchMarkets({ perPage: 25, page: 1 });
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Could not load markets');
      setList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.symbol && c.symbol.toLowerCase().includes(q))
    );
  }, [list, query]);

  const renderItem = ({ item }) => {
    const change = item.price_change_percentage_24h;
    const up = change >= 0;

    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        onPress={() => navigation.navigate('CryptoAssetDetail', { coinId: item.id })}
        activeOpacity={0.75}
      >
        <Image source={{ uri: item.image }} style={styles.coinIcon} />
        <View style={styles.rowMid}>
          <Text style={[styles.coinName, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.coinSym, { color: colors.textSecondary }]}>{item.symbol?.toUpperCase()}</Text>
        </View>
        <View style={styles.rowRight}>
          <Text style={[styles.price, { color: colors.textPrimary }]}>{formatUsd(item.current_price)}</Text>
          <Text style={[styles.pct, { color: up ? '#10B981' : '#EF4444' }]}>
            {change != null ? `${up ? '+' : ''}${change.toFixed(2)}%` : '—'}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Crypto market</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <MaterialIcons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search name or symbol"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <MaterialIcons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={[styles.caption, { color: colors.textSecondary }]}>
        Top assets by market cap · Live prices via CoinGecko
      </Text>

      {loading && !list.length ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading markets…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={[styles.errText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity style={[styles.retry, { backgroundColor: colors.primary }]} onPress={() => { setLoading(true); load(); }}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textSecondary }]}>No coins match your search.</Text>
          }
        />
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
  title: { fontSize: 18, fontWeight: '700' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 4 },
  caption: { fontSize: 12, marginHorizontal: 20, marginTop: 10, marginBottom: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  coinIcon: { width: 40, height: 40, borderRadius: 20 },
  rowMid: { flex: 1, minWidth: 0 },
  coinName: { fontSize: 15, fontWeight: '700' },
  coinSym: { fontSize: 12, marginTop: 2 },
  rowRight: { alignItems: 'flex-end', minWidth: 88 },
  price: { fontSize: 14, fontWeight: '700' },
  pct: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { marginTop: 12, fontSize: 14 },
  errText: { textAlign: 'center', marginTop: 12, fontSize: 14, lineHeight: 20 },
  retry: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  empty: { textAlign: 'center', paddingVertical: 24, fontSize: 14 },
});
