// Global Types

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Business {
  id: string;
  name: string;
  website?: string;
  instagram?: string;
  category: string;
  location: string;
  targetCustomer?: string;
  preferredLanguage?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
}

export interface BrandKit {
  id: string;
  businessId: string;
  logoUrl?: string;
  brandName: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  brandVoice: string;
  targetAudience?: string;
  language?: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: string[];
  stock: number;
  category: string;
  sku: string;
  images: string[];
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface APIError {
  message: string;
  code?: string;
}
