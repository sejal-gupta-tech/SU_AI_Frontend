"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';

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
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname === '/login' || pathname === '/signup';
      const isAdminLoginRoute = pathname === '/admin/login';
      const isProtectedRoute = ['/dashboard', '/business', '/brand', '/products', '/settings', '/onboarding', '/content', '/content-library', '/campaigns', '/messages', '/reviews', '/social-platforms', '/create', '/create-ad', '/ai-'].some(route => pathname.startsWith(route));
      const isAdminRoute = pathname.startsWith('/admin') && !isAdminLoginRoute;

      if (!user) {
        if (isAdminRoute) {
          router.replace('/admin/login');
        } else if (isProtectedRoute) {
          router.replace('/login');
        }
      } else {
        const role = user.role || 'user';
        
        if (isAdminRoute && role !== 'admin') {
          router.replace('/dashboard');
        } else if (isAdminLoginRoute && role !== 'admin') {
          router.replace('/dashboard');
        } else if (isAuthRoute && role === 'admin') {
          router.replace('/admin');
        } else if (isAuthRoute && role === 'user') {
          if (pathname === '/signup') {
             // If already logged in, no need to stay on signup
             // In case they just signed up, they should go to onboarding
             // For safety we redirect to dashboard, but signup's onSubmit will push to onboarding if it can.
             // Actually, if we are on signup, we redirect to dashboard.
             router.replace('/dashboard');
          } else {
             router.replace('/dashboard');
          }
        } else if (isAdminLoginRoute && role === 'admin') {
          router.replace('/admin');
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    const wasAdmin = user?.role === 'admin';
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.replace(wasAdmin ? '/admin/login' : '/login');
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
