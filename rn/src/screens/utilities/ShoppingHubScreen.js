import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { COLORS } from '../../theme/theme';
import { fetchShoppingStores, getDefaultShoppingStores } from '../../services/appContentService';

const SIDE = 16;
const COLS = 3;
const GAP = 11;

function normalizeStore(raw, fallbackAccent) {
  return {
    id: String(raw.id),
    name: raw.name || 'Store',
    tag: raw.tag || raw.tagline || 'Shop',
    icon: raw.icon || 'store',
    brandColor: raw.brandColor || fallbackAccent,
    url: raw.url || null,
  };
}

function storeMonogram(name) {
  const t = (name || '?').trim();
  if (!t) return '?';
  return t.slice(0, 2).toUpperCase();
}

export default function ShoppingHubScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const [stores, setStores] = useState([]);

  const tileWidth = useMemo(
    () => (winW - SIDE * 2 - GAP * (COLS - 1)) / COLS,
    [winW]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchShoppingStores();
      if (!mounted) return;
      const list = Array.isArray(data) && data.length > 0 ? data : getDefaultShoppingStores();
      setStores(list.map((s) => normalizeStore(s, COLORS.primary)));
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const openStore = useCallback(async (item) => {
    if (!item.url) {
      Alert.alert('Coming soon', `${item.name} will be available in a future update.`);
      return;
    }
    try {
      const can = await Linking.canOpenURL(item.url);
      if (can) {
        await Linking.openURL(item.url);
      } else {
        Alert.alert('Unable to open', 'Please try again later or open the store in your browser.');
      }
    } catch {
      Alert.alert('Unable to open', 'Could not open this link.');
    }
  }, []);

  const gridBottom = useMemo(() => Math.max(insets.bottom, 28), [insets.bottom]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 12) + 6,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backWrap}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Shopping</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Third-party marketplaces</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: gridBottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.introCard, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
          <View style={[styles.introIconWrap, { backgroundColor: `${colors.primary}14` }]}>
            <MaterialIcons name="storefront" size={26} color={colors.primary} />
          </View>
          <View style={styles.introTextCol}>
            <Text style={[styles.introTitle, { color: colors.textPrimary }]}>Shop outside the app</Text>
            <Text style={[styles.introBody, { color: colors.textSecondary }]}>
              Browse trusted stores below. Each tile opens the official site in your browser. Use RexiPay at checkout
              where partners support it.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionKicker, { color: colors.primary }]}>POPULAR STORES</Text>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Marketplace grid</Text>
        </View>

        <View style={[styles.grid, { paddingHorizontal: SIDE, gap: GAP }]}>
          {stores.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.tile,
                {
                  width: tileWidth,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => openStore(s)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={`Open ${s.name} in browser`}
            >
              <View style={[styles.tileHero, { backgroundColor: s.brandColor }]}>
                <View style={styles.tileHeroInner}>
                  <View style={styles.monogramRing}>
                    <Text style={styles.monogramText}>{storeMonogram(s.name)}</Text>
                  </View>
                  <MaterialIcons name={s.icon} size={26} color="rgba(255,255,255,0.92)" />
                </View>
              </View>
              <View style={styles.tileFooter}>
                <Text style={[styles.tileName, { color: colors.textPrimary }]} numberOfLines={2}>
                  {s.name}
                </Text>
                <Text style={[styles.tileTag, { color: colors.textSecondary }]} numberOfLines={1}>
                  {s.tag}
                </Text>
                <View style={styles.tileCtaRow}>
                  <Text style={[styles.tileCta, { color: colors.primary }]}>Open</Text>
                  <MaterialIcons name="open-in-new" size={14} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.note, { marginHorizontal: SIDE, backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
          <MaterialIcons name="info-outline" size={20} color={colors.primary} />
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>
            You will leave RexiPay to shop on third-party sites. RexiPay is not affiliated with these stores; links are
            provided for convenience.
          </Text>
        </View>

        <View style={[styles.banner, { marginHorizontal: SIDE, backgroundColor: colors.primaryLight }]}>
          <MaterialIcons name="account-balance-wallet" size={22} color={colors.primary} />
          <Text style={[styles.bannerText, { color: colors.primary }]}>
            Use RexiPay at partner checkouts when available for instant confirmation.
          </Text>
        </View>
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
    paddingHorizontal: 10,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backWrap: { padding: 8, marginLeft: 2 },
  headerTitles: { flex: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { fontSize: 12, fontWeight: '600', marginTop: 2, letterSpacing: 0.2 },
  scroll: { paddingTop: 16 },
  introCard: {
    marginHorizontal: SIDE,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  introIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTextCol: { flex: 1, minWidth: 0 },
  introTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  introBody: { fontSize: 13, lineHeight: 19 },
  sectionHead: {
    paddingHorizontal: SIDE,
    marginBottom: 12,
  },
  sectionKicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 22,
  },
  tile: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 168,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  tileHero: {
    height: 76,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileHeroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  monogramRing: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  monogramText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tileFooter: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'flex-start',
  },
  tileName: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 17,
    minHeight: 34,
    textAlign: 'center',
  },
  tileTag: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  tileCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
  },
  tileCta: { fontSize: 12, fontWeight: '700' },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },
  bannerText: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 18 },
});
