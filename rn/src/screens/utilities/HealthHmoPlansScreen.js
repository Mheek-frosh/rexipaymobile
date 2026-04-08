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
import { useTheme } from '../../theme/ThemeContext';
import HealthFlowHeader from '../../components/HealthFlowHeader';
import PrimaryButton from '../../components/PrimaryButton';

const PLANS = [
  {
    id: 'bronze',
    name: 'Bronze Care',
    price: 'From ₦45,000',
    period: '/ year · individual',
    highlight: 'Essential inpatient & GP visits',
    features: ['Inpatient cover up to ₦500k', '20 GP consultations', 'Basic diagnostics', 'Emergency stabilisation'],
    accent: '#5D4037',
  },
  {
    id: 'silver',
    name: 'Silver Plus',
    price: 'From ₦95,000',
    period: '/ year · individual',
    highlight: 'Add maternity & dental',
    features: [
      'Inpatient up to ₦1.5M',
      '40 specialist visits',
      'Maternity (waiting period applies)',
      'Dental & optical allowance',
    ],
    accent: '#1565C0',
    badge: 'Popular',
  },
  {
    id: 'gold',
    name: 'Gold Executive',
    price: 'From ₦220,000',
    period: '/ year · family (4)',
    highlight: 'Full family, higher limits',
    features: ['Inpatient up to ₦5M', 'Chronic care programme', 'Executive check-ups', '4 dependants included'],
    accent: '#F57F17',
  },
];

const FAQ = [
  {
    q: 'What is an HMO?',
    a: 'A Health Maintenance Organisation manages your care through a network of hospitals and clinics. You pay a premium instead of large out-of-pocket bills.',
  },
  {
    q: 'When does cover start?',
    a: 'Usually after payment clears and your enrolment is confirmed — often within 5–10 business days. Some benefits have waiting periods.',
  },
  {
    q: 'Can I use RexiPay?',
    a: 'Yes. Pay premiums and co-pays from your RexiPay balance where your provider accepts it. Receipts appear in transaction history.',
  },
];

export default function HealthHmoPlansScreen() {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const submitInterest = () => {
    if (!phone.replace(/\D/g, '') || phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Phone required', 'Enter a valid Nigerian phone number so an adviser can reach you.');
      return;
    }
    setModalVisible(false);
    setPhone('');
    setNote('');
    Alert.alert(
      'Request received',
      'A licensed partner will contact you within 1–2 business days. You can track status from Notifications when live.'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HealthFlowHeader title="HMO & plans" subtitle="Compare coverage and get expert help enrolling" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.intro, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
          <Text style={[styles.introTitle, { color: colors.textPrimary }]}>Why use RexiPay for health cover?</Text>
          <Text style={[styles.introBody, { color: colors.textSecondary }]}>
            One place to explore vetted plans, pay premiums securely, and keep proof of payment for your employer or
            hospital.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PLAN TIERS</Text>
        {PLANS.map((p) => (
          <View
            key={p.id}
            style={[styles.planCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          >
            {p.badge ? (
              <View style={[styles.badge, { backgroundColor: `${p.accent}22` }]}>
                <Text style={[styles.badgeText, { color: p.accent }]}>{p.badge}</Text>
              </View>
            ) : null}
            <View style={[styles.planStripe, { backgroundColor: p.accent }]} />
            <View style={styles.planBody}>
              <Text style={[styles.planName, { color: colors.textPrimary }]}>{p.name}</Text>
              <Text style={[styles.planPrice, { color: p.accent }]}>{p.price}</Text>
              <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>{p.period}</Text>
              <Text style={[styles.planHighlight, { color: colors.textPrimary }]}>{p.highlight}</Text>
              {p.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Text style={[styles.check, { color: p.accent }]}>✓</Text>
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <PrimaryButton text="Talk to an adviser" onPress={() => setModalVisible(true)} style={styles.cta} />

        <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 8 }]}>QUESTIONS</Text>
        {FAQ.map((item, i) => (
          <TouchableOpacity
            key={item.q}
            style={[styles.faqRow, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            onPress={() => setExpanded(expanded === i ? null : i)}
            activeOpacity={0.85}
          >
            <View style={styles.faqHead}>
              <Text style={[styles.faqQ, { color: colors.textPrimary }]}>{item.q}</Text>
              <Text style={[styles.faqToggle, { color: colors.primary }]}>{expanded === i ? '−' : '+'}</Text>
            </View>
            {expanded === i ? (
              <Text style={[styles.faqA, { color: colors.textSecondary }]}>{item.a}</Text>
            ) : null}
          </TouchableOpacity>
        ))}

        <View style={[styles.disclaimer, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Plans shown are illustrative. Final benefits, limits, and exclusions depend on the underwriter. RexiPay does
            not provide medical advice.
          </Text>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Request a callback</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              We will only use this to discuss HMO options. No spam.
            </Text>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="0800 000 0000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline, { color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="e.g. Family of 3, need maternity"
              placeholderTextColor={colors.textSecondary}
              value={note}
              onChangeText={setNote}
              multiline
            />
            <PrimaryButton text="Submit request" onPress={submitInterest} />
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
  scroll: { padding: 16, paddingBottom: 40 },
  intro: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 1 },
    }),
  },
  introTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  introBody: { fontSize: 14, lineHeight: 21 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  planCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 },
      android: { elevation: 2 },
    }),
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '800' },
  planStripe: { height: 5, width: '100%' },
  planBody: { padding: 16 },
  planName: { fontSize: 18, fontWeight: '800' },
  planPrice: { fontSize: 20, fontWeight: '800', marginTop: 6 },
  planPeriod: { fontSize: 13, marginTop: 2 },
  planHighlight: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  check: { fontSize: 14, fontWeight: '800', marginTop: 1 },
  featureText: { flex: 1, fontSize: 13, lineHeight: 19 },
  cta: { marginTop: 8, marginBottom: 8 },
  faqRow: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  faqHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  faqQ: { fontSize: 15, fontWeight: '700', flex: 1 },
  faqToggle: { fontSize: 20, fontWeight: '300', lineHeight: 22 },
  faqA: { fontSize: 13, lineHeight: 20, marginTop: 10 },
  disclaimer: { padding: 14, borderRadius: 14, marginTop: 16 },
  disclaimerText: { fontSize: 12, lineHeight: 18 },
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
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalSub: { fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  modalCancel: { alignItems: 'center', paddingVertical: 14 },
});
