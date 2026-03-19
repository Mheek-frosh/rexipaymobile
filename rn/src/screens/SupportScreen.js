import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
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

const BOT_QUICK_TOPICS = [
  'Card issues',
  'Transfers',
  'Offline payments',
  'Account & PIN',
];

const initialBotMessage = {
  id: 'bot-1',
  from: 'bot',
  text:
    'Hi, I\'m REXI Bot. Tell me what you need help with – cards, transfers, offline payments, or your account.',
};

export default function SupportScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([initialBotMessage]);
  const [input, setInput] = useState('');

  const addMessage = (from, text) => {
    setMessages((prev) => [
      ...prev,
      { id: `${from}-${prev.length + 1}`, from, text },
    ]);
  };

  const getBotReply = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('card')) {
      return 'For card issues, you can view your virtual card under Cards, change limits, freeze, or delete the card from Card Settings. If a transaction looks wrong, freeze the card and contact support.';
    }
    if (lower.includes('transfer') || lower.includes('bank')) {
      return 'For transfers, make sure the beneficiary details are correct. Bank transfers are usually instant; if one is pending for more than 30 minutes, save the reference and contact support.';
    }
    if (lower.includes('offline')) {
      return 'Offline payments use your last synced balance. Make sure you reconnect to the internet regularly so we can sync your offline transactions and keep your balance accurate.';
    }
    if (lower.includes('pin') || lower.includes('password')) {
      return 'You can change your transaction PIN from Settings > Security, or use the Forgot PIN flow if you no longer remember it.';
    }
    return 'Thanks for your message. A support agent will review this shortly. You can also check the FAQs below for quick answers.';
  };

  const handleSend = (textOverride) => {
    const content = (textOverride ?? input).trim();
    if (!content) return;
    addMessage('user', content);
    const reply = getBotReply(content);
    addMessage('bot', reply);
    setInput('');
  };

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

        <View style={[styles.section, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Chat with Rexi Bot</Text>
          <View style={[styles.chatCard, { backgroundColor: colors.cardBackground }]}>
            <ScrollView
              style={styles.chatMessages}
              contentContainerStyle={styles.chatMessagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.from === 'user'
                      ? [styles.chatBubbleUser, { backgroundColor: colors.primary }]
                      : [styles.chatBubbleBot, { backgroundColor: colors.surfaceVariant }],
                  ]}
                >
                  <Text
                    style={[
                      styles.chatText,
                      { color: msg.from === 'user' ? '#FFF' : colors.textPrimary },
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.quickRow}>
              {BOT_QUICK_TOPICS.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={[styles.quickChip, { borderColor: colors.border }]}
                  onPress={() => handleSend(topic)}
                >
                  <Text style={[styles.quickChipText, { color: colors.textSecondary }]}>
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Type your message..."
                placeholderTextColor={colors.textSecondary}
                value={input}
                onChangeText={setInput}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleSend()}
                activeOpacity={0.8}
              >
                <MaterialIcons name="send" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
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
  chatCard: {
    borderRadius: 16,
    padding: 12,
  },
  chatMessages: {
    maxHeight: 220,
  },
  chatMessagesContent: {
    paddingVertical: 4,
  },
  chatBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
  },
  chatBubbleBot: {
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
