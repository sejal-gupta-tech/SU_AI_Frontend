import { Campaign, GenerateCampaignRequest } from '@/types/campaign';
import api from '@/lib/api';

export const campaignService = {
  async generateCampaign(request: GenerateCampaignRequest): Promise<{ data: Campaign }> {
    const response = await api.post('/api/v1/campaigns/', request);
    return { data: response.data.data };
  },

  async getCampaigns(): Promise<{ data: Campaign[] }> {
    const response = await api.get('/api/v1/campaigns/');
    return { data: response.data.data };
  },
  
  async getCampaign(id: string): Promise<{ data: Campaign }> {
    const response = await api.get(`/api/v1/campaigns/${id}`);
    return { data: response.data.data };
  },

  async updateCampaign(id: string, request: Partial<Campaign>): Promise<{ data: Campaign }> {
    const response = await api.put(`/api/v1/campaigns/${id}`, request);
    return { data: response.data.data };
  },

  async deleteCampaign(id: string): Promise<void> {
    await api.delete(`/api/v1/campaigns/${id}`);
  }
};