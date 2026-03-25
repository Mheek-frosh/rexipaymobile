import React, { useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { useNotifications, NOTIFICATION_TYPES } from '../context/NotificationContext';
import PrimaryButton from '../components/PrimaryButton';

export default function NotificationDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { id } = route.params || {};
  const { notifications, markRead, remove } = useNotifications();

  const notification = useMemo(() => (id ? notifications.find((n) => n.id === id) : null), [notifications, id]);

  useLayoutEffect(() => {
    if (!id || !notifications.some((n) => n.id === id)) {
      navigation.goBack();
    }
  }, [id, notifications, navigation]);

  useLayoutEffect(() => {
    if (notification && !notification.read) {
      markRead(notification.id);
    }
  }, [notification, markRead]);

  if (!notification) {
    return null;
  }

  const meta = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system;
  const detailText = notification.detailBody || notification.body;

  const handlePrimaryCta = () => {
    if (notification.ctaRoute) {
      navigation.navigate(notification.ctaRoute, notification.ctaParams || {});
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete notification?', 'This will remove it from your inbox.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          remove(notification.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 12),
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerSide}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.backBtn}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          Notification
        </Text>
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="delete-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 24) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
            <MaterialIcons name={meta.icon} size={36} color={meta.color} />
          </View>
          <Text style={[styles.category, { color: meta.color }]}>{meta.label}</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{notification.title}</Text>
          <Text style={[styles.metaTime, { color: colors.textSecondary }]}>{notification.receivedAt}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Message</Text>
          <Text style={[styles.body, { color: colors.textPrimary }]}>{detailText}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Preview</Text>
          <Text style={[styles.preview, { color: colors.textSecondary }]}>{notification.body}</Text>
        </View>

        {notification.ctaRoute && notification.ctaLabel ? (
          <PrimaryButton text={notification.ctaLabel} onPress={handlePrimaryCta} style={styles.cta} />
        ) : null}

        <TouchableOpacity
          style={[styles.linkRow, { borderColor: colors.border }]}
          onPress={() => navigation.navigate('NotificationSettings')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="tune" size={22} color={colors.primary} />
          <Text style={[styles.linkText, { color: colors.textPrimary }]}>Notification preferences</Text>
          <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerSide: { minWidth: 48, alignItems: 'center', justifyContent: 'center' },
  backBtn: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
  scroll: { padding: 20 },
  hero: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  category: { fontSize: 18, fontWeight: '700', letterSpacing: 0.3, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8, letterSpacing: -0.3 },
  metaTime: { fontSize: 14 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
  },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  body: { fontSize: 16, lineHeight: 24 },
  preview: { fontSize: 14, lineHeight: 21 },
  cta: { marginTop: 4, marginBottom: 8 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginTop: 8,
  },
  linkText: { flex: 1, fontSize: 16, fontWeight: '600' },
});
