"use client";

import { useState, useEffect } from 'react';
import { campaignService } from '@/services/campaign.service';
import { Campaign, GenerateCampaignRequest } from '@/types/campaign';
import { Megaphone, Target, BarChart2, Plus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
          <Megaphone className="h-6 w-6 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Campaigns</h1>
            <p className="text-muted-foreground mt-1">Generate complete marketing strategies with AI.</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'New Campaign'}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary-100 bg-gradient-to-br from-background to-primary-50/20 animate-in slide-in-from-top-4">
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
                  <select name="goal" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
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
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-muted/20 border-dashed">
          <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p>No campaigns generated yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map(campaign => (
            <Card key={campaign.id || campaign._id || Math.random().toString()} className="overflow-hidden">
              <div className="bg-primary-50 p-4 border-b border-primary-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-primary-900">{campaign.name}</h3>
                  <p className="text-sm text-primary-700">Goal: {campaign.goal} • {campaign.duration}</p>
                </div>
                                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Full Strategy</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(campaign.id || campaign._id as string)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Strategy</h4>
                  <p className="text-sm">{campaign.strategy}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Content</h4>
                  <ul className="text-sm list-disc pl-4 space-y-1">
                    {campaign.suggestedPosts.slice(0,2).map((p,i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Ad Copy</h4>
                  <p className="text-sm text-muted-foreground italic">"{campaign.adCopy}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
