"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, TrendingUp, ChevronRight } from 'lucide-react';
import { Insight } from '@/types/insights';
import { useRouter } from 'next/navigation';

interface AIInsightsProps {
  insights: Insight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  const router = useRouter();

  const handleAction = (insight: Insight) => {
    if (insight.actionType === 'Create Post' || insight.actionType === 'Create Reel') {
      router.push(`/content?type=${insight.actionTarget}`);
    } else if (insight.actionType === 'Create Ad') {
      // Future ad route
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border rounded-lg bg-muted/20 border-dashed border-border">
        <TrendingUp className="h-10 w-10 text-muted-foreground/40 mb-4" />
        <p>No insights available right now.</p>
        <p className="text-sm">Check back later for personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div key={insight._id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary-500/50 transition-colors">
          <div className="flex gap-4 items-start flex-1">
            <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
                {insight.priority === 'High' && (
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">
                    High Priority
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
              <p className="text-xs font-medium text-foreground mt-2">
                <span className="text-primary-600 dark:text-primary-400">Recommendation:</span> {insight.recommendedAction}
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            className="w-full sm:w-auto mt-2 sm:mt-0 shrink-0"
            onClick={() => handleAction(insight)}
          >
            {insight.actionType} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      ))}
    </div>
  );
}
