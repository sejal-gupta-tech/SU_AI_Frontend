"use client";

import { GeneratedContent } from '@/types/content';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Users, Briefcase, PlaySquare, MoreVertical, Calendar, Eye, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  content: GeneratedContent;
  onView?: (content: GeneratedContent) => void;
  onEdit?: (content: GeneratedContent) => void;
  onDelete?: (id: string) => void;
}

export function ContentCard({ content, onView, onEdit, onDelete }: ContentCardProps) {
  const PlatformIcon = () => {
    switch (content.platform?.toLowerCase() || '') {
      case 'instagram': return <Camera className="h-4 w-4 text-pink-600" />;
      case 'facebook': return <Users className="h-4 w-4 text-blue-600" />;
      case 'linkedin': return <Briefcase className="h-4 w-4 text-blue-800" />;
      case 'youtube': return <PlaySquare className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const StatusBadge = () => {
    const styles = {
      Draft: 'bg-surface-elevated text-text-secondary',
      Scheduled: 'bg-brand-purple/10 text-brand-purple',
      Published: 'bg-brand-coral/10 text-brand-coral',
    };
    
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[content.status as keyof typeof styles] || styles.Draft}`}>
        {content.status}
      </span>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow group flex flex-col h-full">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0 border-b border-border/10">
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-surface-elevated rounded-md">
            {PlatformIcon()}
          </div>
          <div>
            <span className="text-xs font-medium text-text-muted">{content.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {StatusBadge()}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-text-muted hover:text-brand-purple" onClick={() => onView?.(content)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-text-muted hover:text-brand-purple" onClick={() => onEdit?.(content)}>
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-text-muted hover:text-red-500" onClick={() => onDelete?.(content._id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-base leading-tight mb-2 line-clamp-2 text-white">{content.title}</CardTitle>
        <p className="text-sm text-text-muted line-clamp-3 mb-3">{content.caption}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {(content.hashtags || []).slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded">{tag}</span>
          ))}
          {(content.hashtags?.length || 0) > 3 && (
            <span className="text-[10px] text-text-muted bg-surface-elevated px-1.5 py-0.5 rounded">+{(content.hashtags?.length || 0) - 3}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 text-xs text-text-muted flex justify-between items-center border-t border-border mt-auto pt-3">
        <span className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {(content.updatedAt && !isNaN(new Date(content.updatedAt).getTime())) 
            ? formatDistanceToNow(new Date(content.updatedAt), { addSuffix: true }) 
            : 'Recently'}
        </span>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onView?.(content)}>
          Preview
        </Button>
      </CardFooter>
    </Card>
  );
}
