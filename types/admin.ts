export type AdminStats = {
  total_users: number;
  total_businesses: number;
  active_subscriptions: number | null;
  credits_used: number | null;
};

export type AIUsage = {
  posts_generated: number | null;
  reels_generated: number | null;
  images_generated: number | null;
  photoshoots_generated: number | null;
  total_generations: number | null;
};

export type RecentRegistration = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export type RecentBusiness = {
  id: string;
  name: string;
  owner_name: string;
  category: string | null;
  city: string | null;
  created_at: string;
};

export type AdminOverview = {
  stats: AdminStats;
  ai_usage: AIUsage;
  recent_registrations: RecentRegistration[];
  recent_businesses: RecentBusiness[];
};
