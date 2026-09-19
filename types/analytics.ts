export interface AnalyticsOverviewData {
  posts?: number;
  reels?: number;
  ai_generations?: number;
  credits_used?: number;
  products?: number;
  calendar_activity?: number;
}

export interface ActivityData {
  date: string;
  posts?: number;
  reels?: number;
  ai_generations?: number;
  [key: string]: any; // Allow generic fallbacks just in case
}

export interface ContentBreakdown {
  posts?: number;
  reels?: number;
  images?: number;
  photoshoots?: number;
}

export interface ExternalMetrics {
  reach?: number | null;
  engagement?: number | null;
  leads?: number | null;
  whatsapp_enquiries?: number | null;
}

export interface AIRecommendation {
  title?: string;
  description: string;
  recommended_action?: string;
  priority?: string;
}

export interface AnalyticsResponse {
  overview: AnalyticsOverviewData;
  activity: ActivityData[];
  content_breakdown: ContentBreakdown;
  external_metrics: ExternalMetrics;
  marketing_score?: number | null;
  ai_recommendation?: AIRecommendation | null;
}
