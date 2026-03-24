import { apiGet } from './apiClient';
import { ALL_SERVICES_SERVICES } from '../data/homeServices';

const FALLBACK = {
  services: ALL_SERVICES_SERVICES,
  savingsOverview: {
    totalSaved: '₦170,000',
    goals: [
      { id: '1', name: 'Emergency fund', saved: '₦125,000', target: '₦500,000', percent: 25 },
      { id: '2', name: 'New phone', saved: '₦45,000', target: '₦180,000', percent: 25 },
    ],
  },
  referralOverview: {
    code: 'REXI-7K2M9P',
    stats: { successfulInvites: 3, totalEarned: '₦1,500' },
    invites: [
      { id: '1', name: 'Chidi O.', status: 'Completed', reward: '₦500', date: 'Mar 12' },
      { id: '2', name: 'Amina K.', status: 'Pending', reward: '—', date: 'Mar 10' },
    ],
  },
  rewardsOverview: {
    points: '2,450',
    perks: [
      { icon: 'payments', title: 'Bill payments', desc: 'Earn points when you pay airtime, data & electricity.' },
      { icon: 'swap-horiz', title: 'Transfers', desc: 'Bonus points on transfers above ₦5,000.' },
      { icon: 'account-balance', title: 'Savings goals', desc: 'Extra rewards when you hit monthly savings targets.' },
    ],
  },
  deals: [
    { id: '1', title: '₦500 cashback on transfers', desc: 'Complete 5 transfers this week', ends: 'Ends Mar 25' },
    { id: '2', title: 'Double rewards points', desc: 'On all bill payments above ₦5k', ends: 'Ends Mar 31' },
    { id: '3', title: 'Zero fees weekend', desc: 'Saturday & Sunday only', ends: 'This weekend' },
  ],
  shoppingStores: [
    { id: '1', name: 'Everyday Market', tag: 'Groceries', icon: 'storefront' },
    { id: '2', name: 'Tech & Gadgets', tag: 'Electronics', icon: 'smartphone' },
    { id: '3', name: 'Fashion Hub', tag: 'Clothing', icon: 'shopping-bag' },
    { id: '4', name: 'Home & Living', tag: 'Furniture', icon: 'home' },
  ],
  healthOptions: [
    { id: '1', title: 'HMO & plans', desc: 'Compare health cover (coming soon)', icon: 'local-hospital' },
    { id: '2', title: 'Pharmacy & labs', desc: 'Pay partner pharmacies with RexiPay', icon: 'local-pharmacy' },
    { id: '3', title: 'Telehealth', desc: 'Book virtual consultations', icon: 'videocam' },
  ],
  networks: [
    { id: 'mtn', label: 'MTN', color: '#FFCC00' },
    { id: 'airtel', label: 'Airtel', color: '#E60000' },
    { id: 'glo', label: 'Glo', color: '#00A859' },
    { id: '9mobile', label: '9mobile', color: '#006847' },
  ],
  discos: ['IKEDC', 'EKEDC', 'AEDC', 'PHED', 'KEDCO', 'EEDC'],
};

const resolve = async (path, key) => {
  const res = await apiGet(path);
  if (res.success && res.data?.[key]) return res.data[key];
  return FALLBACK[key];
};

export const fetchAllServices = () => resolve('/api/services/all', 'services');
export const fetchSavingsOverview = () => resolve('/api/savings/overview', 'savingsOverview');
export const fetchReferralOverview = () => resolve('/api/referrals/overview', 'referralOverview');
export const fetchRewardsOverview = () => resolve('/api/rewards/overview', 'rewardsOverview');
export const fetchDeals = () => resolve('/api/deals', 'deals');
export const fetchShoppingStores = () => resolve('/api/shopping/stores', 'shoppingStores');
export const fetchHealthOptions = () => resolve('/api/health/options', 'healthOptions');
export const fetchNetworks = () => resolve('/api/mobile/networks', 'networks');
export const fetchDiscos = () => resolve('/api/electricity/discos', 'discos');
