import { GeneratedContent, GenerateContentRequest } from '@/types/content';

// Mock Data
const mockContent: GeneratedContent[] = [
  {
    _id: '1',
    type: 'Instagram Post',
    platform: 'Instagram',
    language: 'English',
    tone: 'Professional',
    title: 'Summer Collection Launch',
    caption: 'Get ready for summer with our new collection! 🌞👗 #summerfashion #newarrival',
    hashtags: ['#summerfashion', '#newarrival', '#style'],
    suggestions: ['Add a carousel of your top 3 products', 'Use a trending audio track'],
    status: 'Published',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: '2',
    type: 'Facebook Post',
    platform: 'Facebook',
    language: 'Hindi',
    tone: 'Friendly',
    title: 'Diwali Special Offer',
    caption: 'दिवाली के इस खास मौके पर पाइए 50% तक की छूट! 🎉🪔',
    hashtags: ['#diwali', '#offer', '#sale'],
    suggestions: ['Boost this post for ₹500 to reach 2000 more people'],
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const contentService = {
  async generateContent(request: GenerateContentRequest): Promise<{ data: GeneratedContent }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newContent: GeneratedContent = {
      _id: Math.random().toString(36).substring(7),
      ...request,
      title: `Generated ${request.type}`,
      caption: `This is an AI generated caption for your ${request.type} on ${request.platform}. It has a ${request.tone} tone in ${request.language}.`,
      hashtags: ['#AI', '#Marketing', '#Growth'],
      suggestions: ['Consider adding a call-to-action link', 'Tag relevant partners'],
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app, this would be saved to DB
    mockContent.unshift(newContent);
    
    return { data: newContent };
  },

  async getContents(): Promise<{ data: GeneratedContent[] }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: [...mockContent] };
  },

  async getContent(id: string): Promise<{ data: GeneratedContent }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const content = mockContent.find(c => c._id === id);
    if (!content) throw new Error('Content not found');
    return { data: content };
  },
  
  async updateContent(id: string, updates: Partial<GeneratedContent>): Promise<{ data: GeneratedContent }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockContent.findIndex(c => c._id === id);
    if (index === -1) throw new Error('Content not found');
    
    mockContent[index] = { ...mockContent[index], ...updates, updatedAt: new Date().toISOString() };
    return { data: mockContent[index] };
  },
  
  async deleteContent(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockContent.findIndex(c => c._id === id);
    if (index > -1) {
      mockContent.splice(index, 1);
    }
  }
};
