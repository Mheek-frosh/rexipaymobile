import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const CONTACTS = [
  { icon: 'email', label: 'Email', value: 'support@rexipay.com' },
  { icon: 'phone', label: 'Phone', value: '+234 800 000 0000' },
  { icon: 'chat-bubble-outline', label: 'Live Chat', value: 'Available 24/7' },
];

const FAQS = [
  {
    q: 'How do I add money to my wallet?',
    a: 'You can add money via Bank Transfer or Crypto. Go to Home > Add Money and select your preferred method.',
  },
  {
    q: 'How do I reset my PIN?',
    a: 'Go to Profile > Settings > Security to reset your transaction PIN.',
  },
  {
    q: 'How long do transfers take?',
    a: 'Bank transfers are usually instant. Crypto transfers may take a few minutes depending on network congestion.',
  },
];

export default function SupportScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Support</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact Us</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
            {CONTACTS.map((c, i) => (
              <View key={i} style={styles.contactItem}>
                <View style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}>
                  <MaterialIcons name={c.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>
                    {c.label}
                  </Text>
                  <Text style={[styles.contactValue, { color: colors.textPrimary }]}>{c.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>FAQs</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
            {FAQS.map((faq, i) => (
              <View key={i} style={styles.faqItem}>
                <Text style={[styles.faqQ, { color: colors.textPrimary }]}>{faq.q}</Text>
                <Text style={[styles.faqA, { color: colors.textSecondary }]}>{faq.a}</Text>
              </View>
            ))}
          </View>
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
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 14 },
  contactValue: { fontSize: 16, fontWeight: '600', marginTop: 2 },
  faqItem: { marginBottom: 16 },
  faqQ: { fontSize: 16, fontWeight: '600' },
  faqA: { fontSize: 14, marginTop: 8, lineHeight: 20 },
});
