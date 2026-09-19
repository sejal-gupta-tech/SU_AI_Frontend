"use client";

import { useState } from "react";
import {
  generatePhotoshoot,
} from "@/services/photoshoot.service";

export function usePhotoshoot() {

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<any>(null);

  const generate = async (data: any) => {

    setLoading(true);
    setError(null);

    try {

      const response = await generatePhotoshoot(data);

      setResult(response);
      window.dispatchEvent(new Event("credit-update"));

      return response;

    } catch (error: any) {

      setError(
        error?.response?.data?.detail ||
        "Failed to generate photoshoot"
      );
      setRawError(error);

    } finally {

      setLoading(false);

    }
  };

  return {
    generate,
    loading,
    result,
    error,
    rawError,
  };
}
