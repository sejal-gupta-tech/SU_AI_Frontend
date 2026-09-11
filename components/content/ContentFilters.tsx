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
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-white hover:bg-primary-50 text-muted-foreground hover:text-primary-700'
          }`}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
