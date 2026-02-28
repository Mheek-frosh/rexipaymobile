import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { AccountSwitcherSheet } from '../components/BottomSheet';

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

const QUICK_ACTIONS = [
  { icon: 'wifi-off', label: 'Offline Pay', color: '#10B981', bg: '#E8F5E9', route: 'OfflinePay' },
  { icon: 'wifi', label: 'Airtime', color: '#FF9800', bg: '#FFF3E0', route: 'Airtime' },
  { icon: 'public', label: 'Internet', color: '#4CAF50', bg: '#E8F5E9', route: null },
  { icon: 'bolt', label: 'Electricity', color: '#FFC107', bg: '#FFFDE7', route: null },
  { icon: 'receipt-long', label: 'History', color: '#FF9800', bg: '#FFF8E1', route: 'Transactions' },
  { icon: 'shopping-cart', label: 'Shopping', color: '#9C27B0', bg: '#F3E5F5', route: null },
  { icon: 'volunteer-activism', label: 'Deals', color: '#E91E63', bg: '#FCE4EC', route: null },
  { icon: 'health-and-safety', label: 'Health', color: '#4CAF50', bg: '#E8F5E9', route: null },
  { icon: 'beach-access', label: 'Insurance', color: '#00BCD4', bg: '#E0F7FA', route: null },
];

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { userName } = useAuth();
  const navigation = useNavigation();
  const [homeView, setHomeView] = useState(0); // 0: Bank, 1: Crypto
  const [selectedAccount, setSelectedAccount] = useState('ngn');
  const [showAccountSheet, setShowAccountSheet] = useState(false);

  const firstName = (userName || 'User').split(' ')[0];
  const currentAccount = CURRENCY_ACCOUNTS.find((a) => a.id === selectedAccount) || CURRENCY_ACCOUNTS[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Blue Header - extends down to overlap half of action card */}
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
          <TouchableOpacity
            style={styles.ngRow}
            onPress={() => setShowAccountSheet(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.ngFlag}>{currentAccount.flag}</Text>
            <Text style={styles.ngText}>{currentAccount.code} {currentAccount.name}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

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

            {/* Quick Actions - 4 columns, proper grid */}
            <View style={styles.quickSection}>
              <View style={styles.quickHeader}>
                <Text style={[styles.quickTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
                <MaterialIcons name="arrow-forward-ios" size={14} color="#9E9E9E" />
              </View>
              <View style={styles.quickGrid}>
                {QUICK_ACTIONS.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.quickItem, { width: ITEM_WIDTH }]}
                    onPress={() => {
                      if (item.route === 'Airtime') navigation.navigate('Airtime');
                      if (item.route === 'Transactions') navigation.navigate('Transactions');
                      if (item.route === 'OfflinePay') navigation.navigate('OfflinePay');
                    }}
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

            {/* Referral Banner */}
            <View style={styles.referralBanner}>
              <View style={styles.referralContent}>
                <Text style={styles.referralTitle}>Refer and Earn</Text>
                <Text style={styles.referralSub}>
                  Refer your friend and win crypto coins
                </Text>
                <TouchableOpacity style={styles.referralBtn}>
                  <Text style={styles.referralBtnText}>Refer Now</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.referralEmoji}>👍</Text>
            </View>
          </>
        )}

        {homeView === 1 && (
          <>
            {/* Crypto Actions */}
            <View style={[styles.cryptoActionCard, { backgroundColor: colors.cardBackground }]}>
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

            {/* My Assets */}
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
  quickHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quickTitle: { fontSize: 18, fontWeight: 'bold' },
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
  referralBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 14,
    backgroundColor: '#FF9800',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralContent: { flex: 1 },
  referralTitle: { color: '#FFF', fontWeight: '600', fontSize: 15 },
  referralSub: { color: 'rgba(255,255,255,0.95)', fontSize: 12, marginTop: 6, lineHeight: 16 },
  referralBtn: { marginTop: 10, backgroundColor: '#FFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start' },
  referralBtnText: { color: '#FF9800', fontWeight: '600', fontSize: 12 },
  referralEmoji: { fontSize: 40 },
  cryptoActionCard: {
    marginHorizontal: 20,
    marginTop: -60,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
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
