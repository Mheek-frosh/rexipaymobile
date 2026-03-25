import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

const STORAGE_KEY = '@rexipay_notification_prefs';

const DEFAULT_PREFS = {
  pushEnabled: true,
  emailEnabled: true,
  txnAlerts: true,
  promoAlerts: true,
  securityAlerts: true,
};

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw);
          setPrefs({ ...DEFAULT_PREFS, ...parsed });
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next) => {
    setPrefs(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const row = (icon, label, subtitle, prefKey) => (
    <View style={[styles.settingRow, { borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}12` }]}>
        <MaterialIcons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.settingBody}>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.settingSub, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <Switch
        value={!!prefs[prefKey]}
        onValueChange={(v) => persist({ ...prefs, [prefKey]: v })}
        trackColor={{ false: '#767577', true: colors.primary }}
        thumbColor="#FFF"
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 12),
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notification preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 24) }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lead, { color: colors.textSecondary }]}>
          Choose how you want to hear from RexiPay. You can change these anytime.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Channels</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {row('notifications-active', 'Push notifications', 'Alerts on this device', 'pushEnabled')}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {row('email', 'Email updates', 'Statements, receipts, and news', 'emailEnabled')}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>What we send</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {row('receipt-long', 'Transaction alerts', 'Payments, transfers, and top-ups', 'txnAlerts')}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {row('card-giftcard', 'Offers & rewards', 'Cashback, promos, and referrals', 'promoAlerts')}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {row('shield', 'Security', 'Logins, OTPs, and device changes', 'securityAlerts')}
        </View>

        {!loaded && (
          <Text style={[styles.hint, { color: colors.textSecondary }]}>Loading preferences…</Text>
        )}
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
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
  scroll: { padding: 20 },
  lead: { fontSize: 14, lineHeight: 21, marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 2,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingBody: { flex: 1, minWidth: 0 },
  settingLabel: { fontSize: 16, fontWeight: '600' },
  settingSub: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 66 },
  hint: { fontSize: 13, textAlign: 'center', marginTop: 8 },
});
