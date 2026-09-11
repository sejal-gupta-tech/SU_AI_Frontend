"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { GenerateContentRequest } from '@/types/content';

const contentSchema = z.object({
  type: z.string().min(1, "Content Type is required"),
  platform: z.string().min(1, "Platform is required"),
  language: z.string().min(1, "Language is required"),
  tone: z.string().min(1, "Tone is required"),
  productId: z.string().optional(),
  targetAudience: z.string().optional(),
  topic: z.string().optional(),
  callToAction: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

interface ContentGeneratorProps {
  initialType?: string;
  initialProductId?: string;
  onGenerate: (data: GenerateContentRequest) => Promise<void>;
  isLoading: boolean;
}

export function ContentGenerator({ initialType, initialProductId, onGenerate, isLoading }: ContentGeneratorProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: initialType || 'Instagram Post',
      platform: 'Instagram',
      language: 'English',
      tone: 'Professional',
      productId: initialProductId || '',
      targetAudience: '',
      topic: '',
      callToAction: '',
      additionalInstructions: '',
    }
  });

  const onSubmit = async (data: ContentFormValues) => {
    await onGenerate(data as GenerateContentRequest);
  };

  return (
    <Card className="border-border shadow-sm bg-gradient-to-br from-background to-muted/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary-500" />
          <CardTitle>Generation Settings</CardTitle>
        </div>
        <CardDescription>Configure AI to write exactly what you need.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Content Type <span className="text-red-500">*</span></Label>
              <select 
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("type")}
              >
                <option value="Instagram Post">Instagram Post</option>
                <option value="Instagram Caption">Instagram Caption</option>
                <option value="Facebook Post">Facebook Post</option>
                <option value="LinkedIn Post">LinkedIn Post</option>
                <option value="Promotional Content">Promotional Content</option>
                <option value="Festival Post">Festival Post</option>
                <option value="Product Advertisement">Product Advertisement</option>
                <option value="Reel Script">Reel Script</option>
                <option value="Ad Copy">Ad Copy</option>
              </select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform <span className="text-red-500">*</span></Label>
              <select 
                id="platform"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("platform")}
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="YouTube">YouTube</option>
              </select>
              {errors.platform && <p className="text-xs text-red-500">{errors.platform.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language <span className="text-red-500">*</span></Label>
              <select 
                id="language"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("language")}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Hinglish">Hinglish</option>
              </select>
              {errors.language && <p className="text-xs text-red-500">{errors.language.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone <span className="text-red-500">*</span></Label>
              <select 
                id="tone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("tone")}
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Premium">Premium</option>
                <option value="Promotional">Promotional</option>
                <option value="Funny">Funny</option>
                <option value="Emotional">Emotional</option>
              </select>
              {errors.tone && <p className="text-xs text-red-500">{errors.tone.message}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Context (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <select 
                  id="productId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("productId")}
                >
                  <option value="">Select a product...</option>
                  <option value="1">Floral Summer Dress</option>
                  <option value="2">Cotton Blend Kurta</option>
                  <option value="3">Denim Jacket</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input id="targetAudience" placeholder="e.g. College students in Delhi" {...register("targetAudience")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" placeholder="e.g. Launching our new summer collection" {...register("topic")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="callToAction">Call To Action</Label>
                <Input id="callToAction" placeholder="e.g. Shop now link in bio" {...register("callToAction")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInstructions">Additional Instructions</Label>
              <textarea 
                id="additionalInstructions" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                placeholder="Any specific keywords, emojis, or structure you want?"
                {...register("additionalInstructions")}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto px-8">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
