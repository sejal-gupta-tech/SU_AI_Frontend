import { AnalyticsData } from "@/types/analytics";

export interface GroqVisualPillar {
  pillar: string;
  score: number;
  maxScore: number;
  status: string;
  color: string;
}

export interface GroqVisualForecast {
  currentScore: number;
  projectedScore: number;
  growthFactor: string;
  topFormat: string;
  efficiencyRating: "Optimal" | "High Velocity" | "Moderate";
}

export interface GroqVisualAnalytics {
  forecast: GroqVisualForecast;
  pillars: GroqVisualPillar[];
  topActions: {
    title: string;
    targetRoute: string;
    impact: "High" | "Quick Win";
    badgeColor: string;
  }[];
  generatedAt: string;
}

const DEFAULT_MODEL = "openai/gpt-oss-20b";

export const groqAnalyticsService = {
  /**
   * Generates dynamic visual forecast and benchmark data via Groq API.
   */
  async generateVisualAnalytics(data: AnalyticsData, range: number): Promise<GroqVisualAnalytics> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const model = process.env.NEXT_PUBLIC_GROQ_MODEL || DEFAULT_MODEL;

    if (!apiKey) {
      throw new Error("Groq API key not found.");
    }

    const prompt = `
Analyze the user's marketing metrics for the last ${range} days:
- Reels: ${data.content?.reels ?? 0}, Posts: ${data.content?.posts ?? 0}, Photoshoots: ${data.content?.photoshoots ?? 0}, Images: ${data.content?.images ?? 0}, Captions: ${data.content?.captions ?? 0}
- Total AI Generations: ${data.ai_usage?.total_generations ?? 0}, Credits Used: ${data.ai_usage?.credits_used ?? 0}
- Products: ${data.business?.products ?? 0}, Calendars: ${data.business?.calendars ?? 0}
- Score: ${data.marketing_score?.score ?? 0}/100

Generate concise numeric predictions and visual dashboard metrics.
Return ONLY valid JSON strictly matching this schema with NO conversational text:

{
  "forecast": {
    "currentScore": ${data.marketing_score?.score ?? 0},
    "projectedScore": ${Math.min(100, (data.marketing_score?.score ?? 0) + 24)},
    "growthFactor": "+24% Expected Surge",
    "topFormat": "Reels",
    "efficiencyRating": "High Velocity"
  },
  "pillars": [
    { "pillar": "Content Output", "score": ${data.marketing_score?.breakdown?.content_activity ?? 0}, "maxScore": 25, "status": "Active", "color": "#BE32FF" },
    { "pillar": "AI Computation", "score": ${data.marketing_score?.breakdown?.ai_usage ?? 0}, "maxScore": 25, "status": "Strong", "color": "#10B981" },
    { "pillar": "Reels Volume", "score": ${data.marketing_score?.breakdown?.reel_activity ?? 0}, "maxScore": 15, "status": "High", "color": "#F0449B" },
    { "pillar": "Product Catalog", "score": ${data.marketing_score?.breakdown?.product_catalogue ?? 0}, "maxScore": 20, "status": "Growing", "color": "#3B82F6" },
    { "pillar": "Calendar Planning", "score": ${data.marketing_score?.breakdown?.calendar_usage ?? 0}, "maxScore": 15, "status": "Standard", "color": "#FC9A5D" }
  ],
  "topActions": [
    { "title": "Create AI Reel", "targetRoute": "/create/reel", "impact": "High", "badgeColor": "#F0449B" },
    { "title": "AI Photoshoot", "targetRoute": "/ai-photoshoot", "impact": "High", "badgeColor": "#FC9A5D" },
    { "title": "Plan 30-Day Calendar", "targetRoute": "/ai-calendar", "impact": "Quick Win", "badgeColor": "#10B981" }
  ]
}
`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          temperature: 0.5,
          max_tokens: 1500,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You output JSON dashboard visualization metrics only." },
            { role: "user", content: prompt }
          ],
        }),
      });

      if (!response.ok) throw new Error(`Groq API returned ${response.status}`);
      const json = await response.json();
      const rawText = (json.choices?.[0]?.message?.content || "").replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed: GroqVisualAnalytics = JSON.parse(rawText);
      parsed.generatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return parsed;
    } catch (err) {
      console.error("Groq Visual Analytics error", err);
      // Fallback visual metrics
      return {
        forecast: {
          currentScore: data.marketing_score?.score ?? 0,
          projectedScore: Math.min(100, (data.marketing_score?.score ?? 0) + 24),
          growthFactor: "+24% Velocity",
          topFormat: "Reels",
          efficiencyRating: "High Velocity"
        },
        pillars: [
          { pillar: "Content Output", score: data.marketing_score?.breakdown?.content_activity ?? 0, maxScore: 25, status: "Active", color: "#BE32FF" },
          { pillar: "AI Computation", score: data.marketing_score?.breakdown?.ai_usage ?? 0, maxScore: 25, status: "Strong", color: "#10B981" },
          { pillar: "Reels Volume", score: data.marketing_score?.breakdown?.reel_activity ?? 0, maxScore: 15, status: "High", color: "#F0449B" },
          { pillar: "Product Catalog", score: data.marketing_score?.breakdown?.product_catalogue ?? 0, maxScore: 20, status: "Growing", color: "#3B82F6" },
          { pillar: "Calendar Planning", score: data.marketing_score?.breakdown?.calendar_usage ?? 0, maxScore: 15, status: "Standard", color: "#FC9A5D" }
        ],
        topActions: [
          { title: "Create AI Reel", targetRoute: "/create/reel", impact: "High", badgeColor: "#F0449B" },
          { title: "AI Photoshoot", targetRoute: "/ai-photoshoot", impact: "High", badgeColor: "#FC9A5D" },
          { title: "Plan 30-Day Calendar", targetRoute: "/ai-calendar", impact: "Quick Win", badgeColor: "#10B981" }
        ],
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  }
};
