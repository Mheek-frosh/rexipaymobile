import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { LogoutBottomSheet } from '../components/BottomSheet';

const MENU_ITEMS = [
  { icon: 'account-balance', iconBg: '#FFD166', iconColor: null, title: 'Cards', route: 'CardsTab' },
  { icon: 'headset-mic', iconBg: '#E8F5E9', iconColor: '#4CAF50', title: 'Support', route: 'Support' },
  { icon: 'settings', iconBg: '#E8F0FE', iconColor: '#2E63F6', title: 'Settings', route: 'Settings' },
  {
    icon: 'storage',
    iconBg: '#E8F5E9',
    iconColor: '#4CAF50',
    title: 'Data & Privacy',
    route: 'DataPrivacy',
  },
  { icon: 'logout', iconBg: '#FFEBEE', iconColor: '#E53935', title: 'Logout', route: 'logout' },
];

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { userName, userPhone, logout } = useAuth();
  const navigation = useNavigation();
  const [showLogoutSheet, setShowLogoutSheet] = useState(false);

  const handleMenuTap = (item) => {
    if (item.route === 'logout') {
      setShowLogoutSheet(true);
    } else if (item.route === 'CardsTab') {
      navigation.navigate('Cards');
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.appBar}>
        <View style={{ width: 24 }} />
        <Text style={[styles.appBarTitle, { color: colors.textPrimary }]}>My Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]}>
            <MaterialIcons name="person" size={40} color={colors.textSecondary} />
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>
                {userName || 'User'}
              </Text>
              <MaterialIcons name="content-copy" size={20} color={colors.textSecondary} />
            </View>
            <Text style={[styles.userDetail, { color: colors.textSecondary }]}>
              Account number {userPhone}
            </Text>
            <Text style={[styles.userDetail, { color: colors.textSecondary }]}>
              Username @{(userName || 'user').replace(/\s/g, '').toLowerCase()}
            </Text>
          </View>
        </View>

        {/* Menu List */}
        <View style={[styles.menuCard, { backgroundColor: colors.cardBackground }]}>
          {/* Dark Mode Toggle */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={toggleTheme}
          >
            <View
              style={[
                styles.menuIconBg,
                {
                  backgroundColor: isDark
                    ? `${colors.surfaceVariant}`
                    : '#F5F5F5',
                },
              ]}
            >
              <MaterialIcons
                name={isDark ? 'light-mode' : 'dark-mode'}
                size={20}
                color={colors.textPrimary}
              />
            </View>
            <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>
              {isDark ? 'Light' : 'Dark'}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor="#FFF"
            />
          </TouchableOpacity>

          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => handleMenuTap(item)}
            >
              <View
                style={[
                  styles.menuIconBg,
                  {
                    backgroundColor: isDark
                      ? `${item.iconBg || '#666'}33`
                      : item.iconBg || '#E0E0E0',
                  },
                ]}
              >
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={item.iconColor || colors.textSecondary}
                />
              </View>
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>{item.title}</Text>
              {item.route !== 'logout' && (
                <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <LogoutBottomSheet
        visible={showLogoutSheet}
        onClose={() => setShowLogoutSheet(false)}
        onConfirm={logout}
      />
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
  content: { padding: 20, paddingBottom: 40 },
  userCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1, marginLeft: 15 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: { fontSize: 16, fontWeight: '700' },
  userDetail: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  menuCard: {
    marginTop: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    gap: 16,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: { flex: 1, fontSize: 15, fontWeight: '600' },
});
