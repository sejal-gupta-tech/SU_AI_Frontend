import api from '@/lib/api';

export const socialService = {
  async publishToWhatsApp(contentId: string, targetPhone: string): Promise<any> {
    const res = await api.post(`/api/v1/social/publish-whatsapp/${contentId}`, {
      target_phone: targetPhone
    });
    return res.data;
  },

  async publishToInstagram(contentId: string): Promise<any> {
    const res = await api.post(`/api/v1/social/publish-instagram/${contentId}`);
    return res.data;
  }
};
