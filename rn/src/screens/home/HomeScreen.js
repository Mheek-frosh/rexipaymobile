import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatNairaBalance, useWallet } from '../../context/WalletContext';
import { AccountSwitcherSheet } from '../../components/BottomSheet';
import { useTheme } from '../../theme/ThemeContext';
import { LIME_DARK, LIME_LIGHT } from '../../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PROMO_CARDS = [
  {
    id: 'send',
    title: 'Send Money',
    subtitle: 'Fast, secure, anywhere',
    icon: 'near-me',
    route: 'Transfer',
  },
  {
    id: 'refer',
    title: 'Refer & Earn',
    subtitle: 'Invite friends and get rewarded',
    icon: 'card-giftcard',
    route: 'ReferralEarn',
  },
  {
    id: 'cash',
    title: 'Crypto to Cash',
    subtitle: 'Convert crypto into naira',
    icon: 'currency-exchange',
    route: 'CryptoSell',
  },
];

function PromoCard({ item, onPress, styles }) {
  return (
    <TouchableOpacity style={styles.sendButton} activeOpacity={0.88} onPress={onPress}>
      <View style={styles.sendIcon}>
        <MaterialIcons name={item.icon} size={18} color={LIME_DARK.text} />
      </View>
      <View style={styles.sendCopy}>
        <Text style={styles.sendTitle}>{item.title}</Text>
        <Text style={styles.sendSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.sendArrow}>
        <MaterialIcons name="arrow-forward" size={18} color={LIME_DARK.onLime} />
      </View>
    </TouchableOpacity>
  );
}

function PromoCarousel({ onOpen, styles }) {
  const [index, setIndex] = useState(0);
  const shift = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);
  const travel = SCREEN_WIDTH - 32;

  useEffect(() => {
    let active = true;
    const timer = setInterval(() => {
      Animated.timing(shift, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!active || !finished) return;
        indexRef.current = (indexRef.current + 1) % PROMO_CARDS.length;
        setIndex(indexRef.current);
        shift.setValue(0);
      });
    }, 3200);
    return () => {
      active = false;
      clearInterval(timer);
      shift.stopAnimation();
    };
  }, [shift]);

  const nextIndex = (index + 1) % PROMO_CARDS.length;
  const currentX = shift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -travel],
  });
  const incomingX = shift.interpolate({
    inputRange: [0, 1],
    outputRange: [travel, 0],
  });

  return (
    <View style={styles.promoViewport}>
      <Animated.View style={{ transform: [{ translateX: currentX }] }}>
        <PromoCard
          item={PROMO_CARDS[index]}
          styles={styles}
          onPress={() => onOpen(PROMO_CARDS[index].route)}
        />
      </Animated.View>
      <Animated.View style={[styles.promoIncoming, { transform: [{ translateX: incomingX }] }]}>
        <PromoCard
          item={PROMO_CARDS[nextIndex]}
          styles={styles}
          onPress={() => onOpen(PROMO_CARDS[nextIndex].route)}
        />
      </Animated.View>
    </View>
  );
}

