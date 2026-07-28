import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../theme/ThemeContext';
import { AccountSwitcherSheet } from '../../components/BottomSheet';
import DraggableQuickActions from '../../components/DraggableQuickActions';
import IosSpinner from '../../components/IosSpinner';
import HomeScreenSkeleton from '../../components/HomeScreenSkeleton';
import { HOME_QUICK_SERVICES } from '../../data/homeServices';

const CURRENCY_ACCOUNTS = [
  { id: 'ngn', name: 'Naira', code: 'NGN', flag: '🇳🇬', balance: '₦250,000.00', symbol: '₦' },
  { id: 'usd', name: 'US Dollar', code: 'USD', flag: '🇺🇸', balance: '$1,250.00', symbol: '$' },
  { id: 'gbp', name: 'British Pound', code: 'GBP', flag: '🇬🇧', balance: '£850.00', symbol: '£' },
];

const { width } = Dimensions.get('window');
const SIDE = 20;
const INITIAL_SKELETON_DURATION = 4000;

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
  const [refreshing, setRefreshing] = useState(false);
  const [rewardIndex, setRewardIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const rewardCarouselRef = useRef(null);

  const REWARD_SLIDES = [
    { id: '1', image: require('../../../assets/images/rewards.png') },
    { id: '2', image: require('../../../assets/images/refer.png') },
    { id: '3', image: require('../../../assets/images/savings.png') },
  ];

  useEffect(() => {
    const startupTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, INITIAL_SKELETON_DURATION);

    return () => clearTimeout(startupTimer);
  }, []);

  useEffect(() => {
    if (REWARD_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setRewardIndex((prev) => {
        const next = (prev + 1) % REWARD_SLIDES.length;
        rewardCarouselRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  }, []);

  // 0: Bank view, 1: Crypto view
  const [homeView, setHomeView] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchingTo, setSwitchingTo] = useState(null);
  const contentFadeAnim = useRef(new Animated.Value(1)).current;

  const handleSwitchMode = () => {
    const target = homeView === 0 ? 'crypto' : 'bank';
    setSwitchingTo(target);
    setIsSwitching(true);
    Animated.timing(contentFadeAnim, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      setHomeView((prev) => (prev === 0 ? 1 : 0));
      setTimeout(() => {
        setIsSwitching(false);
        setSwitchingTo(null);
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      }, 350);
    });
  };

  const [bankQuickActions, setBankQuickActions] = useState([
    { id: 'send', label: 'Send', icon: 'arrow-upward', color: '#2E63F6', bg: '#EEF2FF', route: 'Transfer' },
    { id: 'receive', label: 'Receive', icon: 'arrow-downward', color: '#10B981', bg: '#ECFDF5', route: 'BankReceive' },
    { id: 'convert', label: 'Convert', icon: 'currency-exchange', color: '#F59E0B', bg: '#FFF7ED', route: 'BankConvert' },
    { id: 'scan', label: 'Scan', icon: 'qr-code-scanner', color: '#8B5CF6', bg: '#F5F3FF', route: 'AllServices' },
  ]);

  const [cryptoQuickActions, setCryptoQuickActions] = useState([
    { id: 'send_crypto', label: 'Send', icon: 'arrow-upward', color: '#2E63F6', bg: '#EEF2FF', route: 'SendCrypto' },
    { id: 'receive_crypto', label: 'Receive', icon: 'arrow-downward', color: '#10B981', bg: '#ECFDF5', route: 'CryptoReceive' },
    { id: 'sell_crypto', label: 'Sell', icon: 'sell', color: '#F59E0B', bg: '#FFF7ED', route: 'CryptoSell' },
    { id: 'market', label: 'Market', icon: 'trending-up', color: '#8B5CF6', bg: '#F5F3FF', route: 'CryptoMarket' },
  ]);

  const quickActions = homeView === 0 ? bankQuickActions : cryptoQuickActions;
  const setQuickActions = homeView === 0 ? setBankQuickActions : setCryptoQuickActions;

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
      id: '2',
      name: 'John Doe',
      displayName: 'Received from John Doe',
      type: 'received',
      amount: '50,000.00',
      amountDisplay: '+ ₦50,000.00',
      date: 'Yesterday',
      time: '10:15 AM',
      dateTime: 'Yesterday | 10:15 AM',
      statusDisplay: 'Success',
      status: 'Completed',
      category: 'Transfer',
      txRef: 'RXP982341823',
      ref: 'RXP982341823',
      bank: 'Access Bank',
      account: '0987654321',
    },
  ];

  const cryptoAssetsList = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', priceDisplay: '$94,520.00', changeDisplay: '+2.45%', positive: true, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', priceDisplay: '$3,340.50', changeDisplay: '+1.80%', positive: true, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { id: 'tether', name: 'Tether', symbol: 'usdt', priceDisplay: '$1.00', changeDisplay: '0.00%', positive: true, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
    { id: 'solana', name: 'Solana', symbol: 'sol', priceDisplay: '$185.20', changeDisplay: '-0.95%', positive: false, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  ];

  if (isInitialLoading) {
    return <HomeScreenSkeleton />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 10), paddingBottom: Math.max(insets.bottom, 100) },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={['transparent']}
          />
        }
      >
        {/* PULL TO REFRESH IOS SPINNER (#0F208F) */}
        {refreshing && (
          <View style={styles.pullRefreshBox}>
            <IosSpinner size={34} color="#0F208F" />
            <Text style={[styles.pullRefreshText, { color: colors.textSecondary }]}>Updating dashboard...</Text>
          </View>
        )}

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
            <MaterialIcons name="notifications-none" size={22} color={colors.textPrimary} />
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
            {/* Top row: currency selector & Switch mode button */}
            <View style={styles.cardTopRow}>
              {homeView === 0 ? (
                <TouchableOpacity
                  style={styles.currencySelector}
                  onPress={() => setShowAccountSheet(true)}
                >
                  <Text style={styles.flagText}>{currentAccount.flag}</Text>
                  <Text style={styles.currencyText}>{currentAccount.code} Wallet</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={16} color="#FFF" />
                </TouchableOpacity>
              ) : (
                <View style={styles.currencySelector}>
                  <Text style={styles.flagText}>🪙</Text>
                  <Text style={styles.currencyText}>Crypto Wallet</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.switchModeBtn}
                onPress={handleSwitchMode}
                activeOpacity={0.8}
                disabled={isSwitching}
              >
                <MaterialIcons name="sync" size={14} color="#FFF" />
                <Text style={styles.switchModeText}>Switch</Text>
              </TouchableOpacity>
            </View>

            {/* Balance */}
            <View style={styles.balanceContainer}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>
                  {homeView === 0 ? 'Available Balance' : 'Crypto Portfolio Value'}
                </Text>
                <TouchableOpacity onPress={() => setBalanceHidden(!balanceHidden)}>
                  <MaterialIcons
                    name={balanceHidden ? 'visibility-off' : 'visibility'}
                    size={16}
                    color="rgba(255,255,255,0.75)"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount}>
                {balanceHidden
                  ? (homeView === 0 ? '₦••••••••' : '$••••••••')
                  : (homeView === 0 ? currentAccount.balance : '$12,450.80')}
              </Text>
            </View>

            {/* Action pills */}
            <View style={styles.cardActions}>
              {homeView === 0 ? (
                <>
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
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.cardPill}
                    onPress={() => navigation.navigate('CryptoReceive')}
                  >
                    <View style={styles.pillIconBox}>
                      <MaterialIcons name="arrow-downward" size={14} color="#1E3A8A" />
                    </View>
                    <Text style={styles.pillText}>Receive Crypto</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cardPill}
                    onPress={() => navigation.navigate('CryptoMarket')}
                  >
                    <View style={styles.pillIconBox}>
                      <MaterialIcons name="trending-up" size={14} color="#1E3A8A" />
                    </View>
                    <Text style={styles.pillText}>Crypto Market</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ImageBackground>

        {/* DYNAMIC CONTENT AREA WITH MOTION ANIMATION & #0F208F IOS SPINNER LOADER */}
        {isSwitching ? (
          <View style={styles.switchingLoaderBox}>
            <View style={[styles.spinnerCard, { backgroundColor: isDark ? '#1F222B' : '#FFFFFF' }]}>
              <IosSpinner size={42} color="#0F208F" />
              <Text style={[styles.switchingText, { color: colors.textPrimary }]}>
                {switchingTo === 'crypto' ? 'Switching to Crypto Wallet...' : 'Switching to Bank Wallet...'}
              </Text>
            </View>
          </View>
        ) : (
          <Animated.View style={{ opacity: contentFadeAnim }}>
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

            {homeView === 0 ? (
              <>
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
                      <View style={[styles.txIconBox, { backgroundColor: tx.type === 'received' || tx.type === 'deposit' ? (isDark ? '#2E63F633' : '#EEF2FF') : (isDark ? '#F59E0B33' : '#FFF7ED') }]}>
                        <MaterialIcons name={tx.type === 'received' || tx.type === 'deposit' ? "arrow-downward" : "flash-on"} size={24} color={tx.type === 'received' || tx.type === 'deposit' ? "#2E63F6" : "#F59E0B"} />
                      </View>
                      <View style={styles.txDetails}>
                        <Text style={[styles.txTitle, { color: colors.textPrimary }]}>{tx.displayName || tx.name}</Text>
                        <Text style={[styles.txTime, { color: colors.textSecondary }]}>{tx.dateTime || tx.date}</Text>
                      </View>
                      <View style={styles.txAmountCol}>
                        <Text style={[styles.txAmount, { color: tx.type === 'received' || tx.type === 'deposit' ? '#10B981' : colors.textPrimary }]}>{tx.amountDisplay}</Text>
                        <View style={[styles.txStatusPill, { backgroundColor: isDark ? '#10B98133' : '#ECFDF5' }]}>
                          <Text style={styles.txStatusText}>Successful</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                {/* MY ASSETS (Crypto View) */}
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>My Assets</Text>
                  <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('CryptoMarket')}>
                    <Text style={styles.seeAllText}>See all</Text>
                    <MaterialIcons name="chevron-right" size={18} color="#2E63F6" />
                  </TouchableOpacity>
                </View>

                <View style={[styles.cryptoAssetsCard, { backgroundColor: isDark ? '#1F222B' : '#FFFFFF' }]}>
                  {cryptoAssetsList.map((coin, i) => (
                    <React.Fragment key={coin.id}>
                      <TouchableOpacity
                        style={styles.cryptoRow}
                        onPress={() => navigation.navigate('CryptoAssetDetail', { coinId: coin.id })}
                        activeOpacity={0.75}
                      >
                        <Image source={{ uri: coin.image }} style={styles.coinIcon} />
                        <View style={styles.coinInfo}>
                          <Text style={[styles.coinName, { color: colors.textPrimary }]}>{coin.name}</Text>
                          <Text style={[styles.coinSymbol, { color: colors.textSecondary }]}>{coin.symbol.toUpperCase()}</Text>
                        </View>
                        <View style={styles.coinPriceCol}>
                          <Text style={[styles.coinPrice, { color: colors.textPrimary }]}>{coin.priceDisplay}</Text>
                          <Text style={[styles.coinChange, { color: coin.positive ? '#10B981' : '#EF4444' }]}>
                            {coin.changeDisplay}
                          </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                      {i < cryptoAssetsList.length - 1 && (
                        <View style={[styles.assetDivider, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* REWARDS CAROUSEL — Bank view only */}
        {homeView === 0 && (
          <View style={styles.rewardCarouselContainer}>
            <FlatList
              ref={rewardCarouselRef}
              data={REWARD_SLIDES}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(
                  e.nativeEvent.contentOffset.x / (width - 40)
                );
                setRewardIndex(newIndex);
              }}
              renderItem={({ item }) => (
                <Image
                  source={item.image}
                  style={styles.rewardSlideImage}
                  resizeMode="cover"
                />
              )}
            />
          </View>
        )}

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
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitial: {
    fontSize: 15,
    fontWeight: '700',
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 11,
    marginBottom: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
  },
  waveEmoji: {
    fontSize: 13,
    marginLeft: 3,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#1A3FAB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 8,
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  cardOverlay: {
    backgroundColor: 'rgba(15, 40, 120, 0.45)',
    borderRadius: 20,
    padding: 16,
    paddingBottom: 18,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  switchModeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginRight: 6,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 26,
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
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillIconBox: {
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  pillText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
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
    marginBottom: 20,
    padding: 12,
    borderRadius: 20,
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
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceItem: {
    width: '23.5%',
    marginBottom: 10,
  },
  serviceCard: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceText: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  transactionsList: {
    marginBottom: 12,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  txIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  txTime: {
    fontSize: 11,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
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
  },
  cryptoAssetsCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cryptoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: 15,
    fontWeight: '600',
  },
  coinSymbol: {
    fontSize: 12,
    marginTop: 2,
  },
  coinPriceCol: {
    alignItems: 'flex-end',
    marginRight: 6,
  },
  coinPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  coinChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  assetDivider: {
    height: 1,
    marginLeft: 52,
  },
  switchingLoaderBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerCard: {
    paddingHorizontal: 28,
    paddingVertical: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  switchingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  pullRefreshBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  pullRefreshText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  rewardCarouselContainer: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 14,
  },
  rewardSlideImage: {
    width: width - 40,
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
  },
  rewardDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 5,
  },
  rewardDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  rewardDotActive: {
    width: 16,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2E63F6',
  },
});
