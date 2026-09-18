import api from "@/lib/api";
import {
  PhotoshootRequest,
  PhotoshootResponse,
} from "@/types/photoshoot";

export async function generatePhotoshoot(
  data: PhotoshootRequest
): Promise<PhotoshootResponse> {

  const response = await api.post(
    "/api/v1/ai/photoshoot",
    data
  );

  return response.data.data;
}
