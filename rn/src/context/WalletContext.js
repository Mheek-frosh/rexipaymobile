import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const INITIAL_NGN_BALANCE = 950000;

const BALANCE_STORAGE_KEY = '@rexipay_ngn_wallet_balance_v1';
const WalletContext = createContext(null);

function normalizeAmount(value) {
  const amount = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

export function formatNairaBalance(value) {
  return `\u20A6${normalizeAmount(value).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function WalletProvider({ children }) {
  const [ngnBalance, setNgnBalance] = useState(INITIAL_NGN_BALANCE);
  const [isWalletReady, setIsWalletReady] = useState(false);
  const balanceRef = useRef(INITIAL_NGN_BALANCE);
  const hydrationPromiseRef = useRef(null);

  const hydrateWallet = useCallback(() => {
    if (!hydrationPromiseRef.current) {
      hydrationPromiseRef.current = (async () => {
        try {
          const savedBalance = await AsyncStorage.getItem(BALANCE_STORAGE_KEY);
          const parsedBalance = normalizeAmount(savedBalance);
          const nextBalance = savedBalance == null ? INITIAL_NGN_BALANCE : parsedBalance;
          balanceRef.current = Math.max(0, nextBalance);
          setNgnBalance(balanceRef.current);
        } catch (error) {
          console.warn('Unable to load wallet balance:', error);
        } finally {
          setIsWalletReady(true);
        }
      })();
    }
    return hydrationPromiseRef.current;
  }, []);

  useEffect(() => {
    hydrateWallet();
  }, [hydrateWallet]);

  const saveBalance = useCallback(async (nextBalance) => {
    balanceRef.current = nextBalance;
    setNgnBalance(nextBalance);
    try {
      await AsyncStorage.setItem(BALANCE_STORAGE_KEY, String(nextBalance));
    } catch (error) {
      console.warn('Unable to save wallet balance:', error);
    }
  }, []);

  const debitNgn = useCallback(async (value) => {
    await hydrateWallet();
    const amount = normalizeAmount(value);
    if (amount <= 0) return { success: false, error: 'Enter a valid amount.' };
    if (amount > balanceRef.current) {
      return {
        success: false,
        error: `Insufficient balance. Available: ${formatNairaBalance(balanceRef.current)}`,
        balance: balanceRef.current,
      };
    }

    const nextBalance = balanceRef.current - amount;
    await saveBalance(nextBalance);
    return { success: true, balance: nextBalance };
  }, [hydrateWallet, saveBalance]);

  const creditNgn = useCallback(async (value) => {
    await hydrateWallet();
    const amount = normalizeAmount(value);
    if (amount <= 0) return { success: false, error: 'Enter a valid amount.' };

    const nextBalance = balanceRef.current + amount;
    await saveBalance(nextBalance);
    return { success: true, balance: nextBalance };
  }, [hydrateWallet, saveBalance]);

  return (
    <WalletContext.Provider
      value={{
        ngnBalance,
        isWalletReady,
        debitNgn,
        creditNgn,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}
