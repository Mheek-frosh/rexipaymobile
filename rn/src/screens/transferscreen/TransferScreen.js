import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { useWallet } from '../../context/WalletContext';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { resolveAccount } from '../../services/bankService';
import { NIGERIAN_BANKS } from '../../data/nigerianBanks';
import TransactionProcessingModal from '../../components/TransactionProcessingModal';

const TRANSFER_PIN_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'biometric', 0, 'backspace'];

function FaceIdIcon({ color, size = 32 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M15 4H10a6 6 0 0 0-6 6v5M33 4h5a6 6 0 0 1 6 6v5M15 44H10a6 6 0 0 1-6-6v-5M33 44h5a6 6 0 0 0 6-6v-5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Path
        d="M16 17v4M32 17v4M24 16v9.5c0 2-1.2 3.2-3.2 3.2M17.5 34c1.8 2 4 3 6.5 3s4.7-1 6.5-3"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TransferPinBottomSheet({
  visible,
  amount,
  recipient,
  onSuccess,
  onCancel,
}) {
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const completionTimer = useRef(null);
  const authorizationStartedRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      setPin('');
      setError('');
      setVerifying(false);
      authorizationStartedRef.current = false;
      return undefined;
    }

    let mounted = true;
    setBiometricAvailable(false);
    Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ])
      .then(([hasHardware, isEnrolled]) => {
        if (mounted) setBiometricAvailable(hasHardware && isEnrolled);
      })
      .catch(() => {
        if (mounted) setBiometricAvailable(false);
      });

    return () => {
      mounted = false;
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
        completionTimer.current = null;
      }
    };
  }, [visible]);

  const completeAuthorization = () => {
    if (authorizationStartedRef.current) return;
    authorizationStartedRef.current = true;
    setVerifying(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    completionTimer.current = setTimeout(() => {
      completionTimer.current = null;
      onSuccess();
    }, 180);
  };

  const handleBiometric = async () => {
    if (!biometricAvailable || authorizationStartedRef.current) return;
    authorizationStartedRef.current = true;
    setError('');
    setVerifying(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Confirm transfer to ${recipient || 'recipient'}`,
        cancelLabel: 'Use PIN',
        disableDeviceFallback: true,
      });
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        onSuccess();
        return;
      }
      setError('Face ID was not completed. Enter your PIN instead.');
    } catch (_) {
      setError('Face ID is unavailable. Enter your PIN instead.');
    } finally {
      authorizationStartedRef.current = false;
      setVerifying(false);
    }
  };

  const handleKeyPress = (key) => {
    if (authorizationStartedRef.current) return;
    setError('');

    if (key === 'biometric') {
      handleBiometric();
      return;
    }

    if (key === 'backspace') {
      Haptics.selectionAsync().catch(() => {});
      setPin((current) => current.slice(0, -1));
      return;
    }

    Haptics.selectionAsync().catch(() => {});
    const nextPin = `${pin}${key}`.slice(0, 4);
    setPin(nextPin);
    if (nextPin.length === 4) completeAuthorization();
  };

  const handleCancel = () => {
    if (authorizationStartedRef.current) return;
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={styles.transferPinOverlay}
        activeOpacity={1}
        onPress={handleCancel}
        accessibilityRole="button"
        accessibilityLabel="Close transfer PIN sheet"
      >
        <View
          style={[styles.transferPinSheet, { backgroundColor: colors.background }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.transferPinHandle, { backgroundColor: colors.border }]} />

          <View style={styles.transferPinHeader}>
            <View style={styles.transferPinHeading}>
              <Text style={[styles.transferPinTitle, { color: colors.textPrimary }]}>
                Confirm {amount} transfer to {recipient}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.transferPinClose, { backgroundColor: colors.surfaceVariant }]}
              onPress={handleCancel}
              disabled={verifying}
              accessibilityRole="button"
              accessibilityLabel="Cancel transfer authorization"
            >
              <MaterialIcons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.transferPinBoxes}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.transferPinBox,
                  {
                    borderColor: error ? colors.error : colors.border,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
              >
                {index < pin.length ? (
                  <View
                    style={[
                      styles.transferPinDot,
                      { backgroundColor: error ? colors.error : colors.textPrimary },
                    ]}
                  />
                ) : null}
              </View>
            ))}
          </View>

          <Text
            style={[
              styles.transferPinError,
              { color: error ? colors.error : 'transparent' },
            ]}
          >
            {error || 'Secure authorization'}
          </Text>

          <View style={styles.transferPinKeypad}>
            {TRANSFER_PIN_KEYS.map((key) => {
              const isBiometric = key === 'biometric';
              const isBackspace = key === 'backspace';
              const biometricDisabled = isBiometric && !biometricAvailable;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.transferPinKey,
                    (verifying || biometricDisabled) && styles.transferPinKeyDisabled,
                  ]}
                  activeOpacity={0.6}
                  disabled={verifying || biometricDisabled}
                  onPress={() => handleKeyPress(key)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isBiometric
                      ? 'Confirm with Face ID'
                      : isBackspace
                        ? 'Delete digit'
                        : `Digit ${key}`
                  }
                >
                  {isBiometric ? (
                    <FaceIdIcon color={colors.textPrimary} size={32} />
                  ) : isBackspace ? (
                    <MaterialIcons name="chevron-left" size={36} color={colors.error} />
                  ) : (
                    <Text style={[styles.transferPinKeyText, { color: colors.textPrimary }]}>
                      {key}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const RECENT_RECIPIENTS = [
  {
    name: 'Isaac Folarin',
    email: 'isaac.folarin@gmail.com',
    amount: '-₦5000',
    accountNumber: '0123456789',
    bankName: 'Access Bank',
  },
  {
    name: 'Grace Michelle',
    email: 'grace.mich@gmail.com',
    amount: '-₦2500',
    accountNumber: '0987654321',
    bankName: 'GTBank',
  },
  {
    name: 'Steve Peters',
    email: 'steve.peters@gmail.com',
    amount: '-₦15,000',
    accountNumber: '1122334455',
    bankName: 'UBA',
  },
  {
    name: 'Martha Kenneth',
    email: 'martha.ken@gmail.com',
    amount: '-₦8500',
    accountNumber: '5544332211',
    bankName: 'Zenith Bank',
  },
];

export default function TransferScreen() {
  const { colors } = useTheme();
  const { debitNgn } = useWallet();
  const navigation = useNavigation();
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountName, setAccountName] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferRecipientBank, setTransferRecipientBank] = useState('');
  const [transferRecipientAccount, setTransferRecipientAccount] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [processingTransfer, setProcessingTransfer] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('Sending money...');
  const [showTransferFailedModal, setShowTransferFailedModal] = useState(false);
  const [transferFailureReason, setTransferFailureReason] = useState('Network timeout while confirming transfer.');
  const pinSheetTimerRef = useRef(null);

  const cleanAccount = accountNumber.replace(/\D/g, '');
  const canResolve = cleanAccount.length === 10 && selectedBank;

  const resolveAccountName = useCallback(async () => {
    if (!canResolve) return;
    setIsResolving(true);
    setAccountName('');
    try {
      const result = await resolveAccount(cleanAccount, selectedBank.code);
      if (result.success) {
        setAccountName(result.accountName);
      } else {
        setAccountName('Account Holder'); // Fallback for demo - logic will be added later
      }
    } catch (e) {
      setAccountName('Account Holder'); // Fallback when API unavailable
    } finally {
      setIsResolving(false);
    }
  }, [cleanAccount, selectedBank]);

  useEffect(() => {
    if (!canResolve) return;
    const t = setTimeout(resolveAccountName, 500);
    return () => clearTimeout(t);
  }, [canResolve, selectedBank?.code]);

  useEffect(() => () => {
    if (pinSheetTimerRef.current) clearTimeout(pinSheetTimerRef.current);
  }, []);

  const handleNext = () => {
    if (!selectedBank) {
      Alert.alert('Error', 'Please select a bank.');
      return;
    }
    if (cleanAccount.length !== 10) {
      Alert.alert('Error', 'Please input correct account number.');
      return;
    }
    if (!accountName) {
      Alert.alert('Error', 'Please enter account number and select bank to resolve account name');
      return;
    }
    setTransferRecipient(accountName);
    setTransferRecipientBank(selectedBank?.name || '');
    setTransferRecipientAccount(cleanAccount);
    setShowAmountModal(true);
  };

  const handleTransferFromAmount = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setShowAmountModal(false);
    setShowSummaryModal(true);
  };

  const handleConfirmFromSummary = () => {
    setShowSummaryModal(false);
    if (pinSheetTimerRef.current) clearTimeout(pinSheetTimerRef.current);
    pinSheetTimerRef.current = setTimeout(() => {
      pinSheetTimerRef.current = null;
      setShowPinModal(true);
    }, 250);
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const playSuccessFeedback = async () => {
    // Haptic feedback for premium completion feel
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {
      // ignore haptic errors
    }

    // Soft completion chime — load expo-av only here so missing/outdated native
    // ExponentAV (Expo Go mismatch, dev client, etc.) does not crash app startup.
    try {
      const { Audio } = await import('expo-av');
      const { sound } = await Audio.Sound.createAsync({
        uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      });
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status?.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (_) {
      // ignore sound errors
    }
  };

  const completeTransfer = async () => {
    const debitResult = await debitNgn(amount);
    if (!debitResult.success) {
      Alert.alert('Transfer failed', debitResult.error);
      return;
    }
    await playSuccessFeedback();
    navigation.navigate('PaymentSuccess', {
      amount: amount,
      recipient: transferRecipient,
      ref: 'RXP' + Date.now(),
    });
  };

  const runTransferProcessing = async ({ isRetry = false } = {}) => {
    setProcessingTransfer(true);
    setProcessingLabel('Sending money...');
    const totalDuration = 1500 + Math.floor(Math.random() * 1001); // 1500-2500ms
    const firstLeg = Math.floor(totalDuration * 0.45);
    const secondLeg = totalDuration - firstLeg;
    await wait(firstLeg);
    setProcessingLabel('Confirming transaction...');
    await wait(secondLeg);

    // Simulated network/timeout errors. Lower chance on retry.
    const failChance = isRetry ? 0.12 : 0.22;
    const shouldFail = Math.random() < failChance;

    setProcessingTransfer(false);
    if (shouldFail) {
      setTransferFailureReason('Network timeout while confirming transfer.');
      setShowTransferFailedModal(true);
      return;
    }
    await completeTransfer();
  };

  const handlePinSuccess = async () => {
    setShowPinModal(false);
    await runTransferProcessing();
  };

  const handleRecentTap = (item) => {
    setTransferRecipient(item.name);
    setTransferRecipientBank(item.bankName || '');
    setTransferRecipientAccount(item.accountNumber || '');
    setShowAmountModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, { color: colors.textPrimary }]}>Transfer to Bank</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Recipient Card */}
        <View style={[styles.recipientCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Recipient Account</Text>

          <TextInput
            style={[styles.input, { color: colors.textPrimary, borderBottomColor: colors.border }]}
            placeholder="Enter 10 digits Account Number"
            placeholderTextColor="#9E9E9E"
            value={accountNumber}
            onChangeText={(t) => setAccountNumber(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="number-pad"
          />

          <TouchableOpacity
            style={[styles.bankSelect, { borderBottomColor: colors.border }]}
            onPress={() => setShowBankModal(true)}
          >
            {selectedBank ? (
              <View style={styles.bankRow}>
                <Text style={styles.bankLogo}>{selectedBank.logo}</Text>
                <Text style={[styles.bankName, { color: colors.textPrimary }]}>{selectedBank.name}</Text>
              </View>
            ) : (
              <Text style={[styles.placeholder, { color: colors.textSecondary }]}>Select Bank</Text>
            )}
            <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          {isResolving && (
            <View style={styles.resolving}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.resolvingText, { color: colors.textSecondary }]}>
                Resolving account...
              </Text>
            </View>
          )}

          {accountName && !isResolving && selectedBank && (
            <View style={[styles.resolvedCard, { backgroundColor: colors.primaryLight }]}>
              <View style={styles.resolvedRow}>
                <View>
                  <Text style={[styles.resolvedBank, { color: colors.textPrimary }]}>
                    {selectedBank.name}
                  </Text>
                  <Text style={[styles.resolvedAcc, { color: colors.textSecondary }]}>
                    Account: {cleanAccount}
                  </Text>
                </View>
                <MaterialIcons name="check-circle" size={28} color={colors.success} />
              </View>
              <View style={[styles.ownerBox, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.ownerLabel, { color: colors.textSecondary }]}>
                  Account Name
                </Text>
                <Text style={[styles.ownerName, { color: colors.textPrimary }]} numberOfLines={2}>
                  {accountName}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            onPress={handleNext}
            disabled={!accountName}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Section */}
        <View style={[styles.recentSection, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.searchBox, { backgroundColor: colors.background }]}>
            <MaterialIcons name="search" size={20} color="#9E9E9E" />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search Recipient name"
              placeholderTextColor="#9E9E9E"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Text style={[styles.recentTitle, { color: colors.textPrimary }]}>Most Recent</Text>
          {RECENT_RECIPIENTS.filter((r) =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.recentItem, { borderBottomColor: colors.border }]}
              onPress={() => handleRecentTap(item)}
            >
              <View style={[styles.recentAvatar, { backgroundColor: colors.primaryLight }]}>
                <MaterialIcons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.recentInfo}>
                <Text style={[styles.recentName, { color: colors.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.recentEmail, { color: colors.textSecondary }]}>{item.email}</Text>
              </View>
              <Text style={[styles.recentAmount, { color: colors.error }]}>{item.amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showBankModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBankModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.background }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Bank</Text>
            <FlatList
              data={NIGERIAN_BANKS}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.bankItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setSelectedBank(item);
                    setShowBankModal(false);
                  }}
                >
                  <Text style={styles.bankLogo}>{item.logo}</Text>
                  <Text style={[styles.bankItemName, { color: colors.textPrimary }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showAmountModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowAmountModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={[styles.amountModalWrap, { backgroundColor: colors.background }]}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.amountModalScroll}
              >
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  Enter Amount
                </Text>
                <View style={[styles.recipientCardModal, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.recipientLabel, { color: colors.textSecondary }]}>
                    Sending to
                  </Text>
                  <Text style={[styles.recipientName, { color: colors.textPrimary }]}>
                    {transferRecipient}
                  </Text>
                  {transferRecipientBank ? (
                    <Text style={[styles.recipientBank, { color: colors.textSecondary }]}>
                      {transferRecipientBank}
                    </Text>
                  ) : null}
                </View>
                <Text style={[styles.amountLabel, { color: colors.textPrimary }]}>
                  Amount (NGN)
                </Text>
                <TextInput
                  style={[
                    styles.amountInput,
                    { color: colors.textPrimary, borderColor: colors.border },
                  ]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
                <View style={styles.amountActions}>
                  <TouchableOpacity
                    style={[styles.cancelBtn, { borderColor: colors.border }]}
                    onPress={() => setShowAmountModal(false)}
                  >
                    <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
                    onPress={handleTransferFromAmount}
                    disabled={!amount || parseFloat(amount) <= 0}
                  >
                    <Text style={styles.confirmText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Summary Modal */}
      <Modal visible={showSummaryModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSummaryModal(false)}
        >
          <View
            style={[styles.summaryModalWrap, { backgroundColor: colors.background }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
              Confirm Transfer
            </Text>
            <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
              <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Recipient</Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {transferRecipient}
                </Text>
              </View>
              <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Bank</Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {transferRecipientBank}
                </Text>
              </View>
              {transferRecipientAccount ? (
                <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Account</Text>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                    {transferRecipientAccount}
                  </Text>
                </View>
              ) : null}
              <View style={[styles.summaryRow, styles.summaryRowLast]}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Amount</Text>
                <Text style={[styles.summaryAmount, { color: colors.primary }]}>
                  ₦{amount ? Number(amount).toLocaleString() : '0'}
                </Text>
              </View>
            </View>
            <View style={styles.summaryActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
                onPress={() => setShowSummaryModal(false)}
              >
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
                onPress={handleConfirmFromSummary}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <TransferPinBottomSheet
        visible={showPinModal}
        amount={`\u20A6${amount ? Number(amount).toLocaleString() : '0'}`}
        recipient={transferRecipient}
        onSuccess={handlePinSuccess}
        onCancel={() => setShowPinModal(false)}
      />

      <TransactionProcessingModal
        visible={processingTransfer}
        label={processingLabel}
        subtext="Please wait while we complete your transfer securely."
      />

      <Modal visible={showTransferFailedModal} transparent animationType="fade">
        <View style={styles.processingOverlay}>
          <View style={[styles.processingCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.failedIconWrap, { backgroundColor: colors.primaryLight }]}>
              <MaterialIcons name="wifi-off" size={22} color={colors.error} />
            </View>
            <Text style={[styles.failedTitle, { color: colors.textPrimary }]}>Transfer delayed</Text>
            <Text style={[styles.failedSub, { color: colors.textSecondary }]}>{transferFailureReason}</Text>
            <View style={styles.failedActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
                onPress={() => setShowTransferFailedModal(false)}
              >
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
                onPress={async () => {
                  setShowTransferFailedModal(false);
                  await runTransferProcessing({ isRetry: true });
                }}
              >
                <Text style={styles.confirmText}>Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: { paddingBottom: 40 },
  recipientCard: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    fontSize: 16,
    marginTop: 16,
  },
  bankSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 12,
    marginTop: 24,
  },
  bankRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bankLogo: { fontSize: 24 },
  bankName: { fontSize: 14 },
  placeholder: { fontSize: 14 },
  resolving: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  resolvingText: { fontSize: 14 },
  resolvedCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(23, 47, 199, 0.2)',
  },
  resolvedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resolvedBank: { fontSize: 15, fontWeight: '600' },
  resolvedAcc: { fontSize: 13, marginTop: 4 },
  ownerBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  ownerLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  ownerName: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  nextBtn: {
    marginTop: 24,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  recentSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  recentTitle: { fontSize: 16, fontWeight: '700', marginTop: 30 },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 15,
  },
  recentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 15, fontWeight: '600' },
  recentEmail: { fontSize: 13, marginTop: 4 },
  recentAmount: { fontSize: 15, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  bankItemName: { fontSize: 16 },
  amountModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  amountModalWrap: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  amountModalScroll: { paddingBottom: 40 },
  recipientCardModal: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  recipientLabel: { fontSize: 13 },
  recipientName: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  recipientBank: { fontSize: 14, marginTop: 4 },
  amountLabel: { fontSize: 16, fontWeight: '600' },
  recipientText: { fontSize: 14, marginTop: 8 },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    marginTop: 16,
  },
  currency: { fontSize: 14, marginTop: 8 },
  amountActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16 },
  confirmBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  summaryModalWrap: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  summaryTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  summaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  summaryRowLast: { borderBottomWidth: 0 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 15, fontWeight: '600' },
  summaryAmount: { fontSize: 18, fontWeight: '700' },
  summaryActions: { flexDirection: 'row', gap: 12 },
  transferPinOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  transferPinSheet: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    alignSelf: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  transferPinHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 22,
  },
  transferPinHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  transferPinHeading: { flex: 1 },
  transferPinTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  transferPinSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  transferPinClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferPinBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 28,
  },
  transferPinBox: {
    flex: 1,
    maxWidth: 64,
    height: 62,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferPinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  transferPinError: {
    minHeight: 20,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  transferPinKeypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  transferPinKey: {
    width: '30%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferPinKeyText: {
    fontSize: 26,
    fontWeight: '600',
  },
  transferPinKeyDisabled: { opacity: 0.3 },
  processingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  processingCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  failedIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 4,
  },
  failedTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  failedSub: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 14,
  },
  failedActions: { flexDirection: 'row', gap: 12 },
});
