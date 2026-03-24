import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { fetchShoppingStores } from '../services/appContentService';

export default function ShoppingHubScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchShoppingStores();
      if (mounted) setStores(Array.isArray(data) ? data : []);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Shopping</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Shop partner stores with your RexiPay balance. More merchants added weekly.
        </Text>

        {stores.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            activeOpacity={0.85}
          >
            <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
              <MaterialIcons name={s.icon} size={26} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{s.name}</Text>
              <Text style={[styles.cardTag, { color: colors.textSecondary }]}>{s.tag}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}

        <View style={[styles.banner, { backgroundColor: colors.primaryLight }]}>
          <MaterialIcons name="local-offer" size={22} color={colors.primary} />
          <Text style={[styles.bannerText, { color: colors.primary }]}>
            Use RexiPay at checkout for instant confirmation.
          </Text>
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
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardTag: { fontSize: 13, marginTop: 2 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  bannerText: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 18 },
});
