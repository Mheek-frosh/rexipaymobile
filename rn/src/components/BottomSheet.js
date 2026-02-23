import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const { height } = Dimensions.get('window');

const CURRENCY_ACCOUNTS = [
  { id: 'ngn', name: 'Naira', code: 'NGN', flag: '🇳🇬', balance: '₦250,000', symbol: '₦' },
  { id: 'usd', name: 'US Dollar', code: 'USD', flag: '🇺🇸', balance: '$1,250.00', symbol: '$' },
  { id: 'gbp', name: 'British Pound', code: 'GBP', flag: '🇬🇧', balance: '£850.00', symbol: '£' },
];

export function AccountSwitcherSheet({ visible, onClose, selectedAccount, onSelect }) {
  const { colors } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{ width: '100%' }}
        >
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor: colors.background },
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Switch Account
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select an account to view balance
          </Text>
          {CURRENCY_ACCOUNTS.map((acc) => (
            <TouchableOpacity
              key={acc.id}
              style={[
                styles.accountItem,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: selectedAccount === acc.id ? colors.primary : colors.border,
                  borderWidth: selectedAccount === acc.id ? 2 : 1,
                },
              ]}
              onPress={() => {
                onSelect(acc);
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.accFlag}>{acc.flag}</Text>
              <View style={styles.accInfo}>
                <Text style={[styles.accName, { color: colors.textPrimary }]}>
                  {acc.name}
                </Text>
                <Text style={[styles.accCode, { color: colors.textSecondary }]}>
                  {acc.code}
                </Text>
              </View>
              <Text style={[styles.accBalance, { color: colors.primary }]}>
                {acc.balance}
              </Text>
              {selectedAccount === acc.id && (
                <MaterialIcons name="check-circle" size={24} color={colors.success} />
              )}
            </TouchableOpacity>
          ))}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export function LogoutBottomSheet({ visible, onClose, onConfirm }) {
  const { colors } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{ width: '100%' }}
        >
          <Animated.View
            style={[
              styles.sheet,
              styles.logoutSheet,
              { backgroundColor: colors.background },
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={[styles.logoutIconWrap, { backgroundColor: '#FFEBEE' }]}>
            <MaterialIcons name="logout" size={48} color="#E53935" />
          </View>
          <Text style={[styles.logoutTitle, { color: colors.textPrimary }]}>
            Logout
          </Text>
          <Text style={[styles.logoutSub, { color: colors.textSecondary }]}>
            Are you sure you want to logout from your account?
          </Text>
          <View style={styles.logoutActions}>
            <TouchableOpacity
              style={[styles.logoutCancel, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.logoutCancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logoutConfirm, { backgroundColor: colors.error }]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.logoutConfirmText}>Logout</Text>
            </TouchableOpacity>
          </View>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: height * 0.6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  accFlag: { fontSize: 28 },
  accInfo: { flex: 1 },
  accName: { fontSize: 16, fontWeight: '600' },
  accCode: { fontSize: 12, marginTop: 2 },
  accBalance: { fontSize: 16, fontWeight: '700' },
  logoutSheet: { alignItems: 'center' },
  logoutIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  logoutSub: { fontSize: 15, textAlign: 'center', marginBottom: 28 },
  logoutActions: { flexDirection: 'row', gap: 12, width: '100%' },
  logoutCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutCancelText: { fontSize: 16, fontWeight: '600' },
  logoutConfirm: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutConfirmText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
