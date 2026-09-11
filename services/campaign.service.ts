import { Campaign, GenerateCampaignRequest } from '@/types/campaign';

const mockCampaigns: Campaign[] = [
  {
    _id: '1',
    name: 'Winter Sale 2026',
    goal: 'Sales',
    targetAudience: 'Fashion enthusiasts in Delhi',
    platforms: ['Instagram', 'Facebook'],
    budget: '₹5000',
    duration: '2 weeks',
    objective: 'Drive online sales',
    strategy: 'Focus on highlighting discounts and limited time offers. Use carousel ads for product catalogs.',
    contentStrategy: 'Post 3 times a week, run 2 continuous ad sets.',
    suggestedPosts: ['Sale Announcement Post', 'Top 5 Winter Picks Carousel', 'Last Chance Reminder'],
    suggestedReels: ['Winter styling tips', 'Behind the scenes packaging orders'],
    adCopy: 'Get ready for winter! Up to 50% off on all premium winter wear. Shop now before stocks run out!',
    callToAction: 'Shop Now',
    postingSchedule: 'Mondays, Wednesdays, Fridays at 6 PM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const campaignService = {
  async generateCampaign(request: GenerateCampaignRequest): Promise<{ data: Campaign }> {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newCampaign: Campaign = {
      _id: Math.random().toString(36).substring(7),
      ...request,
      strategy: `AI suggested strategy for ${request.goal}. Focus on high-quality visuals.`,
      contentStrategy: `Engage ${request.targetAudience} with interactive content.`,
      suggestedPosts: ['Introduction Post', 'Product Highlight', 'Customer Testimonial'],
      suggestedReels: ['Quick tip reel', 'Product in action'],
      adCopy: `Discover the best solution for your needs. Join thousands of happy customers today!`,
      callToAction: 'Learn More',
      postingSchedule: 'Optimal times: Tue, Thu, Sat at 10 AM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCampaigns.unshift(newCampaign);
    return { data: newCampaign };
  },

  async getCampaigns(): Promise<{ data: Campaign[] }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: [...mockCampaigns] };
  },
  
  async getCampaign(id: string): Promise<{ data: Campaign }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const campaign = mockCampaigns.find(c => c._id === id);
    if (!campaign) throw new Error('Campaign not found');
    return { data: campaign };
  },

  async deleteCampaign(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockCampaigns.findIndex(c => c._id === id);
    if (index > -1) {
      mockCampaigns.splice(index, 1);
    }
  }
};
