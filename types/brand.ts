export interface ContactInfo {
    phone?: string;
    email?: string;
}

export interface LocationInfo {
    city?: string;
    state?: string;
}

export interface BrandKit {
    id: string;
    business_id: string;

    logo_url?: string;

    primary_color?: string;
    secondary_color?: string;

    font?: string;
    tone?: string;

    brand_description?: string;
    target_audience?: string;

    website?: string;
    instagram?: string;

    contact?: ContactInfo;
    location?: LocationInfo;

    social_style?: string;

    created_at?: string;
    updated_at?: string;
}

export interface BrandCreate {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    font?: string;
    tone?: string;
    brand_description?: string;
    target_audience?: string;
    website?: string;
    instagram?: string;
    contact?: ContactInfo;
    location?: LocationInfo;
    social_style?: string;
}

export type BrandUpdate = Partial<BrandCreate>;