"use client";

import { useState } from "react";
import { ReelMakerForm } from "@/components/reel/ReelMakerForm";
import { ReelGenerationProgress } from "@/components/reel/ReelGenerationProgress";
import { ReelResult } from "@/components/reel/ReelResult";
import { reelService } from "@/services/reel.service";
import { GenerateReelRequest, ReelJobStatus } from "@/types/reel";
import { Sparkles, Video, PlayCircle } from "lucide-react";

export default function CreateReelPage() {
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
      } else {
        setError(response.message || "Failed to start generation job.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to the API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobComplete = (status: ReelJobStatus) => {
    setActiveJobId(null);
    setCompletedResult(status);
  };

  const handleJobError = (errMsg: string) => {
    setActiveJobId(null);
    setError(errMsg);
  };

  const handleReset = () => {
    setActiveJobId(null);
    setCompletedResult(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-7xl p-6 min-h-screen bg-gray-50/30">
      <div className="mb-10 flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
          <Video className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900">
            AI Reel Studio
          </h1>
          <p className="mt-2 text-gray-500 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Generate high-converting short-form videos with AI instantly.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 relative">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 xl:col-span-4 relative z-10">
          {!activeJobId && !completedResult ? (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <ReelMakerForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
          ) : (
            <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-8 text-center shadow-xl shadow-gray-200/50">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Configuration Locked</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Your reel settings are securely locked while the AI engine generates your masterpiece.
              </p>
              <button 
                type="button"
                onClick={handleReset}
                className="relative z-50 cursor-pointer text-sm font-bold text-indigo-600 bg-indigo-50 px-6 py-2.5 rounded-full hover:bg-indigo-100 transition-all hover:scale-105 active:scale-95"
              >
                Start Over
              </button>
            </div>
          )}
          
          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-5 text-sm text-red-600 border border-red-100 shadow-sm flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong className="block font-bold mb-1">Generation Failed</strong> 
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Progress or Result */}
        <div className="lg:col-span-7 xl:col-span-8 relative z-10">
          {!activeJobId && !completedResult && (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/30 text-center text-gray-400 p-12 transition-all duration-300 hover:bg-indigo-50/50">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 blur-2xl rounded-full opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-5 rounded-2xl shadow-sm border border-indigo-50 mb-6">
                  <Wand2 className="w-12 h-12 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Reel Generated Yet</h3>
              <p className="text-base max-w-md text-gray-500 leading-relaxed">
                Configure your product details, select an objective, and click <span className="font-semibold text-indigo-600">Generate Reel</span> to witness the magic of AI video creation.
              </p>
            </div>
          )}

          {activeJobId && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <ReelGenerationProgress 
                jobId={activeJobId} 
                onComplete={handleJobComplete} 
                onError={handleJobError} 
              />
            </div>
          )}

          {completedResult && (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <ReelResult 
                result={completedResult} 
                onReset={handleReset} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Wand2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
      <path d="m14 7 3 3" />
      <path d="M5 6v4" />
      <path d="M19 14v4" />
      <path d="M10 2v2" />
      <path d="M7 8H3" />
      <path d="M21 16h-4" />
      <path d="M11 3H9" />
    </svg>
  );
}
