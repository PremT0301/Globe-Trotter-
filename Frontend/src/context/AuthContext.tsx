import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../lib/api';
import { useToast } from './ToastContext';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  avatar?: string;
  role?: 'user' | 'admin';
  phone?: string;
  location?: string;
  bio?: string;
  dateOfBirth?: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
  };
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<'user' | 'admin'>;
  loginWithOTP: (email: string, otp: string) => Promise<void>;
  generateOTP: (email: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  uploadProfilePhoto: (file: File) => Promise<void>;
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
    console.log('🔐 Attempting login with:', { email, password: '***' });
    try {
      const res = await api.post<{ token: string; user: User }>('/api/auth/login', { email, password });
      console.log('✅ Login successful:', res);
      setUser(res.user);
      persist(res.user, res.token);
      
      // Return user role for redirection logic
      return res.user.role || 'user';
    } catch (error) {
      console.log('❌ Login failed:', error);
      throw error;
    }
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
    persist(updatedUser);
  };

  const uploadProfilePhoto = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/photos/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const result = await response.json();
      
      // Update user with new profile photo
      const updatedUser = { ...user!, profilePhoto: result.photoUrl };
      setUser(updatedUser);
      persist(updatedUser);
      
      showToast('success', 'Photo Updated', 'Profile photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast('error', 'Upload Failed', 'Failed to upload profile photo. Please try again.');
      throw error;
    }
  };

  const value = {
    user,
    login,
    loginWithOTP,
    generateOTP,
    signup,
    logout,
    updateUser,
    uploadProfilePhoto,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};