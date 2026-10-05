import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import AppBackButton from '../../components/AppBackButton';

const DESIGN_OPTIONS = [
  { id: 'blue', label: 'Blue' },
  { id: 'bamboo', label: 'Bamboo' },
];

const MODE_OPTIONS = [
  { id: 'system', label: 'Phone' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

const SETTINGS_SECTIONS = [
  {
    title: 'Security',
    items: [
      {
        icon: 'lock-outline',
        title: 'Change PIN',
        subtitle: 'Update your transaction PIN',
        route: 'ChangePin',
      },
      {
        icon: 'fingerprint',
        title: 'Biometrics',
        subtitle: 'Use Face ID or fingerprint',
        route: 'Biometrics',
      },
    ],
  },
  {
    title: 'Notifications',
    items: [
      {
        icon: 'notifications',
        title: 'Push notifications',
        subtitle: 'Transaction alerts, security, and offers',
        route: 'NotificationSettings',
      },
      {
        icon: 'email',
        title: 'Email & preferences',
        subtitle: 'Receipts, statements, and channel settings',
        route: 'NotificationSettings',
      },
    ],
  },
];

function AppearanceCard({ colors, palette, themeMode, setPalette, setThemeMode }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground, padding: 16 }]}>
        <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>Design</Text>
        <Text style={[styles.itemSubtitle, { color: colors.textSecondary, marginBottom: 12 }]}>
          Choose Blue or Bamboo. Both support light and dark.
        </Text>
        <View style={styles.segmentRow}>
          {DESIGN_OPTIONS.map((option) => {
            const selected = palette === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.segment,
                  {
                    backgroundColor: selected ? colors.primary : colors.surfaceVariant,
                    borderRadius: colors.buttonRadius,
                  },
                ]}
                onPress={() => setPalette(option.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentLabel, { color: selected ? colors.onPrimary : colors.textPrimary }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.itemTitle, { color: colors.textPrimary, marginTop: 18 }]}>Mode</Text>
        <Text style={[styles.itemSubtitle, { color: colors.textSecondary, marginBottom: 12 }]}>
          Phone follows your device. Light or Dark keeps that look until you change it.
        </Text>
        <View style={styles.segmentRow}>
          {MODE_OPTIONS.map((option) => {
            const selected = themeMode === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.segment,
                  {
                    backgroundColor: selected ? colors.primary : colors.surfaceVariant,
                    borderRadius: colors.buttonRadius,
                  },
                ]}
                onPress={() => setThemeMode(option.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentLabel, { color: selected ? colors.onPrimary : colors.textPrimary }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { colors, palette, themeMode, setPalette, setThemeMode } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.header}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.content}>
        <AppearanceCard
          colors={colors}
          palette={palette}
          themeMode={themeMode}
          setPalette={setPalette}
          setThemeMode={setThemeMode}
        />
        {SETTINGS_SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
              {section.items.map((item, ii) => {
                const handlePress = item.route ? () => navigation.navigate(item.route) : undefined;

                return (
                  <TouchableOpacity
                    key={ii}
                    style={[styles.item, { borderBottomColor: colors.border }]}
                    onPress={handlePress}
                    activeOpacity={0.7}
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
                  <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                );
              })}
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
    paddingTop: 12,
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
  segmentRow: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  segmentLabel: { fontSize: 14, fontWeight: '700' },
});
