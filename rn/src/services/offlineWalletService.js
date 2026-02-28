/**
 * Offline Wallet Service
 * Manages local wallet state: lastSyncedBalance, pending debits/credits, sync.
 */

import CryptoJS from 'crypto-js';
import { saveOfflineWallet, loadOfflineWallet, getDeviceId } from '../utils/offlineStorage';

const DEFAULT_CURRENCY = 'NGN';
const DEFAULT_BALANCE = 250000; // Align with existing mock CURRENCY_ACCOUNTS

export const SYNC_STATUS = { PENDING: 'pending', SYNCED: 'synced', FAILED: 'failed' };

export function createTransactionId() {
  return `OFF-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDeviceSignature(payload) {
  const str = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}

export function createOfflineTransaction(senderId, receiverId, amount, currency = DEFAULT_CURRENCY) {
  const transactionId = createTransactionId();
  const timestamp = Date.now();
  const payload = { transactionId, senderId, receiverId, amount, currency, timestamp };
  return { ...payload, deviceSignature: null, syncStatus: SYNC_STATUS.PENDING };
}

export function signTransaction(tx) {
  const payload = `${tx.transactionId}|${tx.senderId}|${tx.receiverId}|${tx.amount}|${tx.currency}|${tx.timestamp}`;
  const deviceSignature = getDeviceSignature(payload);
  return { ...tx, deviceSignature };
}

export function verifyTransactionSignature(tx) {
  if (!tx.deviceSignature) return false;
  const payload = `${tx.transactionId}|${tx.senderId}|${tx.receiverId}|${tx.amount}|${tx.currency}|${tx.timestamp}`;
  const expected = getDeviceSignature(payload);
  return expected === tx.deviceSignature;
}

export function getInitialWalletState() {
  return {
    lastSyncedBalance: { [DEFAULT_CURRENCY]: DEFAULT_BALANCE },
    pendingOfflineDebits: [],
    pendingOfflineCredits: [],
    lastSyncTime: Date.now(),
  };
}

export async function getWalletState() {
  const state = await loadOfflineWallet();
  if (!state) return getInitialWalletState();
  return {
    lastSyncedBalance: state.lastSyncedBalance || { [DEFAULT_CURRENCY]: DEFAULT_BALANCE },
    pendingOfflineDebits: state.pendingOfflineDebits || [],
    pendingOfflineCredits: state.pendingOfflineCredits || [],
    lastSyncTime: state.lastSyncTime || 0,
  };
}

export function computeAvailableBalance(state, currency = DEFAULT_CURRENCY) {
  const base = (state.lastSyncedBalance?.[currency] ?? DEFAULT_BALANCE) || 0;
  const debits = (state.pendingOfflineDebits || [])
    .filter((d) => d.currency === currency)
    .reduce((s, d) => s + d.amount, 0);
  const credits = (state.pendingOfflineCredits || [])
    .filter((c) => c.currency === currency)
    .reduce((s, c) => s + c.amount, 0);
  return base - debits + credits;
}

export function canSendAmount(state, amount, currency = DEFAULT_CURRENCY) {
  const available = computeAvailableBalance(state, currency);
  return amount > 0 && amount <= available;
}

export async function addPendingDebit(state, tx) {
  const next = { ...state };
  next.pendingOfflineDebits = [...(next.pendingOfflineDebits || []), tx];
  await saveOfflineWallet(next);
  return next;
}

export async function addPendingCredit(state, tx) {
  const next = { ...state };
  next.pendingOfflineCredits = [...(next.pendingOfflineCredits || []), tx];
  await saveOfflineWallet(next);
  return next;
}

export async function recordOfflineDebit(state, senderId, receiverId, amount, currency = DEFAULT_CURRENCY) {
  if (!canSendAmount(state, amount, currency)) return { success: false, error: 'Insufficient balance' };
  const tx = createOfflineTransaction(senderId, receiverId, amount, currency);
  const signed = await signTransaction(tx);
  const next = await addPendingDebit(state, signed);
  return { success: true, transaction: signed, state: next };
}

export async function recordOfflineCredit(state, tx) {
  const verified = await verifyTransactionSignature(tx);
  if (!verified) return { success: false, error: 'Invalid transaction signature' };
  const existing = (state.pendingOfflineCredits || []).some((c) => c.transactionId === tx.transactionId);
  if (existing) return { success: false, error: 'Duplicate transaction' };
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  if (tx.timestamp < fiveMinutesAgo) return { success: false, error: 'Transaction too old' };
  const next = await addPendingCredit(state, tx);
  return { success: true, state: next };
}

export async function syncFromServer(balanceByCurrency, clearPending = false) {
  const state = await getWalletState();
  state.lastSyncedBalance = { ...state.lastSyncedBalance, ...balanceByCurrency };
  state.lastSyncTime = Date.now();
  if (clearPending) {
    state.pendingOfflineDebits = [];
    state.pendingOfflineCredits = [];
  }
  await saveOfflineWallet(state);
  return state;
}

export async function markTransactionsSynced(transactionIds) {
  const state = await getWalletState();
  const ids = new Set(transactionIds);
  state.pendingOfflineDebits = (state.pendingOfflineDebits || []).filter((t) => !ids.has(t.transactionId));
  state.pendingOfflineCredits = (state.pendingOfflineCredits || []).filter((t) => !ids.has(t.transactionId));
  await saveOfflineWallet(state);
  return state;
}

export { getDeviceId };
