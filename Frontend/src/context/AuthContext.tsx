import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const persist = (u: User | null, token?: string) => {
    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
    } else {
      localStorage.removeItem('user');
    }
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>('/api/auth/login', { email, password });
    setUser(res.user);
    persist(res.user, res.token);
  };

  const signup = async (name: string, email: string, password: string) => {
    await api.post('/api/auth/signup', { name, email, password });
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch {}
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};