import api from "@/lib/api";

import {
    Product,
    ProductCreate,
    ProductUpdate,
} from "@/types/product";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get<
        ApiResponse<Product[]>
    >("/api/products");

    return response.data.data;
};

export const getProduct = async (
    productId: string
): Promise<Product> => {
    const response = await api.get<
        ApiResponse<Product>
    >(`/api/products/${productId}`);

    return response.data.data;
};

export const createProduct = async (
    data: ProductCreate
): Promise<Product> => {
    const response = await api.post<
        ApiResponse<Product>
    >("/api/products", data);

    return response.data.data;
};

export const updateProduct = async (
    productId: string,
    data: ProductUpdate
): Promise<Product> => {
    const response = await api.put<
        ApiResponse<Product>
    >(
        `/api/products/${productId}`,
        data
    );

    return response.data.data;
};

export const deleteProduct = async (
    productId: string
) => {
    const response = await api.delete(
        `/api/products/${productId}`
    );

    return response.data;
};

export const uploadProductImage = async (
    file: File
): Promise<string> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<
        ApiResponse<{ image_url: string }>
    >(
        "/api/products/upload-image",
        formData
    );

    return response.data.data.image_url;
};