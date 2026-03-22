/**
 * Shared quick actions / services for Home and All Services screen.
 * `route` is a RootNavigator screen name, or null if not wired yet.
 */
export const HOME_QUICK_SERVICES = [
  { id: 'offline', icon: 'wifi-off', label: 'Offline Pay', color: '#10B981', bg: '#E8F5E9', route: 'OfflinePay' },
  { id: 'airtime', icon: 'wifi', label: 'Airtime', color: '#FF9800', bg: '#FFF3E0', route: 'Airtime' },
  { id: 'internet', icon: 'public', label: 'Internet', color: '#4CAF50', bg: '#E8F5E9', route: null },
  { id: 'electricity', icon: 'bolt', label: 'Electricity', color: '#FFC107', bg: '#FFFDE7', route: null },
  { id: 'history', icon: 'receipt-long', label: 'History', color: '#FF9800', bg: '#FFF8E1', route: 'Transactions' },
  { id: 'shopping', icon: 'shopping-cart', label: 'Shopping', color: '#9C27B0', bg: '#F3E5F5', route: null },
  { id: 'deals', icon: 'volunteer-activism', label: 'Deals', color: '#E91E63', bg: '#FCE4EC', route: null },
  { id: 'health', icon: 'health-and-safety', label: 'Health', color: '#4CAF50', bg: '#E8F5E9', route: null },
  { id: 'savings', icon: 'account-balance', label: 'Savings', color: '#1565C0', bg: '#E3F2FD', route: 'SavingsHome' },
];
