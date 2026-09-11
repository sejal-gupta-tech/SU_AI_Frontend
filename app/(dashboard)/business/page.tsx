"use client";

import { useState, useEffect } from "react";
import { businessService } from "@/services/business.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Loader2, Save } from "lucide-react";

export default function BusinessProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    website: "",
    instagram: "",
    location: "",
    target_customer: "",
    preferred_language: "",
    description: "",
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const business = await businessService.getMyBusiness();
        if (business) {
          setHasBusiness(true);
          setFormData({
            name: business.name || "",
            category: business.category || "clothing",
            website: business.website || "",
            instagram: business.instagram || "",
            location: business.location || "",
            target_customer: business.target_customer || "",
            preferred_language: business.preferred_language || "english",
            description: business.description || "",
          });
        }
      } catch (err: any) {
        setHasBusiness(false);
        // It's normal to not have a business yet
      } finally {
        setIsFetching(false);
      }
    };
    fetchBusiness();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsSaved(false);
    try {
      if (hasBusiness) {
        await businessService.updateBusiness(formData);
      } else {
        await businessService.createBusiness(formData as any);
        setHasBusiness(true);
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Unable to save your business information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="ml-2 text-muted-foreground">Loading business information...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Store className="h-6 w-6 text-primary-600" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Profile</h1>
      </div>
      <p className="text-muted-foreground">Manage your business information so our AI can learn about you.</p>

      <form onSubmit={handleSave}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>The core details of your business.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="clothing">Clothing / Apparel</option>
                    <option value="restaurant">Restaurant / Cafe</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <textarea 
                  id="description" 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Online Presence & Location</CardTitle>
              <CardDescription>Where your customers interact with you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input id="instagram" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">City / Location</Label>
                  <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience & Tone</CardTitle>
              <CardDescription>How our AI should communicate on your behalf.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetCustomer">Target Customer</Label>
                  <Input id="targetCustomer" value={formData.target_customer} onChange={e => setFormData({...formData, target_customer: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <select id="language" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" value={formData.preferred_language} onChange={e => setFormData({...formData, preferred_language: e.target.value})}>
                    <option value="hinglish">Hinglish</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
