"use client";

import { useEffect, useState } from "react";
import { getBrandKit, createBrandKit, updateBrandKit, uploadBrandLogo } from "@/services/brand.service";
import { BrandKit, BrandCreate } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sparkles, Loader2, Save, Upload, Globe, AtSign, Phone, Mail, MapPin } from "lucide-react";

export default function BrandKitPage() {
  const [brand, setBrand] = useState<BrandKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<BrandCreate>({
    primary_color: "#204972",
    secondary_color: "#84CC16",
    font: "Inter",
    tone: "",
    brand_description: "",
    target_audience: "",
    website: "",
    instagram: "",
    social_style: "",
    contact: { phone: "", email: "" },
    location: { city: "", state: "" },
  });

  useEffect(() => {
    loadBrand();
  }, []);

  const loadBrand = async () => {
    try {
      const data = await getBrandKit();
      setBrand(data);
      setForm({
        logo_url: data.logo_url,
        primary_color: data.primary_color || "#204972",
        secondary_color: data.secondary_color || "#84CC16",
        font: data.font || "Inter",
        tone: data.tone || "",
        brand_description: data.brand_description || "",
        target_audience: data.target_audience || "",
        website: data.website || "",
        instagram: data.instagram || "",
        social_style: data.social_style || "",
        contact: data.contact || { phone: "", email: "" },
        location: data.location || { city: "", state: "" },
      });
    } catch {
      // No brand kit yet — will create on save
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLogoUploading(true);
      const url = await uploadBrandLogo(file);
      setForm((prev) => ({ ...prev, logo_url: url }));
    } catch {
      setErrorMsg("Logo upload failed. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMsg("");
      setErrorMsg("");
      const result = brand ? await updateBrandKit(form) : await createBrandKit(form);
      setBrand(result);
      setSuccessMsg("Brand Kit saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setErrorMsg("Failed to save Brand Kit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof BrandCreate, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateContact = (key: "phone" | "email", value: string) =>
    setForm((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));

  const updateLocation = (key: "city" | "state", value: string) =>
    setForm((prev) => ({ ...prev, location: { ...prev.location, [key]: value } }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const primaryColor = form.primary_color || "#204972";
  const secondaryColor = form.secondary_color || "#84CC16";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Brand Kit</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Define your brand identity for consistent AI-generated content.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary-600 hover:bg-primary-700 text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : "Save Brand Kit"}
        </Button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Logo</CardTitle>
              <CardDescription>Upload your logo to use in AI-generated content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {form.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logo_url} alt="Brand Logo" className="h-20 w-20 rounded-xl object-contain border border-border bg-muted" />
                ) : (
                  <div className="h-20 w-20 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center">
                    <Palette className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <label htmlFor="logo-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>
                        {logoUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        {logoUploading ? "Uploading..." : "Upload Logo"}
                      </span>
                    </Button>
                  </label>
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG up to 5MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors & Font */}
          <Card>
            <CardHeader>
              <CardTitle>Colors &amp; Typography</CardTitle>
              <CardDescription>Set your brand colour palette and preferred font.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={primaryColor} onChange={(e) => update("primary_color", e.target.value)} className="w-12 h-10 rounded-md border border-border cursor-pointer p-1 bg-transparent" />
                    <Input value={primaryColor} onChange={(e) => update("primary_color", e.target.value)} className="font-mono uppercase" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={secondaryColor} onChange={(e) => update("secondary_color", e.target.value)} className="w-12 h-10 rounded-md border border-border cursor-pointer p-1 bg-transparent" />
                    <Input value={secondaryColor} onChange={(e) => update("secondary_color", e.target.value)} className="font-mono uppercase" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font">Font</Label>
                  <select
                    id="font"
                    value={form.font || "Inter"}
                    onChange={(e) => update("font", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {["Inter", "Roboto", "Open Sans", "Montserrat", "Playfair Display", "Lato", "Poppins"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_style">Social Style</Label>
                  <select
                    id="social_style"
                    value={form.social_style || ""}
                    onChange={(e) => update("social_style", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select style</option>
                    {["Minimal", "Bold", "Elegant", "Playful", "Professional", "Vibrant"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Voice */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice</CardTitle>
              <CardDescription>Help AI understand how to write for your brand.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Brand Tone</Label>
                <select
                  id="tone"
                  value={form.tone || ""}
                  onChange={(e) => update("tone", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select tone</option>
                  {["Professional", "Friendly", "Luxury", "Playful", "Inspirational", "Casual", "Authoritative"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand_description">Brand Description</Label>
                <textarea
                  id="brand_description"
                  rows={3}
                  value={form.brand_description || ""}
                  onChange={(e) => update("brand_description", e.target.value)}
                  placeholder="Describe your brand, what you sell, and your unique value..."
                  className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Input
                  id="target_audience"
                  value={form.target_audience || ""}
                  onChange={(e) => update("target_audience", e.target.value)}
                  placeholder="e.g. Women aged 25–45 interested in ethnic fashion"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <Card>
            <CardHeader>
              <CardTitle>Contact &amp; Location</CardTitle>
              <CardDescription>Used in AI-generated promotional content and local targeting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">
                    <Globe className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />Website
                  </Label>
                  <Input id="website" value={form.website || ""} onChange={(e) => update("website", e.target.value)} placeholder="https://yourbrand.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">
                    <AtSign className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />Instagram
                  </Label>
                  <Input id="instagram" value={form.instagram || ""} onChange={(e) => update("instagram", e.target.value)} placeholder="@yourbrand" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />Phone
                  </Label>
                  <Input id="phone" value={form.contact?.phone || ""} onChange={(e) => updateContact("phone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />Email
                  </Label>
                  <Input id="email" type="email" value={form.contact?.email || ""} onChange={(e) => updateContact("email", e.target.value)} placeholder="hello@yourbrand.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    <MapPin className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />City
                  </Label>
                  <Input id="city" value={form.location?.city || ""} onChange={(e) => updateLocation("city", e.target.value)} placeholder="Mumbai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.location?.state || ""} onChange={(e) => updateLocation("state", e.target.value)} placeholder="Maharashtra" />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="overflow-hidden" style={{ borderColor: `${primaryColor}60` }}>
              <div className="h-36 flex items-center justify-center p-6" style={{ background: `linear-gradient(135deg, ${primaryColor}25, ${secondaryColor}25)` }}>
                {form.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logo_url} alt="Logo" className="h-20 object-contain" />
                ) : (
                  <Sparkles className="w-14 h-14 opacity-60" style={{ color: primaryColor }} />
                )}
              </div>
              <CardContent className="pt-5 text-center space-y-3">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: primaryColor }}>Your Brand</h3>
                  <p className="text-xs font-medium mt-1" style={{ color: secondaryColor }}>{form.tone || "Brand Tone"}</p>
                </div>
                <div className="h-px w-full bg-border" />
                <p className="text-xs text-muted-foreground line-clamp-3">{form.brand_description || "Your brand description will appear here and be used in AI-generated content."}</p>
                <div className="flex justify-center gap-2 pt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: primaryColor }} />
                    <span className="text-xs text-muted-foreground font-mono">{primaryColor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: secondaryColor }} />
                    <span className="text-xs text-muted-foreground font-mono">{secondaryColor}</span>
                  </div>
                </div>
                {form.font && (
                  <p className="text-xs text-muted-foreground">Font: <span className="font-medium text-foreground">{form.font}</span></p>
                )}
              </CardContent>
            </Card>

            <p className="text-xs text-center text-muted-foreground px-2">
              This preview shows how your brand identity will guide AI-generated content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
