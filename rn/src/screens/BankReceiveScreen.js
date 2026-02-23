import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

// Dummy account details - in real app would come from API
const ACCOUNT_DETAILS = {
  accountNumber: '0123456789',
  accountName: 'RexiPay User',
  bankName: 'RexiPay Bank',
  sortCode: '058',
};

export default function BankReceiveScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (value, field) => {
    await Clipboard.setStringAsync(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Receive money to my account:\nBank: ${ACCOUNT_DETAILS.bankName}\nAccount: ${ACCOUNT_DETAILS.accountNumber}\nName: ${ACCOUNT_DETAILS.accountName}`,
      });
    } catch (e) {}
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Receive to Bank</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.qrPlaceholder, { backgroundColor: colors.surfaceVariant }]}>
            <MaterialIcons name="qr-code-2" size={120} color={colors.primary} />
          </View>
          <Text style={[styles.qrLabel, { color: colors.textSecondary }]}>
            Scan QR code to receive
          </Text>

          <View style={styles.details}>
            <DetailRow
              label="Account Number"
              value={ACCOUNT_DETAILS.accountNumber}
              colors={colors}
              onCopy={() => handleCopy(ACCOUNT_DETAILS.accountNumber, 'account')}
              copied={copiedField === 'account'}
            />
            <DetailRow
              label="Account Name"
              value={ACCOUNT_DETAILS.accountName}
              colors={colors}
              onCopy={() => handleCopy(ACCOUNT_DETAILS.accountName, 'name')}
              copied={copiedField === 'name'}
            />
            <DetailRow
              label="Bank Name"
              value={ACCOUNT_DETAILS.bankName}
              colors={colors}
              onCopy={() => handleCopy(ACCOUNT_DETAILS.bankName, 'bank')}
              copied={copiedField === 'bank'}
            />
            <DetailRow
              label="Sort Code"
              value={ACCOUNT_DETAILS.sortCode}
              colors={colors}
              onCopy={() => handleCopy(ACCOUNT_DETAILS.sortCode, 'sort')}
              copied={copiedField === 'sort'}
            />
          </View>

          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.primary }]}
            onPress={handleShare}
          >
            <MaterialIcons name="share" size={20} color="#FFF" />
            <Text style={styles.shareText}>Share Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, colors, onCopy, copied }) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.rowValue}>
        <Text style={[styles.rowText, { color: colors.textPrimary }]}>{value}</Text>
        <TouchableOpacity onPress={onCopy} style={styles.copyBtn}>
          <MaterialIcons name="content-copy" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
      {copied && <Text style={[styles.copiedText, { color: colors.success }]}>Copied!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrLabel: { fontSize: 14, marginTop: 16 },
  details: { width: '100%', marginTop: 28 },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: 14 },
  rowValue: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  rowText: { flex: 1, fontSize: 16, fontWeight: '600' },
  copyBtn: { padding: 4 },
  copiedText: { fontSize: 12, marginTop: 4 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  shareText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
