import api from "@/lib/api";

export interface CalendarRequest {
  product_id: string;
  prompt: string;
}

export interface DayPlan {
  day_number: number;
  content_type: string;
  caption: string;
  hashtags: string;
  visual_direction: string;
}

export interface CalendarResponse {
  success: boolean;
  message: string;
  data: DayPlan[];
}

export async function generateCalendar(data: CalendarRequest): Promise<DayPlan[]> {
  const response = await api.post("/api/v1/ai/calendar/", data);
  return response.data.data;
}
