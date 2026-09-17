import { 
  GenerateReelRequest, 
  ReelGenerationResponse, 
  ReelJobStatus, 
  Reel 
} from '@/types/reel';
import api from "@/lib/api";

export const reelService = {
  async generateReel(request: GenerateReelRequest): Promise<ReelGenerationResponse> {
    const response = await api.post("/api/v1/content/generate-reel", request);
    return response.data;
  },

  async getReelStatus(jobId: string): Promise<ReelJobStatus> {
    const response = await api.get(`/api/v1/content/reel/${jobId}/status`);
    return response.data;
  },

  async getReels(): Promise<{ data: Reel[] }> {
    const response = await api.get("/api/v1/content/reels");
    return response.data;
  },

  async getReel(reelId: string): Promise<{ data: Reel }> {
    const response = await api.get(`/api/v1/content/reel/${reelId}`);
    return response.data;
  },

  async deleteReel(reelId: string): Promise<void> {
    await api.delete(`/api/v1/content/reel/${reelId}`);
  }
};
