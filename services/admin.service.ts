import api from '@/lib/api';
import { AdminOverview } from '@/types/admin';

export const adminService = {
  async getUsers() {
    const response = await api.get('/api/v1/admin/users');
    return response.data;
  },

  async getBusinesses() {
    const response = await api.get('/api/v1/admin/businesses');
    return response.data;
  },

  async getAdminOverview(): Promise<AdminOverview> {
    const response = await api.get('/api/v1/admin/dashboard/overview');
    return response.data;
  }
};
