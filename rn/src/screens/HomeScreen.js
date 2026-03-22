import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { AccountSwitcherSheet } from '../components/BottomSheet';
import { HOME_QUICK_SERVICES } from '../data/homeServices';

const CURRENCY_ACCOUNTS = [
  { id: 'ngn', name: 'Naira', code: 'NGN', flag: '🇳🇬', balance: '₦250,000', symbol: '₦' },
  { id: 'usd', name: 'US Dollar', code: 'USD', flag: '🇺🇸', balance: '$1,250.00', symbol: '$' },
  { id: 'gbp', name: 'British Pound', code: 'GBP', flag: '🇬🇧', balance: '£850.00', symbol: '£' },
];

const { width } = Dimensions.get('window');
const PADDING = 20;
const GAP = 12;
const COLS = 4;
const ITEM_WIDTH = (width - PADDING * 2 - GAP * (COLS - 1)) / COLS;

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { userName } = useAuth();
  const navigation = useNavigation();

  // State for toggling between Bank (fiat) and Crypto views
  const [homeView, setHomeView] = useState(0); // 0: Bank, 1: Crypto

  // State for managing which fiat account is currently selected (e.g., NGN, USD, GBP)
  const [selectedAccount, setSelectedAccount] = useState('ngn');
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const firstName = (userName || 'User').split(' ')[0];
  const currentAccount = CURRENCY_ACCOUNTS.find((a) => a.id === selectedAccount) || CURRENCY_ACCOUNTS[0];

  const handleQuickService = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
      return;
    }
    Alert.alert('Coming soon', `${item.label} will be available in a future update.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* === TOP BLUE HEADER === */}
        {/* Contains the user profile, Bank/Crypto toggle, and notification bell. 
            The blue background extends downward to partially overlap the action cards below. */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View style={styles.topRowLeft}>
              <TouchableOpacity
                onPress={() => navigation.navigate('AccountDetails')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="account-circle" size={30} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.toggle}>
              <TouchableOpacity
                style={[styles.toggleOption, homeView === 0 && styles.toggleActive]}
                onPress={() => setHomeView(0)}
              >
                <Text style={styles.toggleText}>Bank</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleOption, homeView === 1 && styles.toggleActive]}
                onPress={() => setHomeView(1)}
              >
                <Text style={styles.toggleText}>Crypto</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.topRowRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="notifications" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.greeting}>Hello, {firstName}!</Text>

          {/* Account Selector Button: Shows the current fiat currency flag and name. 
              Tapping it opens a bottom sheet to switch between NGN, USD, GBP, etc. */}
          <TouchableOpacity
            style={styles.ngRow}
            onPress={() => setShowAccountSheet(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.ngFlag}>{currentAccount.flag}</Text>
            <Text style={styles.ngText}>{currentAccount.code} {currentAccount.name}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          {/* Current Balance Display based on selected fiat currency */}
          <Text style={styles.balance}>{currentAccount.balance}</Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>

          <TouchableOpacity
            style={styles.addMoneyBtn}
            onPress={() => navigation.navigate('AddMoney')}
          >
            <MaterialIcons name="account-balance-wallet" size={20} color="#FFF" />
            <Text style={styles.addMoneyText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        {homeView === 0 && (
          <>
            {/* Action Buttons Card - blue extends to fill half of this */}
            <View style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('Transfer')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                  <MaterialIcons name="arrow-upward" size={24} color="#FFF" />
                </View>
                <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Send</Text>
              </TouchableOpacity>
              <View style={[styles.actionDivider, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('BankReceive')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#2E63F6' }]}>
                  <MaterialIcons name="arrow-downward" size={24} color="#FFF" />
                </View>
                <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Receive</Text>
              </TouchableOpacity>
              <View style={[styles.actionDivider, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('BankConvert')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                  <MaterialIcons name="currency-exchange" size={24} color="#FFF" />
                </View>
                <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Convert</Text>
              </TouchableOpacity>
            </View>

            {/* === QUICK ACTIONS GRID (Bank View) === */}
            {/* 4-column layout mapping through the `QUICK_ACTIONS` array defined at the top */}
            <View style={styles.quickSection}>
              <View style={styles.quickHeader}>
                <Text style={[styles.quickTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AllServices')}
                  style={styles.quickSeeAll}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.quickSeeAllText, { color: colors.primary }]}>See all</Text>
                  <MaterialIcons name="arrow-forward-ios" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.quickGrid}>
                {HOME_QUICK_SERVICES.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.quickItem, { width: ITEM_WIDTH }]}
                    onPress={() => handleQuickService(item)}
                  >
                    <View
                      style={[
                        styles.quickIconBg,
                        {
                          backgroundColor: isDark ? `${item.bg}33` : item.bg,
                        },
                      ]}
                    >
                      <MaterialIcons name={item.icon} size={22} color={item.color} />
                    </View>
                    <Text
                      style={[styles.quickLabel, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Featured carousel: Savings · Refer & earn · Rexi Rewards */}
            <View style={styles.carouselSection}>
              <Text style={[styles.carouselSectionTitle, { color: colors.textPrimary }]}>For you</Text>
              <ScrollView
                horizontal
                pagingEnabled
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  const idx = Math.round(x / width);
                  setCarouselIndex(Math.min(2, Math.max(0, idx)));
                }}
                scrollEventThrottle={16}
              >
                {/* Slide 1 — Savings */}
                <View style={[styles.carouselSlide, { width }]}>
                  <TouchableOpacity
                    style={[styles.promoCard, styles.promoCardSavings, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('SavingsHome')}
                    activeOpacity={0.92}
                  >
                    <View style={styles.promoCardIconLight}>
                      <MaterialIcons name="account-balance" size={26} color={colors.primary} />
                    </View>
                    <View style={styles.promoCardText}>
                      <Text style={styles.promoCardTitle}>Savings</Text>
                      <Text style={styles.promoCardSub} numberOfLines={2}>
                        Earn interest on your goals — start with any amount.
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.9)" />
                  </TouchableOpacity>
                </View>

                {/* Slide 2 — Refer & earn */}
                <View style={[styles.carouselSlide, { width }]}>
                  <TouchableOpacity
                    style={[styles.promoCard, styles.promoCardReferral]}
                    onPress={() => navigation.navigate('ReferralEarn')}
                    activeOpacity={0.92}
                  >
                    <View style={styles.referralSlideInner}>
                      <View style={styles.referralTextBlock}>
                        <Text style={styles.promoCardTitleDark}>Refer & earn</Text>
                        <Text style={styles.promoCardSubDark} numberOfLines={2}>
                          Invite friends and win rewards when they join RexiPay.
                        </Text>
                        <View style={styles.referralCta}>
                          <Text style={styles.referralCtaText}>Refer now</Text>
                        </View>
                      </View>
                      <Image
                        source={require('../../assets/images/thumbs.png')}
                        style={styles.referralSlideImage}
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Slide 3 — Rexi Rewards */}
                <View style={[styles.carouselSlide, { width }]}>
                  <TouchableOpacity
                    style={[styles.promoCard, styles.promoCardRewards]}
                    onPress={() => navigation.navigate('RewardsHub')}
                    activeOpacity={0.92}
                  >
                    <View style={styles.promoCardIconRewards}>
                      <MaterialIcons name="stars" size={26} color="#1DB954" />
                    </View>
                    <View style={styles.promoCardText}>
                      <Text style={styles.promoCardTitleRewards}>Rexi Rewards</Text>
                      <Text style={styles.promoCardSubRewards} numberOfLines={2}>
                        Earn points on bills & transfers — redeem for perks.
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.95)" />
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View style={styles.dotsRow}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      carouselIndex === i ? styles.dotActive : styles.dotInactive,
                      {
                        backgroundColor: carouselIndex === i ? colors.primary : colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </>
        )}

        {homeView === 1 && (
          <>
            {/* Crypto Actions — same card style as Bank Send / Receive / Convert */}
            <View style={[styles.actionCard, { backgroundColor: colors.cardBackground }]}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('SendCrypto')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                  <MaterialIcons name="arrow-upward" size={24} color="#FFF" />
                </View>
                <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Send</Text>
              </TouchableOpacity>
              <View style={[styles.actionDivider, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('CryptoReceive')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#2E63F6' }]}>
                  <MaterialIcons name="arrow-downward" size={24} color="#FFF" />
                </View>
                <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Receive</Text>
              </TouchableOpacity>
              <View style={[styles.actionDivider, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('CryptoSell')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                  <MaterialIcons name="sell" size={24} color="#FFF" />
                </View>
                <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Sell</Text>
              </TouchableOpacity>
            </View>

            {/* === MY ASSETS (Crypto View) === */}
            {/* Displays a hardcoded list of crypto assets (BTC, ETH, etc.) and their fiat values */}
            <View style={styles.assetsSection}>
              <View style={styles.assetsHeader}>
                <Text style={[styles.assetsTitle, { color: colors.textPrimary }]}>My Assets</Text>
                <MaterialIcons name="arrow-forward" size={20} color={colors.textSecondary} />
              </View>
              <View style={[styles.assetsCard, { backgroundColor: colors.cardBackground }]}>
                {[
                  { name: 'Bitcoin', symbol: 'BTC', value: '$230,000', color: '#FF9800', icon: 'currency-bitcoin' },
                  { name: 'Ethereum', symbol: 'ETH', value: '$130,000', color: '#627EEA', icon: 'token' },
                  { name: 'USDT', symbol: 'USDT', value: '$100,000', color: '#26A17B', icon: 'attach-money' },
                  { name: 'Litecoin', symbol: 'LTC', value: '$40,000', color: '#78909C', icon: 'payments' },
                ].map((a, i) => (
                  <View key={i}>
                    <TouchableOpacity style={styles.assetRow}>
                      <View style={[styles.assetIcon, { backgroundColor: `${a.color}20` }]}>
                        <MaterialIcons name={a.icon} size={24} color={a.color} />
                      </View>
                      <View style={styles.assetInfo}>
                        <Text style={[styles.assetName, { color: colors.textPrimary }]}>{a.name}</Text>
                        <Text style={[styles.assetSymbol, { color: colors.textSecondary }]}>{a.symbol}</Text>
                      </View>
                      <Text style={[styles.assetValue, { color: colors.textPrimary }]}>{a.value}</Text>
                    </TouchableOpacity>
                    {i < 3 && <View style={[styles.assetDivider, { backgroundColor: colors.border }]} />}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <AccountSwitcherSheet
        visible={showAccountSheet}
        onClose={() => setShowAccountSheet(false)}
        selectedAccount={selectedAccount}
        onSelect={(acc) => setSelectedAccount(acc.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#2E63F6',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 120, // Extended so blue fills half of action card
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRowLeft: { flex: 1, alignItems: 'flex-start' },
  topRowRight: { flex: 1, alignItems: 'flex-end' },
  toggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 25,
    padding: 4,
    flex: 0,
  },
  toggleOption: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleActive: { backgroundColor: '#2E63F6' },
  toggleText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  rightIcons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  notifBtn: { padding: 4 },
  greeting: { color: '#FFF', fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 30 },
  ngRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 },
  ngFlag: { fontSize: 18 },
  ngText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  balance: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', marginTop: 4 },
  addMoneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
  },
  addMoneyText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  actionCard: {
    marginHorizontal: 20,
    marginTop: -60, // Overlap more - blue fills half
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  actionItem: { alignItems: 'center' },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  actionDivider: { width: 1, height: 30 },
  quickSection: { paddingHorizontal: 20, paddingVertical: 16 },
  quickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickTitle: { fontSize: 18, fontWeight: 'bold' },
  quickSeeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  quickSeeAllText: { fontSize: 14, fontWeight: '600' },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: GAP,
  },
  quickItem: { alignItems: 'center' },
  quickIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { fontSize: 11, fontWeight: '500', marginTop: 6, textAlign: 'center' },
  carouselSection: { marginTop: 8, paddingBottom: 8 },
  carouselSectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 12 },
  carouselSlide: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  promoCard: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 100,
  },
  promoCardSavings: {},
  promoCardIconLight: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCardText: { flex: 1 },
  promoCardTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  promoCardSub: { color: 'rgba(255,255,255,0.92)', fontSize: 12, marginTop: 4, lineHeight: 17 },
  promoCardReferral: {
    backgroundColor: '#FF9800',
    flexDirection: 'column',
    alignItems: 'stretch',
    minHeight: 120,
  },
  referralSlideInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  referralTextBlock: { flex: 1 },
  promoCardTitleDark: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  promoCardSubDark: { color: 'rgba(255,255,255,0.95)', fontSize: 12, marginTop: 6, lineHeight: 16 },
  referralCta: {
    marginTop: 10,
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  referralCtaText: { color: '#FF9800', fontWeight: '700', fontSize: 12 },
  referralSlideImage: { width: 72, height: 72 },
  promoCardRewards: {
    backgroundColor: '#047857',
  },
  promoCardIconRewards: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCardTitleRewards: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  promoCardSubRewards: { color: 'rgba(255,255,255,0.92)', fontSize: 12, marginTop: 4, lineHeight: 17 },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingBottom: 4,
  },
  dot: { height: 6, borderRadius: 3 },
  dotInactive: { width: 6 },
  dotActive: { width: 22 },
  assetsSection: { paddingHorizontal: 20, marginTop: 20 },
  assetsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  assetsTitle: { fontSize: 18, fontWeight: '700' },
  assetsCard: { borderRadius: 20, overflow: 'hidden' },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetInfo: { flex: 1 },
  assetName: { fontSize: 16, fontWeight: '600' },
  assetSymbol: { fontSize: 12, marginTop: 2 },
  assetValue: { fontSize: 16, fontWeight: '600' },
  assetDivider: { height: 1, marginLeft: 76 },
});
