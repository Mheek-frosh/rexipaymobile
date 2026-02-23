import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const MOCK_TRANSACTIONS = [
  { id: '1', name: 'Divine Chiamaka', amount: '25,000', type: 'sent', date: 'Today', time: '2:30 PM', ref: 'RXP' + Date.now(), status: 'Completed', bank: 'GTBank', account: '0123456789' },
  { id: '2', name: 'John Doe', amount: '50,000', type: 'received', date: 'Yesterday', time: '10:15 AM', ref: 'RXP' + (Date.now() - 86400000), status: 'Completed', bank: 'Access Bank', account: '0987654321' },
  { id: '3', name: 'Airtime Purchase', amount: '1,000', type: 'sent', date: '2 days ago', time: '4:45 PM', ref: 'RXP' + (Date.now() - 172800000), status: 'Completed' },
];

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Transactions</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={MOCK_TRANSACTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.cardBackground }]}
            onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
            activeOpacity={0.8}
          >
            <View>
              <Text style={[styles.itemName, { color: colors.textPrimary }]}>{item.name}</Text>
              <Text style={[styles.itemDate, { color: colors.textSecondary }]}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.itemAmount,
                { color: item.type === 'sent' ? colors.error : colors.success },
              ]}
            >
              {item.type === 'sent' ? '-' : '+'}₦{item.amount}
            </Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  list: { padding: 20 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemDate: { fontSize: 12, marginTop: 4 },
  itemAmount: { fontSize: 16, fontWeight: '600' },
});
