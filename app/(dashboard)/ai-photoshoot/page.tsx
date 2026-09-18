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
        setProductId(products[0].id || products[0]._id || "");
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
        <h1 className="text-3xl font-bold">AI Photoshoot</h1>
        <p className="mt-2 text-gray-500">Turn your product into professional marketing visuals.</p>
      </div>

      <div className="space-y-8 rounded-2xl border bg-white p-6">
        <ProductImageUpload
          image={productImage}
          onChange={(file) => setProductImage(URL.createObjectURL(file))}
        />

        <StyleSelector value={style} onChange={setStyle} />

        {/* Dynamic Options based on Style */}
        <div className="grid gap-5 md:grid-cols-2">
          {style === "studio" && (
            <div>
              <label className="mb-2 block font-medium">Background Type</label>
              <select value={background} onChange={(e) => setBackground(e.target.value)} className="w-full rounded-lg border p-3">
                <option value="white">White Background</option>
                <option value="luxury">Luxury</option>
                <option value="premium">Premium Background</option>
              </select>
            </div>
          )}

          {style === "lifestyle" && (
            <div>
              <label className="mb-2 block font-medium">Environment</label>
              <input type="text" value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="e.g. Real-life environment" className="w-full rounded-lg border p-3" />
            </div>
          )}
          
          {style === "model" && (
            <div>
              <label className="mb-2 block font-medium">Model Type</label>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full rounded-lg border p-3">
                <option value="female">Female Model</option>
                <option value="male">Male Model</option>
              </select>
            </div>
          )}
          
          {style === "festival" && (
            <div>
              <label className="mb-2 block font-medium">Festival</label>
              <select value={festival} onChange={(e) => setFestival(e.target.value)} className="w-full rounded-lg border p-3">
                <option value="diwali">Diwali</option>
                <option value="holi">Holi</option>
                <option value="rakhi">Rakhi</option>
                <option value="eid">Eid</option>
              </select>
            </div>
          )}
          
          {style === "marketplace" && (
            <div>
              <label className="mb-2 block font-medium">Platform</label>
              <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} className="w-full rounded-lg border p-3">
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
          className="w-full rounded-lg border p-3"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleGenerate}
          className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Photoshoot"}
        </button>

        {error && <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>}

        {result && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">Generated Result</h2>
            <img src={result.image_url} alt="Generated photoshoot" className="max-w-lg rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
}
