import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Transfer Successful', body: 'You sent ₦25,000 to Divine Chiamaka', time: '2 min ago' },
  { id: '2', title: 'OTP Sent', body: 'Your verification code has been sent', time: '1 hour ago' },
  { id: '3', title: 'Welcome to RexiPay', body: 'Your account has been created successfully', time: 'Yesterday' },
];

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.itemBody, { color: colors.textSecondary }]}>{item.body}</Text>
            <Text style={[styles.itemTime, { color: colors.textSecondary }]}>{item.time}</Text>
          </View>
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemBody: { fontSize: 14, marginTop: 4 },
  itemTime: { fontSize: 12, marginTop: 8 },
});
