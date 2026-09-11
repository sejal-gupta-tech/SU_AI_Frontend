export interface Product {
    id: string;
    business_id: string;

    name: string;
    description?: string;

    price: number;
    sale_price?: number;

    sizes: string[];
    colors: string[];

    stock: number;

    image_url?: string;

    created_at?: string;
    updated_at?: string;
}

export interface ProductCreate {
    name: string;
    description?: string;
    price: number;
    sale_price?: number;
    sizes: string[];
    colors: string[];
    stock: number;
    image_url?: string;
}

export type ProductUpdate =
    Partial<ProductCreate>;