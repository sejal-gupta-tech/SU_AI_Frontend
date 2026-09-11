import api from '@/lib/api';
import { User, APIResponse } from '@/types';

export const authService = {
  login: async (email: string, password: string):Promise<{token: string, user: User}> => {
    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          resolve({
            token: 'mock-jwt-token-123',
            user: {
              id: 'u_1',
              name: 'Test User',
              email: 'test@example.com'
            }
          });
        } else {
          reject({ message: 'Invalid credentials' });
        }
      }, 1000);
    });
    
    // REAL IMPLEMENTATION (uncomment when backend is ready)
    /*
    const response = await api.post<APIResponse<{token: string, user: User}>>('/auth/login', { email, password });
    return response.data.data;
    */
  },

  signup: async (name: string, email: string, password: string):Promise<{token: string, user: User}> => {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-new',
          user: {
            id: 'u_2',
            name: name,
            email: email
          }
        });
      }, 1000);
    });

    // REAL IMPLEMENTATION
    /*
    const response = await api.post<APIResponse<{token: string, user: User}>>('/auth/signup', { name, email, password });
    return response.data.data;
    */
  }
};
