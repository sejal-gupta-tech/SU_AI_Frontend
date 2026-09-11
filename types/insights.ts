export interface Insight {
  _id: string;
  userId?: string;
  businessId?: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  recommendedAction: string;
  actionType: 'Create Post' | 'Create Reel' | 'Create Ad' | 'Promote Product' | string;
  actionTarget?: string; // e.g. pre-fill content type
  createdAt: string;
  updatedAt: string;
}
