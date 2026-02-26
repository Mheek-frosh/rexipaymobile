import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../theme/ThemeContext';

const SUCCESS_GREEN = '#10B981';
const PENDING_ORANGE = '#F59E0B';

function getStatusColor(status, colors) {
  const s = (status || '').toLowerCase();
  if (s === 'success' || s === 'completed' || s === 'done' || s === 'successful') return colors.success;
  if (s === 'pending') return PENDING_ORANGE;
  return colors.textSecondary;
}

function DetailRow({ label, value, colors, last }) {
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }, last && styles.detailRowLast]}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

export default function DebitCardTransactionDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const viewRef = useRef(null);
  const { transaction } = route.params || {};

  const tx = transaction || {
    id: '1',
    title: 'POS Purchase',
    terminal: 'Shoprite Ikeja',
    channel: 'POS',
    amount: '15,500',
    date: 'Today',
    time: '2:30 PM',
    ref: 'RXP' + Date.now(),
    status: 'Successful',
  };

  const isPending = (tx.status || '').toLowerCase() === 'pending';
  const statusColor = getStatusColor(tx.status, colors);

  const handleSavePNG = async () => {
    try {
      if (!viewRef.current) return;
      const uri = await captureRef(viewRef, { format: 'png', quality: 1, result: 'tmpfile' });
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
          <head><meta charset="utf-8"><title>Debit Transaction Receipt</title></head>
          <body style="font-family:sans-serif;padding:24px;">
            <h2>Debit Transaction Receipt</h2>
            <p><strong>Reference:</strong> ${tx.ref}</p>
            <p><strong>Status:</strong> ${tx.status}</p>
            <p><strong>Terminal / Merchant:</strong> ${tx.terminal || tx.title}</p>
            <p><strong>Amount:</strong> -₦${tx.amount}</p>
            <p><strong>Date:</strong> ${tx.date} ${tx.time || ''}</p>
            <p><strong>Channel:</strong> ${tx.channel || '—'}</p>
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Transaction Details</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View ref={viewRef} collapsable={false} style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.doneWrap}>
            <View style={[styles.doneCircle, { backgroundColor: isPending ? PENDING_ORANGE : SUCCESS_GREEN }]}>
              <MaterialIcons
                name={isPending ? 'schedule' : 'check'}
                size={48}
                color="#FFFFFF"
              />
            </View>
          </View>
          <Text style={[styles.statusLabel, { color: statusColor }]}>{tx.status}</Text>
          <Text style={[styles.amount, { color: colors.textPrimary }]}>-₦{tx.amount}</Text>
          <Text style={[styles.recipientLabel, { color: colors.textSecondary }]}>Card debit</Text>
          <Text style={[styles.recipient, { color: colors.textPrimary }]} numberOfLines={2}>{tx.terminal || tx.title}</Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <DetailRow label="Reference" value={tx.ref} colors={colors} last={false} />
          <DetailRow label="Date" value={tx.date} colors={colors} last={false} />
          <DetailRow label="Time" value={tx.time} colors={colors} last={false} />
          <DetailRow label="Channel" value={tx.channel || '—'} colors={colors} last={false} />
          <DetailRow label="Terminal / Merchant" value={tx.terminal || '—'} colors={colors} last={false} />
          <DetailRow label="Status" value={tx.status} colors={colors} last />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
            onPress={handleSavePNG}
          >
            <MaterialIcons name="image" size={22} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Save as image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
            onPress={handleSavePDF}
          >
            <MaterialIcons name="picture-as-pdf" size={22} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Save as PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerBtn: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 40 },
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  doneWrap: { marginBottom: 16 },
  doneCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  amount: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  recipientLabel: { fontSize: 13, marginTop: 8 },
  recipient: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    width: '100%',
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionText: { fontSize: 14, fontWeight: '600' },
});
