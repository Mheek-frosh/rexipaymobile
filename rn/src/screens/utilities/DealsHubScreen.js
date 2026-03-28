import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { fetchDeals } from '../../services/appContentService';

export default function DealsHubScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchDeals();
      if (mounted) setDeals(Array.isArray(data) ? data : []);
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
        <Text style={[styles.title, { color: colors.textPrimary }]}>Deals</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Exclusive offers for RexiPay users. Tap a deal to learn more.
        </Text>

        {deals.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.deal, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            activeOpacity={0.88}
          >
            <View style={[styles.dealIcon, { backgroundColor: '#FCE4EC' }]}>
              <MaterialIcons name="local-fire-department" size={26} color="#E91E63" />
            </View>
            <View style={styles.dealText}>
              <Text style={[styles.dealTitle, { color: colors.textPrimary }]}>{d.title}</Text>
              <Text style={[styles.dealDesc, { color: colors.textSecondary }]}>{d.desc}</Text>
              <Text style={[styles.dealEnds, { color: colors.primary }]}>{d.ends}</Text>
            </View>
          </TouchableOpacity>
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
    paddingBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  deal: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  dealIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealText: { flex: 1 },
  dealTitle: { fontSize: 16, fontWeight: '700' },
  dealDesc: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  dealEnds: { fontSize: 12, fontWeight: '600', marginTop: 8 },
});
