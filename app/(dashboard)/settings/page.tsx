"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Loader2, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);


  const handleUpdateProfile = () => {
    setIsUpdatingProfile(true);
    setTimeout(() => {
      setIsUpdatingProfile(false);
      setProfileUpdated(true);
      setTimeout(() => setProfileUpdated(false), 3000);
    }, 1000);
  };


  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-primary-600" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings & Integrations</h1>
      </div>
      <p className="text-muted-foreground">Manage your account settings and connected apps.</p>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Test User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" defaultValue="test@example.com" />
          </div>
          <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile}>
            {isUpdatingProfile ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
            ) : profileUpdated ? (
              <><Check className="mr-2 h-4 w-4" /> Profile Updated</>
            ) : (
              "Update Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
