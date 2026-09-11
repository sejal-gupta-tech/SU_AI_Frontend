import api from "@/lib/api";

import {
    BrandKit,
    BrandCreate,
    BrandUpdate,
} from "@/types/brand";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const getBrandKit = async (): Promise<BrandKit> => {
    const response = await api.get<ApiResponse<BrandKit>>(
        "/api/brand"
    );

    return response.data.data;
};

export const createBrandKit = async (
    data: BrandCreate
): Promise<BrandKit> => {
    const response = await api.post<ApiResponse<BrandKit>>(
        "/api/brand",
        data
    );

    return response.data.data;
};

export const updateBrandKit = async (
    data: BrandUpdate
): Promise<BrandKit> => {
    const response = await api.put<ApiResponse<BrandKit>>(
        "/api/brand",
        data
    );

    return response.data.data;
};

export const uploadBrandLogo = async (
    file: File
): Promise<string> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<
        ApiResponse<{ logo_url: string }>
    >(
        "/api/brand/upload-logo",
        formData
    );

    return response.data.data.logo_url;
};