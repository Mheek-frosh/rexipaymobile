import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getWalletState } from '../services/offlineWalletService';

const PENDING_ORANGE = '#F59E0B';
const PENDING_ORANGE_LIGHT = 'rgba(245, 158, 11, 0.15)';

const MOCK_TRANSACTIONS = [
  { id: '1', name: 'Divine Chiamaka', amount: '25,000', type: 'sent', date: 'Today', time: '2:30 PM', dateTime: 'Today | 2:30 PM', ref: 'RXP' + Date.now(), status: 'Completed', statusDisplay: 'Success', bank: 'GTBank', account: '0123456789' },
  { id: '2', name: 'John Doe', amount: '50,000', type: 'received', date: 'Yesterday', time: '10:15 AM', dateTime: 'Yesterday | 10:15 AM', ref: 'RXP' + (Date.now() - 86400000), status: 'Completed', statusDisplay: 'Success', bank: 'Access Bank', account: '0987654321' },
  { id: '3', name: 'Airtime Purchase', amount: '1,000', type: 'airtime', date: '2 days ago', time: '4:45 PM', dateTime: '2 days ago | 4:45 PM', ref: 'RXP' + (Date.now() - 172800000), status: 'Pending', statusDisplay: 'Pending' },
];

function getTransactionIcon(type) {
  if (type === 'airtime') return 'phone-android';
  if (type === 'sent') return 'arrow-upward';
  return 'arrow-downward';
}

function getIconColor(type, colors) {
  if (type === 'sent') return colors.error;
  if (type === 'received') return colors.success;
  return colors.primary;
}

function getIconBg(type, colors) {
  if (type === 'sent') return colors.error + '20';
  if (type === 'received') return colors.success + '20';
  return colors.primaryLight;
}

function formatOfflineTx(tx, userId, type) {
  const amount = Number(tx.amount).toLocaleString();
  const date = new Date(tx.timestamp);
  return {
    id: tx.transactionId,
    name: type === 'sent' ? tx.receiverId : tx.senderId,
    amount,
    type: type === 'sent' ? 'sent' : 'received',
    dateTime: date.toLocaleDateString() + ' | ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    statusDisplay: 'Pending Sync',
    isOffline: true,
  };
}

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const { userPhone } = useAuth();
  const navigation = useNavigation();
  const [offlineTxs, setOfflineTxs] = useState([]);

  const loadOffline = useCallback(async () => {
    const state = await getWalletState();
    const userId = userPhone || 'user';
    const debits = (state?.pendingOfflineDebits || []).map((t) => formatOfflineTx(t, userId, 'sent'));
    const credits = (state?.pendingOfflineCredits || []).map((t) => formatOfflineTx(t, userId, 'received'));
    setOfflineTxs([...debits, ...credits].sort((a, b) => b.id.localeCompare(a.id)));
  }, [userPhone]);

  useFocusEffect(
    useCallback(() => {
      loadOffline();
    }, [loadOffline])
  );

  const allTxs = [...offlineTxs, ...MOCK_TRANSACTIONS];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Transaction History</Text>
        <View style={styles.backBtn} />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>This Month</Text>
      </View>
      <FlatList
        data={allTxs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: tx }) => {
          const isSuccess = tx.statusDisplay === 'Success' && !tx.isOffline;
          const amountColor = isSuccess ? colors.success : PENDING_ORANGE;
          const pillBg = isSuccess ? colors.success + '20' : PENDING_ORANGE_LIGHT;
          const pillColor = isSuccess ? colors.success : PENDING_ORANGE;
          const pillLabel = tx.statusDisplay || (isSuccess ? 'Success' : 'Pending');
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.cardBackground }]}
              onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, { backgroundColor: getIconBg(tx.type, colors) }]}>
                <MaterialIcons
                  name={getTransactionIcon(tx.type)}
                  size={24}
                  color={getIconColor(tx.type, colors)}
                />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.itemName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {tx.name}
                </Text>
                <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>
                  {tx.dateTime || `${tx.date} | ${tx.time}`}
                </Text>
              </View>
              <View style={styles.rightCol}>
                <Text style={[styles.itemAmount, { color: amountColor }]}>
                  {tx.type === 'sent' ? '-' : '+'}₦{tx.amount}
                </Text>
                <View style={[styles.pill, { backgroundColor: pillBg }]}>
                  <Text style={[styles.pillText, { color: pillColor }]}>{pillLabel}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  backBtn: { width: 40 },
  title: { fontSize: 18, fontWeight: '700' },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowContent: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemMeta: { fontSize: 13, marginTop: 4 },
  rightCol: { alignItems: 'flex-end' },
  itemAmount: { fontSize: 16, fontWeight: '700' },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  pillText: { fontSize: 12, fontWeight: '600' },
});
