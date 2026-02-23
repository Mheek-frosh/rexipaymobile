import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const SETTINGS_SECTIONS = [
  {
    title: 'Appearance',
    items: [
      {
        icon: 'palette-outlined',
        title: 'Theme',
        subtitle: 'Light, Dark, or System',
        trailing: 'value',
      },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: 'lock-outline', title: 'Change PIN', subtitle: 'Update your transaction PIN' },
      { icon: 'fingerprint', title: 'Biometrics', subtitle: 'Use fingerprint or face ID' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      {
        icon: 'notifications-outlined',
        title: 'Push Notifications',
        subtitle: 'Receive transaction alerts',
      },
      {
        icon: 'email-outlined',
        title: 'Email Notifications',
        subtitle: 'Receive updates via email',
      },
    ],
  },
];

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {SETTINGS_SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.item, { borderBottomColor: colors.border }]}
                  onPress={item.trailing === 'value' ? toggleTheme : undefined}
                >
                  <View style={[styles.itemIcon, { backgroundColor: colors.primaryLight }]}>
                    <MaterialIcons name={item.icon} size={22} color={colors.primary} />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  {item.trailing === 'value' ? (
                    <Text style={[styles.itemValue, { color: colors.textSecondary }]}>
                      {isDark ? 'Dark' : 'Light'}
                    </Text>
                  ) : (
                    <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  sectionCard: { borderRadius: 16, overflow: 'hidden' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    gap: 16,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSubtitle: { fontSize: 14, marginTop: 2 },
  itemValue: { fontSize: 14 },
});
