/**
 * Home quick grid (no Savings — Savings lives under All services).
 * `route` is a RootNavigator screen name.
 */
export const HOME_QUICK_SERVICES = [
  { id: 'airtime',    icon: 'smartphone',           label: 'Airtime',        color: '#172FC7', bg: '#EEF0FF', route: 'Airtime' },
  { id: 'internet',  icon: 'wifi',                  label: 'Internet',       color: '#16A34A', bg: '#F0FDF4', route: 'InternetData' },
  { id: 'electricity', icon: 'bolt',                label: 'Electricity',    color: '#D97706', bg: '#FFFBEB', route: 'ElectricityBill' },
  { id: 'tv',        icon: 'tv',                    label: 'TV Sub',         color: '#7C3AED', bg: '#F5F3FF', route: 'TvSubscription' },
  { id: 'offline',   icon: 'wifi-off',              label: 'Offline Pay',    color: '#059669', bg: '#ECFDF5', route: 'OfflinePay' },
  { id: 'shopping',  icon: 'shopping-bag',          label: 'Shopping',       color: '#DB2777', bg: '#FDF2F8', route: 'ShoppingHub' },
  { id: 'deals',     icon: 'local-offer',           label: 'Deals',          color: '#DC2626', bg: '#FEF2F2', route: 'DealsHub' },
  { id: 'more',      icon: 'more-horiz',            label: 'More',           color: '#374151', bg: '#F9FAFB', route: 'AllServices' },
];

/** All services: Savings first, then same items as home (full list). */
export const ALL_SERVICES_SERVICES = [
  { id: 'savings', icon: 'account-balance', label: 'Savings', color: '#172FC7', bg: '#EEF0FF', route: 'SavingsHome' },
  ...HOME_QUICK_SERVICES,
];
