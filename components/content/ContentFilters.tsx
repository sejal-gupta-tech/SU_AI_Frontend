"use client";

import { Button } from '@/components/ui/button';

interface ContentFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ContentFilters({ currentFilter, onFilterChange }: ContentFiltersProps) {
  const filters = [
    'All',
    'Posts',
    'Reels',
    'Ads',
    'Drafts',
    'Scheduled',
    'Published'
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={currentFilter === filter ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className={`rounded-full ${
            currentFilter === filter 
              ? 'bg-brand-purple text-white hover:bg-brand-purple/80' 
              : 'bg-surface border-border hover:bg-brand-purple/10 text-text-muted hover:text-brand-purple'
          }`}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
