import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { fetchReferralOverview } from '../../services/appContentService';

export default function ReferralEarnScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { userName } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('REXI-7K2M9P');
  const [invites, setInvites] = useState([]);
  const [stats, setStats] = useState({ successfulInvites: 0, totalEarned: '₦0' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchReferralOverview();
      if (!mounted) return;
      setReferralCode(data?.code || 'REXI-7K2M9P');
      setInvites(Array.isArray(data?.invites) ? data.invites : []);
      setStats(data?.stats || { successfulInvites: 0, totalEarned: '₦0' });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const shareMessage = `Join me on RexiPay — secure payments & crypto in one app. Use my code ${referralCode} when you sign up: https://rexipay.app/r/${referralCode}`;

  const copyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied', 'Referral code copied to clipboard.');
  };

  const shareInvite = async () => {
    try {
      await Share.share({ message: shareMessage, title: 'Join RexiPay' });
    } catch {
      Alert.alert('Share', 'Unable to open share sheet.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Refer & earn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="card-giftcard" size={40} color="rgba(255,255,255,0.95)" />
          <Text style={styles.heroTitle}>Invite friends, earn rewards</Text>
          <Text style={styles.heroSub}>
            You and your friend both get a bonus when they complete their first transaction.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Your referral code</Text>
        <TouchableOpacity
          style={[styles.codeCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={copyCode}
          activeOpacity={0.85}
        >
          <Text style={[styles.codeText, { color: colors.textPrimary }]}>{referralCode}</Text>
          <View style={[styles.copyPill, { backgroundColor: colors.primaryLight }]}>
            <MaterialIcons name={copied ? 'check' : 'content-copy'} size={16} color={colors.primary} />
            <Text style={[styles.copyPillText, { color: colors.primary }]}>{copied ? 'Copied' : 'Copy'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: colors.primary }]}
          onPress={shareInvite}
          activeOpacity={0.9}
        >
          <MaterialIcons name="share" size={20} color="#FFF" />
          <Text style={styles.shareBtnText}>Share invite link</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.successfulInvites}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Successful invites</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.totalEarned}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total earned</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textPrimary, marginTop: 8 }]}>How it works</Text>
        {[
          { step: '1', text: 'Share your code or link with friends.' },
          { step: '2', text: 'They sign up and verify their account.' },
          { step: '3', text: 'When they complete a qualifying transaction, you both earn a reward.' },
        ].map((row) => (
          <View key={row.step} style={[styles.stepRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.stepBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.stepNum, { color: colors.primary }]}>{row.step}</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.textSecondary }]}>{row.text}</Text>
          </View>
        ))}

        <Text style={[styles.sectionLabel, { color: colors.textPrimary, marginTop: 16 }]}>Recent activity</Text>
        {invites.map((row) => (
          <View
            key={row.id}
            style={[styles.activityRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          >
            <View>
              <Text style={[styles.activityName, { color: colors.textPrimary }]}>{row.name}</Text>
              <Text style={[styles.activityMeta, { color: colors.textSecondary }]}>
                {row.date} · {row.status}
              </Text>
            </View>
            <Text style={[styles.activityReward, { color: colors.primary }]}>{row.reward}</Text>
          </View>
        ))}

        <Text style={[styles.footnote, { color: colors.textSecondary }]}>
          Logged in as {(userName || 'User').split(' ')[0]}. Rewards are credited within 24 hours of a qualifying
          transaction. Terms apply.
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
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 48 },
  hero: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
    alignItems: 'center',
  },
  heroTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginTop: 12, textAlign: 'center' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 20, marginTop: 8, textAlign: 'center' },
  sectionLabel: { fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  codeText: { fontSize: 20, fontWeight: '800', letterSpacing: 2 },
  copyPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  copyPillText: { fontSize: 13, fontWeight: '700' },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 14,
  },
  shareBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2, textAlign: 'center' },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontSize: 14, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20, paddingTop: 2 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityName: { fontSize: 15, fontWeight: '600' },
  activityMeta: { fontSize: 12, marginTop: 2 },
  activityReward: { fontSize: 15, fontWeight: '700' },
  footnote: { fontSize: 11, lineHeight: 16, marginTop: 20 },
});
