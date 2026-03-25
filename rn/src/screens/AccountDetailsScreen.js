import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

export default function AccountDetailsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { userName, userPhone, userEmail, logout } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const username = `@${(userName || 'user').replace(/\s/g, '').toLowerCase()}`;
  const accountNumber = (userPhone || '0000000000').replace(/\D/g, '').slice(-10);

  const renderSettingItem = (icon, label, value = null, onPress = null, isDestructive = false) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.settingIconWrap, { backgroundColor: isDestructive ? '#EF444415' : `${colors.primary}15` }]}>
        <MaterialIcons name={icon} size={22} color={isDestructive ? '#EF4444' : colors.primary} />
      </View>
      <View style={styles.settingBody}>
        <Text style={[styles.settingLabel, { color: isDestructive ? '#EF4444' : colors.textPrimary }]}>
          {label}
        </Text>
        {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
      </View>
      {onPress && <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.textPrimary }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground, shadowColor: colors.textPrimary }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarWrap, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {(userName || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="edit" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{userName || 'User'}</Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>{username}</Text>
          <View style={[styles.tierBadge, { backgroundColor: `${colors.primary}15` }]}>
            <MaterialIcons name="verified" size={16} color={colors.primary} />
            <Text style={[styles.tierText, { color: colors.primary }]}>Tier 1 Verified</Text>
          </View>
        </View>

        {/* Info Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Personal Information</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
          {renderSettingItem('badge', 'Account Number', accountNumber)}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {renderSettingItem('email', 'Email Address', userEmail || 'Not provided')}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {renderSettingItem('phone', 'Phone Number', `+234 ${userPhone || ''}`)}
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingItem}>
            <View style={[styles.settingIconWrap, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialIcons name="dark-mode" size={22} color={colors.primary} />
            </View>
            <View style={styles.settingBody}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor="#FFF"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {renderSettingItem('lock', 'Security Settings', null, () => Alert.alert('Coming Soon'))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {renderSettingItem('notifications', 'Notifications', null, () => Alert.alert('Coming Soon'))}
        </View>

        {/* Help & Support */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Help & Support</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
          {renderSettingItem('help-center', 'FAQ & Support', null, () => Alert.alert('Coming Soon'))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {renderSettingItem('description', 'Terms & Conditions', null, () => Alert.alert('Coming Soon'))}
        </View>

        {/* Logout */}
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground, marginTop: 10 }]}>
          {renderSettingItem('logout', 'Sign Out', null, handleLogout, true)}
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerText: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20 },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  username: { fontSize: 14, textAlign: 'center', marginBottom: 12 },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingBody: {
    flex: 1,
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 70,
  },
});
