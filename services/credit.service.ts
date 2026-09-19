import api from "@/lib/api";
import { CreditBalance, CreditTransaction, Subscription } from "@/types/credits";

export const creditService = {
  async getCredits(): Promise<CreditBalance> {
    const response = await api.get("/api/v1/credits/me");
    return response.data;
  },

  async getCreditHistory(): Promise<CreditTransaction[]> {
    const response = await api.get("/api/v1/credits/history");
    return response.data;
  },

  async getSubscription(): Promise<Subscription> {
    const response = await api.get("/api/v1/subscription/me");
    return response.data;
  }
};
