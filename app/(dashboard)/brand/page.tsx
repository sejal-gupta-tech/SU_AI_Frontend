"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sparkles } from "lucide-react";

export default function BrandKitPage() {
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState("#f43f5e");
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Palette className="h-6 w-6 text-primary-600" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Brand Kit</h1>
      </div>
      <p className="text-muted-foreground">Define your brand identity for consistent AI-generated content.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input id="brandName" defaultValue="Sharma Fashion" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" defaultValue="Where Tradition Meets Trend" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colors & Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 p-1 cursor-pointer"
                    />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="color" 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-12 p-1 cursor-pointer"
                    />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                    <option>Inter</option>
                    <option>Playfair Display</option>
                    <option>Montserrat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button>Save Brand Kit</Button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="overflow-hidden border-2" style={{ borderColor: primaryColor }}>
              <div className="h-32 bg-gradient-to-br flex items-center justify-center p-6 text-center" style={{ 
                background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` 
              }}>
                <Sparkles className="w-12 h-12 mb-2 opacity-50" style={{ color: primaryColor }} />
              </div>
              <CardContent className="pt-6 text-center space-y-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: primaryColor }}>Sharma Fashion</h3>
                  <p className="text-sm font-medium mt-1" style={{ color: secondaryColor }}>Where Tradition Meets Trend</p>
                </div>
                <div className="h-px w-full bg-border" />
                <p className="text-sm text-muted-foreground">
                  This is a live preview of how your brand assets will be styled by our AI.
                </p>
                <div className="flex justify-center gap-2 pt-4">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
