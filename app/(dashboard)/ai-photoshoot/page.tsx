"use client";

import { useEffect, useState } from "react";
import ProductImageUpload from "@/components/ai-photoshoot/ProductImageUpload";
import StyleSelector from "@/components/ai-photoshoot/StyleSelector";
import { usePhotoshoot } from "@/hooks/usePhotoshoot";
import { getProducts } from "@/services/product.service";

export default function AIPhotoshootPage() {

  const [productId, setProductId] = useState("");
  const [productImage, setProductImage] =
    useState<string | null>(null);

  const [style, setStyle] =
    useState("studio");

  const [background, setBackground] =
    useState("clean");

  const [model, setModel] =
    useState("");

  const [pose, setPose] =
    useState("");

  const [instruction, setInstruction] =
    useState("");

  const {
    generate,
    loading,
    result,
    error,
  } = usePhotoshoot();

  useEffect(() => {
    // Attempt to automatically select the user's first product
    getProducts().then((products) => {
      if (products && products.length > 0) {
        setProductId(products[0].id || products[0]._id || "");
        if (products[0].image_url) {
          setProductImage(products[0].image_url);
        }
      }
    }).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!productId) {
      alert("No product selected. Please ensure you have products available.");
      return;
    }

    await generate({
      product_id: productId,
      style,
      background,
      model,
      pose,
      language: "English",
      additional_instruction: instruction,
    });

  };

  return (
    <div className="mx-auto max-w-7xl p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          AI Photoshoot
        </h1>

        <p className="mt-2 text-gray-500">
          Turn your product into professional marketing visuals.
        </p>
      </div>

      <div className="space-y-8 rounded-2xl border bg-white p-6">

        <ProductImageUpload
          image={productImage}
          onChange={(file) => {

            setProductImage(
              URL.createObjectURL(file)
            );

            // In production:
            // upload file and use returned product/image ID.
          }}
        />

        <StyleSelector
          value={style}
          onChange={setStyle}
        />

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium">
              Background
            </label>

            <select
              value={background}
              onChange={(e) =>
                setBackground(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="clean">
                Clean
              </option>

              <option value="luxury">
                Luxury
              </option>

              <option value="premium">
                Premium
              </option>

              <option value="lifestyle">
                Lifestyle
              </option>

              <option value="festival">
                Festival
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Model
            </label>

            <select
              value={model}
              onChange={(e) =>
                setModel(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="">
                No Model
              </option>

              <option value="female">
                Female Model
              </option>

              <option value="male">
                Male Model
              </option>
            </select>
          </div>

        </div>

        <textarea
          placeholder="Additional instructions..."
          value={instruction}
          onChange={(e) =>
            setInstruction(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleGenerate}
          className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate Photoshoot"}
        </button>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8">

            <h2 className="mb-4 text-xl font-bold">
              Generated Result
            </h2>

            <img
              src={result.image_url}
              alt="Generated photoshoot"
              className="max-w-lg rounded-xl"
            />

          </div>
        )}

      </div>

    </div>
  );
}
