import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

const TRANSFER_WINDOW_SECONDS = 8 * 60;

const formatMoney = (value) =>
  `₦${Number(value || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default function BankTransferBottomSheet({
  visible,
  accountName,
  accountNumber,
  amount,
  bankName = 'Wema Bank',
  fee = 50,
  onClose,
  onConfirm,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [secondsLeft, setSecondsLeft] = useState(TRANSFER_WINDOW_SECONDS);
  const [copied, setCopied] = useState(false);
  const expiryTimeRef = useRef(0);
  const copyResetTimerRef = useRef(null);

  const startCountdown = () => {
    expiryTimeRef.current = Date.now() + TRANSFER_WINDOW_SECONDS * 1000;
    setSecondsLeft(TRANSFER_WINDOW_SECONDS);
  };

  useEffect(() => {
    if (!visible) return undefined;

    startCountdown();
    const countdownTimer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((expiryTimeRef.current - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [visible]);

  useEffect(
    () => () => {
      if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    },
    [],
  );

  const copyAccountNumber = async () => {
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);
    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    copyResetTimerRef.current = setTimeout(() => setCopied(false), 1800);
  };

  const topUpAmount = Number(amount || 0);
  const total = topUpAmount + fee;
  const expired = secondsLeft <= 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        accessibilityLabel="Close bank transfer details"
        accessibilityRole="button"
        style={styles.overlay}
        onPress={onClose}
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Bank transfer</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Transfer the exact total below to fund your wallet instantly.</Text>
              </View>
              <TouchableOpacity
                accessibilityLabel="Close"
                accessibilityRole="button"
                style={[styles.closeButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={onClose}
              >
                <MaterialIcons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.timerCard,
                {
                  backgroundColor: expired ? 'rgba(229, 57, 53, 0.1)' : colors.primaryLight,
                },
              ]}
            >
              <View
                style={[
                  styles.timerIcon,
                  { backgroundColor: expired ? 'rgba(229, 57, 53, 0.14)' : colors.cardBackground },
                ]}
              >
                <MaterialIcons
                  name="schedule"
                  size={22}
                  color={expired ? colors.error : colors.primary}
                />
              </View>
              <View style={styles.timerCopy}>
                <Text
                  style={[
                    styles.timerLabel,
                    { color: expired ? colors.error : colors.textSecondary },
                  ]}
                >
                  {expired ? 'Transfer details expired' : 'Account expires in'}
                </Text>
                <Text
                  style={[
                    styles.timerValue,
                    { color: expired ? colors.error : colors.primary },
                  ]}
                >
                  {formatCountdown(secondsLeft)}
                </Text>
              </View>
              {expired ? (
                <TouchableOpacity accessibilityRole="button" onPress={startCountdown}>
                  <Text style={[styles.refreshText, { color: colors.primary }]}>Refresh</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View
              style={[
                styles.accountCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <View style={styles.detailBlock}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Account name</Text>
                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{accountName}</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.detailBlock}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Bank</Text>
                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{bankName}</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.accountNumberRow}>
                <View style={styles.detailBlock}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Account number</Text>
                  <Text style={[styles.accountNumber, { color: colors.textPrimary }]}>{accountNumber}</Text>
                </View>
                <TouchableOpacity
                  accessibilityLabel="Copy account number"
                  accessibilityRole="button"
                  style={[styles.copyButton, { backgroundColor: colors.primaryLight }]}
                  onPress={copyAccountNumber}
                >
                  <MaterialIcons
                    name={copied ? 'check' : 'content-copy'}
                    size={17}
                    color={colors.primary}
                  />
                  <Text style={[styles.copyText, { color: colors.primary }]}>
                    {copied ? 'Copied' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                styles.summaryCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Top-up amount</Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {formatMoney(topUpAmount)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Processing fee</Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {formatMoney(fee)}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total to transfer</Text>
                <Text style={[styles.totalValue, { color: colors.primary }]}>{formatMoney(total)}</Text>
              </View>
            </View>

            <View style={styles.notice}>
              <MaterialIcons name="verified-user" size={19} color={colors.primary} />
              <Text style={[styles.noticeText, { color: colors.textSecondary }]}>Only transfer from an account in your name. Your wallet will be credited after confirmation.</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              accessibilityRole="button"
              disabled={expired}
              style={[
                styles.confirmButton,
                { backgroundColor: colors.primary },
                expired && styles.disabledButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>I’ve made the transfer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxHeight: '92%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 18,
  },
  headerCopy: { flex: 1 },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCard: {
    minHeight: 72,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  timerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCopy: {
    flex: 1,
    marginLeft: 12,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  timerValue: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  refreshText: {
    fontSize: 13,
    fontWeight: '700',
    padding: 8,
  },
  accountCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  detailBlock: { flex: 1 },
  detailLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },
  accountNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountNumber: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  copyButton: {
    minHeight: 38,
    borderRadius: 12,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  copyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginVertical: 4,
  },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  totalLabel: { fontSize: 15, fontWeight: '700' },
  totalValue: { fontSize: 19, fontWeight: '800' },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginVertical: 15,
    paddingHorizontal: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  confirmButton: {
    minHeight: 56,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.45 },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
