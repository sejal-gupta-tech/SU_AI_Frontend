import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  withText?: boolean;
  size?: "sm" | "default" | "lg";
  showSubtitle?: boolean;
}

export function Logo({ className, withText = true, size = "default", showSubtitle = true }: LogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className={cn("flex items-center gap-2 md:gap-3", className)}>
      <div 
        className={cn(
          "relative flex-shrink-0 flex items-center justify-center",
          isSm ? "h-8 w-8" : isLg ? "h-16 w-16" : "h-10 w-10 md:h-12 md:w-12"
        )}
      >
        <div className="bg-brand-pink/20 text-brand-pink p-1.5 rounded-md flex items-center justify-center h-full w-full">
          <Sparkles className="h-full w-full" />
        </div>
      </div>
      {withText && (
        <div className="flex flex-col justify-center min-w-0 overflow-hidden">
          <span 
            className={cn(
              "font-bold text-white tracking-tight leading-tight truncate",
              isSm ? "text-base md:text-lg" : isLg ? "text-2xl" : "text-lg md:text-xl"
            )}
          >
            SevenUnique AI
          </span>
          {showSubtitle && (
            <span 
              className={cn(
                "text-gray-300 font-medium mt-0.5 truncate",
                isSm ? "text-[9px] md:text-[10px]" : isLg ? "text-sm" : "text-[10px] md:text-xs"
              )}
            >
              India's AI Business Growth App
            </span>
          )}
        </div>
      )}
    </div>
  );
}
