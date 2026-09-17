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
    switch (content.platform.toLowerCase()) {
      case 'instagram': return <Camera className="h-4 w-4 text-pink-600" />;
      case 'facebook': return <Users className="h-4 w-4 text-blue-600" />;
      case 'linkedin': return <Briefcase className="h-4 w-4 text-blue-800" />;
      case 'youtube': return <PlaySquare className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const StatusBadge = () => {
    const styles = {
      Draft: 'bg-gray-100 text-gray-700',
      Scheduled: 'bg-blue-100 text-blue-700',
      Published: 'bg-green-100 text-green-700',
    };
    
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[content.status as keyof typeof styles] || styles.Draft}`}>
        {content.status}
      </span>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow group flex flex-col h-full">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-muted/50 rounded-md">
            {PlatformIcon()}
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">{content.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {StatusBadge()}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary-600" onClick={() => onView?.(content)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary-600" onClick={() => onEdit?.(content)}>
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-600" onClick={() => onDelete?.(content._id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-base leading-tight mb-2 line-clamp-2">{content.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{content.caption}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {content.hashtags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{tag}</span>
          ))}
          {content.hashtags.length > 3 && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">+{content.hashtags.length - 3}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center border-t border-border/50 mt-auto pt-3">
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
