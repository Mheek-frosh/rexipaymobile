import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { ALL_SERVICES_SERVICES } from '../data/homeServices';

const { width } = Dimensions.get('window');
const PADDING = 20;
const GAP = 12;
const COLS = 3;
const ITEM_WIDTH = (width - PADDING * 2 - GAP * (COLS - 1)) / COLS;

export default function AllServicesScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  const go = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
    }
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
          Savings first — then bills, shopping, and more. Tap any service to open.
        </Text>

        <View style={styles.grid}>
          {ALL_SERVICES_SERVICES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.tile, { width: ITEM_WIDTH }]}
              onPress={() => go(item)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: isDark ? `${item.bg}33` : item.bg },
                ]}
              >
                <MaterialIcons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={[styles.tileLabel, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.label}
              </Text>
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
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  tile: {
    alignItems: 'center',
    marginBottom: 4,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 14,
  },
});
