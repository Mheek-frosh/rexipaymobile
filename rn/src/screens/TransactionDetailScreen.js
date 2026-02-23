import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../theme/ThemeContext';

export default function TransactionDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const viewRef = useRef(null);
  const { transaction } = route.params || {};

  const tx = transaction || {
    id: '1',
    name: 'Divine Chiamaka',
    amount: '25,000',
    type: 'sent',
    date: 'Today',
    time: '2:30 PM',
    ref: 'REF' + Date.now(),
    status: 'Completed',
    bank: 'GTBank',
    account: '0123456789',
  };

  const handleSavePNG = async () => {
    try {
      if (!viewRef.current) return;
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png' });
      } else {
        Alert.alert('Saved', 'Receipt saved to gallery');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not save');
    }
  };

  const handleSavePDF = async () => {
    try {
      await Print.printAsync({
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><title>Transaction Receipt</title></head>
          <body style="font-family:sans-serif;padding:24px;">
            <h2>Transaction Receipt</h2>
            <p><strong>Reference:</strong> ${tx.ref}</p>
            <p><strong>Status:</strong> ${tx.status}</p>
            <p><strong>${tx.type === 'sent' ? 'To' : 'From'}:</strong> ${tx.name}</p>
            <p><strong>Amount:</strong> ${tx.type === 'sent' ? '-' : '+'}₦${tx.amount}</p>
            <p><strong>Date:</strong> ${tx.date} ${tx.time || ''}</p>
            ${tx.bank ? `<p><strong>Bank:</strong> ${tx.bank}</p>` : ''}
            ${tx.account ? `<p><strong>Account:</strong> ${tx.account}</p>` : ''}
          </body>
          </html>
        `,
      });
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not create PDF');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Transaction Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View ref={viewRef} collapsable={false} style={[styles.receiptCard, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.statusText, { color: colors.success }]}>{tx.status}</Text>
          </View>
          <Text style={[styles.amount, { color: tx.type === 'sent' ? colors.error : colors.success }]}>
            {tx.type === 'sent' ? '-' : '+'}₦{tx.amount}
          </Text>
          <Text style={[styles.recipient, { color: colors.textPrimary }]}>{tx.name}</Text>
          <View style={styles.divider} />
          <DetailRow label="Reference" value={tx.ref} colors={colors} />
          <DetailRow label="Date" value={tx.date} colors={colors} />
          {tx.time && <DetailRow label="Time" value={tx.time} colors={colors} />}
          {tx.bank && <DetailRow label="Bank" value={tx.bank} colors={colors} />}
          {tx.account && <DetailRow label="Account" value={tx.account} colors={colors} />}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
            onPress={handleSavePNG}
          >
            <MaterialIcons name="image" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Save as PNG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
            onPress={handleSavePDF}
          >
            <MaterialIcons name="picture-as-pdf" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Save as PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, colors }) {
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{value}</Text>
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
  receiptCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: { fontSize: 14, fontWeight: '600' },
  amount: { fontSize: 32, fontWeight: '700' },
  recipient: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 20 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  actionText: { fontSize: 14, fontWeight: '600' },
});
