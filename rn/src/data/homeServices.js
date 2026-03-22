/**
 * Home quick grid (no Savings — Savings lives under All services).
 * `route` is a RootNavigator screen name.
 */
export const HOME_QUICK_SERVICES = [
  { id: 'offline', icon: 'wifi-off', label: 'Offline Pay', color: '#10B981', bg: '#E8F5E9', route: 'OfflinePay' },
  { id: 'airtime', icon: 'wifi', label: 'Airtime', color: '#FF9800', bg: '#FFF3E0', route: 'Airtime' },
  { id: 'internet', icon: 'public', label: 'Internet', color: '#4CAF50', bg: '#E8F5E9', route: 'InternetData' },
  { id: 'electricity', icon: 'bolt', label: 'Electricity', color: '#FFC107', bg: '#FFFDE7', route: 'ElectricityBill' },
  { id: 'history', icon: 'receipt-long', label: 'History', color: '#FF9800', bg: '#FFF8E1', route: 'Transactions' },
  { id: 'shopping', icon: 'shopping-cart', label: 'Shopping', color: '#9C27B0', bg: '#F3E5F5', route: 'ShoppingHub' },
  { id: 'deals', icon: 'volunteer-activism', label: 'Deals', color: '#E91E63', bg: '#FCE4EC', route: 'DealsHub' },
  { id: 'health', icon: 'health-and-safety', label: 'Health', color: '#4CAF50', bg: '#E8F5E9', route: 'HealthHub' },
];

/** All services: Savings first, then same items as home (full list). */
export const ALL_SERVICES_SERVICES = [
  { id: 'savings', icon: 'account-balance', label: 'Savings', color: '#1565C0', bg: '#E3F2FD', route: 'SavingsHome' },
  ...HOME_QUICK_SERVICES,
];
