import api from '@/lib/api';
import { User, APIResponse } from '@/types';

export const authService = {
  login: async (email: string, password: string):Promise<{token: string, user: User}> => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      return {
        token: response.data.access_token,
        user: response.data.user
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'An error occurred during login');
    }
  },

  signup: async (name: string, email: string, password: string):Promise<{token: string, user: User}> => {
    try {
      const response = await api.post('/api/v1/auth/signup', { name, email, password });
      return {
        token: response.data.access_token,
        user: response.data.user
      };
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      throw new Error(error.message || 'An error occurred during signup');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/api/v1/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to fetch user');
    }
  }
};
