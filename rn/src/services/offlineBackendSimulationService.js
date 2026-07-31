import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_SERVER_BALANCES_KEY = '@rexipay_mock_server_balances';
const MOCK_SERVER_SYNCED_TX_KEY = '@rexipay_mock_server_synced_tx';

// Get simulated database balance for a user
export async function getSimulatedServerBalance(userId) {
  try {
    const balancesJson = await AsyncStorage.getItem(MOCK_SERVER_BALANCES_KEY);
    const balances = balancesJson ? JSON.parse(balancesJson) : {};
    // Default initial balance is 250,000 NGN
    return balances[userId] || { NGN: 250000 };
  } catch (e) {
    console.warn('Error reading simulated server balances:', e);
    return { NGN: 250000 };
  }
}

// Update simulated database balance for a user
export async function updateSimulatedServerBalance(userId, balance) {
  try {
    const balancesJson = await AsyncStorage.getItem(MOCK_SERVER_BALANCES_KEY);
    const balances = balancesJson ? JSON.parse(balancesJson) : {};
    balances[userId] = balance;
    await AsyncStorage.setItem(MOCK_SERVER_BALANCES_KEY, JSON.stringify(balances));
  } catch (e) {
    console.warn('Error updating simulated server balances:', e);
  }
}

// Get simulated database synced transaction IDs
export async function getSimulatedServerSyncedTxIds() {
  try {
    const idsJson = await AsyncStorage.getItem(MOCK_SERVER_SYNCED_TX_KEY);
    return idsJson ? JSON.parse(idsJson) : [];
  } catch (e) {
    console.warn('Error reading simulated server synced tx ids:', e);
    return [];
  }
}

// Save simulated database synced transaction IDs
export async function saveSimulatedServerSyncedTxIds(ids) {
  try {
    await AsyncStorage.setItem(MOCK_SERVER_SYNCED_TX_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn('Error saving simulated server synced tx ids:', e);
  }
}

/**
 * Simulates server-side /api/offline/sync
 */
export async function simulateServerSync(transactions) {
  if (!Array.isArray(transactions)) {
    return { success: false, error: 'transactions array required' };
  }

  const syncedIds = await getSimulatedServerSyncedTxIds();
  const syncedIdsSet = new Set(syncedIds);
  const newlySyncedIds = [];

  const balancesJson = await AsyncStorage.getItem(MOCK_SERVER_BALANCES_KEY);
  const balances = balancesJson ? JSON.parse(balancesJson) : {};

  for (const tx of transactions) {
    const { transactionId, senderId, receiverId, amount, currency, timestamp } = tx;
    if (!transactionId || !senderId || !receiverId || amount == null) {
      continue;
    }
    // Prevent duplicate processing
    if (syncedIdsSet.has(transactionId)) {
      continue;
    }
    // Filter out transactions older than 5 minutes (security threshold)
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    if (timestamp < fiveMinAgo) {
      continue;
    }

    syncedIdsSet.add(transactionId);
    newlySyncedIds.push(transactionId);

    // Mock: deduct sender, credit receiver in server simulation db
    const sBal = balances[senderId] || { NGN: 250000 };
    const rBal = balances[receiverId] || { NGN: 0 };
    const cur = currency || 'NGN';

    sBal[cur] = (sBal[cur] || 0) - Number(amount);
    rBal[cur] = (rBal[cur] || 0) + Number(amount);

    balances[senderId] = sBal;
    balances[receiverId] = rBal;
  }

  // Persist updated mock DB state
  await saveSimulatedServerSyncedTxIds(Array.from(syncedIdsSet));
  await AsyncStorage.setItem(MOCK_SERVER_BALANCES_KEY, JSON.stringify(balances));

  return { success: true, syncedIds: newlySyncedIds };
}

/**
 * Simulates server-side /api/wallet/reconcile
 */
export async function simulateServerReconcile(userId) {
  if (!userId) {
    return { success: false, error: 'userId required' };
  }
  const balance = await getSimulatedServerBalance(userId);
  return { success: true, balance };
}
