import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../lib/api';
import { useToast } from './ToastContext';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  phone?: string;
  location?: string;
  bio?: string;
  dateOfBirth?: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    publicProfile: boolean;
  };
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (email: string, otp: string) => Promise<void>;
  generateOTP: (email: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
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
      const token = localStorage.getItem('token');
      console.log('AuthContext: Initializing with stored user:', stored ? 'Present' : 'Missing');
      console.log('AuthContext: Initializing with stored token:', token ? 'Present' : 'Missing');
      return stored ? JSON.parse(stored) : null;
    } catch {
      console.log('AuthContext: Error reading from localStorage');
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
  const { showToast } = useToast();

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>('/api/auth/login', { email, password });
    setUser(res.user);
    persist(res.user, res.token);
  };

  const generateOTP = async (email: string) => {
    await api.post('/api/auth/generate-otp', { email });
  };

  const loginWithOTP = async (email: string, otp: string) => {
    const res = await api.post<{ token: string; user: User }>('/api/auth/verify-otp', { email, otp });
    setUser(res.user);
    persist(res.user, res.token);
  };

  const signup = async (name: string, email: string, password: string) => {
    await api.post('/api/auth/signup', { name, email, password });
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch {}
    showToast('info', 'Logged out', 'You have been successfully logged out.');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    loginWithOTP,
    generateOTP,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};