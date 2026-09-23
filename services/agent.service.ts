import api from "@/lib/api";

export interface AgentCommandResponse {
  success: boolean;
  action: string;
  message?: string;
  data?: any;
}

const agentService = {
  async sendCommand(command: string): Promise<AgentCommandResponse> {
    const res = await api.post("/api/v1/agent/command", { command });
    return res.data;
  },
};

export default agentService;
