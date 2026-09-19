import api from "@/lib/api";
import { AnalyticsResponse } from "@/types/analytics";

export const analyticsService = {
  getAnalyticsOverview: async (range: 7 | 30 | 90): Promise<AnalyticsResponse> => {
    const res = await api.get(`/api/v1/analytics/overview?range=${range}`);
    return res.data;
  },
};
