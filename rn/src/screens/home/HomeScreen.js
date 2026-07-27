import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../theme/ThemeContext';
import { AccountSwitcherSheet } from '../../components/BottomSheet';
import DraggableQuickActions from '../../components/DraggableQuickActions';
import { HOME_QUICK_SERVICES } from '../../data/homeServices';

const CURRENCY_ACCOUNTS = [
  { id: 'ngn', name: 'Naira', code: 'NGN', flag: '🇳🇬', balance: '₦250,000.00', symbol: '₦' },
  { id: 'usd', name: 'US Dollar', code: 'USD', flag: '🇺🇸', balance: '$1,250.00', symbol: '$' },
  { id: 'gbp', name: 'British Pound', code: 'GBP', flag: '🇬🇧', balance: '£850.00', symbol: '£' },
];

const { width } = Dimensions.get('window');
const SIDE = 20;

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { userName } = useAuth();
  const { notifications } = useNotifications();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [selectedAccount, setSelectedAccount] = useState('ngn');
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [isEditingQuickActions, setIsEditingQuickActions] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);

  const [quickActions, setQuickActions] = useState([
    { id: 'send', label: 'Send', icon: 'arrow-upward', color: '#2E63F6', bg: '#EEF2FF', route: 'Transfer' },
    { id: 'receive', label: 'Receive', icon: 'arrow-downward', color: '#10B981', bg: '#ECFDF5', route: 'BankReceive' },
    { id: 'convert', label: 'Convert', icon: 'currency-exchange', color: '#F59E0B', bg: '#FFF7ED', route: 'BankConvert' },
    { id: 'scan', label: 'Scan', icon: 'qr-code-scanner', color: '#8B5CF6', bg: '#F5F3FF', route: 'AllServices' },
  ]);

  const firstName = (userName || 'User').split(' ')[0];
  const nameParts = String(userName || 'User')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || 'MU';

  const currentAccount = CURRENCY_ACCOUNTS.find((a) => a.id === selectedAccount) || CURRENCY_ACCOUNTS[0];

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const handleQuickService = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
      return;
    }
    navigation.navigate('AllServices');
  };

  const mockTransactions = [
    {
      id: '1',
      name: 'Received from John Doe',
      type: 'deposit',
      amountDisplay: '+ ₦50,000.00',
      date: 'Today, 8:45 AM',
      timestamp: 'Today, 8:45 AM',
      statusDisplay: 'Success',
      status: 'completed',
      category: 'Transfer',
      txRef: 'TX-982341823',
    },
    {
      id: '2',
      name: 'Paid Electricity Bill',
      type: 'electricity',
      amountDisplay: '- ₦15,000.00',
      date: 'Yesterday, 2:15 PM',
      timestamp: 'Yesterday, 2:15 PM',
      statusDisplay: 'Success',
      status: 'completed',
      category: 'Bills',
      txRef: 'TX-773192041',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 10), paddingBottom: Math.max(insets.bottom, 100) },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.navigate('AccountDetails')}>
              <View style={[styles.avatarContainer, { backgroundColor: isDark ? '#2C2F3A' : '#E5E7EB' }]}>
                <Text style={[styles.avatarInitial, { color: colors.textPrimary }]}>{initials}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={[styles.greetingText, { color: colors.textSecondary }]}>Good morning,</Text>
              <View style={styles.nameRow}>
                <Text style={[styles.nameText, { color: colors.textPrimary }]}>{firstName}</Text>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={[styles.notifBtn, { backgroundColor: isDark ? '#1F222B' : '#EEF2FF' }]}
          >
            <MaterialIcons name="notifications-none" size={24} color={colors.textPrimary} />
            {unreadNotificationCount > 0 && (
              <View style={styles.notifBadge} />
            )}
          </TouchableOpacity>
        </View>

        {/* WALLET IMAGE CARD — wallet.png is the card itself */}
        <ImageBackground
          source={require('../../../assets/images/wallet.png')}
          style={styles.cardContainer}
          imageStyle={styles.cardImageStyle}
          resizeMode="cover"
        >
          {/* Overlay to ensure text is legible */}
          <View style={styles.cardOverlay}>
            {/* Top row: currency selector */}
            <View style={styles.cardTopRow}>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => setShowAccountSheet(true)}
              >
                <Text style={styles.flagText}>{currentAccount.flag}</Text>
                <Text style={styles.currencyText}>{currentAccount.code} Wallet</Text>
                <MaterialIcons name="keyboard-arrow-down" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Balance */}
            <View style={styles.balanceContainer}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <TouchableOpacity onPress={() => setBalanceHidden(!balanceHidden)}>
                  <MaterialIcons
                    name={balanceHidden ? 'visibility-off' : 'visibility'}
                    size={16}
                    color="rgba(255,255,255,0.75)"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount}>
                {balanceHidden ? '₦••••••••' : currentAccount.balance}
              </Text>
            </View>

            {/* Action pills */}
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.cardPill}
                onPress={() => navigation.navigate('AddMoney')}
              >
                <View style={styles.pillIconBox}>
                  <MaterialIcons name="add" size={14} color="#1E3A8A" />
                </View>
                <Text style={styles.pillText}>Add Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cardPill}
                onPress={() => navigation.navigate('AccountDetails')}
              >
                <View style={styles.pillIconBox}>
                  <MaterialIcons name="credit-card" size={14} color="#1E3A8A" />
                </View>
                <Text style={styles.pillText}>Account Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* QUICK ACTIONS ROW (Press & Hold Drag-to-Reorder) */}
        <DraggableQuickActions
          quickActions={quickActions}
          setQuickActions={setQuickActions}
          isEditing={isEditingQuickActions}
          setIsEditing={setIsEditingQuickActions}
          isDark={isDark}
          colors={colors}
          navigation={navigation}
        />

        {/* PAY & SERVICES */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Pay & Services</Text>
          <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('AllServices')}>
            <Text style={styles.seeAllText}>See all</Text>
            <MaterialIcons name="chevron-right" size={18} color="#2E63F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          {HOME_QUICK_SERVICES.map((item, index) => (
            <TouchableOpacity key={index} style={styles.serviceItem} onPress={() => handleQuickService(item)}>
              <View style={[styles.serviceCard, { backgroundColor: isDark ? '#1F222B' : '#FFFFFF' }]}>
                <MaterialIcons name={item.icon} size={28} color={item.color} />
                <Text style={[styles.serviceText, { color: colors.textPrimary }]} numberOfLines={1}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* RECENT TRANSACTIONS */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Transactions</Text>
          <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAllText}>See all</Text>
            <MaterialIcons name="chevron-right" size={18} color="#2E63F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {mockTransactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.txItem}
              onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
              activeOpacity={0.75}
            >
              <View style={[styles.txIconBox, { backgroundColor: tx.type === 'deposit' ? (isDark ? '#2E63F633' : '#EEF2FF') : (isDark ? '#F59E0B33' : '#FFF7ED') }]}>
                <MaterialIcons name={tx.type === 'deposit' ? "arrow-downward" : "flash-on"} size={24} color={tx.type === 'deposit' ? "#2E63F6" : "#F59E0B"} />
              </View>
              <View style={styles.txDetails}>
                <Text style={[styles.txTitle, { color: colors.textPrimary }]}>{tx.name}</Text>
                <Text style={[styles.txTime, { color: colors.textSecondary }]}>{tx.date}</Text>
              </View>
              <View style={styles.txAmountCol}>
                <Text style={[styles.txAmount, { color: tx.type === 'deposit' ? '#10B981' : colors.textPrimary }]}>{tx.amountDisplay}</Text>
                <View style={[styles.txStatusPill, { backgroundColor: isDark ? '#10B98133' : '#ECFDF5' }]}>
                  <Text style={styles.txStatusText}>Successful</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
  scrollContent: {
    paddingHorizontal: SIDE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 13,
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  waveEmoji: {
    fontSize: 16,
    marginLeft: 4,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E63F6',
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 28,
    shadowColor: '#1A3FAB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  cardOverlay: {
    backgroundColor: 'rgba(15, 40, 120, 0.45)', // Subtle dark overlay so text pops
    borderRadius: 24,
    padding: 20,
    paddingBottom: 24,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  flagText: {
    fontSize: 16,
    marginRight: 6,
  },
  currencyText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  balanceContainer: {
    marginBottom: 30,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginRight: 8,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillIconBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  pillText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    color: '#2E63F6',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#2E63F6',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  reorderHintBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  reorderHintText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionBtnContainer: {
    flex: 1,
    alignItems: 'center',
  },
  inlineArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 4,
  },
  miniArrowBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 99, 246, 0.12)',
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  serviceItem: {
    width: '23.5%', // slightly wider for better proportions
    marginBottom: 12,
  },
  serviceCard: {
    alignItems: 'center',
    paddingVertical: 12, // reduced height as requested
    paddingHorizontal: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceText: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  transactionsList: {
    marginBottom: 20,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  txIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  txTime: {
    fontSize: 13,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  txStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  txStatusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  }
});
