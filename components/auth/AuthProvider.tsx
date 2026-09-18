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
      const isAuthRoute = pathname === '/login' || pathname === '/signup';
      const isAdminLoginRoute = pathname === '/admin/login';
      const isProtectedRoute = ['/dashboard', '/business', '/brand', '/products', '/settings', '/onboarding'].some(route => pathname.startsWith(route));
      const isAdminRoute = pathname.startsWith('/admin') && !isAdminLoginRoute;

      if (!user) {
        if (isProtectedRoute) {
          router.push('/login');
        } else if (isAdminRoute) {
          router.push('/admin/login');
        }
      } else {
        if (isAdminRoute && user.role !== 'admin') {
          router.push('/dashboard');
        } else if (isProtectedRoute && user.role === 'admin') {
          router.push('/admin');
        } else if (isAuthRoute || isAdminLoginRoute) {
          router.push(user.role === 'admin' ? '/admin' : '/dashboard');
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    const wasAdmin = user?.role === 'admin';
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push(wasAdmin ? '/admin/login' : '/login');
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
