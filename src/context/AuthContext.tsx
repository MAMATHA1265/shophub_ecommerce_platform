import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  getCurrentUserSync,
  loginUser,
  logoutUserSync,
  signupUser,
} from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUserSync());

  const login = useCallback(async (email: string, password: string) => {
    const loggedIn = await loginUser(email, password);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const created = await signupUser(name, email, password);
      setUser(created);
      return created;
    },
    []
  );

  const logout = useCallback(() => {
    logoutUserSync();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
