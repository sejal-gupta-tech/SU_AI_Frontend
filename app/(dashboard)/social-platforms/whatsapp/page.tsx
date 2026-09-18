"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#25D366" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function WhatsAppIntegrationPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  
  const [waPhoneId, setWaPhoneId] = useState("");
  const [waToken, setWaToken] = useState("");
  
  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await api.put('/api/v1/business', {
        whatsapp_phone_id: waPhoneId,
        whatsapp_token: waToken
      });
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    } catch (error) {
      console.error("Failed to update WhatsApp", error);
      alert("Failed to save settings");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <WhatsAppIcon className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">WhatsApp Integration</h1>
          <p className="text-muted-foreground mt-1">Connect your WhatsApp Business API to automate messaging.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <WhatsAppIcon className="h-5 w-5" />
            <CardTitle>WhatsApp API Settings</CardTitle>
          </div>
          <CardDescription>Enter your WhatsApp API credentials below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>WhatsApp Phone Number ID</Label>
            <Input 
              placeholder="e.g. 10234567890" 
              value={waPhoneId}
              onChange={(e) => setWaPhoneId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Permanent Access Token</Label>
            <Input 
              type="password" 
              placeholder="EAA..." 
              value={waToken}
              onChange={(e) => setWaToken(e.target.value)}
            />
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="w-full bg-green-600 hover:bg-green-700">
            {isUpdating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : updated ? (
              <><Check className="mr-2 h-4 w-4" /> Saved</>
            ) : (
              "Save WhatsApp Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
