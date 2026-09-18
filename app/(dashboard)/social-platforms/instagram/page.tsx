"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function InstagramIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  
  const [igAccountId, setIgAccountId] = useState("");
  const [igToken, setIgToken] = useState("");

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await api.put('/api/v1/business', {
        ig_account_id: igAccountId,
        ig_access_token: igToken
      });
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (error) {
      console.error("Failed to update Instagram", error);
      alert("Failed to save settings");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <InstagramIcon className="h-8 w-8 text-pink-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Instagram Integration</h1>
          <p className="text-muted-foreground mt-1">Connect your Instagram Business account to auto-publish Posts and Reels.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <InstagramIcon className="h-5 w-5 text-pink-600" />
            <CardTitle>Instagram Graph API</CardTitle>
          </div>
          <CardDescription>Enter your Instagram Graph API credentials below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Instagram Account ID</Label>
            <Input 
              placeholder="e.g. 178414..." 
              value={igAccountId}
              onChange={(e) => setIgAccountId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Permanent Access Token</Label>
            <Input 
              type="password" 
              placeholder="EAA..." 
              value={igToken}
              onChange={(e) => setIgToken(e.target.value)}
            />
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="w-full bg-pink-600 hover:bg-pink-700">
            {isUpdating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : updated ? (
              <><Check className="mr-2 h-4 w-4" /> Saved</>
            ) : (
              "Save Instagram Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
