import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';

const PERIODS = [
  { id: '30d', label: 'Last 30 days' },
  { id: '3m', label: 'Last 3 months' },
  { id: '6m', label: 'Last 6 months' },
  { id: 'ytd', label: 'Year to date' },
  { id: 'custom', label: 'Custom range' },
];

function formatDate(d) {
  if (!d) return '';
  const x = new Date(d);
  const month = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  const year = x.getFullYear();
  return `${month}/${day}/${year}`;
}

export default function BankStatementRequestScreen() {
  const { colors } = useTheme();
  const { userEmail } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [period, setPeriod] = useState('30d');
  const [customStart, setCustomStart] = useState(() => {
    const t = new Date();
    t.setMonth(t.getMonth() - 1);
    return t;
  });
  const [customEnd, setCustomEnd] = useState(() => new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const periodLabel = useMemo(() => PERIODS.find((p) => p.id === period)?.label || '', [period]);

  const handleSubmit = () => {
    setSubmitting(true);
    const payload = {
      period,
      periodLabel,
      email: userEmail,
      customStart: period === 'custom' ? customStart.toISOString() : null,
      customEnd: period === 'custom' ? customEnd.toISOString() : null,
    };
    setTimeout(() => {
      setSubmitting(false);
      navigation.replace('BankStatementSuccess', payload);
    }, 600);
  };

  const onStartChange = (e, d) => {
    if (Platform.OS === 'android') setShowStartPicker(false);
    if (d) setCustomStart(d);
  };
  const onEndChange = (e, d) => {
    if (Platform.OS === 'android') setShowEndPicker(false);
    if (d) setCustomEnd(d);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16), borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.headerBack}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Bank statement</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.lead, { color: colors.textSecondary }]}>
            Choose a period and we will email a PDF statement to your registered address. Processing
            usually takes a few minutes.
          </Text>

          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Statement period</Text>
          <View style={styles.chipWrap}>
            {PERIODS.map((p) => {
              const active = period === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setPeriod(p.id)}
                  style={[
                    styles.chip,
                    {
                      borderColor: active ? colors.primary : colors.border,
                      backgroundColor: active ? `${colors.primary}18` : colors.cardBackground,
                    },
                  ]}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? colors.primary : colors.textPrimary },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {period === 'custom' && (
            <View style={styles.customBlock}>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, marginTop: 8 }]}>
                Start date
              </Text>
              <TouchableOpacity
                style={[styles.dateRow, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
                onPress={() => {
                  setShowEndPicker(false);
                  setShowStartPicker(true);
                }}
              >
                <Text style={{ color: colors.textPrimary }}>{formatDate(customStart)}</Text>
                <MaterialIcons name="calendar-today" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <Text style={[styles.sectionLabel, { color: colors.textPrimary, marginTop: 16 }]}>
                End date
              </Text>
              <TouchableOpacity
                style={[styles.dateRow, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
                onPress={() => {
                  setShowStartPicker(false);
                  setShowEndPicker(true);
                }}
              >
                <Text style={{ color: colors.textPrimary }}>{formatDate(customEnd)}</Text>
                <MaterialIcons name="calendar-today" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={customStart}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onStartChange}
                  maximumDate={customEnd}
                />
              )}
              {showEndPicker && (
                <DateTimePicker
                  value={customEnd}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onEndChange}
                  minimumDate={customStart}
                  maximumDate={new Date()}
                />
              )}
              {Platform.OS === 'ios' && (showStartPicker || showEndPicker) && (
                <TouchableOpacity
                  style={styles.iosDone}
                  onPress={() => {
                    setShowStartPicker(false);
                    setShowEndPicker(false);
                  }}
                >
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={[styles.emailCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <MaterialIcons name="email" size={22} color={colors.primary} />
            <View style={styles.emailBody}>
              <Text style={[styles.emailLabel, { color: colors.textSecondary }]}>Deliver to</Text>
              <Text style={[styles.emailValue, { color: colors.textPrimary }]}>{userEmail || '—'}</Text>
            </View>
          </View>

          <Text style={[styles.note, { color: colors.textSecondary }]}>
            Statements include NGN account activity only. For questions, contact support from the Help
            section.
          </Text>

          <PrimaryButton
            text="Request statement"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerBack: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: 20 },
  lead: { fontSize: 14, lineHeight: 21, marginBottom: 20 },
  sectionLabel: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: { fontSize: 14, fontWeight: '600' },
  customBlock: { marginBottom: 8 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iosDone: { alignSelf: 'flex-end', marginTop: 8 },
  emailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
    gap: 12,
  },
  emailBody: { flex: 1 },
  emailLabel: { fontSize: 12, marginBottom: 4 },
  emailValue: { fontSize: 15, fontWeight: '600' },
  note: { fontSize: 12, lineHeight: 18, marginTop: 16, marginBottom: 8 },
  submitBtn: { marginTop: 12 },
});
