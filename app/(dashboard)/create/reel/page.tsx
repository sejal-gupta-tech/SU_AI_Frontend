"use client";

import { useState, useCallback } from "react";
import { ReelMakerForm } from "@/components/reel/ReelMakerForm";
import { ReelGenerationProgress } from "@/components/reel/ReelGenerationProgress";
import { ReelResult } from "@/components/reel/ReelResult";
import { reelService } from "@/services/reel.service";
import { GenerateReelRequest, ReelJobStatus } from "@/types/reel";
import { Sparkles, Video } from "lucide-react";

type PageState = "form" | "generating" | "result";

export default function CreateReelPage() {
  const [pageState, setPageState] = useState<PageState>("form");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [completedResult, setCompletedResult] = useState<ReelJobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (request: GenerateReelRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reelService.generateReel(request);
      if (response.success && response.job_id) {
        setActiveJobId(response.job_id);
        setPageState("generating");
      } else {
        setError(response.message || "Failed to start generation job.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "An error occurred while connecting to the API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobComplete = useCallback((status: ReelJobStatus) => {
    setActiveJobId(null);
    setCompletedResult(status);
    setPageState("result");
  }, []);

  const handleJobError = useCallback((errMsg: string) => {
    setActiveJobId(null);
    setError(errMsg);
    setPageState("form");
  }, []);

  const handleReset = () => {
    setActiveJobId(null);
    setCompletedResult(null);
    setError(null);
    setPageState("form");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200">
          <Video className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900">
            AI Reel Studio
          </h1>
          <p className="mt-1 text-gray-500 font-medium flex items-center gap-1.5 text-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Generate high-converting short-form videos with AI instantly.
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-200 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <strong className="block font-bold mb-1">Generation Failed</strong>
            {error}
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* FORM STATE */}
      {pageState === "form" && (
        <ReelMakerForm onGenerate={handleGenerate} isLoading={isLoading} />
      )}

      {/* GENERATING STATE */}
      {pageState === "generating" && activeJobId && (
        <div>
          <ReelGenerationProgress
            jobId={activeJobId}
            onComplete={handleJobComplete}
            onError={handleJobError}
          />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Cancel &amp; Start Over
            </button>
          </div>
        </div>
      )}

      {/* RESULT STATE */}
      {pageState === "result" && completedResult && (
        <ReelResult result={completedResult} onReset={handleReset} />
      )}
    </div>
  );
}

