import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const NotificationContext = createContext(null);

export const NOTIFICATION_TYPES = {
  transfer: { icon: 'swap-horiz', color: '#2E63F6', bg: 'rgba(46, 99, 246, 0.12)', label: 'Payments' },
  security: { icon: 'verified-user', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)', label: 'Security' },
  promo: { icon: 'card-giftcard', color: '#EA580C', bg: 'rgba(234, 88, 12, 0.12)', label: 'Offers' },
  system: { icon: 'notifications-active', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', label: 'Account' },
  alert: { icon: 'info-outline', color: '#CA8A04', bg: 'rgba(202, 138, 4, 0.12)', label: 'Action needed' },
};

/** Seed data — replace with API / WebSocket in production */
export const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'transfer',
    title: 'Transfer successful',
    body: 'You sent ₦25,000 to Divine Chiamaka · Ref #RX88291',
    detailBody:
      'Your transfer of ₦25,000 to Divine Chiamaka was completed successfully. Reference RX88291. The recipient should receive the funds within minutes.',
    time: '2 min ago',
    receivedAt: 'Today · 10:42',
    section: 'today',
    read: false,
    ctaLabel: 'View transactions',
    ctaRoute: 'Transactions',
    ctaParams: undefined,
  },
  {
    id: '2',
    type: 'security',
    title: 'OTP sent',
    body: 'A verification code was sent to your registered number.',
    detailBody:
      'For your security, we sent a one-time password to the phone number on your account. Never share this code with anyone. RexiPay staff will never ask for your OTP.',
    time: '1 hour ago',
    receivedAt: 'Today · 9:15',
    section: 'today',
    read: false,
    ctaLabel: 'Security settings',
    ctaRoute: 'ChangePin',
    ctaParams: undefined,
  },
  {
    id: '3',
    type: 'system',
    title: 'Welcome to RexiPay',
    body: 'Your account is ready. Add money to start sending and paying bills.',
    detailBody:
      'Welcome aboard. You can fund your wallet from your bank, send money, buy airtime, pay bills, and explore crypto — all in one place.',
    time: 'Yesterday',
    receivedAt: 'Yesterday · 14:20',
    section: 'earlier',
    read: true,
    ctaLabel: 'Add money',
    ctaRoute: 'AddMoney',
    ctaParams: undefined,
  },
  {
    id: '4',
    type: 'promo',
    title: 'Cashback on airtime',
    body: 'Get 2% back on airtime purchases this week. Tap to see details.',
    detailBody:
      'Recharge any network this week and earn 2% cashback to your RexiPay wallet. Applies to airtime purchases up to ₦50,000 per day.',
    time: '2 days ago',
    receivedAt: 'Mon · 11:00',
    section: 'earlier',
    read: true,
    ctaLabel: 'Buy airtime',
    ctaRoute: 'Airtime',
    ctaParams: undefined,
  },
  {
    id: '5',
    type: 'alert',
    title: 'Verify your email',
    body: 'Confirm your email to unlock higher limits and statements.',
    detailBody:
      'Verifying your email helps us protect your account and lets you receive statements and important alerts. Check your inbox for a confirmation link.',
    time: '3 days ago',
    receivedAt: 'Fri · 08:30',
    section: 'earlier',
    read: true,
    ctaLabel: 'Account details',
    ctaRoute: 'AccountDetails',
    ctaParams: undefined,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      markRead,
      markAllRead,
      remove,
    }),
    [notifications, markRead, markAllRead, remove]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
