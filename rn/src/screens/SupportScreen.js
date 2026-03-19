import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const BOT_QUICK_TOPICS = [
  {
    id: 'card',
    icon: 'credit-card',
    title: 'Card not working',
    subtitle: 'Declines, limits, freeze or replace card',
    prompt: 'My card is not working',
  },
  {
    id: 'transfer',
    icon: 'swap-horiz',
    title: 'Transfer issue',
    subtitle: 'Pending transfer or wrong beneficiary',
    prompt: 'I have a transfer issue',
  },
  {
    id: 'security',
    icon: 'shield',
    title: 'Security and PIN',
    subtitle: 'Reset PIN, password help, secure account',
    prompt: 'I need help with my PIN and security',
  },
  {
    id: 'offline',
    icon: 'wifi-off',
    title: 'Offline payments',
    subtitle: 'Sync issues and offline balance updates',
    prompt: 'I need help with offline payments',
  },
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
  const chatScrollRef = useRef(null);
  const [messages, setMessages] = useState([initialBotMessage]);
  const [input, setInput] = useState('');
  const [quickOptionsOpen, setQuickOptionsOpen] = useState(true);

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
    return 'Thanks for your message. I can help right away, or I can connect you to a support agent for advanced issues.';
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
      <View style={styles.content}>
        <View style={[styles.botTopCard, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.botAvatar, { backgroundColor: colors.primaryLight }]}>
            <MaterialIcons name="smart-toy" size={18} color={colors.primary} />
          </View>
          <View style={styles.botTopTextWrap}>
            <Text style={[styles.botName, { color: colors.textPrimary }]}>Rexi Assistant</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: '#1DB954' }]} />
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>Online now</Text>
            </View>
          </View>
        </View>

        <ScrollView
          ref={chatScrollRef}
          style={[styles.chatCard, { backgroundColor: colors.cardBackground }]}
          contentContainerStyle={styles.chatMessagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
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

        <TouchableOpacity
          style={styles.quickHeader}
          onPress={() => setQuickOptionsOpen((prev) => !prev)}
          activeOpacity={0.85}
        >
          <Text style={[styles.quickTitle, { color: colors.textPrimary }]}>Quick options</Text>
          <MaterialIcons
            name={quickOptionsOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        {quickOptionsOpen ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            {BOT_QUICK_TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[styles.quickCard, { borderColor: colors.border, backgroundColor: colors.background }]}
                onPress={() => handleSend(topic.prompt)}
                activeOpacity={0.85}
              >
                <View style={[styles.quickCardTopRow]}>
                  <View style={[styles.quickIconWrap, { backgroundColor: colors.primaryLight }]}>
                    <MaterialIcons name={topic.icon} size={14} color={colors.primary} />
                  </View>
                  <MaterialIcons name="north-east" size={14} color={colors.textSecondary} />
                </View>
                <Text style={[styles.quickCardTitle, { color: colors.textPrimary }]}>{topic.title}</Text>
                <Text
                  style={[styles.quickCardSubtitle, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {topic.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}

        <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Write a message..."
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: colors.primary }]}
            onPress={() => handleSend()}
            activeOpacity={0.85}
          >
            <MaterialIcons name="send" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  botTopCard: {
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botTopTextWrap: { flex: 1 },
  botName: { fontSize: 15, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '500' },
  chatCard: {
    borderRadius: 16,
    padding: 12,
    flex: 1,
  },
  chatMessagesContent: {
    paddingVertical: 8,
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
  quickTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  quickHeader: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickRow: {
    paddingRight: 6,
    gap: 8,
    marginBottom: 12,
  },
  quickCard: {
    width: 150,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  quickCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  quickIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardTitle: { fontSize: 12, fontWeight: '700' },
  quickCardSubtitle: { fontSize: 11, lineHeight: 15, marginTop: 4 },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 96,
    paddingHorizontal: 6,
    paddingVertical: 6,
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
