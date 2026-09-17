import { useState, useEffect } from "react";
import { GenerateReelRequest } from "@/types/reel";
import ObjectiveSelector from "@/components/create-ad/ObjectiveSelector";
import { getProducts } from "@/services/product.service";
import { Product } from "@/types/product";

interface ReelMakerFormProps {
  onGenerate: (request: GenerateReelRequest) => void;
  isLoading: boolean;
}

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
          // It might be `id` or `_id` depending on the frontend Product type
          setProductId((data[0] as any)._id || (data[0] as any).id || "");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleGenerate = () => {
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

  return (
    <div className="space-y-6 rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-100/50">
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">Product</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white/50 p-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-800 shadow-sm appearance-none"
          disabled={products.length === 0}
        >
          {products.length === 0 ? (
            <option value="" disabled>No products available. Please create one.</option>
          ) : (
            <option value="" disabled>Select a product...</option>
          )}
          {products.map((product: any) => (
            <option key={product._id || product.id} value={product._id || product.id}>
              {product.name || product.title || "Unnamed Product"}
            </option>
          ))}
        </select>
        {products.length === 0 && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            You need to create at least one product to generate a reel.
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">Platform</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white/50 p-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-800 shadow-sm appearance-none"
        >
          <option value="instagram">Instagram Reels</option>
          <option value="youtube">YouTube Shorts</option>
          <option value="tiktok">TikTok</option>
        </select>
      </div>

      <div className="p-1 rounded-xl bg-gray-50 border border-gray-100 shadow-inner">
        <ObjectiveSelector value={objective} onChange={setObjective} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/50 p-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-800 shadow-sm appearance-none"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Hinglish</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white/50 p-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-800 shadow-sm appearance-none"
          >
            <option value={10}>10 Seconds</option>
            <option value={15}>15 Seconds</option>
            <option value={20}>20 Seconds</option>
            <option value={30}>30 Seconds</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/50 p-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-800 shadow-sm appearance-none"
          >
            <option value="energetic">Energetic</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="funny">Funny</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">Offer / Promo</label>
          <input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="e.g. 50% Off"
            className="w-full rounded-xl border border-gray-200 bg-white/50 p-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-800 shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 uppercase tracking-wider">Instructions</label>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Any specific requests for the video?"
          className="min-h-[100px] w-full rounded-xl border border-gray-200 bg-white/50 p-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-800 shadow-sm resize-none"
        />
      </div>

      <button
        disabled={isLoading || !productId}
        onClick={handleGenerate}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] px-6 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-[center_right_1rem] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="relative flex items-center justify-center gap-2">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Generate AI Reel
            </>
          )}
        </span>
      </button>
    </div>
  );
}
