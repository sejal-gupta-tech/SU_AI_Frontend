import api from "@/lib/api";

export interface FestivalAssetContent {
  headline?: string;
  body?: string;
  image_prompt?: string;
  hook?: string;
  script?: string;
  voiceover?: string;
  cta?: string;
  message?: string;
  primary_text?: string;
}

export interface FestivalAsset {
  id: string;
  type: "post" | "reel" | "ad" | "whatsapp";
  platform: string;
  day: number;
  scheduled_date: string;
  content: FestivalAssetContent;
}

export interface FestivalCampaign {
  id: string;
  festival_name: string;
  festival_emoji: string;
  festival_date: string;
  days_left: number;
  status: "draft" | "approved" | "active";
  offer_strategy: string;
  assets: FestivalAsset[];
  created_at: string;
}

export interface UpcomingFestival {
  name: string;
  date: string;
  emoji: string;
  days_left: number;
}

const festivalService = {
  async getUpcoming(): Promise<{
    upcoming_festivals: UpcomingFestival[];
    campaigns: FestivalCampaign[];
  }> {
    const res = await api.get("/api/v1/festivals/upcoming");
    return res.data?.data || { upcoming_festivals: [], campaigns: [] };
  },

  async generateCampaign(festivalName: string): Promise<FestivalCampaign | null> {
    const encoded = encodeURIComponent(festivalName);
    const res = await api.post(`/api/v1/festivals/generate/?festival_name=${encoded}`);
    return res.data?.data || null;
  },

  async approveCampaign(campaignId: string): Promise<{ message: string }> {
    const res = await api.post(`/api/v1/festivals/${campaignId}/approve`);
    return res.data;
  },

  async deleteCampaign(campaignId: string): Promise<void> {
    await api.delete(`/api/v1/festivals/${campaignId}`);
  },
};

export default festivalService;
