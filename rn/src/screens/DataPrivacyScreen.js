import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const SECTIONS = [
  {
    title: 'Data Collection',
    content:
      'We collect only the information necessary to provide our services: account details, transaction history, and device information for security.',
  },
  {
    title: 'Data Usage',
    content:
      'Your data is used to process transactions, improve our services, and comply with legal requirements. We never sell your personal information.',
  },
  {
    title: 'Data Security',
    content:
      'We use industry-standard encryption to protect your data. Your account is secured with PIN and optional biometric authentication.',
  },
  {
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or delete your personal data. Contact support@rexipay.com for any data-related requests.',
  },
  {
    title: 'Cookies & Tracking',
    content:
      'We use minimal cookies for app functionality. We do not track your activity for advertising purposes.',
  },
];

export default function DataPrivacyScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Data & Privacy</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {SECTIONS.map((s, i) => (
          <View
            key={i}
            style={[styles.section, { backgroundColor: colors.cardBackground }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{s.title}</Text>
            <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
              {s.content}
            </Text>
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
    paddingTop: 50,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  sectionContent: { fontSize: 14, marginTop: 12, lineHeight: 22 },
});
