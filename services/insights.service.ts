import { Insight } from '@/types/insights';

const mockInsights: Insight[] = [
  {
    _id: '1',
    title: 'Trending in your area',
    description: 'Short-form video content is currently performing strongly among your target demographic.',
    priority: 'High',
    recommendedAction: 'Create a 20-second product Reel highlighting your newest arrivals.',
    actionType: 'Create Reel',
    actionTarget: 'Reel Script',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Audience Engagement',
    description: 'Your audience is most active between 6 PM and 8 PM on weekdays.',
    priority: 'Medium',
    recommendedAction: 'Schedule your next Instagram post for Tuesday at 7 PM for maximum reach.',
    actionType: 'Create Post',
    actionTarget: 'Instagram Post',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Product Promotion Opportunity',
    description: 'Winter wear searches have increased by 40% in your location.',
    priority: 'High',
    recommendedAction: 'Launch a promotional ad for your winter collection.',
    actionType: 'Create Ad',
    actionTarget: 'Ad Copy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const insightsService = {
  async getInsights(): Promise<{ data: Insight[] }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: [...mockInsights] };
  }
};
