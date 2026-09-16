import api from "@/lib/api";

const mockInsights = [
  {
    _id: "1",
    title: "High Engagement on Silk Sarees",
    description: "Your recent posts featuring Silk Sarees have 40% higher engagement. We recommend creating more content around this product category.",
    priority: "High",
    recommendedAction: "Create a new Reel focusing on Silk Saree draping styles.",
    actionType: "Create Reel",
    actionTarget: "reel"
  },
  {
    _id: "2",
    title: "Untapped Audience Segment",
    description: "Analytics show growing interest from users aged 18-24 in your modern fusion wear.",
    priority: "Medium",
    recommendedAction: "Create a targeted Instagram Post highlighting trendy fusion styles.",
    actionType: "Create Post",
    actionTarget: "post"
  }
];

export const getDashboardInsights = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return { data: mockInsights };
};
