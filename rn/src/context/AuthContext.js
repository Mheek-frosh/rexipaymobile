import React, { createContext, useContext, useState, useCallback } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const login = useCallback((phone, name) => {
    const displayName = name || phone || 'User';
    setUser({ phone, name: displayName });
    setUserName(displayName);
    setUserPhone(phone || '');
    setUserEmail(`${phone || 'user'}@rexipay.com`);
    setIsAuthenticated(true);
  }, []);

  const setPendingSignupUser = useCallback((userData) => {
    setPendingUser(userData);
  }, []);

  const signupComplete = useCallback((userData) => {
    setUser(userData);
    setUserName(userData?.name || userData?.firstName || 'User');
    setUserPhone((userData?.phone || '').replace(/\D/g, ''));
    setUserEmail(`${(userData?.phone || '').replace(/\D/g, '')}@rexipay.com`);
    setPendingUser(null);
    setIsAuthenticated(true);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    if (updates.name) setUserName(updates.name);
    if (updates.phone) setUserPhone(String(updates.phone).replace(/\D/g, ''));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userName,
        userPhone,
        userEmail,
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
