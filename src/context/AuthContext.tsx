import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<boolean>;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true
  });

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const isValid = token !== null;
    
    setAuthState({
      isAuthenticated: isValid,
      loading: false
    });

    return isValid;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();
  }, [checkAuth]);

  const setToken = useCallback((token: string) => {
    localStorage.setItem('token', token);
    setAuthState({
      isAuthenticated: true,
      loading: false
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      loading: false
    });
  }, []);

  const value = {
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    checkAuth,
    setToken,
    logout
  };


  return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
