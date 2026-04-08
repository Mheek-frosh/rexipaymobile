import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { COLORS } from '../../theme/theme';
import { fetchShoppingStores } from '../../services/appContentService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDE = 16;
const COLS = 3;
const GAP = 12;
const TILE_WIDTH = (SCREEN_WIDTH - SIDE * 2 - GAP * (COLS - 1)) / COLS;

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

export default function ShoppingHubScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [stores, setStores] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchShoppingStores();
      if (!mounted) return;
      const list = Array.isArray(data) ? data : [];
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

  const gridBottom = useMemo(() => Math.max(insets.bottom, 24), [insets.bottom]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backWrap}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Shopping</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: gridBottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lead, { color: colors.textSecondary }]}>
          Browse popular marketplaces. Tap a store to open it in your browser — pay with RexiPay where supported.
        </Text>

        <View style={[styles.grid, { paddingHorizontal: SIDE, gap: GAP }]}>
          {stores.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.tile,
                {
                  width: TILE_WIDTH,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => openStore(s)}
              activeOpacity={0.88}
            >
              <View style={[styles.tileBrandBar, { backgroundColor: s.brandColor }]} />
              <View style={styles.tileBody}>
                <View style={[styles.tileIconWrap, { backgroundColor: `${s.brandColor}18` }]}>
                  <MaterialIcons name={s.icon} size={28} color={s.brandColor} />
                </View>
                <Text style={[styles.tileName, { color: colors.textPrimary }]} numberOfLines={2}>
                  {s.name}
                </Text>
                <Text style={[styles.tileTag, { color: colors.textSecondary }]} numberOfLines={1}>
                  {s.tag}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.note, { marginHorizontal: SIDE, backgroundColor: colors.surfaceVariant }]}>
          <MaterialIcons name="open-in-new" size={20} color={colors.primary} />
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
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  backWrap: { padding: 8, marginLeft: 4 },
  title: { fontSize: 18, fontWeight: '700' },
  scroll: { paddingTop: 4 },
  lead: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
    paddingHorizontal: SIDE,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tile: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  tileBrandBar: {
    height: 4,
    width: '100%',
  },
  tileBody: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tileIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 17,
    minHeight: 34,
  },
  tileTag: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
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
