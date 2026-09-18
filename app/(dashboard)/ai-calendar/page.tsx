"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/product.service";
import { generateCalendar, DayPlan } from "@/services/calendar.service";
import { Loader2, Wand2 } from "lucide-react";

function DayCard({ day, initialProductImage }: { day: DayPlan, initialProductImage: string | null }) {
  const [currentImage, setCurrentImage] = useState<string | null>(initialProductImage);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDesign = () => {
    setIsGenerating(true);
    const prompt = day.visual_direction || `${day.content_type} for a product. High quality commercial photo.`;
    if (day.content_type === 'Reel') {
      setCurrentImage(`https://www.w3schools.com/html/mov_bbb.mp4`);
    } else {
      setCurrentImage(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1080&nologo=true&seed=${Math.floor(Math.random() * 10000)}`);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
      
      {/* Left: Thumbnail/Placeholder */}
      <div className="w-full md:w-48 flex-shrink-0 flex flex-col gap-3">
        <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden border group">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/80 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
              <span className="text-xs font-semibold text-indigo-700 animate-pulse">Generating...</span>
            </div>
          ) : null}
          
          {currentImage ? (
            currentImage.endsWith('.mp4') ? (
            <video src={currentImage} onLoadedData={() => setIsGenerating(false)} autoPlay loop muted className="object-cover w-full h-full opacity-90 transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <img src={currentImage} onLoad={() => setIsGenerating(false)} alt="Product" className="object-cover w-full h-full opacity-90 transition-transform duration-500 group-hover:scale-105" />
          )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100" />
          )}
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-white/20">
              {day.content_type}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleGenerateDesign}
          disabled={isGenerating}
          className="w-full text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white py-2 rounded-lg transition-colors border border-indigo-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <Wand2 className="w-4 h-4" />
          Generate Design
        </button>
      </div>
      
      {/* Right: Content details */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="bg-indigo-600 text-white text-sm font-bold w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
            Day {day.day_number}
          </div>
          <h3 className="text-xl font-extrabold text-gray-900">{day.content_type}</h3>
        </div>
        
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Visual Direction</p>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">{day.visual_direction}</p>
        </div>

        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Caption</p>
          <p className="text-gray-800 text-sm whitespace-pre-line">{day.caption}</p>
          <p className="text-blue-600 text-sm mt-3 font-semibold break-words">{day.hashtags}</p>
        </div>
      </div>
    </div>
  );
}

export default function AICalendarPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [productId, setProductId] = useState("");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Mere liye September ka Instagram calendar bana do");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<DayPlan[] | null>(null);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      if (data && data.length > 0) {
        setProductId(data[0].id || data[0]._id || "");
        setProductImage(data[0].image_url || null);
      }
    }).catch(console.error);
  }, []);

  const handleProductChange = (id: string) => {
    setProductId(id);
    const prod = products.find(p => (p.id || p._id) === id);
    if (prod) {
      setProductImage(prod.image_url || null);
    }
  };

  const handleGenerate = async () => {
    if (!productId) {
      alert("Please select a product");
      return;
    }
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const data = await generateCalendar({ product_id: productId, prompt });
      setPlan(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to generate calendar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Social Media Calendar</h1>
        <p className="mt-2 text-gray-500">Generate a full 30-day content plan instantly.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        
        {/* Left Column: Input Form */}
        <div className="col-span-1 space-y-6 rounded-2xl border bg-white p-6 shadow-sm h-fit">
          
          <div>
            <label className="mb-2 block font-medium">Select Product</label>
            <select
              value={productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="" disabled>Select a product</option>
              {products.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Your Request</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Mere liye September ka Instagram calendar bana do"
              className="w-full rounded-lg border p-3 resize-none"
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="w-full rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Generating 30-Day Plan..." : "Generate Calendar"}
          </button>
          
          {error && <div className="rounded-lg bg-red-50 p-4 text-red-600 text-sm">{error}</div>}
        </div>

        {/* Right Column: Calendar View */}
        <div className="col-span-2">
          {loading && (
            <div className="flex h-64 items-center justify-center rounded-2xl border bg-white shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                <p className="text-gray-500 font-medium animate-pulse">Designing your strategy... this takes a few seconds.</p>
              </div>
            </div>
          )}

          {!loading && plan && (
            <div className="space-y-6">
              {plan.map((day) => (
                <DayCard key={day.day_number} day={day} initialProductImage={productImage} />
              ))}
            </div>
          )}

          {!loading && !plan && (
            <div className="flex h-64 items-center justify-center rounded-2xl border bg-white border-dashed">
              <p className="text-gray-400 font-medium">Your calendar will appear here.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
