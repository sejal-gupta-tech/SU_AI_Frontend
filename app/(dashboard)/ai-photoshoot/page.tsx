"use client";

import { useEffect, useState } from "react";
import ProductImageUpload from "@/components/ai-photoshoot/ProductImageUpload";
import StyleSelector from "@/components/ai-photoshoot/StyleSelector";
import { usePhotoshoot } from "@/hooks/usePhotoshoot";
import { getProducts } from "@/services/product.service";

export default function AIPhotoshootPage() {

  const [productId, setProductId] = useState("");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [style, setStyle] = useState("studio");
  
  // Dynamic fields
  const [background, setBackground] = useState("white");
  const [model, setModel] = useState("female");
  const [festival, setFestival] = useState("diwali");
  const [marketplace, setMarketplace] = useState("amazon");
  const [environment, setEnvironment] = useState("Real-life environment");
  const [instruction, setInstruction] = useState("");

  const { generate, loading, result, error } = usePhotoshoot();

  useEffect(() => {
    getProducts().then((products) => {
      if (products && products.length > 0) {
        setProductId(products[0].id || "");
        if (products[0].image_url) {
          setProductImage(products[0].image_url);
        }
      }
    }).catch(console.error);
  }, []);
  
  // Reset fields when style changes
  useEffect(() => {
    if (style === "studio") setBackground("white");
    if (style === "lifestyle") setEnvironment("Real-life environment");
    if (style === "model") setModel("female");
    if (style === "festival") setFestival("diwali");
    if (style === "marketplace") setMarketplace("amazon");
  }, [style]);

  const handleGenerate = async () => {
    if (!productId) {
      alert("No product selected. Please ensure you have products available.");
      return;
    }

    let finalBackground = background;
    let finalInstruction = instruction;
    
    if (style === "lifestyle") finalBackground = environment;
    if (style === "festival") finalBackground = festival;
    if (style === "marketplace") {
      finalBackground = "white";
      finalInstruction = "E-commerce optimized for " + marketplace + ", pure white background, professional lighting. " + instruction;
    }

    await generate({
      product_id: productId,
      style,
      background: finalBackground,
      model: style === "model" ? model : "no model",
      pose: "",
      language: "English",
      additional_instruction: finalInstruction,
    });
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">AI Photoshoot</h1>
        <p className="mt-2 text-text-muted">Turn your product into professional marketing visuals.</p>
      </div>

      <div className="space-y-8 rounded-2xl border border-border bg-surface p-6 shadow-lg">
        <ProductImageUpload
          image={productImage}
          onChange={(file) => setProductImage(URL.createObjectURL(file))}
        />

        <StyleSelector value={style} onChange={setStyle} />

        {/* Dynamic Options based on Style */}
        <div className="grid gap-5 md:grid-cols-2">
          {style === "studio" && (
            <div>
              <label className="mb-2 block font-medium text-white">Background Type</label>
              <select value={background} onChange={(e) => setBackground(e.target.value)} className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none">
                <option value="white">White Background</option>
                <option value="luxury">Luxury</option>
                <option value="premium">Premium Background</option>
              </select>
            </div>
          )}

          {style === "lifestyle" && (
            <div>
              <label className="mb-2 block font-medium text-white">Environment</label>
              <input type="text" value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="e.g. Real-life environment" className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none" />
            </div>
          )}
          
          {style === "model" && (
            <div>
              <label className="mb-2 block font-medium text-white">Model Type</label>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none">
                <option value="female">Female Model</option>
                <option value="male">Male Model</option>
              </select>
            </div>
          )}
          
          {style === "festival" && (
            <div>
              <label className="mb-2 block font-medium text-white">Festival</label>
              <select value={festival} onChange={(e) => setFestival(e.target.value)} className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none">
                <option value="diwali">Diwali</option>
                <option value="holi">Holi</option>
                <option value="rakhi">Rakhi</option>
                <option value="eid">Eid</option>
              </select>
            </div>
          )}
          
          {style === "marketplace" && (
            <div>
              <label className="mb-2 block font-medium text-white">Platform</label>
              <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none">
                <option value="amazon">Amazon</option>
                <option value="flipkart">Flipkart</option>
                <option value="meesho">Meesho</option>
              </select>
            </div>
          )}
        </div>

        <textarea
          placeholder="Additional instructions..."
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleGenerate}
          className="rounded-xl bg-brand-gradient px-8 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Photoshoot"}
        </button>

        {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">{error}</div>}

        {result && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-white">Generated Result</h2>
            <img src={result.image_url} alt="Generated photoshoot" className="max-w-lg rounded-xl border border-border" />
          </div>
        )}
      </div>
    </div>
  );
}
