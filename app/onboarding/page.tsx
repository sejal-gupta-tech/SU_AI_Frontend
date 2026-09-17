"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { businessService } from "@/services/business.service";
import { Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { id: "business", title: "Business Details" },
  { id: "presence", title: "Online Presence" },
  { id: "audience", title: "Target Audience" },
  { id: "complete", title: "Complete" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    website: "",
    instagram: "",
    location: "",
    target_customer: "",
    preferred_language: "hinglish",
  });
  const router = useRouter();

  const handleNext = async (e: any) => { if(e) e.preventDefault();
    if (currentStep < steps.length - 2) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === steps.length - 2) {
      setIsSubmitting(true);
      setError("");
      try {
        await businessService.createBusiness(formData);
        setCurrentStep(prev => prev + 1);
      } catch (err: any) {
        setError(err.message || "Unable to create your business. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-background flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-primary-600">
          <Sparkles className="w-6 h-6" />
          SevenUnique AI Setup
        </div>
      </div>

      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-primary-100 -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  idx <= currentStep 
                    ? "bg-primary-600 text-white" 
                    : "bg-white border-2 border-primary-200 text-muted-foreground"
                }`}
              >
                {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs font-medium ${idx <= currentStep ? "text-primary-800" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full max-w-2xl bg-card border-border shadow-lg">
        <CardContent className="p-8 sm:p-12">
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-bold">Welcome! What&apos;s your business name?</h2>
                <p className="text-muted-foreground">Let&apos;s start customizing your AI marketing experience.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" placeholder="e.g. Sharma Fashion" className="h-12 text-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Business Category</Label>
                  <select id="category" className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select a category</option>
                    <option value="clothing">Clothing / Apparel</option>
                    <option value="restaurant">Restaurant / Cafe</option>
                    <option value="salon">Salon / Spa</option>
                    <option value="jewellery">Jewellery</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="doctor">Doctor / Clinic</option>
                    <option value="gym">Gym / Fitness</option>
                    <option value="other">Other Local Business</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-bold">Where can customers find you?</h2>
                <p className="text-muted-foreground">This helps our AI understand your current brand.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input id="website" placeholder="https://www.example.com" className="h-12 text-lg" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input id="instagram" placeholder="@sharmafashion" className="h-12 text-lg" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">City / Location</Label>
                  <Input id="location" placeholder="e.g. Mumbai, Maharashtra" className="h-12 text-lg" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl font-bold">Who are your customers?</h2>
                <p className="text-muted-foreground">We&apos;ll tailor the AI generated content to speak their language.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetCustomer">Target Customer Description</Label>
                  <Input id="targetCustomer" placeholder="e.g. Young professionals looking for affordable ethnic wear" className="h-12 text-lg" value={formData.target_customer} onChange={(e) => setFormData({...formData, target_customer: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Marketing Language</Label>
                  <select id="language" className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" value={formData.preferred_language} onChange={(e) => setFormData({...formData, preferred_language: e.target.value})}>
                    <option value="hinglish">Hinglish</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="marathi">Marathi</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="tamil">Tamil</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500 py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold">Your AI is Ready!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We&apos;ve analyzed your business details and setup your personalized AI marketing engine. 
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
            <Button type="button" variant="outline" 
              onClick={handleBack} 
              disabled={currentStep === 0 || isSubmitting}
              className={currentStep === 0 ? "opacity-0 pointer-events-none" : ""}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button type="button" onClick={handleNext} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? "Submitting..." : currentStep === steps.length - 1 ? "Go to Dashboard" : "Continue"} 
              {!isSubmitting && currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


