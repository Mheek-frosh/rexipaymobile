import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const PERKS = [
  { icon: 'payments', title: 'Bill payments', desc: 'Earn points when you pay airtime, data & electricity.' },
  { icon: 'swap-horiz', title: 'Transfers', desc: 'Bonus points on transfers above ₦5,000.' },
  { icon: 'account-balance', title: 'Savings goals', desc: 'Extra rewards when you hit monthly savings targets.' },
];

export default function RewardsHubScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Rexi Rewards</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: '#1DB954' }]}>
          <Text style={styles.heroKicker}>Your points</Text>
          <Text style={styles.heroPoints}>2,450</Text>
          <Text style={styles.heroSub}>Redeem for airtime, fee discounts & more — coming soon.</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Ways to earn</Text>
        {PERKS.map((p) => (
          <View key={p.title} style={[styles.perkRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[styles.perkIcon, { backgroundColor: 'rgba(29, 185, 84, 0.15)' }]}>
              <MaterialIcons name={p.icon} size={22} color="#1DB954" />
            </View>
            <View style={styles.perkText}>
              <Text style={[styles.perkTitle, { color: colors.textPrimary }]}>{p.title}</Text>
              <Text style={[styles.perkDesc, { color: colors.textSecondary }]}>{p.desc}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.cta, { borderColor: colors.border }]}
          onPress={() => navigation.navigate('Transactions')}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaText, { color: colors.primary }]}>View transaction history</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
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
    paddingBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  hero: { borderRadius: 20, padding: 22, marginBottom: 22 },
  heroKicker: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  heroPoints: { color: '#FFF', fontSize: 36, fontWeight: '800', marginTop: 4 },
  heroSub: { color: 'rgba(255,255,255,0.92)', fontSize: 13, lineHeight: 18, marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  perkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: { flex: 1 },
  perkTitle: { fontSize: 15, fontWeight: '700' },
  perkDesc: { fontSize: 13, lineHeight: 18, marginTop: 4 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  ctaText: { fontSize: 15, fontWeight: '700' },
});
