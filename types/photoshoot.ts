export type PhotoshootStyle =
  | "studio"
  | "lifestyle"
  | "model"
  | "festival"
  | "marketplace";

export interface PhotoshootRequest {
  product_id: string;
  style: PhotoshootStyle;
  background?: string;
  model?: string;
  pose?: string;
  language: string;
  additional_instruction?: string;
}

export interface PhotoshootResponse {
  id: string;
  image_url: string;
  prompt: string;
  style: PhotoshootStyle;
  status: string;
}
