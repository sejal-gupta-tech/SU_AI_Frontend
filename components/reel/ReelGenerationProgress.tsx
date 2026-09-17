import { useEffect, useState } from "react";
import { reelService } from "@/services/reel.service";
import { ReelJobStatus } from "@/types/reel";

interface ReelGenerationProgressProps {
  jobId: string;
  onComplete: (status: ReelJobStatus) => void;
  onError: (error: string) => void;
}

export function ReelGenerationProgress({ jobId, onComplete, onError }: ReelGenerationProgressProps) {
  const [status, setStatus] = useState<ReelJobStatus | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const data = await reelService.getReelStatus(jobId);
        setStatus(data);

        if (data.status === "completed") {
          clearInterval(interval);
          onComplete(data);
        } else if (data.status === "failed") {
          clearInterval(interval);
          onError(data.message || data.stage || "Reel generation failed.");
        }
      } catch (err: any) {
        clearInterval(interval);
        onError(err.message || "Failed to check status.");
      }
    };

    pollStatus();
    interval = setInterval(pollStatus, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [jobId, onComplete, onError]);

  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-gray-500 bg-white rounded-2xl border">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        <p>Connecting to generation service...</p>
      </div>
    );
  }

  const stages = [
    { key: "queued", label: "Queued" },
    { key: "generating_script", label: "Writing Script" },
    { key: "generating_voice", label: "Creating Voiceover" },
    { key: "generating_video", label: "Generating Video" },
    { key: "composing", label: "Applying Captions & Finalizing" },
  ];

  // Determine active stage by mapping progress percentage (0-100)
  let currentStageIndex = 0;
  if (status.progress >= 10 && status.progress < 30) currentStageIndex = 1;
  else if (status.progress >= 30 && status.progress < 50) currentStageIndex = 2;
  else if (status.progress >= 50 && status.progress < 80) currentStageIndex = 3;
  else if (status.progress >= 80) currentStageIndex = 4;
  
  if (status.status === "completed") currentStageIndex = 5;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 space-y-8 shadow-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Crafting Your Reel</h2>
      </div>
      
      <div className="relative pt-2">
        <div className="flex mb-3 items-center justify-between">
          <div>
            <span className="text-xs font-bold inline-block py-1.5 px-3 uppercase rounded-full text-indigo-700 bg-indigo-100/80 shadow-sm border border-indigo-200">
              {status.stage || "Processing"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold inline-block text-indigo-600">
              {status.progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-3 mb-6 text-xs flex rounded-full bg-indigo-100 inset-shadow-sm">
          <div 
            style={{ width: `${status.progress}%` }} 
            className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] animate-[gradient_2s_linear_infinite] transition-all duration-700 ease-out"
          ></div>
        </div>
      </div>

      <div className="bg-white/50 rounded-2xl p-6 border border-gray-100 shadow-sm">
        <ul className="space-y-5">
          {stages.map((stage, index) => {
            const isCompleted = currentStageIndex > index || status.status === "completed";
            const isActive = currentStageIndex === index && status.status !== "completed";
            const isPending = currentStageIndex < index && status.status !== "completed";

            return (
              <li key={stage.key} className="flex items-center space-x-4 relative">
                {/* Connecting Line */}
                {index !== stages.length - 1 && (
                  <div className={`absolute left-3.5 top-8 w-0.5 h-6 -ml-px ${isCompleted ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                )}
                
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' : isActive ? 'border-indigo-500 text-indigo-600 bg-white animate-pulse' : 'border-gray-200 text-gray-300 bg-white'}`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                  )}
                </div>
                
                <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${isCompleted ? "text-gray-900" : isActive ? "text-indigo-700" : "text-gray-400"}`}>
                  {stage.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
