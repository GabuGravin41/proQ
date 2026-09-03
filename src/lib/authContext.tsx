'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'anonymous' | 'free' | 'subscriber' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  subscriptionPlan?: 'free' | 'pro' | 'enterprise';
  subscriptionExpiry?: string;
  // Capability profile
  capabilities?: string[];
  targetSectors?: string[];
  targetCounties?: string[];
  minBudget?: number;
  maxBudget?: number;
  agpoStatus?: 'Youth' | 'Women' | 'PWD' | 'None';
  // Notification prefs
  notifEmail?: boolean;
  notifWhatsApp?: boolean;
  notifTelegram?: boolean;
  notifSMS?: boolean;
  notifDigest?: boolean;
  notifRealTime?: boolean;
  whatsappNumber?: string;
  telegramHandle?: string;
  smsNumber?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  company?: string;
  password: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isSubscriber: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  bookmarks: string[];
  toggleBookmark: (tenderId: string) => void;
  isBookmarked: (tenderId: string) => boolean;
}

const MOCK_USERS: Record<string, { password: string; profile: UserProfile }> = {
  'wanjiku.mwangi@techbiz.co.ke': {
    password: 'TenderIQ@Free2026',
    profile: {
      id: 'user-001',
      email: 'wanjiku.mwangi@techbiz.co.ke',
      name: 'Wanjiku Mwangi',
      role: 'free',
      company: 'TechBiz Solutions Ltd',
      subscriptionPlan: 'free',
      capabilities: ['ICT hardware supply', 'Computer networking'],
      targetSectors: ['Education', 'County Government'],
      targetCounties: ['Nairobi', 'Kiambu'],
      minBudget: 1000000,
      maxBudget: 10000000,
      agpoStatus: 'Youth',
      notifEmail: true,
      notifWhatsApp: false,
      notifTelegram: false,
      notifSMS: false,
      notifDigest: true,
      notifRealTime: false,
    },
  },
  'kipchoge.ruto@buildright.co.ke': {
    password: 'TenderIQ@Pro2026',
    profile: {
      id: 'user-002',
      email: 'kipchoge.ruto@buildright.co.ke',
      name: 'Kipchoge Ruto',
      role: 'subscriber',
      company: 'BuildRight Engineering Ltd',
      subscriptionPlan: 'pro',
      subscriptionExpiry: '2027-08-31',
      capabilities: ['Solar water pumping', 'IoT sensors', 'Borehole drilling', 'CCTV installation', 'Biometric systems'],
      targetSectors: ['Parastatals', 'County Government', 'Education'],
      targetCounties: ['Kiambu', 'Nairobi', 'Nakuru', 'Turkana', 'National'],
      minBudget: 5000000,
      maxBudget: 100000000,
      agpoStatus: 'Youth',
      notifEmail: true,
      notifWhatsApp: true,
      notifTelegram: true,
      notifSMS: false,
      notifDigest: false,
      notifRealTime: true,
      whatsappNumber: '+254712345678',
      telegramHandle: '@kipchoge_ruto',
    },
  },
  'admin@proq.co.ke': {
    password: 'proQ@Admin2026',
    profile: {
      id: 'user-003',
      email: 'admin@proq.co.ke',
      name: 'proQ Admin',
      role: 'admin',
      company: 'proQ Kenya Platform',
      subscriptionPlan: 'enterprise',
    },
  },
  'admin@tenderiq.co.ke': {
    password: 'TenderIQ@Admin2026',
    profile: {
      id: 'user-003',
      email: 'admin@proq.co.ke',
      name: 'proQ Admin',
      role: 'admin',
      company: 'proQ Kenya Platform',
      subscriptionPlan: 'enterprise',
    },
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('tenderiq_user');
    const storedBookmarks = localStorage.getItem('tenderiq_bookmarks');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    if (storedBookmarks) {
      try { setBookmarks(JSON.parse(storedBookmarks)); } catch {}
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check built-in mock users
    const entry = MOCK_USERS[normalizedEmail];
    if (entry && entry.password === password) {
      setUser(entry.profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tenderiq_user', JSON.stringify(entry.profile));
      }
      return { success: true };
    }

    // 2. Check locally registered users
    if (typeof window !== 'undefined') {
      try {
        const storedUsersStr = localStorage.getItem('proq_registered_users');
        if (storedUsersStr) {
          const registeredUsers: Record<string, { password: string; profile: UserProfile }> = JSON.parse(storedUsersStr);
          const regEntry = registeredUsers[normalizedEmail];
          if (regEntry && regEntry.password === password) {
            setUser(regEntry.profile);
            localStorage.setItem('tenderiq_user', JSON.stringify(regEntry.profile));
            return { success: true };
          }
        }
      } catch (e) {
        console.error('Error reading registered users:', e);
      }
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const normalizedEmail = data.email.toLowerCase().trim();

    if (!normalizedEmail || !data.password || !data.name) {
      return { success: false, error: 'Please provide name, email, and password.' };
    }

    if (data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      name: data.name.trim(),
      role: 'free',
      company: data.company?.trim() || 'My Enterprise',
      subscriptionPlan: 'free',
      capabilities: ['General Supplies', 'Consulting'],
      targetSectors: ['County Government', 'Parastatals'],
      targetCounties: ['Nairobi', 'National'],
      minBudget: 500000,
      maxBudget: 20000000,
      agpoStatus: 'None',
      notifEmail: true,
      notifWhatsApp: false,
      notifTelegram: false,
      notifSMS: false,
      notifDigest: true,
      notifRealTime: false,
    };

    if (typeof window !== 'undefined') {
      try {
        const storedUsersStr = localStorage.getItem('proq_registered_users');
        const registeredUsers: Record<string, { password: string; profile: UserProfile }> = storedUsersStr
          ? JSON.parse(storedUsersStr)
          : {};

        if (registeredUsers[normalizedEmail] || MOCK_USERS[normalizedEmail]) {
          return { success: false, error: 'An account with this email already exists.' };
        }

        registeredUsers[normalizedEmail] = {
          password: data.password,
          profile: newProfile,
        };

        localStorage.setItem('proq_registered_users', JSON.stringify(registeredUsers));
        localStorage.setItem('tenderiq_user', JSON.stringify(newProfile));
      } catch (e) {
        console.error('Error saving registered user:', e);
      }
    }

    setUser(newProfile);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tenderiq_user');
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('tenderiq_user', JSON.stringify(updated));
        // Also update in registered users store if exists
        try {
          const storedUsersStr = localStorage.getItem('proq_registered_users');
          if (storedUsersStr) {
            const registeredUsers = JSON.parse(storedUsersStr);
            if (registeredUsers[updated.email]) {
              registeredUsers[updated.email].profile = updated;
              localStorage.setItem('proq_registered_users', JSON.stringify(registeredUsers));
            }
          }
        } catch {}
      }
      return updated;
    });
  }, []);

  const toggleBookmark = useCallback((tenderId: string) => {
    setBookmarks(prev => {
      const next = prev.includes(tenderId)
        ? prev.filter(id => id !== tenderId)
        : [...prev, tenderId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('tenderiq_bookmarks', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const isBookmarked = useCallback((tenderId: string) => bookmarks.includes(tenderId), [bookmarks]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isSubscriber: user?.role === 'subscriber' || user?.role === 'admin',
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
      bookmarks,
      toggleBookmark,
      isBookmarked,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
