import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import HealthFlowHeader from '../../components/HealthFlowHeader';
import PrimaryButton from '../../components/PrimaryButton';

const RELATIONSHIPS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];

const INITIAL = [
  { id: 'self', name: 'You (primary)', relation: 'Account holder', age: '—', isPrimary: true },
  { id: 'm1', name: 'Kemi Okafor', relation: 'Child', age: '8 yrs', isPrimary: false },
];

export default function HealthFamilyProfilesScreen() {
  const { colors } = useTheme();
  const [members, setMembers] = useState(INITIAL);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState(RELATIONSHIPS[1]);
  const [age, setAge] = useState('');

  const addMember = () => {
    const n = name.trim();
    if (!n) {
      Alert.alert('Name', 'Enter the dependant’s full name.');
      return;
    }
    setMembers((prev) => [
      ...prev,
      {
        id: 'n' + Date.now(),
        name: n,
        relation,
        age: age.trim() || '—',
        isPrimary: false,
      },
    ]);
    setModalVisible(false);
    setName('');
    setAge('');
    setRelation(RELATIONSHIPS[1]);
    Alert.alert('Profile added', `${n} can be selected when booking care or claiming benefits (when enabled).`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HealthFlowHeader title="Family & dependants" subtitle="Who is covered under your health activity" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.info, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
          <MaterialIcons name="groups" size={26} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Use profiles to pre-fill names for pharmacy delivery, paediatric telehealth, and HMO enrolment. Limits and
            verification rules apply per product.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PROFILES</Text>
        {members.map((m) => (
          <View
            key={m.id}
            style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          >
            <View style={styles.cardRow}>
              <View style={[styles.avatar, { backgroundColor: `${colors.primary}18` }]}>
                <Text style={[styles.avatarLetter, { color: colors.primary }]}>
                  {(m.name.trim().charAt(0) || '?').toUpperCase()}
                </Text>
              </View>
              <View style={styles.cardMain}>
                <View style={styles.nameRow}>
                  <Text style={[styles.cardName, { color: colors.textPrimary }]}>{m.name}</Text>
                  {m.isPrimary ? (
                    <View style={[styles.primaryPill, { backgroundColor: `${colors.primary}22` }]}>
                      <Text style={[styles.primaryPillText, { color: colors.primary }]}>Primary</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                  {m.relation}
                  {m.age !== '—' ? ` · ${m.age}` : ''}
                </Text>
              </View>
              {!m.isPrimary ? (
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() =>
                    Alert.alert('Remove profile?', `${m.name} will be removed from this list.`, [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Remove',
                        style: 'destructive',
                        onPress: () => setMembers((prev) => prev.filter((x) => x.id !== m.id)),
                      },
                    ])
                  }
                >
                  <MaterialIcons name="more-horiz" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : (
                <MaterialIcons name="verified" size={22} color={colors.success} />
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.addRow, { borderColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <MaterialIcons name="person-add" size={22} color={colors.primary} />
          <Text style={[styles.addText, { color: colors.primary }]}>Add dependant</Text>
        </TouchableOpacity>

        <View style={[styles.tip, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            Tip: Keep dates of birth accurate for children — some vaccines and dosages are age-based.
          </Text>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>New dependant</Text>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full name</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="As on ID or birth certificate"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Relationship</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relPick}>
              {RELATIONSHIPS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.relChip,
                    {
                      borderColor: relation === r ? colors.primary : colors.border,
                      backgroundColor: relation === r ? `${colors.primary}18` : colors.background,
                    },
                  ]}
                  onPress={() => setRelation(r)}
                >
                  <Text style={[styles.relChipText, { color: relation === r ? colors.primary : colors.textPrimary }]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Age or year of birth (optional)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="e.g. 8 yrs or 2017"
              placeholderTextColor={colors.textSecondary}
              value={age}
              onChangeText={setAge}
            />
            <PrimaryButton text="Save profile" onPress={addMember} />
            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 1 },
    }),
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: 18, fontWeight: '800' },
  cardMain: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardName: { fontSize: 16, fontWeight: '800' },
  primaryPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  primaryPillText: { fontSize: 10, fontWeight: '800' },
  cardMeta: { fontSize: 13, marginTop: 4 },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 6,
  },
  addText: { fontSize: 15, fontWeight: '700' },
  tip: { padding: 14, borderRadius: 14, marginTop: 20 },
  tipText: { fontSize: 12, lineHeight: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    paddingBottom: 32,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  relPick: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  relChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  relChipText: { fontSize: 13, fontWeight: '700' },
  modalCancel: { alignItems: 'center', paddingVertical: 14 },
});
