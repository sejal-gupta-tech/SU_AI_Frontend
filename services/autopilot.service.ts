import api from "@/lib/api";

export interface AutopilotSchedule {
  [day: string]: string[];
}

export interface QueueItem {
  id: string;
  content_id: string;
  scheduled_for: string;
  status: "pending" | "published" | "failed";
  platform: string;
  error_message?: string;
  created_at: string;
}

export const autopilotService = {
  async getQueue(): Promise<{ data: QueueItem[] }> {
    const res = await api.get("/api/v1/autopilot/queue");
    return res.data;
  },

  async toggleAutopilot(enabled: boolean): Promise<{ message: string }> {
    const res = await api.post("/api/v1/autopilot/toggle", { enabled });
    return res.data;
  },

  async updateSchedule(schedule: AutopilotSchedule): Promise<{ message: string }> {
    const res = await api.put("/api/v1/autopilot/schedule", { schedule });
    return res.data;
  },

  async cancelScheduledPost(itemId: string): Promise<{ message: string }> {
    const res = await api.delete(`/api/v1/autopilot/queue/${itemId}`);
    return res.data;
  }
};
