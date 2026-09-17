"use client";

import { useState } from "react";
import { generateAd } from "@/services/ad.service";

export function useCreateAd() {

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: any) => {

    setLoading(true);
    setError(null);

    try {

      const response = await generateAd(data);

      setResult(response);

      return response;

    } catch (error: any) {

      setError(
        error?.response?.data?.detail ||
        "Failed to generate ad"
      );

    } finally {

      setLoading(false);

    }
  };

  return {
    create,
    loading,
    result,
    error,
  };
}
