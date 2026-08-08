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
import AppBackButton from '../../components/AppBackButton';
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

function getRecipientInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

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
  const [showRecentModal, setShowRecentModal] = useState(false);
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
  const canContinue = Boolean(canResolve && accountName && !isResolving);
  const filteredRecipients = RECENT_RECIPIENTS.filter((recipient) =>
    recipient.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

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
  }, [canResolve, resolveAccountName]);

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
    setShowRecentModal(false);
    setShowAmountModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.appBar}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.appBarTitle, { color: colors.textPrimary }]}>Transfer to Bank</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Who are you paying?</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          Choose a recent recipient or add a new bank account.
        </Text>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <MaterialIcons name="search" size={22} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search recipient"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent</Text>
          <TouchableOpacity
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setShowRecentModal(true)}
          >
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>

        {filteredRecipients.length > 0 ? (
          <View style={styles.recentGrid}>
            {filteredRecipients.map((item) => (
              <TouchableOpacity
                accessibilityLabel={`Pay ${item.name}`}
                accessibilityRole="button"
                activeOpacity={0.72}
                key={item.accountNumber}
                style={styles.recentPerson}
                onPress={() => handleRecentTap(item)}
              >
                <View style={[styles.recentAvatar, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.recentInitials, { color: colors.primary }]}>
                    {getRecipientInitials(item.name)}
                  </Text>
                </View>
                <Text style={[styles.recentFirstName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {item.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={[styles.emptyRecentText, { color: colors.textSecondary }]}>No matching recipients</Text>
        )}

        <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

        <Text style={[styles.sectionTitle, styles.newRecipientTitle, { color: colors.textPrimary }]}>
          New bank recipient
        </Text>

        <View
          style={[
            styles.formRow,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View style={[styles.formIcon, { backgroundColor: colors.primaryLight }]}>
            <MaterialIcons name="credit-card" size={24} color={colors.primary} />
          </View>
          <View style={styles.formCopy}>
            <Text style={[styles.formLabel, { color: colors.textPrimary }]}>Account number</Text>
            <TextInput
              accessibilityLabel="Recipient account number"
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={(value) => setAccountNumber(value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit account number"
              placeholderTextColor={colors.textSecondary}
              style={[styles.accountInput, { color: colors.textPrimary }]}
              value={accountNumber}
            />
          </View>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.75}
          style={[
            styles.formRow,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
          onPress={() => setShowBankModal(true)}
        >
          <View style={[styles.formIcon, { backgroundColor: colors.primaryLight }]}>
            <MaterialIcons name="account-balance" size={24} color={colors.primary} />
          </View>
          <View style={styles.formCopy}>
            <Text style={[styles.formLabel, { color: colors.textPrimary }]}>Bank</Text>
            <Text style={[styles.formValue, { color: colors.textSecondary }]} numberOfLines={1}>
              {selectedBank?.name || 'Select bank'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={25} color={colors.textSecondary} />
        </TouchableOpacity>

        {isResolving && (
          <View style={styles.resolving}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.resolvingText, { color: colors.textSecondary }]}>Verifying recipient...</Text>
          </View>
        )}

        {accountName && !isResolving && selectedBank && (
          <View style={[styles.resolvedInline, { backgroundColor: colors.primaryLight }]}>
            <MaterialIcons name="check-circle" size={22} color={colors.success} />
            <View style={styles.resolvedInlineCopy}>
              <Text style={[styles.resolvedInlineName, { color: colors.textPrimary }]}>{accountName}</Text>
              <Text style={[styles.resolvedInlineMeta, { color: colors.textSecondary }]}>
                {selectedBank.name} {'\u00B7'} {cleanAccount}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.verificationNote}>
          <MaterialIcons name="verified-user" size={22} color={colors.primary} />
          <Text style={[styles.verificationText, { color: colors.textSecondary }]}>
            Recipient will be verified before transfer
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={handleNext}
          style={[
            styles.nextBtn,
            { backgroundColor: canContinue ? colors.primary : colors.surfaceVariant },
          ]}
        >
          <Text style={[styles.nextBtnText, !canContinue && { color: colors.textSecondary }]}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setShowRecentModal(false)}
        statusBarTranslucent
        transparent
        visible={showRecentModal}
      >
        <View style={styles.recentModalOverlay}>
          <TouchableOpacity
            accessibilityLabel="Close recent recipients"
            accessibilityRole="button"
            activeOpacity={1}
            onPress={() => setShowRecentModal(false)}
            style={styles.recentModalBackdrop}
          />

          <View
            onStartShouldSetResponder={() => true}
            style={[
              styles.recentModalCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <View style={[styles.recentModalHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.recentModalHeading}>
                <Text style={[styles.recentModalTitle, { color: colors.textPrimary }]}>Recent recipients</Text>
                <Text style={[styles.recentModalSubtitle, { color: colors.textSecondary }]}>
                  Choose someone you have paid before
                </Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => setShowRecentModal(false)}
              >
                <Text style={[styles.recentModalClose, { color: colors.primary }]}>Close</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              contentContainerStyle={styles.recentModalList}
              data={RECENT_RECIPIENTS}
              keyExtractor={(item) => item.accountNumber}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={[styles.recentModalDivider, { backgroundColor: colors.border }]} />
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  accessibilityLabel={`Pay ${item.name}`}
                  accessibilityRole="button"
                  activeOpacity={0.7}
                  onPress={() => handleRecentTap(item)}
                  style={styles.recentModalRow}
                >
                  <View style={[styles.recentModalAvatar, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.recentModalInitials, { color: colors.primary }]}>
                      {getRecipientInitials(item.name)}
                    </Text>
                  </View>
                  <View style={styles.recentModalRecipientInfo}>
                    <Text style={[styles.recentModalName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.recentModalMeta, { color: colors.textSecondary }]} numberOfLines={1}>
                      {item.bankName} {'\u00B7'} {item.accountNumber}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

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
  content: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
  pageTitle: { fontSize: 25, fontWeight: '800', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, lineHeight: 19, marginTop: 5 },
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
    minHeight: 52,
    borderRadius: 25,
    borderWidth: 1,
    gap: 12,
    marginTop: 22,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  sectionHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  seeAllText: { fontSize: 13, fontWeight: '700' },
  recentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  recentPerson: { alignItems: 'center', width: 58 },
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
  recentInitials: { fontSize: 16, fontWeight: '800' },
  recentFirstName: { fontSize: 12, fontWeight: '500', marginTop: 8, maxWidth: 58 },
  emptyRecentText: { fontSize: 13, marginTop: 20, textAlign: 'center' },
  sectionDivider: { height: StyleSheet.hairlineWidth, marginTop: 24 },
  newRecipientTitle: { marginBottom: 14, marginTop: 24 },
  formRow: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 68,
    paddingHorizontal: 14,
  },
  formIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  formCopy: { flex: 1, marginLeft: 12 },
  formLabel: { fontSize: 13, fontWeight: '600' },
  formValue: { fontSize: 13, marginTop: 4 },
  accountInput: { fontSize: 13, marginTop: 1, paddingHorizontal: 0, paddingVertical: 2 },
  resolvedInline: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    marginTop: 2,
    padding: 14,
  },
  resolvedInlineCopy: { flex: 1, marginLeft: 10 },
  resolvedInlineName: { fontSize: 14, fontWeight: '700' },
  resolvedInlineMeta: { fontSize: 12, marginTop: 3 },
  verificationNote: { alignItems: 'center', flexDirection: 'row', marginTop: 18 },
  verificationText: { flex: 1, fontSize: 12, lineHeight: 18, marginLeft: 9 },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 15, fontWeight: '600' },
  recentEmail: { fontSize: 13, marginTop: 4 },
  recentAmount: { fontSize: 15, fontWeight: '700' },
  recentModalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(5, 8, 20, 0.56)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  recentModalBackdrop: { ...StyleSheet.absoluteFillObject },
  recentModalCard: {
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: '72%',
    overflow: 'hidden',
    width: '100%',
  },
  recentModalHeader: {
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    padding: 20,
  },
  recentModalHeading: { flex: 1, paddingRight: 12 },
  recentModalTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  recentModalSubtitle: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  recentModalClose: { fontSize: 14, fontWeight: '700', paddingTop: 2 },
  recentModalList: { paddingHorizontal: 18, paddingVertical: 6 },
  recentModalRow: { alignItems: 'center', flexDirection: 'row', minHeight: 72 },
  recentModalAvatar: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  recentModalInitials: { fontSize: 14, fontWeight: '800' },
  recentModalRecipientInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  recentModalName: { fontSize: 14, fontWeight: '700' },
  recentModalMeta: { fontSize: 12, marginTop: 4 },
  recentModalDivider: { height: StyleSheet.hairlineWidth, marginLeft: 56 },
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
