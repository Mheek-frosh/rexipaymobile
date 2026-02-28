/**
 * Offline Sync Service
 * Detects network, syncs pending transactions when online.
 */

import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '../config/apiConfig';
import { getWalletState, syncFromServer, markTransactionsSynced } from './offlineWalletService';

let listeners = [];
let isOnline = true;

export function isConnected() {
  return isOnline;
}

export function addNetworkListener(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

export function notifyListeners(online) {
  isOnline = online;
  listeners.forEach((cb) => cb(online));
}

export function startNetworkMonitoring() {
  return NetInfo.addEventListener((state) => {
    const online = state.isConnected === true && state.isInternetReachable !== false;
    notifyListeners(online);
  });
}

export async function syncPendingTransactions() {
  const state = await getWalletState();
  const debits = state.pendingOfflineDebits || [];
  const credits = state.pendingOfflineCredits || [];
  const all = [...debits, ...credits];
  if (all.length === 0) return { success: true, synced: [] };

  try {
    const res = await fetch(`${API_BASE_URL}/api/offline/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: all }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Sync failed' };
    }
    if (data.success && data.syncedIds?.length) {
      await markTransactionsSynced(data.syncedIds);
      return { success: true, synced: data.syncedIds };
    }
    return { success: true, synced: [] };
  } catch (e) {
    return { success: false, error: e.message || 'Network error' };
  }
}

export async function fetchAndReconcileWallet(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/wallet/reconcile?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Reconcile failed' };
    if (data.success && data.balance) {
      await syncFromServer(data.balance, true);
      return { success: true, balance: data.balance };
    }
    return { success: false, error: 'No balance data' };
  } catch (e) {
    return { success: false, error: e.message || 'Network error' };
  }
}
