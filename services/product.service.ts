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
    >("/api/v1/products");

    return response.data.data;
};

export const getProduct = async (
    productId: string
): Promise<Product> => {
    const response = await api.get<
        ApiResponse<Product>
    >(`/api/v1/products/${productId}`);

    return response.data.data;
};

export const createProduct = async (
    data: ProductCreate
): Promise<Product> => {
    const response = await api.post<
        ApiResponse<Product>
    >("/api/v1/products", data);

    return response.data.data;
};

export const updateProduct = async (
    productId: string,
    data: ProductUpdate
): Promise<Product> => {
    const response = await api.put<
        ApiResponse<Product>
    >(
        `/api/v1/products/${productId}`,
        data
    );

    return response.data.data;
};

export const deleteProduct = async (
    productId: string
) => {
    const response = await api.delete(
        `/api/v1/products/${productId}`
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
        "/api/v1/products/upload-image",
        formData
    );

    return response.data.data.image_url;
};