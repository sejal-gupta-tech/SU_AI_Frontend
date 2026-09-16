"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Protect routes
    if (!isLoading) {
      const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
      const isProtectedRoute = ['/dashboard', '/business', '/brand', '/products', '/settings', '/onboarding'].some(route => pathname.startsWith(route));

      if (!user && isProtectedRoute) {
        router.push('/login');
      } else if (user && isAuthRoute) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
