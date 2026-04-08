import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import HealthFlowHeader from '../../components/HealthFlowHeader';
import PrimaryButton from '../../components/PrimaryButton';

const SPECIALTIES = [
  { id: 'gp', label: 'General practice', icon: 'medical-services' },
  { id: 'ped', label: 'Paediatrics', icon: 'child-care' },
  { id: 'mental', label: 'Mental health', icon: 'psychology' },
  { id: 'derm', label: 'Dermatology', icon: 'spa' },
  { id: 'gyn', label: "Women's health", icon: 'favorite' },
  { id: 'chronic', label: 'Chronic care', icon: 'healing' },
];

const DOCTORS = [
  {
    id: 'd1',
    name: 'Dr. Adaora N.',
    spec: 'General practice',
    rating: '4.9',
    patients: '2.1k visits',
    nextSlot: 'Today · 4:20 PM',
    languages: 'English, Igbo',
  },
  {
    id: 'd2',
    name: 'Dr. Tunde M.',
    spec: 'Paediatrics',
    rating: '4.8',
    patients: '1.4k visits',
    nextSlot: 'Tomorrow · 9:00 AM',
    languages: 'English, Yoruba',
  },
  {
    id: 'd3',
    name: 'Dr. Chioma E.',
    spec: 'Mental health',
    rating: '5.0',
    patients: '890 visits',
    nextSlot: 'Today · 7:00 PM',
    languages: 'English',
  },
];

export default function HealthTelehealthScreen() {
  const { colors } = useTheme();
  const [specialty, setSpecialty] = useState('gp');

  const filtered = DOCTORS.filter((d) => {
    const s = SPECIALTIES.find((x) => x.id === specialty);
    return !s || d.spec === s.label;
  });

  const book = (doc) => {
    Alert.alert(
      'Confirm video visit',
      `${doc.name}\n${doc.nextSlot}\n\nYou will receive a secure link before the appointment. Consultation fees are charged after the session in production.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () =>
            Alert.alert('Booked (demo)', 'Check Notifications for your session link when this feature goes live.'),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HealthFlowHeader title="Telehealth" subtitle="Licensed doctors by secure video" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: '#E3F2FD', borderColor: colors.border }]}>
          <MaterialIcons name="videocam" size={28} color="#1565C0" />
          <View style={styles.bannerText}>
            <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>How it works</Text>
            <Text style={[styles.bannerBody, { color: colors.textSecondary }]}>
              Pick a specialty, choose a clinician, and join from a quiet place. Have your vitals and pharmacy details
              ready.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>SPECIALTY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {SPECIALTIES.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.chip,
                {
                  backgroundColor: specialty === s.id ? colors.primary : colors.cardBackground,
                  borderColor: specialty === s.id ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSpecialty(s.id)}
            >
              <MaterialIcons
                name={s.icon}
                size={18}
                color={specialty === s.id ? '#FFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.chipLabel,
                  { color: specialty === s.id ? '#FFF' : colors.textPrimary },
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 8 }]}>AVAILABLE CLINICIANS</Text>
        {(filtered.length ? filtered : DOCTORS).map((doc) => (
          <View
            key={doc.id}
            style={[styles.docCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          >
            <View style={styles.docRow}>
              <View style={[styles.avatar, { backgroundColor: `${colors.primary}20` }]}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>
                  {doc.name
                    .replace('Dr. ', '')
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={[styles.docName, { color: colors.textPrimary }]}>{doc.name}</Text>
                <Text style={[styles.docSpec, { color: colors.textSecondary }]}>{doc.spec}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={16} color="#F59E0B" />
                  <Text style={[styles.rating, { color: colors.textPrimary }]}>{doc.rating}</Text>
                  <Text style={[styles.dot, { color: colors.textSecondary }]}> · </Text>
                  <Text style={[styles.meta, { color: colors.textSecondary }]}>{doc.patients}</Text>
                </View>
                <Text style={[styles.lang, { color: colors.textSecondary }]}>{doc.languages}</Text>
              </View>
            </View>
            <View style={[styles.slotRow, { backgroundColor: colors.surfaceVariant }]}>
              <MaterialIcons name="event" size={18} color={colors.primary} />
              <Text style={[styles.slotText, { color: colors.textPrimary }]}>{doc.nextSlot}</Text>
            </View>
            <PrimaryButton text="Book video visit" onPress={() => book(doc)} style={styles.bookBtn} />
          </View>
        ))}

        <View style={[styles.foot, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.footText, { color: colors.textSecondary }]}>
            Telehealth is not for emergencies. If you have chest pain, sudden weakness, or difficulty breathing, call
            emergency services immediately.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 36 },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 1 },
    }),
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  bannerBody: { fontSize: 13, lineHeight: 19 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  chips: { gap: 8, paddingBottom: 4, flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  chipLabel: { fontSize: 13, fontWeight: '700' },
  docCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  docRow: { flexDirection: 'row', gap: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800' },
  docInfo: { flex: 1, minWidth: 0 },
  docName: { fontSize: 17, fontWeight: '800' },
  docSpec: { fontSize: 13, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  rating: { fontSize: 14, fontWeight: '700', marginLeft: 4 },
  dot: { fontSize: 14 },
  meta: { fontSize: 13 },
  lang: { fontSize: 12, marginTop: 6 },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
  },
  slotText: { fontSize: 14, fontWeight: '700', flex: 1 },
  bookBtn: { marginTop: 12 },
  foot: { padding: 14, borderRadius: 14, marginTop: 8 },
  footText: { fontSize: 12, lineHeight: 18 },
});
