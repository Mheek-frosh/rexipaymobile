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
export const INITIAL_NOTIFICATIONS = [];

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
