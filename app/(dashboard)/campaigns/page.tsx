"use client";

import { useState, useEffect } from 'react';
import { campaignService } from '@/services/campaign.service';
import { Campaign, GenerateCampaignRequest } from '@/types/campaign';
import { Megaphone, Target, BarChart2, Plus, Loader2, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [generatingAdCopyId, setGeneratingAdCopyId] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await campaignService.getCampaigns();
      setCampaigns(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await campaignService.deleteCampaign(id);
      setCampaigns(campaigns.filter(c => c._id !== id && c.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateAdCopy = async (campaign: Campaign) => {
    const campaignId = (campaign.id || campaign._id) as string;
    setGeneratingAdCopyId(campaignId);
    try {
      const res = await campaignService.generateAdCopy(campaignId, {
        name: campaign.name,
        goal: campaign.goal,
        audience: campaign.targetAudience
      });
      // Try to update the backend, but update local state regardless of success to simulate UI response
      try {
        await campaignService.updateCampaign(campaignId, { adCopy: res.data });
      } catch (e) {
        console.warn("Could not save to backend, updating local state only", e);
      }
      setCampaigns(campaigns.map(c => 
        (c.id === campaignId || c._id === campaignId) 
          ? { ...c, adCopy: res.data } 
          : c
      ));
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingAdCopyId(null);
    }
  };

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const formData = new FormData(e.currentTarget);
    const request: GenerateCampaignRequest = {
      name: formData.get('name') as string,
      goal: formData.get('goal') as string,
      targetAudience: formData.get('targetAudience') as string,
      platforms: ['Instagram', 'Facebook'], // Simplified for UI
      budget: formData.get('budget') as string,
      duration: formData.get('duration') as string,
      objective: formData.get('objective') as string,
    };

    try {
      const res = await campaignService.generateCampaign(request);
      setCampaigns([res.data, ...campaigns]);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-brand-purple" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">AI Campaigns</h1>
            <p className="text-text-muted mt-1">Generate complete marketing strategies with AI.</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'New Campaign'}
        </Button>
      </div>

      {showForm && (
        <Card className="border-border bg-surface animate-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle>Create AI Campaign</CardTitle>
            <CardDescription>Fill in the details and let AI do the rest.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input name="name" required placeholder="e.g. Winter Collection Launch" />
                </div>
                <div className="space-y-2">
                  <Label>Campaign Goal</Label>
                  <select name="goal" className="flex h-10 w-full rounded-md border border-border bg-surface-elevated text-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple outline-none">
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Leads">Leads</option>
                    <option value="Sales">Sales</option>
                    <option value="Engagement">Engagement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input name="targetAudience" required placeholder="e.g. Young adults in India" />
                </div>
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input name="budget" placeholder="e.g. ₹10000" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input name="duration" placeholder="e.g. 1 Month" />
                </div>
                <div className="space-y-2">
                  <Label>Campaign Objective</Label>
                  <Input name="objective" placeholder="e.g. Increase website traffic by 20%" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Campaign with AI'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-brand-purple" /></div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted border rounded-lg bg-surface-elevated border-border border-dashed">
          <Target className="h-12 w-12 text-text-muted mb-4" />
          <p>No campaigns generated yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map(campaign => (
            <Card key={campaign.id || campaign._id || Math.random().toString()} className="overflow-hidden bg-surface border-border">
              <div className="bg-surface-elevated p-4 border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
                  <p className="text-sm text-text-muted">Goal: {campaign.goal} • {campaign.duration}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setExpandedCampaignId(expandedCampaignId === (campaign.id || campaign._id as string) ? null : (campaign.id || campaign._id as string))}>
                    {expandedCampaignId === (campaign.id || campaign._id) ? "Hide Strategy" : "View Full Strategy"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(campaign.id || campaign._id as string)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-text-muted uppercase">Strategy</h4>
                    <p className="text-sm text-white">{campaign.strategy}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-text-muted uppercase">Content</h4>
                    <ul className="text-sm text-white list-disc pl-4 space-y-1">
                      {campaign.suggestedPosts.slice(0,2).map((p,i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-text-muted uppercase">Ad Copy</h4>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-6 text-[10px] px-2 rounded font-medium flex items-center gap-1"
                        onClick={() => handleGenerateAdCopy(campaign)}
                        disabled={generatingAdCopyId === (campaign.id || campaign._id)}
                      >
                        {generatingAdCopyId === (campaign.id || campaign._id) ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        Generate with Groq AI
                      </Button>
                    </div>
                    <p className="text-sm text-text-muted italic">"{campaign.adCopy}"</p>
                  </div>
                </div>
                
                {expandedCampaignId === (campaign.id || campaign._id) && (
                  <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-text-muted uppercase">Target Audience & Platforms</h4>
                      <p className="text-sm text-text-secondary"><span className="font-medium text-white">Audience:</span> {campaign.targetAudience}</p>
                      <p className="text-sm text-text-secondary"><span className="font-medium text-white">Platforms:</span> {campaign.platforms.join(', ')}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-text-muted uppercase">Budget & Schedule</h4>
                      <p className="text-sm text-text-secondary"><span className="font-medium text-white">Budget:</span> {campaign.budget}</p>
                      <p className="text-sm text-text-secondary"><span className="font-medium text-white">Posting:</span> {campaign.postingSchedule}</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <h4 className="font-semibold text-sm text-text-muted uppercase">Full Content Strategy</h4>
                      <p className="text-sm text-text-secondary">{campaign.contentStrategy}</p>
                    </div>
                    {campaign.suggestedPosts.length > 0 && (
                      <div className="space-y-2 md:col-span-2">
                        <h4 className="font-semibold text-sm text-text-muted uppercase">All Suggested Posts</h4>
                        <ul className="text-sm text-text-secondary list-disc pl-4 space-y-1">
                          {campaign.suggestedPosts.map((p,i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    )}
                    {campaign.suggestedReels && campaign.suggestedReels.length > 0 && (
                      <div className="space-y-2 md:col-span-2">
                        <h4 className="font-semibold text-sm text-text-muted uppercase">Suggested Reels</h4>
                        <ul className="text-sm text-text-secondary list-disc pl-4 space-y-1">
                          {campaign.suggestedReels.map((r,i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="space-y-2 md:col-span-2">
                      <h4 className="font-semibold text-sm text-text-muted uppercase">Call to Action</h4>
                      <Button variant="outline" className="text-brand-purple border border-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 hover:text-white" asChild>
                        <Link href="/content">
                          {campaign.callToAction}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
