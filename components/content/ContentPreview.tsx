"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GeneratedContent } from '@/types/content';
import { Copy, RefreshCw, Save, Calendar, Check, Edit2 } from 'lucide-react';

interface ContentPreviewProps {
  content: GeneratedContent;
  onRegenerate: () => void;
  onSave: (editedContent: GeneratedContent) => void;
}

export function ContentPreview({ content, onRegenerate, onSave }: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${editedContent.title}\n\n${editedContent.caption}\n\n${editedContent.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
    alert("Content saved to database successfully!");
  };

  const handleSchedule = () => {
    alert("Content scheduled for posting!");
  };

  return (
    <Card className="border-border shadow-md bg-card">
      <CardHeader className="bg-muted/50 border-b border-border pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              Generated Result
              <span className="text-xs px-2 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full font-medium">
                {editedContent.type}
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Platform: {editedContent.platform} • Tone: {editedContent.tone}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="text-muted-foreground hover:bg-muted">
              <Edit2 className="h-4 w-4 mr-1" /> {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="text-muted-foreground hover:bg-muted">
              {copiedText ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Headline / Title</h3>
          {isEditing ? (
            <input 
              className="w-full p-2 border rounded-md text-lg font-medium"
              value={editedContent.title}
              onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
            />
          ) : (
            <h2 className="text-xl font-medium text-foreground">{editedContent.title}</h2>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Caption</h3>
          {isEditing ? (
            <textarea 
              className="w-full p-3 border rounded-md min-h-[150px]"
              value={editedContent.caption}
              onChange={(e) => setEditedContent({...editedContent, caption: e.target.value})}
            />
          ) : (
            <p className="text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-4 rounded-lg">{editedContent.caption}</p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Hashtags</h3>
          {isEditing ? (
            <input 
              className="w-full p-2 border rounded-md"
              value={editedContent.hashtags.join(' ')}
              onChange={(e) => setEditedContent({...editedContent, hashtags: e.target.value.split(' ')})}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {editedContent.hashtags.map((tag, i) => (
                <span key={i} className="text-sm text-primary-600 dark:text-primary-400 bg-primary-500/10 px-2 py-1 rounded-md">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {editedContent.suggestions.length > 0 && !isEditing && (
          <div className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Suggestions</h3>
            <ul className="list-disc pl-5 space-y-1">
              {editedContent.suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm text-muted-foreground">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/10 border-t border-border p-4 flex justify-between">
        <Button variant="ghost" onClick={onRegenerate} className="text-muted-foreground">
          <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSchedule} className="border-primary-200 text-primary-700 dark:text-primary-400 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950">
            <Calendar className="h-4 w-4 mr-2" /> Schedule
          </Button>
          <Button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white">
            <Save className="h-4 w-4 mr-2" /> Save Content
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
