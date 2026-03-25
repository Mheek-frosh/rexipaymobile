import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  SectionList,
  StyleSheet,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const NOTIFICATION_TYPES = {
  transfer: { icon: 'swap-horiz', color: '#2E63F6', bg: 'rgba(46, 99, 246, 0.12)' },
  security: { icon: 'verified-user', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)' },
  promo: { icon: 'card-giftcard', color: '#EA580C', bg: 'rgba(234, 88, 12, 0.12)' },
  system: { icon: 'notifications-active', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
  alert: { icon: 'info-outline', color: '#CA8A04', bg: 'rgba(202, 138, 4, 0.12)' },
};

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'transfer',
    title: 'Transfer successful',
    body: 'You sent ₦25,000 to Divine Chiamaka · Ref #RX88291',
    time: '2 min ago',
    section: 'today',
    read: false,
  },
  {
    id: '2',
    type: 'security',
    title: 'OTP sent',
    body: 'A verification code was sent to your registered number.',
    time: '1 hour ago',
    section: 'today',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Welcome to RexiPay',
    body: 'Your account is ready. Add money to start sending and paying bills.',
    time: 'Yesterday',
    section: 'earlier',
    read: true,
  },
  {
    id: '4',
    type: 'promo',
    title: 'Cashback on airtime',
    body: 'Get 2% back on airtime purchases this week. Tap to see details.',
    time: '2 days ago',
    section: 'earlier',
    read: true,
  },
  {
    id: '5',
    type: 'alert',
    title: 'Verify your email',
    body: 'Confirm your email to unlock higher limits and statements.',
    time: '3 days ago',
    section: 'earlier',
    read: true,
  },
];

function NotificationRow({ item, colors, onPress, onDelete, swipeRef, onSwipeableOpen }) {
  const meta = NOTIFICATION_TYPES[item.type] || NOTIFICATION_TYPES.system;
  const unread = !item.read;

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onDelete(item.id);
  };

  const renderRightActions = () => (
    <View style={styles.deleteActionOuter}>
      <RectButton style={styles.deleteRect} onPress={handleDelete}>
        <MaterialIcons name="delete-outline" size={26} color="#FFF" />
        <Text style={styles.deleteLabel}>Delete</Text>
      </RectButton>
    </View>
  );

  return (
    <View style={styles.swipeRowOuter}>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={40}
        enableTrackpadTwoFingerGesture
        onSwipeableOpen={onSwipeableOpen}
      >
        <Pressable
          style={({ pressed }) => [
            styles.row,
            {
              backgroundColor: colors.cardBackground,
              borderColor: unread ? `${colors.primary}35` : colors.border,
              opacity: pressed ? 0.92 : 1,
            },
            unread && styles.rowUnread,
          ]}
          onPress={() => onPress(item.id)}
        >
          {unread && <View style={[styles.unreadBar, { backgroundColor: colors.primary }]} />}
          <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
            <MaterialIcons name={meta.icon} size={22} color={meta.color} />
          </View>
          <View style={styles.rowBody}>
            <View style={styles.rowTop}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                {item.title}
              </Text>
              {unread && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
            </View>
            <Text style={[styles.rowBodyText, { color: colors.textSecondary }]} numberOfLines={3}>
              {item.body}
            </Text>
            <Text style={[styles.rowTime, { color: colors.textSecondary }]}>{item.time}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} style={styles.chevron} />
        </Pressable>
      </Swipeable>
    </View>
  );
}

function NotificationSwipeRow({ item, colors, onPress, onDelete, openSwipeRef }) {
  const swipeRef = useRef(null);
  const onSwipeableOpen = () => {
    if (openSwipeRef.current && openSwipeRef.current !== swipeRef.current) {
      openSwipeRef.current.close();
    }
    openSwipeRef.current = swipeRef.current;
  };

  return (
    <NotificationRow
      item={item}
      colors={colors}
      onPress={onPress}
      onDelete={onDelete}
      swipeRef={swipeRef}
      onSwipeableOpen={onSwipeableOpen}
    />
  );
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const sections = useMemo(() => {
    const today = items.filter((n) => n.section === 'today');
    const earlier = items.filter((n) => n.section === 'earlier');
    const out = [];
    if (today.length) out.push({ title: 'Today', data: today });
    if (earlier.length) out.push({ title: 'Earlier', data: earlier });
    return out;
  }, [items]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markOneRead = useCallback((id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const openSwipeRef = useRef(null);

  const removeNotification = useCallback((id) => {
    openSwipeRef.current = null;
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const listEmpty = sections.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 12),
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
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
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerSide}>
          {unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[styles.markAll, { color: colors.primary }]}>Mark all read</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationSwipeRow
            item={item}
            colors={colors}
            onPress={markOneRead}
            onDelete={removeNotification}
            openSwipeRef={openSwipeRef}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{title}</Text>
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 20) },
          listEmpty && styles.listEmpty,
        ]}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}12` }]}>
              <MaterialIcons name="notifications-none" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>You're all caught up</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              New alerts for transfers, security, and offers will show up here.
            </Text>
          </View>
        }
      />
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
  headerSide: {
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: { padding: 8 },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  markAll: { fontSize: 13, fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  listEmpty: { flexGrow: 1, justifyContent: 'center' },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 2,
  },
  swipeRowOuter: {
    marginBottom: 10,
  },
  deleteActionOuter: {
    width: 92,
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  deleteRect: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 8,
  },
  deleteLabel: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  rowUnread: {
    borderWidth: 1,
  },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  rowTitle: { fontSize: 16, fontWeight: '700', flex: 1, letterSpacing: -0.2 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  rowBodyText: { fontSize: 14, lineHeight: 20 },
  rowTime: { fontSize: 12, fontWeight: '500', marginTop: 8, opacity: 0.85 },
  chevron: { marginTop: 10, marginLeft: 4, opacity: 0.5 },
  emptyWrap: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  emptySub: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
