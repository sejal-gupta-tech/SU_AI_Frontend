import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function InsufficientCreditsAlert() {
  return (
    <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 shadow-lg mb-6 animate-in fade-in slide-in-from-top-2">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-400">
            You don&apos;t have enough AI credits.
          </h3>
          <div className="mt-2 text-sm text-red-400/80">
            <p>
              Your current plan has run out of AI generation credits. Upgrade your subscription to continue generating content.
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <Link
                href="/subscription"
                className="rounded-md bg-red-400/20 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-400/30 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