const QUICK_ACTIONS = [
  { id: 'airtime', label: 'Buy Airtime', icon: 'smartphone', route: 'Airtime' },
  { id: 'bills', label: 'Pay Bills', icon: 'description', route: 'AllServices' },
  { id: 'transfer', label: 'Transfer', icon: 'swap-horiz', route: 'Transfer' },
  { id: 'crypto', label: 'Buy Crypto', icon: 'currency-bitcoin', route: 'CryptoMarket' },
  { id: 'more', label: 'More', icon: 'apps', route: 'AllServices' },
];

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export default function HomeScreen() {
  const { isDark } = useTheme();
  const ui = isDark ? LIME_DARK : LIME_LIGHT;
  const styles = useMemo(() => createStyles(ui), [ui]);
  const { userName } = useAuth();
  const { notifications } = useNotifications();
  const { ngnBalance } = useWallet();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('ngn');
  const [homeView, setHomeView] = useState(0);

  const firstName = (userName || 'Alex').split(' ')[0];
  const nameParts = String(userName || 'Alex').trim().split(/\s+/).filter(Boolean);
  const initials = nameParts.slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || 'A';
  const unreadNotificationCount = notifications.filter((item) => !item.read).length;
  const accounts = useMemo(() => ([
    { id: 'ngn', name: 'Naira', code: 'NGN', flag: '🇳🇬', balance: formatNairaBalance(ngnBalance), symbol: '₦' },
    { id: 'usd', name: 'US Dollar', code: 'USD', flag: '🇺🇸', balance: '$1,500.00', symbol: '$' },
    { id: 'gbp', name: 'British Pound', code: 'GBP', flag: '🇬🇧', balance: '£1,000.00', symbol: '£' },
  ]), [ngnBalance]);
  const currentAccount = accounts.find((account) => account.id === selectedAccount) || accounts[0];
  const balanceLabel = balanceHidden
    ? (homeView === 0 ? `${currentAccount.symbol}••••••` : '$••••••')
    : homeView === 0
      ? (currentAccount.id === 'ngn' ? formatNairaBalance(ngnBalance) : currentAccount.balance)
      : '$12,450.80';

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const transactions = [
    {
      id: 'rx-1',
      name: 'John Doe',
      displayName: 'Received from John Doe',
      subtitle: 'Today, 8:45 AM',
      amountDisplay: '+ ₦ 50,000',
      positive: true,
      icon: 'south',
      type: 'received',
      amount: '50,000.00',
      date: 'Today',
      time: '8:45 AM',
      status: 'Completed',
      bank: 'Access Bank',
      account: '0987654321',
      ref: 'RXP982341823',
    },
    {
      id: 'rx-2',
      name: 'Bright Tech',
      displayName: 'Sent to Bright Tech',
      subtitle: 'Yesterday, 4:32 PM',
      amountDisplay: '- ₦ 20,000',
      positive: false,
      icon: 'north',
      type: 'sent',
      amount: '20,000.00',
      date: 'Yesterday',
      time: '4:32 PM',
      status: 'Completed',
      bank: 'GTBank',
      account: '0123456789',
      ref: 'RXP982341824',
    },
    {
      id: 'rx-3',
      name: 'Bitcoin',
      displayName: 'Crypto Purchase (BTC)',
      subtitle: 'Sept 28, 2025, 1:12 PM',
      amountDisplay: '- ₦ 150,000',
      positive: false,
      icon: 'currency-bitcoin',
      type: 'sent',
      amount: '150,000.00',
      date: 'Sept 28, 2025',
      time: '1:12 PM',
      status: 'Completed',
      bank: 'RexiPay',
      account: 'Crypto',
      ref: 'RXP982341825',
    },
    {
      id: 'rx-4',
      name: 'Airtime',
      displayName: 'Airtime Purchase',
      subtitle: 'Sept 27, 2025, 7:09 PM',
      amountDisplay: '- ₦ 5,000',
      positive: false,
      icon: 'smartphone',
      type: 'sent',
      amount: '5,000.00',
      date: 'Sept 27, 2025',
      time: '7:09 PM',
      status: 'Completed',
      bank: 'MTN',
      account: 'Airtime',
      ref: 'RXP982341826',
    },
    {
      id: 'rx-5',
      name: 'Adaeze Okonkwo',
      displayName: 'Adaeze Okonkwo',
      subtitle: 'Today, 10:30 AM',
      amountDisplay: '+ ₦ 367,000',
      positive: true,
      icon: 'south',
      type: 'received',
      amount: '367,000.00',
      date: 'Today',
      time: '10:30 AM',
      status: 'Completed',
      bank: 'Opay',
      account: '8123456789',
      ref: 'RXP982341827',
    },
    {
      id: 'rx-6',
      name: 'Tunde Bakare',
      displayName: 'Tunde Bakare',
      subtitle: 'Today, 9:14 AM',
      amountDisplay: '- ₦ 90,800',
      positive: false,
      icon: 'north',
      type: 'sent',
      amount: '90,800.00',
      date: 'Today',
      time: '9:14 AM',
      status: 'Completed',
      bank: 'GTBank',
      account: '0234567891',
      ref: 'RXP982341828',
    },
    {
      id: 'rx-7',
      name: 'Chioma Adeyemi',
      displayName: 'Chioma Adeyemi',
      subtitle: 'Today, 7:02 AM',
      amountDisplay: '- ₦ 45,000',
      positive: false,
      icon: 'north',
      type: 'sent',
      amount: '45,000.00',
      date: 'Today',
      time: '7:02 AM',
      status: 'Completed',
      bank: 'Kuda',
      account: '2012345678',
      ref: 'RXP982341829',
    },
    {
      id: 'rx-8',
      name: 'Payroll',
      displayName: 'Salary credit',
      subtitle: 'Yesterday, 8:00 AM',
      amountDisplay: '+ ₦ 420,000',
      positive: true,
      icon: 'account-balance',
      type: 'received',
      amount: '420,000.00',
      date: 'Yesterday',
      time: '8:00 AM',
      status: 'Completed',
      bank: 'RexiPay',
      account: 'Payroll',
      ref: 'RXP982341830',
    },
    {
      id: 'rx-9',
      name: 'Netflix',
      displayName: 'Netflix',
      subtitle: 'Yesterday, 6:18 PM',
      amountDisplay: '- ₦ 4,500',
      positive: false,
      icon: 'subscriptions',
      type: 'sent',
      amount: '4,500.00',
      date: 'Yesterday',
      time: '6:18 PM',
      status: 'Completed',
      bank: 'Card',
      account: 'Subscription',
      ref: 'RXP982341831',
    },
    {
      id: 'rx-10',
      name: 'Mum',
      displayName: 'Sent to Mum',
      subtitle: 'Sept 26, 2025, 2:40 PM',
      amountDisplay: '- ₦ 15,000',
      positive: false,
      icon: 'north',
      type: 'sent',
      amount: '15,000.00',
      date: 'Sept 26, 2025',
      time: '2:40 PM',
      status: 'Completed',
      bank: 'UBA',
      account: '2098765432',
      ref: 'RXP982341832',
    },
    {
      id: 'rx-11',
      name: 'Shoprite',
      displayName: 'Shoprite POS',
      subtitle: 'Sept 26, 2025, 11:05 AM',
      amountDisplay: '- ₦ 28,750',
      positive: false,
      icon: 'storefront',
      type: 'sent',
      amount: '28,750.00',
      date: 'Sept 26, 2025',
      time: '11:05 AM',
      status: 'Completed',
      bank: 'POS',
      account: 'Shoprite',
      ref: 'RXP982341833',
    },
    {
      id: 'rx-12',
      name: 'Refund',
      displayName: 'Card refund',
      subtitle: 'Sept 25, 2025, 3:22 PM',
      amountDisplay: '+ ₦ 8,200',
      positive: true,
      icon: 'south',
      type: 'received',
      amount: '8,200.00',
      date: 'Sept 25, 2025',
      time: '3:22 PM',
      status: 'Completed',
      bank: 'RexiPay',
      account: 'Card',
      ref: 'RXP982341834',
    },
  ];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 8) + 4,
          paddingBottom: Math.max(insets.bottom, 12) + 96,
          paddingHorizontal: 16,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ui.lime}
            colors={[ui.lime]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.greeting}>{greetingForNow()}</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AccountDetails')}
              style={styles.avatar}
              accessibilityLabel="Account details"
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={styles.bell}
              accessibilityLabel="Notifications"
            >
              <MaterialIcons name="notifications-none" size={18} color={ui.text} />
              {unreadNotificationCount > 0 ? <View style={styles.bellDot} /> : null}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.cardTopRow}>
            {homeView === 0 ? (
              <TouchableOpacity
                style={styles.walletChip}
                onPress={() => setShowAccountSheet(true)}
                accessibilityLabel={`${currentAccount.code} wallet`}
              >
                <Text style={styles.walletFlag}>{currentAccount.flag}</Text>
                <Text style={styles.walletChipText}>{currentAccount.code} Wallet</Text>
                <MaterialIcons name="keyboard-arrow-down" size={18} color={LIME_DARK.text} />
              </TouchableOpacity>
            ) : (
              <View style={styles.walletChip}>
                <Text style={styles.walletFlag}>🪙</Text>
                <Text style={styles.walletChipText}>Crypto Wallet</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => setHomeView((view) => (view === 0 ? 1 : 0))}
              accessibilityLabel="Switch wallet"
            >
              <MaterialIcons name="sync" size={16} color={LIME_DARK.text} />
              <Text style={styles.switchText}>Switch</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceLabelRow}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <TouchableOpacity
              onPress={() => setBalanceHidden((hidden) => !hidden)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={balanceHidden ? 'Show balance' : 'Hide balance'}
            >
              <MaterialIcons
                name={balanceHidden ? 'visibility-off' : 'visibility'}
                size={18}
                color="rgba(255,255,255,0.72)"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{balanceLabel}</Text>

          <View style={styles.cardActions}>
            {homeView === 0 ? (
              <>
                <TouchableOpacity
                  style={styles.cardPill}
                  onPress={() => navigation.navigate('AddMoney')}
                >
                  <MaterialIcons name="add" size={18} color={ui.onLime} />
                  <Text style={styles.cardPillText}>Add Money</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cardPill}
                  onPress={() => navigation.navigate('AccountDetails')}
                >
                  <MaterialIcons name="credit-card" size={16} color={ui.onLime} />
                  <Text style={styles.cardPillText}>Account Details</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.cardPill}
                  onPress={() => navigation.navigate('CryptoReceive')}
                >
                  <MaterialIcons name="arrow-downward" size={16} color={ui.onLime} />
                  <Text style={styles.cardPillText}>Receive Crypto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cardPill}
                  onPress={() => navigation.navigate('CryptoMarket')}
                >
                  <MaterialIcons name="trending-up" size={16} color={ui.onLime} />
                  <Text style={styles.cardPillText}>Crypto Market</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <PromoCarousel styles={styles} onOpen={(route) => navigation.navigate(route)} />

        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              onPress={() => navigation.navigate(action.route)}
              accessibilityLabel={action.label}
            >
              <View style={styles.actionBubble}>
                <MaterialIcons name={action.icon} size={20} color={ui.accentText} />
              </View>
              <Text style={styles.actionLabel} numberOfLines={2}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.txCard}>
          <View style={styles.txHeader}>
            <Text style={styles.txTitle}>Recent Transactions</Text>
            <TouchableOpacity
              style={styles.seeAll}
              onPress={() => navigation.navigate('Transactions')}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <MaterialIcons name="chevron-right" size={18} color={ui.accentText} />
            </TouchableOpacity>
          </View>
          {transactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.txRow}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
            >
              <View style={styles.txIcon}>
                <MaterialIcons name={tx.icon} size={18} color={ui.onLime} />
              </View>
              <View style={styles.txCopy}>
                <Text style={styles.txName} numberOfLines={1}>{tx.displayName}</Text>
                <Text style={styles.txMeta}>{tx.subtitle}</Text>
              </View>
              <Text style={[styles.txAmount, tx.positive ? styles.txAmountIn : styles.txAmountOut]}>
                {tx.amountDisplay}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <AccountSwitcherSheet
        visible={showAccountSheet}
        onClose={() => setShowAccountSheet(false)}
        selectedAccount={selectedAccount}
        onSelect={(account) => setSelectedAccount(account.id)}
        accounts={accounts}
      />
    </View>
  );
}

