import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { HOME_QUICK_SERVICES } from '../data/homeServices';

export default function AllServicesScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  const go = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
      return;
    }
    Alert.alert('Coming soon', `${item.label} will be available in a future update.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>All services</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Pay bills, save money, and manage your account — all in one place.
        </Text>

        <View style={styles.grid}>
          {HOME_QUICK_SERVICES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.tile, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => go(item)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: isDark ? `${item.bg}33` : item.bg },
                ]}
              >
                <MaterialIcons name={item.icon} size={26} color={item.color} />
              </View>
              <Text style={[styles.tileLabel, { color: colors.textPrimary }]} numberOfLines={2}>
                {item.label}
              </Text>
              <MaterialIcons name="chevron-right" size={18} color={colors.textSecondary} style={styles.chevron} />
            </TouchableOpacity>
          ))}
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
    paddingBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  grid: { gap: 10 },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  chevron: { opacity: 0.7 },
});
