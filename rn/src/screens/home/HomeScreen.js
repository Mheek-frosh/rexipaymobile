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
  const [balanceHidden, setBalanceHidden] = useState(false);

  const firstName = (userName || 'User').split(' ')[0];
  const currentAccount = CURRENCY_ACCOUNTS.find((a) => a.id === selectedAccount) || CURRENCY_ACCOUNTS[0];

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

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
              <View style={styles.avatarContainer}>
                {/* Simulated avatar image */}
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?u=' + firstName }}
                  style={styles.avatarImage}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={[styles.greetingText, { color: colors.textSecondary }]}>Good morning,</Text>
              <View style={styles.nameRow}>
                <Text style={[styles.nameText, { color: colors.textPrimary }]}>{firstName}</Text>
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
            {/* Top row: currency selector + menu */}
            <View style={styles.cardTopRow}>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => setShowAccountSheet(true)}
              >
                <Text style={styles.flagText}>{currentAccount.flag}</Text>
                <Text style={styles.currencyText}>{currentAccount.code} Wallet</Text>
                <MaterialIcons name="keyboard-arrow-down" size={16} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialIcons name="more-vert" size={20} color="rgba(255,255,255,0.85)" />
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

        {/* QUICK ACTIONS ROW */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Actions</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
            <MaterialIcons name="edit" size={14} color="#2E63F6" />
          </TouchableOpacity>
        </View>

        <View style={[styles.quickActionsRow, { backgroundColor: isDark ? '#1F222B' : '#FFFFFF' }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Transfer')}>
            <View style={[styles.actionIconBox, { backgroundColor: isDark ? '#2E63F633' : '#EEF2FF' }]}>
              <MaterialIcons name="arrow-upward" size={24} color="#2E63F6" />
            </View>
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('BankReceive')}>
            <View style={[styles.actionIconBox, { backgroundColor: isDark ? '#10B98133' : '#ECFDF5' }]}>
              <MaterialIcons name="arrow-downward" size={24} color="#10B981" />
            </View>
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('BankConvert')}>
            <View style={[styles.actionIconBox, { backgroundColor: isDark ? '#F59E0B33' : '#FFF7ED' }]}>
              <MaterialIcons name="currency-exchange" size={24} color="#F59E0B" />
            </View>
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Convert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: isDark ? '#8B5CF633' : '#F5F3FF' }]}>
              <MaterialIcons name="qr-code-scanner" size={24} color="#8B5CF6" />
            </View>
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Scan</Text>
          </TouchableOpacity>
        </View>

        {/* PAY & SERVICES */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Pay & Services</Text>
          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See all</Text>
            <MaterialIcons name="chevron-right" size={18} color="#2E63F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          {HOME_QUICK_SERVICES.map((item, index) => (
            <TouchableOpacity key={index} style={styles.serviceItem}>
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
          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See all</Text>
            <MaterialIcons name="chevron-right" size={18} color="#2E63F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {/* Mock Tx 1 */}
          <View style={styles.txItem}>
            <View style={[styles.txIconBox, { backgroundColor: isDark ? '#2E63F633' : '#EEF2FF' }]}>
              <MaterialIcons name="arrow-downward" size={24} color="#2E63F6" />
            </View>
            <View style={styles.txDetails}>
              <Text style={[styles.txTitle, { color: colors.textPrimary }]}>Received from John Doe</Text>
              <Text style={[styles.txTime, { color: colors.textSecondary }]}>Today, 8:45 AM</Text>
            </View>
            <View style={styles.txAmountCol}>
              <Text style={[styles.txAmount, { color: '#10B981' }]}>+ ₦50,000.00</Text>
              <View style={[styles.txStatusPill, { backgroundColor: isDark ? '#10B98133' : '#ECFDF5' }]}>
                <Text style={styles.txStatusText}>Successful</Text>
              </View>
            </View>
          </View>

          {/* Mock Tx 2 */}
          <View style={styles.txItem}>
            <View style={[styles.txIconBox, { backgroundColor: isDark ? '#F59E0B33' : '#FFF7ED' }]}>
              <MaterialIcons name="flash-on" size={24} color="#F59E0B" />
            </View>
            <View style={styles.txDetails}>
              <Text style={[styles.txTitle, { color: colors.textPrimary }]}>Paid Electricity Bill</Text>
              <Text style={[styles.txTime, { color: colors.textSecondary }]}>Yesterday, 2:15 PM</Text>
            </View>
            <View style={styles.txAmountCol}>
              <Text style={[styles.txAmount, { color: colors.textPrimary }]}>- ₦15,000.00</Text>
              <View style={[styles.txStatusPill, { backgroundColor: isDark ? '#10B98133' : '#ECFDF5' }]}>
                <Text style={styles.txStatusText}>Successful</Text>
              </View>
            </View>
          </View>
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
    backgroundColor: '#DDD',
    overflow: 'hidden',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
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
    width: '23%', // approx 4 per row
    marginBottom: 12,
  },
  serviceCard: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  serviceText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10,
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