function createStyles(ui) {
  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ui.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    color: ui.muted,
    fontSize: 13,
    marginBottom: 1,
  },
  name: {
    color: ui.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2A2A2A',
    borderWidth: 2,
    borderColor: ui.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: LIME_DARK.text,
    fontWeight: '700',
    fontSize: 13,
  },
  bell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ui.bubble,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ui.lime,
  },
  balanceCard: {
    backgroundColor: LIME_DARK.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: LIME_DARK.cardBorder,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  walletFlag: {
    fontSize: 16,
  },
  walletChipText: {
    color: LIME_DARK.text,
    fontSize: 13,
    fontWeight: '700',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  switchText: {
    color: LIME_DARK.text,
    fontSize: 13,
    fontWeight: '600',
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
  },
  balanceAmount: {
    color: LIME_DARK.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  cardPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ui.lime,
    borderRadius: 999,
    minHeight: 40,
    paddingHorizontal: 12,
  },
  cardPillText: {
    color: ui.onLime,
    fontSize: 13,
    fontWeight: '700',
  },
  promoViewport: {
    marginTop: 12,
    overflow: 'hidden',
  },
  promoIncoming: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  sendButton: {
    backgroundColor: ui.lime,
    borderRadius: 999,
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ui.onLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCopy: {
    flex: 1,
    marginLeft: 12,
  },
  sendTitle: {
    color: ui.onLime,
    fontSize: 15,
    fontWeight: '700',
  },
  sendSubtitle: {
    color: 'rgba(16,16,16,0.62)',
    fontSize: 13,
    marginTop: 1,
  },
  sendArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(16,16,16,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  actionItem: {
    width: '18%',
    alignItems: 'center',
  },
  actionBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ui.bubble,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: ui.muted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  txCard: {
    backgroundColor: ui.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ui.cardBorder,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 6,
  },
  txHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  txTitle: {
    color: ui.text,
    fontSize: 16,
    fontWeight: '700',
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: ui.accentText,
    fontWeight: '600',
    fontSize: 14,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ui.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txCopy: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  txName: {
    color: ui.text,
    fontSize: 14,
    fontWeight: '600',
  },
  txMeta: {
    color: ui.muted,
    fontSize: 12,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  txAmountIn: {
    color: ui.accentText,
  },
  txAmountOut: {
    color: ui.amountOut,
  },
});
}
