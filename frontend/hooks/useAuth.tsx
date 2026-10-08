'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types/user';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  devLogin: (email: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if URL has ?token= (returned from OAuth callback)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        api.setAuthToken(token);
        // Clean URL parameter without reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const authUrl = await api.getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google Login');
      setLoading(false);
    }
  };

  const devLogin = async (email: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.devLogin(email, name);
      api.setAuthToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Dev login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithGoogle,
        devLogin,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
