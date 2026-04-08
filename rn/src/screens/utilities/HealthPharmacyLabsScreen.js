import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import HealthFlowHeader from '../../components/HealthFlowHeader';
import PrimaryButton from '../../components/PrimaryButton';

const PHARMACIES = [
  { id: '1', name: 'MedPlus Pharmacy', area: 'Victoria Island', eta: '45 min', rx: true },
  { id: '2', name: 'HealthPlus', area: 'Ikeja City Mall', eta: 'Same day', rx: true },
  { id: '3', name: 'Reddington Pharmacy', area: 'Lekki Phase 1', eta: '60 min', rx: false },
  { id: '4', name: 'MegaCare Chemists', area: 'Surulere', eta: '90 min', rx: true },
];

const LABS = [
  { id: 'l1', name: 'SynLab Diagnostics', area: 'Nationwide booking', tests: 'Full panel, PCR, imaging refs' },
  { id: 'l2', name: 'Lagos University Lab', area: 'Ikeja', tests: 'Blood work, cultures' },
  { id: 'l3', name: 'PathCare', area: 'Multiple centres', tests: 'Home sample collection available' },
];

export default function HealthPharmacyLabsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');

  const filteredPharm = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHARMACIES;
    return PHARMACIES.filter((p) => p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q));
  }, [query]);

  const filteredLabs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LABS;
    return LABS.filter((p) => p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q));
  }, [query]);

  const payPartner = (name, kind) => {
    Alert.alert(
      'Pay with RexiPay',
      `${kind} · ${name}\n\nIn production you would enter amount or scan a bill. For now, add money if you need balance, then complete payment with your transaction PIN.`,
      [
        { text: 'Not now', style: 'cancel' },
        { text: 'Add money', onPress: () => navigation.navigate('AddMoney') },
      ]
    );
  };

  const bookLab = (name) => {
    Alert.alert(
      'Book a test',
      `${name}\n\nChoose a test package and time slot. A partner will confirm via SMS. (Demo flow)`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HealthFlowHeader title="Pharmacy & labs" subtitle="Order, pay, and book diagnostics" />

      <View style={[styles.tabs, { backgroundColor: colors.surfaceVariant }]}>
        {['Pharmacy', 'Lab tests'].map((label, i) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.tab,
              tab === i && { backgroundColor: colors.cardBackground },
              { borderColor: colors.border },
            ]}
            onPress={() => setTab(i)}
          >
            <Text style={[styles.tabText, { color: tab === i ? colors.primary : colors.textSecondary }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.searchWrap, { marginHorizontal: 16 }]}>
        <MaterialIcons name="search" size={22} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.search, { color: colors.textPrimary }]}
          placeholder={tab === 0 ? 'Search pharmacy or area' : 'Search lab or test type'}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {tab === 0 ? (
        <FlatList
          data={filteredPharm}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPad}
          ListHeaderComponent={
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Partner fulfilment — pay securely from RexiPay. Prescription verification may be required.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.cardTop}>
                <View style={[styles.pinIcon, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialIcons name="local-pharmacy" size={24} color="#2E7D32" />
                </View>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>{item.area} · {item.eta}</Text>
                  {item.rx ? (
                    <View style={[styles.pill, { backgroundColor: `${colors.primary}18` }]}>
                      <Text style={[styles.pillText, { color: colors.primary }]}>Prescription accepted</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.secondaryBtn, { borderColor: colors.border }]}
                  onPress={() => payPartner(item.name, 'Pharmacy order')}
                >
                  <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>Pay bill</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.primaryOutline, { borderColor: colors.primary }]}
                  onPress={() =>
                    Alert.alert('Track order', 'Order tracking will appear here once you complete a purchase.')
                  }
                >
                  <Text style={[styles.primaryOutlineText, { color: colors.primary }]}>How it works</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={filteredLabs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPad}
          ListHeaderComponent={
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Book a slot, visit centre, or request home sample where available. Results often within 24–72 hours.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.cardTop}>
                <View style={[styles.pinIcon, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialIcons name="science" size={24} color="#1565C0" />
                </View>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>{item.area}</Text>
                  <Text style={[styles.tests, { color: colors.textSecondary }]}>{item.tests}</Text>
                </View>
              </View>
              <PrimaryButton text="Book appointment" onPress={() => bookLab(item.name)} style={styles.cardCta} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 4,
    borderRadius: 14,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: { fontSize: 14, fontWeight: '700' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchIcon: { position: 'absolute', left: 14, zIndex: 1 },
  search: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 44,
    paddingRight: 14,
    fontSize: 16,
  },
  listPad: { padding: 16, paddingTop: 8, paddingBottom: 32 },
  hint: { fontSize: 13, lineHeight: 19, marginBottom: 14 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 1 },
    }),
  },
  cardTop: { flexDirection: 'row', gap: 12 },
  pinIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardMeta: { fontSize: 13, marginTop: 4 },
  tests: { fontSize: 12, marginTop: 6, lineHeight: 17 },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  pillText: { fontSize: 11, fontWeight: '700' },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: { fontWeight: '700', fontSize: 14 },
  primaryOutline: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryOutlineText: { fontWeight: '700', fontSize: 14 },
  cardCta: { marginTop: 14 },
});
