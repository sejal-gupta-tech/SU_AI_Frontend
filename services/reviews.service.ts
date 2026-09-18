import { Review } from '@/types/reviews';

export const reviewsService = {
  async getReviews(): Promise<{ data: Review[] }> {
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!groqKey) {
      throw new Error("Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local");
    }

    const prompt = `
Generate 4 realistic customer reviews for a business.
Return ONLY a raw JSON array of objects with NO markdown formatting, NO backticks. 
Each object must have these keys exactly:
"customerName" (string, random person name)
"reviewText" (string, the review content, 1-3 sentences)
"rating" (number, 1 to 5)
"status" (string, either "Pending" or "Replied")
`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_GROQ_MODEL || "llama3-8b-8192",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        })
      });

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const json = await response.json();
      let content = json.choices[0].message.content.trim();
      
      if (content.startsWith("```json")) {
        content = content.replace(/```json/g, "").replace(/```/g, "").trim();
      } else if (content.startsWith("```")) {
        content = content.replace(/```/g, "").trim();
      }

      const parsedReviews = JSON.parse(content);
      const data = parsedReviews.map((r: any, index: number) => ({
        _id: "rev-" + Date.now() + "-" + index,
        customerName: r.customerName,
        reviewText: r.reviewText,
        rating: r.rating,
        status: r.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reply: r.status === "Replied" ? "Thank you for your feedback!" : null
      }));

      return { data };
    } catch (error) {
      console.error("Groq Reviews Error:", error);
      return { data: [] }; // Fallback
    }
  },

  async generateReply(reviewId: string, reviewText?: string): Promise<{ data: string }> {
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!groqKey) return { data: "Thank you for your review! We appreciate your feedback." };

    const prompt = `
You are a professional customer support agent. Generate a polite and helpful reply to this customer review:
"${reviewText || "Great service!"}"

Return ONLY the reply text, no quotes, no extra formatting.
`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_GROQ_MODEL || "llama3-8b-8192",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        })
      });

      if (!response.ok) throw new Error("Failed to generate reply");

      const json = await response.json();
      let content = json.choices[0].message.content.trim();
      
      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.substring(1, content.length - 1);
      }
      
      return { data: content };
    } catch (error) {
      console.error("Groq Reply Error:", error);
      return { data: "Thank you for your review! We truly appreciate your feedback." };
    }
  },

  async sendReply(reviewId: string, replyText: string): Promise<{ data: Review }> {
    // Mock response for frontend update
    return { 
      data: {
        _id: reviewId,
        customerName: "Customer",
        reviewText: "...",
        rating: 5,
        status: 'Replied',
        reply: replyText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Review
    };
  }
};
