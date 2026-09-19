"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#1877F2" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function FacebookIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  
  const [fbPageId, setFbPageId] = useState("");
  const [fbToken, setFbToken] = useState("");

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await api.put('/api/v1/businesses/me', {
        fb_page_id: fbPageId,
        fb_access_token: fbToken
      });
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (error) {
      console.error("Failed to update Facebook", error);
      alert("Failed to save settings");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <FacebookIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Facebook Integration</h1>
          <p className="text-text-muted mt-1">Connect your Facebook Page to automate publishing.</p>
        </div>
      </div>

      <Card className="bg-surface border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FacebookIcon className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-white">Facebook API Settings</CardTitle>
          </div>
          <CardDescription>Enter your Facebook Graph API credentials below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Facebook Page ID</Label>
            <Input 
              placeholder="e.g. 10435..." 
              value={fbPageId}
              onChange={(e) => setFbPageId(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Page Access Token</Label>
            <Input 
              type="password" 
              placeholder="EAA..." 
              value={fbToken}
              onChange={(e) => setFbToken(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none"
            />
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="w-full bg-brand-gradient hover:opacity-90 text-white transition-opacity">
            {isUpdating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : updated ? (
              <><Check className="mr-2 h-4 w-4" /> Saved</>
            ) : (
              "Save Facebook Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
