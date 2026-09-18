import api from '@/lib/api';
import { Business } from '@/types';

export interface BusinessCreateRequest {
  name: string;
  category: string;
  location: string;
  website?: string;
  instagram?: string;
  target_customer?: string;
  preferred_language?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
}

export interface BusinessUpdateRequest {
  name?: string;
  category?: string;
  location?: string;
  website?: string;
  instagram?: string;
  target_customer?: string;
  preferred_language?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
}

export const businessService = {
  createBusiness: async (data: BusinessCreateRequest): Promise<Business> => {
    try {
      const response = await api.post('/api/v1/businesses', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Unable to create your business. Please try again.');
    }
  },

  getMyBusiness: async (): Promise<Business> => {
    try {
      const response = await api.get('/api/v1/businesses/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Unable to fetch your business.');
    }
  },

  updateBusiness: async (data: BusinessUpdateRequest): Promise<Business> => {
    try {
      const response = await api.put('/api/v1/businesses/me', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Unable to save your business information. Please try again.');
    }
  },

  deleteBusiness: async (): Promise<void> => {
    try {
      await api.delete('/api/v1/businesses/me');
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Unable to delete your business. Please try again.');
    }
  }
};
