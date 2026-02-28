/**
 * Local storage for offline wallet data.
 * Uses AsyncStorage (app-sandboxed). Production: use expo-secure-store or MMKV with native encryption.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = '@rexipay_offline_wallet_v1';

export async function saveOfflineWallet(data) {
  try {
    const json = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch (e) {
    console.warn('OfflineStorage save error:', e);
    return false;
  }
}

export async function loadOfflineWallet() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function getDeviceId() {
  try {
    let id = await AsyncStorage.getItem('@rexipay_device_id');
    if (!id) {
      id = CryptoJS.SHA256(`device-${Date.now()}-${Math.random()}`).toString(CryptoJS.enc.Hex);
      await AsyncStorage.setItem('@rexipay_device_id', id);
    }
    return id;
  } catch {
    return `device-${Date.now()}`;
  }
}
