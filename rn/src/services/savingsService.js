import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchSavingsOverview } from './appContentService';

const STORAGE_KEY = '@rexipay/savings-goals:v1';

const parseAmount = (v) => {
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export const formatNaira = (value) =>
  `₦${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(
    Math.max(0, Number(value) || 0)
  )}`;

const hydrateGoal = (g) => {
  if (!g) return null;
  const targetAmount = parseAmount(g.targetAmount ?? g.target ?? 0);
  const savedAmount = parseAmount(g.savedAmount ?? g.saved ?? 0);
  const percent = targetAmount > 0 ? Math.min(100, Math.round((savedAmount / targetAmount) * 100)) : 0;
  return {
    ...g,
    autoSaveEnabled: g.autoSaveEnabled ?? true,
    nextAutoSaveAt: g.nextAutoSaveAt || null,
    history: Array.isArray(g.history) ? g.history : [],
    targetAmount,
    savedAmount,
    percent,
    target: formatNaira(targetAmount),
    saved: formatNaira(savedAmount),
  };
};

const getNextAutoDate = (fromDate, frequency) => {
  const d = new Date(fromDate);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  if (frequency === 'Daily') d.setDate(d.getDate() + 1);
  else if (frequency === 'Weekly') d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
};

const applyAutoSaveTick = (goal, now = new Date()) => {
  if (!goal.autoSaveEnabled || !goal.contributionAmount) return goal;
  let updated = { ...goal };
  let nextAt = updated.nextAutoSaveAt || getNextAutoDate(updated.createdAt || now.toISOString(), updated.frequency);
  let guard = 0;
  while (new Date(nextAt) <= now && guard < 24) {
    const amount = parseAmount(updated.contributionAmount);
    if (amount <= 0) break;
    const previous = parseAmount(updated.savedAmount);
    updated.savedAmount = previous + amount;
    updated.history = [
      {
        id: `h-${Date.now()}-${guard}`,
        type: 'auto',
        amount,
        createdAt: now.toISOString(),
        note: `${updated.frequency} autosave`,
      },
      ...(updated.history || []),
    ];
    nextAt = getNextAutoDate(nextAt, updated.frequency);
    guard += 1;
  }
  updated.nextAutoSaveAt = nextAt;
  return updated;
};

export const getSavingsGoals = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        const now = new Date();
        const ticked = arr.map((g) => applyAutoSaveTick(g, now));
        await saveSavingsGoals(ticked);
        return ticked.map(hydrateGoal);
      }
    }
  } catch (_) {
    // ignore storage error and fall back
  }

  const fallback = await fetchSavingsOverview();
  const goals = Array.isArray(fallback?.goals) ? fallback.goals : [];
  return goals.map((g) =>
    hydrateGoal({
      id: g.id || String(Date.now()),
      name: g.name || 'Savings goal',
      frequency: g.frequency || 'Monthly',
      targetAmount: parseAmount(g.target),
      savedAmount: parseAmount(g.saved),
      contributionAmount: parseAmount(g.contributionAmount || 0),
      autoSaveEnabled: true,
      nextAutoSaveAt: getNextAutoDate(new Date().toISOString(), g.frequency || 'Monthly'),
      history: [],
      createdAt: new Date().toISOString(),
    })
  );
};

export const saveSavingsGoals = async (goals) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

export const getSavingsSummary = async () => {
  const goals = await getSavingsGoals();
  const totalSavedAmount = goals.reduce((sum, g) => sum + parseAmount(g.savedAmount), 0);
  return {
    goals,
    totalSavedAmount,
    totalSaved: formatNaira(totalSavedAmount),
  };
};

export const createSavingsGoal = async ({ name, targetAmount, contributionAmount, frequency }) => {
  const goals = await getSavingsGoals();
  const goal = {
    id: `goal-${Date.now()}`,
    name,
    frequency,
    targetAmount: parseAmount(targetAmount),
    savedAmount: 0,
    contributionAmount: parseAmount(contributionAmount),
    autoSaveEnabled: true,
    nextAutoSaveAt: getNextAutoDate(new Date().toISOString(), frequency),
    history: [],
    createdAt: new Date().toISOString(),
  };
  const next = [goal, ...goals];
  await saveSavingsGoals(next);
  return hydrateGoal(goal);
};

export const addToSavingsGoal = async (goalId, amountToAdd) => {
  const add = Math.max(0, parseAmount(amountToAdd));
  const goals = await getSavingsGoals();
  const next = goals.map((g) =>
    g.id === goalId
      ? {
          ...g,
          savedAmount: parseAmount(g.savedAmount) + add,
          history: [
            {
              id: `h-${Date.now()}`,
              type: 'manual',
              amount: add,
              createdAt: new Date().toISOString(),
              note: 'Manual top up',
            },
            ...(g.history || []),
          ],
        }
      : g
  );
  await saveSavingsGoals(next);
  return hydrateGoal(next.find((g) => g.id === goalId) || null);
};

export const getSavingsGoalById = async (goalId) => {
  const goals = await getSavingsGoals();
  return hydrateGoal(goals.find((g) => g.id === goalId) || null);
};

export const updateSavingsGoal = async (goalId, payload) => {
  const goals = await getSavingsGoals();
  const next = goals.map((g) => {
    if (g.id !== goalId) return g;
    const merged = { ...g, ...payload };
    if (payload.frequency && payload.frequency !== g.frequency) {
      merged.nextAutoSaveAt = getNextAutoDate(new Date().toISOString(), payload.frequency);
    }
    return merged;
  });
  await saveSavingsGoals(next);
  return hydrateGoal(next.find((g) => g.id === goalId) || null);
};

export const deleteSavingsGoal = async (goalId) => {
  const goals = await getSavingsGoals();
  const next = goals.filter((g) => g.id !== goalId);
  await saveSavingsGoals(next);
  return true;
};
