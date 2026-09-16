export interface Campaign {
  _id?: string;
  id?: string;
  userId?: string;
  businessId?: string;
  name: string;
  goal: string;
  targetAudience: string;
  platforms: string[];
  budget: string;
  duration: string;
  productId?: string;
  objective: string;
  
  // Results
  strategy: string;
  contentStrategy: string;
  suggestedPosts: string[];
  suggestedReels: string[];
  adCopy: string;
  callToAction: string;
  postingSchedule: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface GenerateCampaignRequest {
  name: string;
  goal: string;
  targetAudience: string;
  platforms: string[];
  budget: string;
  duration: string;
  productId?: string;
  objective: string;
}
