import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const login = useCallback((email) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUserEmail('');
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, userEmail, login, logout }),
    [isAuthenticated, userEmail, login, logout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used inside <SessionProvider>');
  }
  return ctx;
}
