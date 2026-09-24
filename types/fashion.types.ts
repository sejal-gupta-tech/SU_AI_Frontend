export type FashionCategory = "tshirt" | "shirt" | "dress" | "hoodie" | "jacket" | "top" | "other";
export type GenderType = "male" | "female" | "unisex";
export type ModelType = "male" | "female";
export type PoseType = "standing" | "walking" | "sitting" | "hands_in_pockets" | "crossed_arms" | "looking_left" | "looking_right" | "custom";
export type BackgroundType = "studio" | "street" | "cafe" | "office" | "home" | "beach" | "luxury_store" | "gym" | "outdoor" | "custom";
export type ShotType = "full_body" | "upper_body" | "close_up";
export type ViewType = "front" | "back" | "side";
export type GenerationStatus = "pending" | "processing" | "completed" | "failed";

export interface FashionProduct {
  id: string;
  name: string;
  category: FashionCategory;
  gender: GenderType;
  color: string;
  image_url: string;
  description?: string;
  created_at: string;
}

export interface FashionConfig {
  categories: string[];
  genders: string[];
  model_types: string[];
  model_styles: {
    male: string[];
    female: string[];
  };
  poses: string[];
  backgrounds: string[];
  shot_types: string[];
  views: string[];
  locations: string[];
  virtual_tryon_configured: boolean;
}

export interface PhotoshootRequest {
  product_id?: string;
  category?: string;
  color?: string;
  garment_name?: string;
  model_type: ModelType;
  model_style: string;
  pose: PoseType;
  background: BackgroundType;
  location?: string;
  shot_type: ShotType;
  view: ViewType;
  custom_pose_description?: string;
  custom_background_description?: string;
}

export interface VirtualTryOnRequest {
  person_image_url: string;
  product_id?: string;
  category?: string;
  color?: string;
  garment_name?: string;
}

export interface GenerationHistoryItem {
  id: string;
  type: "photoshoot" | "tryon";
  product_id?: string;
  product_name?: string;
  model_type?: string;
  model_style?: string;
  pose?: string;
  background?: string;
  location?: string;
  status: GenerationStatus;
  result_images?: string[];
  result_image_url?: string;
  created_at: string;
  completed_at?: string;
}
