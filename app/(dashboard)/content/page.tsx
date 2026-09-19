"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentGenerator } from '@/components/content/ContentGenerator';
import { ContentPreview } from '@/components/content/ContentPreview';
import { contentService } from '@/services/content.service';
import { GenerateContentRequest, GeneratedContent } from '@/types/content';
import { Sparkles, History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ContentStudioContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const productIdParam = searchParams.get('productId');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const initialType = typeParam === 'reel' ? 'Reel Script' : typeParam === 'post' ? 'Instagram Post' : 'Instagram Post';

  const handleGenerate = async (data: GenerateContentRequest) => {
    setIsLoading(true);
    try {
      const response = await contentService.generateContent(data);
      setGeneratedContent(response.data);
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (editedContent: GeneratedContent) => {
    try {
      await contentService.updateContent(editedContent._id, editedContent);
      setGeneratedContent(editedContent);
    } catch (error) {
      console.error("Failed to save content:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand-purple" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">AI Content Studio</h1>
            <p className="text-text-muted mt-1">Create engaging marketing content with AI.</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/content-library">
            <History className="h-4 w-4 mr-2" />
            Content Library
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className={
          (generatedContent ? 'xl:col-span-5' : 'xl:col-span-8 xl:col-start-3') + 
          ' transition-all duration-500 w-full'
        }>
          <ContentGenerator 
            initialType={initialType} 
            initialProductId={productIdParam || ''} 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
          />
        </div>

        {generatedContent && (
          <div className="xl:col-span-7 animate-in fade-in slide-in-from-right-8 duration-500">
            <ContentPreview 
              content={generatedContent} 
              onRegenerate={() => {}} 
              onSave={handleSave} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContentStudioPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-brand-purple" /></div>}>
      <ContentStudioContent />
    </Suspense>
  );
}
