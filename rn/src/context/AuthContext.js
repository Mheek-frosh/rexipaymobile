import React, { createContext, useContext, useState, useCallback } from 'react';
import { buildRexipayAccountNumber } from '../utils/rexipayAccount';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userAccountNumber, setUserAccountNumber] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const login = useCallback((phone, name, extras = {}) => {
    const displayName = name || phone || 'User';
    const clerkId = extras.clerkUserId || extras.id;
    const email = extras.email || `${phone || 'user'}@rexipay.com`;
    const accountNumber = buildRexipayAccountNumber({
      clerkUserId: clerkId,
      phone,
      email,
    });
    setUser({ phone, name: displayName, email, accountNumber, id: clerkId });
    setUserName(displayName);
    setUserPhone((phone || '').replace(/\D/g, ''));
    setUserEmail(String(email).trim());
    setUserAccountNumber(accountNumber);
    setUserAddress('');
    setIsAuthenticated(true);
  }, []);

  const setPendingSignupUser = useCallback((userData) => {
    setPendingUser(userData);
  }, []);

  const signupComplete = useCallback((userData) => {
    const name = userData?.name || userData?.firstName || 'User';
    const phone = (userData?.phone || '').replace(/\D/g, '');
    const syntheticEmail = userData?.phone
      ? `${String(userData.phone).replace(/\D/g, '')}@rexipay.com`
      : '';
    const email = userData?.email?.trim() || syntheticEmail || 'user@rexipay.com';
    const accountNumber = buildRexipayAccountNumber({
      clerkUserId: userData?.id,
      phone: userData?.phone,
      email,
    });
    const merged = { ...userData, name, accountNumber };
    setUser(merged);
    setUserName(name);
    setUserPhone(phone);
    setUserEmail(email);
    setUserAccountNumber(accountNumber);
    setUserAddress(userData?.address || '');
    setPendingUser(null);
    setIsAuthenticated(true);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    if (updates.name) setUserName(updates.name);
    if (updates.phone) setUserPhone(String(updates.phone).replace(/\D/g, ''));
    if (updates.email !== undefined) setUserEmail(String(updates.email || '').trim());
    if (updates.accountNumber !== undefined) setUserAccountNumber(String(updates.accountNumber || ''));
    if (updates.address !== undefined) setUserAddress(updates.address || '');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setUserAccountNumber('');
    setUserAddress('');
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userName,
        userPhone,
        userEmail,
        userAccountNumber,
        userAddress,
        isAuthenticated,
        pendingUser,
        login,
        signupComplete,
        setPendingSignupUser,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
