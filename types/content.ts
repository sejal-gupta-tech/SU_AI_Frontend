export interface GeneratedContent {
  _id: string;
  userId?: string;
  businessId?: string;
  type: 'Instagram Post' | 'Instagram Caption' | 'Facebook Post' | 'LinkedIn Post' | 'Promotional Content' | 'Festival Post' | 'Product Advertisement' | 'Reel Script' | 'Ad Copy' | string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'YouTube' | string;
  language: string;
  tone: string;
  productId?: string;
  targetAudience?: string;
  topic?: string;
  callToAction?: string;
  additionalInstructions?: string;
  
  // Results
  title: string;
  caption: string;
  hashtags: string[];
  suggestions: string[];
  
  status: 'Draft' | 'Scheduled' | 'Published';
  createdAt: string;
  updatedAt: string;
}

export interface GenerateContentRequest {
  type: string;
  platform: string;
  language: string;
  tone: string;
  productId?: string;
  targetAudience?: string;
  topic?: string;
  callToAction?: string;
  additionalInstructions?: string;
}
