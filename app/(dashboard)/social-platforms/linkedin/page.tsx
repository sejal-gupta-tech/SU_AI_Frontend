"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#0A66C2" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function LinkedinIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  
  const [authorId, setAuthorId] = useState("");
  const [token, setToken] = useState("");

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await api.put('/api/v1/businesses/me', {
        linkedin_author_id: authorId,
        linkedin_access_token: token
      });
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (error) {
      console.error("Failed to update LinkedIn", error);
      alert("Failed to save settings");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <LinkedinIcon className="h-8 w-8 text-blue-700" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">LinkedIn Integration</h1>
          <p className="text-text-muted mt-1">Connect your LinkedIn Profile or Company Page to automate publishing.</p>
        </div>
      </div>

      <Card className="bg-surface border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkedinIcon className="h-5 w-5 text-blue-700" />
            <CardTitle className="text-white">LinkedIn API Settings</CardTitle>
          </div>
          <CardDescription>Enter your LinkedIn API credentials below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">LinkedIn Author ID</Label>
            <Input 
              placeholder="e.g. urn:li:person:12345..." 
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Access Token</Label>
            <Input 
              type="password" 
              placeholder="AQV..." 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border-border bg-surface-elevated text-white focus:ring-2 focus:ring-brand-purple outline-none"
            />
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="w-full bg-brand-gradient hover:opacity-90 text-white transition-opacity">
            {isUpdating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : updated ? (
              <><Check className="mr-2 h-4 w-4" /> Saved</>
            ) : (
              "Save LinkedIn Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
