import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  getWalletState,
  computeAvailableBalance,
  recordOfflineDebit,
  recordOfflineCredit,
} from '../services/offlineWalletService';
import {
  addNetworkListener,
  syncPendingTransactions,
  fetchAndReconcileWallet,
  isConnected,
} from '../services/offlineSyncService';
import PinEntryModal from '../components/PinEntryModal';

const DEFAULT_CURRENCY = 'NGN';
const SYMBOL = { NGN: '₦' };

function formatTime(ts) {
  if (!ts) return 'Never';
  return new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function formatBalance(amount) {
  return SYMBOL[amount?.currency || 'NGN'] + Number(amount || 0).toLocaleString();
}

export default function OfflinePayScreen() {
  const { colors } = useTheme();
  const { user, userPhone, userName } = useAuth();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();

  const [walletState, setWalletState] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | synced | error
  const [mode, setMode] = useState('main'); // main | scan_receiver | scan_tx | enter_amount | receive | success
  const [receiverData, setReceiverData] = useState(null);
  const [amount, setAmount] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [successTx, setSuccessTx] = useState(null);
  const [manualReceiverId, setManualReceiverId] = useState('');
  const scaleAnim = useState(new Animated.Value(0))[0];

  const userId = user?.phone || userPhone || 'user-' + Date.now();
  const receiverId = receiverData?.userId || manualReceiverId;

  const loadWallet = useCallback(async () => {
    const state = await getWalletState();
    setWalletState(state);
  }, []);

  useEffect(() => {
    loadWallet();
    const unsub = addNetworkListener((online) => {
      setIsOnline(online);
      if (online && syncStatus === 'idle') setSyncStatus('syncing');
    });
    return unsub;
  }, [loadWallet]);

  useEffect(() => {
    if (!isOnline) return;
    let cancelled = false;
    setSyncing(true);
    (async () => {
      try {
        const res = await syncPendingTransactions();
        if (cancelled) return;
        if (res.success) {
          await fetchAndReconcileWallet(userId);
          if (cancelled) return;
        }
        setSyncStatus(res.success ? 'synced' : 'error');
        await loadWallet();
      } catch (_) {
        if (!cancelled) setSyncStatus('error');
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isOnline, userId, loadWallet]);

  const availableBalance = walletState
    ? computeAvailableBalance(walletState, DEFAULT_CURRENCY)
    : 0;

  const myQRPayload = JSON.stringify({
    type: 'rexipay_receiver',
    userId,
    userName: userName || 'Rexipay User',
    deviceId: null,
  });

  const scannedRef = React.useRef(false);
  const txScannedRef = React.useRef(false);

  const handleScanReceiver = (data) => {
    if (scannedRef.current) return;
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'rexipay_receiver' && parsed.userId) {
        scannedRef.current = true;
        setReceiverData({ userId: parsed.userId, userName: parsed.userName || 'User' });
        setMode('enter_amount');
      }
    } catch (_) {}
  };

  const handleStartPay = () => {
    scannedRef.current = false;
    if (!permission?.granted) {
      requestPermission?.();
      return;
    }
    setReceiverData(null);
    setManualReceiverId('');
    setMode('scan_receiver');
  };

  const handleManualReceiver = () => {
    const id = (manualReceiverId || '').trim();
    if (!id) {
      Alert.alert('Error', 'Enter Rexipay user ID (phone or ID)');
      return;
    }
    setReceiverData({ userId: id, userName: 'Rexipay User' });
    setMode('enter_amount');
  };

  const handleEnterAmount = () => {
    const amt = parseFloat(String(amount).replace(/,/g, ''));
    if (!amt || amt <= 0) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    if (amt > availableBalance) {
      Alert.alert('Insufficient Balance', `Available: ${formatBalance(availableBalance)}`);
      return;
    }
    setShowPinModal(true);
  };

  const handlePinSuccess = async () => {
    setShowPinModal(false);
    const amt = parseFloat(String(amount).replace(/,/g, ''));
    const res = await recordOfflineDebit(
      walletState,
      userId,
      receiverData.userId,
      amt,
      DEFAULT_CURRENCY
    );
    if (!res.success) {
      Alert.alert('Error', res.error || 'Transaction failed');
      return;
    }
    setSuccessTx(res.transaction);
    setWalletState(res.state);
    setMode('success');
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }).start();
  };

  const handleScanTransaction = async (data) => {
    if (txScannedRef.current) return;
    try {
      const tx = JSON.parse(data);
      if (!tx.transactionId || tx.receiverId !== userId) return;
      txScannedRef.current = true;
      const state = await getWalletState();
      const res = await recordOfflineCredit(state, tx);
      if (res.success) {
        setWalletState(res.state);
        Alert.alert('Success', `${formatBalance({ amount: tx.amount, currency: tx.currency })} received from sender`);
        loadWallet();
        setMode('main');
      } else {
        Alert.alert('Error', res.error || 'Invalid transaction');
      }
    } catch (_) {}
  };

  const handleDone = () => {
    setMode('main');
    setAmount('');
    setReceiverData(null);
    setSuccessTx(null);
    loadWallet();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => mode === 'main' ? navigation.goBack() : setMode('main')}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, { color: colors.textPrimary }]}>Offline Pay</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.banner, { backgroundColor: isOnline ? colors.success + '20' : '#F59E0B20' }]}>
          <MaterialIcons
            name={isOnline ? 'wifi' : 'wifi-off'}
            size={20}
            color={isOnline ? colors.success : '#F59E0B'}
          />
          <View style={styles.bannerText}>
            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>
              {isOnline ? 'Online' : '⚡ Offline Mode Active'}
            </Text>
            <Text style={[styles.bannerSub, { color: colors.textSecondary }]}>
              {isOnline
                ? syncing
                  ? '🔄 Syncing Offline Transactions...'
                  : syncStatus === 'synced'
                    ? '✅ Synced Successfully'
                    : 'Using last synced balance'
                : 'Using last synced balance'}
            </Text>
            <Text style={[styles.bannerSub, { color: colors.textSecondary }]}>
              Last Sync: {formatTime(walletState?.lastSyncTime)}
            </Text>
          </View>
        </View>

        {/* Cached Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            Available Offline Balance
          </Text>
          <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>
            {formatBalance(availableBalance)}
          </Text>
        </View>

        {mode === 'main' && (
          <>
            {/* Nearby Users / Transfer Actions */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Scan nearby devices
              </Text>
              <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
                Use QR to send or receive money offline
              </Text>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={handleStartPay}
              >
                <MaterialIcons name="qr-code-scanner" size={24} color="#FFF" />
                <Text style={styles.actionBtnText}>Scan to Pay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: colors.primary, borderWidth: 2 }]}
                onPress={() => setMode('receive')}
              >
                <MaterialIcons name="qr-code-2" size={24} color={colors.primary} />
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>Show QR to Receive</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => { txScannedRef.current = false; setMode('scan_tx'); }}
              >
                <MaterialIcons name="qr-code-scanner" size={24} color={colors.textSecondary} />
                <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>
                  Scan Transaction QR (Receiver)
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {mode === 'scan_receiver' && (
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Scan receiver's Rexipay QR
            </Text>
            {!permission?.granted ? (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={requestPermission}
              >
                <Text style={styles.actionBtnText}>Allow Camera</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.cameraWrap}>
                <CameraView
                  style={styles.camera}
                  facing="back"
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                  onBarcodeScanned={({ data }) => {
                    handleScanReceiver(data);
                  }}
                />
              </View>
            )}
            <Text style={[styles.sectionSub, { color: colors.textSecondary, marginTop: 12 }]}>
              Or enter receiver ID manually
            </Text>
            <View style={[styles.inputRow, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="Phone or Rexipay ID"
                placeholderTextColor={colors.textSecondary}
                value={manualReceiverId}
                onChangeText={setManualReceiverId}
              />
              <TouchableOpacity
                style={[styles.manualBtn, { backgroundColor: colors.primary }]}
                onPress={handleManualReceiver}
              >
                <Text style={styles.actionBtnText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {mode === 'enter_amount' && receiverData && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.section}
          >
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Enter Amount</Text>
              <View style={[styles.recipientRow, { backgroundColor: colors.background }]}>
                <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                  <MaterialIcons name="person" size={28} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.recipientName, { color: colors.textPrimary }]}>
                    {receiverData.userName}
                  </Text>
                  <Text style={[styles.recipientId, { color: colors.textSecondary }]}>
                    {receiverData.userId}
                  </Text>
                </View>
              </View>
              <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Amount (NGN)</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                value={amount}
                onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.availableText, { color: colors.textSecondary }]}>
                Available: {formatBalance(availableBalance)}
              </Text>
              <View style={styles.amountActions}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                  onPress={() => setMode('main')}
                >
                  <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
                  onPress={handleEnterAmount}
                >
                  <Text style={styles.confirmText}>Confirm Payment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}

        {mode === 'receive' && (
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Show this QR to sender
            </Text>
            <View style={styles.qrWrap}>
              <QRCode value={myQRPayload} size={200} />
            </View>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
              {userName || 'Rexipay User'} • {userId}
            </Text>
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: colors.border, borderWidth: 1 }]}
              onPress={() => setMode('main')}
            >
              <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'scan_tx' && (
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Scan Transaction QR
            </Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
              Ask sender to show their transaction QR
            </Text>
            {!permission?.granted ? (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={requestPermission}
              >
                <Text style={styles.actionBtnText}>Allow Camera</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.cameraWrap}>
                <CameraView
                  style={styles.camera}
                  facing="back"
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={({ data }) => handleScanTransaction(data)}
                />
              </View>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: colors.border, borderWidth: 1, marginTop: 12 }]}
              onPress={() => setMode('main')}
            >
              <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'success' && successTx && (
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
              <MaterialIcons name="check-circle" size={80} color={colors.success} />
            </Animated.View>
            <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
              Payment Sent!
            </Text>
            <Text style={[styles.successAmount, { color: colors.primary }]}>
              {formatBalance(successTx.amount)}
            </Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
              Show this QR to receiver to complete
            </Text>
            <View style={styles.qrWrap}>
              <QRCode value={JSON.stringify(successTx)} size={200} />
            </View>
            <Text style={[styles.pendingBadge, { backgroundColor: '#F59E0B20', color: '#F59E0B' }]}>
              Pending Sync
            </Text>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={handleDone}
            >
              <Text style={styles.actionBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <PinEntryModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onCancel={() => setShowPinModal(false)}
        title="Enter PIN to confirm offline payment"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  appBarTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: '600' },
  bannerSub: { fontSize: 13, marginTop: 2 },
  balanceCard: {
    marginTop: 16,
    padding: 24,
    borderRadius: 20,
  },
  balanceLabel: { fontSize: 14 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  section: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionSub: { fontSize: 14, marginTop: 8 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 14,
    marginTop: 12,
  },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  cameraWrap: { height: 260, borderRadius: 16, overflow: 'hidden', marginTop: 16 },
  camera: { flex: 1 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  input: { flex: 1, padding: 16, fontSize: 16 },
  manualBtn: { padding: 16 },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginTop: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientName: { fontSize: 16, fontWeight: '600' },
  recipientId: { fontSize: 13, marginTop: 2 },
  amountLabel: { fontSize: 14, marginTop: 20 },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    marginTop: 8,
  },
  availableText: { fontSize: 13, marginTop: 8 },
  amountActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16 },
  confirmBtn: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  confirmText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  qrWrap: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
  },
  successCircle: { alignSelf: 'center', marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  successAmount: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  pendingBadge: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
  },
});
