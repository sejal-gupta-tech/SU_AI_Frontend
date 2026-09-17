import { GeneratedContent, GenerateContentRequest, GeneratePostRequest, GeneratedPost } from '@/types/content';
import api from "@/lib/api";

export const contentService = {
  async generateContent(request: GenerateContentRequest): Promise<{ data: GeneratedContent }> {
    const response = await api.post("/api/v1/content/generate-post", {
      product_id: request.productId || "",
      platform: request.platform.toLowerCase(),
      objective: request.type.toLowerCase(),
      language: request.language,
      additional_instruction: request.additionalInstructions
    });

    const apiData = response.data.data;

    const newContent: GeneratedContent = {
      _id: apiData._id || Math.random().toString(36).substring(7),
      type: request.type,
      platform: request.platform,
      language: request.language,
      tone: request.tone,
      productId: request.productId,
      targetAudience: request.targetAudience,
      topic: request.topic,
      callToAction: request.callToAction,
      additionalInstructions: request.additionalInstructions,
      
      title: apiData.headline || "Generated " + request.type,
      caption: apiData.caption || "",
      hashtags: apiData.hashtags || [],
      suggestions: apiData.creative_direction ? [apiData.creative_direction] : [],
      
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return { data: newContent };
  },

  async getContents(): Promise<{ data: GeneratedContent[] }> {
    const response = await api.get("/api/v1/content");
    return { data: response.data.data };
  },

  async getContent(id: string): Promise<{ data: GeneratedContent }> {
    // Optionally implement a GET by ID endpoint if needed, for now we will assume it's part of getContents list
    const response = await api.get("/api/v1/content");
    const content = response.data.data.find((c: any) => c._id === id);
    if (!content) throw new Error('Content not found');
    return { data: content };
  },
  
  async updateContent(id: string, updates: Partial<GeneratedContent>): Promise<{ data: GeneratedContent }> {
    const response = await api.put("/api/v1/content/update", { ...updates, _id: id });
    return { data: response.data.data };
  },
  
  async deleteContent(id: string): Promise<void> {
    await api.delete(`/api/v1/content/${id}`);
  }
};

export async function generatePost(
  payload: GeneratePostRequest
): Promise<GeneratedPost> {

  const response = await api.post(
    "/api/v1/content/generate-post",
    payload
  );

  return response.data.data;
}