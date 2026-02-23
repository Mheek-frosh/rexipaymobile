import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

export default function AccountDetailsScreen() {
  const { colors } = useTheme();
  const { userName, userPhone } = useAuth();
  const navigation = useNavigation();

  const username = `@${(userName || 'user').replace(/\s/g, '').toLowerCase()}`;
  const accountNumber = (userPhone || '0000000000').replace(/\D/g, '').slice(-10);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={[styles.headerText, { color: colors.textPrimary }]}>Account Details</Text>
          <Text style={styles.ngFlag}>🇳🇬</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.avatarWrap, { backgroundColor: colors.surfaceVariant }]}>
          <MaterialIcons name="person" size={50} color={colors.textPrimary} />
        </View>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{userName || 'User'}</Text>
        <Text style={[styles.username, { color: colors.textSecondary }]}>{username}</Text>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Account Number</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{accountNumber}</Text>
          </View>
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>+234 {userPhone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>user@rexipay.com</Text>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerText: { fontSize: 18, fontWeight: '700' },
  ngFlag: { fontSize: 18 },
  content: { padding: 20 },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  name: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 12 },
  username: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  card: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600' },
});
