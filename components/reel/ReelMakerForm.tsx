import { useState, useEffect } from "react";
import { GenerateReelRequest } from "@/types/reel";
import { getProducts } from "@/services/product.service";
import { Product } from "@/types/product";

interface ReelMakerFormProps {
  onGenerate: (request: GenerateReelRequest) => void;
  isLoading: boolean;
}

const OBJECTIVES = [
  { value: "sale", label: "🛍️ Sale" },
  { value: "product_launch", label: "🚀 Product Launch" },
  { value: "festival", label: "🎉 Festival" },
  { value: "brand_awareness", label: "📣 Brand Awareness" },
  { value: "offer", label: "🎁 Offer" },
  { value: "testimonial", label: "⭐ Testimonial" },
  { value: "educational", label: "📚 Educational" },
  { value: "before_after", label: "✨ Before/After" },
];

export function ReelMakerForm({ onGenerate, isLoading }: ReelMakerFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [objective, setObjective] = useState("sale");
  const [platform, setPlatform] = useState("instagram");
  const [language, setLanguage] = useState("Hinglish");
  const [duration, setDuration] = useState(15);
  const [tone, setTone] = useState("energetic");
  const [offer, setOffer] = useState("");
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        if (data.length > 0) {
          setProductId((data[0] as any)._id || (data[0] as any).id || "");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleGenerate = () => {
    if (!productId) return;
    onGenerate({
      product_id: productId,
      objective,
      platform,
      language,
      duration,
      tone,
      offer,
      additional_instruction: instruction,
    });
  };

  const selectCls = "w-full rounded-xl border border-gray-200 bg-white p-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-gray-800 text-sm cursor-pointer";
  const labelCls = "mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Form header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Reel Configuration</h2>
        <p className="text-sm text-gray-500 mt-0.5">Fill in the details to generate your AI reel</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Product */}
        <div>
          <label className={labelCls}>Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={selectCls}
            disabled={products.length === 0}
          >
            {products.length === 0 ? (
              <option value="">No products — please create one first</option>
            ) : (
              <>
                <option value="" disabled>Select a product...</option>
                {products.map((product: any) => (
                  <option key={product._id || product.id} value={product._id || product.id}>
                    {product.name || product.title || "Unnamed Product"}
                  </option>
                ))}
              </>
            )}
          </select>
          {products.length === 0 && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              ⚠️ Go to Products &amp; create a product first.
            </p>
          )}
        </div>

        {/* Platform + Duration row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={selectCls}>
              <option value="instagram">Instagram Reels</option>
              <option value="youtube">YouTube Shorts</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={selectCls}>
              <option value={10}>10 Seconds</option>
              <option value={15}>15 Seconds</option>
              <option value={20}>20 Seconds</option>
              <option value={30}>30 Seconds</option>
            </select>
          </div>
        </div>

        {/* Language + Tone row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectCls}>
              <option>English</option>
              <option>Hindi</option>
              <option>Hinglish</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className={selectCls}>
              <option value="energetic">Energetic</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="funny">Funny</option>
            </select>
          </div>
        </div>

        {/* Objective pills */}
        <div>
          <label className={labelCls}>Objective</label>
          <div className="grid grid-cols-2 gap-2">
            {OBJECTIVES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setObjective(value)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold text-left transition-all cursor-pointer ${
                  objective === value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Offer */}
        <div>
          <label className={labelCls}>Offer / Promo (Optional)</label>
          <input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="e.g. 50% Off this weekend"
            className="w-full rounded-xl border border-gray-200 bg-white p-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-gray-800 text-sm"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className={labelCls}>Additional Instructions (Optional)</label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Any specific requests for the video?"
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-gray-800 text-sm resize-none"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="px-6 pb-6">
        <button
          type="button"
          disabled={isLoading || !productId}
          onClick={handleGenerate}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Starting Generation...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generate AI Reel
            </>
          )}
        </button>
      </div>
    </div>
  );
}

