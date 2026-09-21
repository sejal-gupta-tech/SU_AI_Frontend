import api from "@/lib/api";
import { AnalyticsApiResponse, AnalyticsData } from "@/types/analytics";

export const analyticsService = {
  getAnalyticsOverview: async (range: 7 | 30 | 90): Promise<AnalyticsData> => {
    const res = await api.get<AnalyticsApiResponse>(`/api/v1/analytics/overview?range=${range}d`);
    return res.data.data;
  },
};
