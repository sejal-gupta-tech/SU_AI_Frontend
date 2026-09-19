"use client";

import { useState } from "react";

import PlatformSelector from "@/components/create-ad/PlatformSelector";
import ObjectiveSelector from "@/components/create-ad/ObjectiveSelector";

import { useCreateAd } from "@/hooks/useCreateAd";

export default function CreateAdPage() {

  const [productId, setProductId] =
    useState("");

  const [platform, setPlatform] =
    useState("instagram");

  const [objective, setObjective] =
    useState("product_promotion");

  const [language, setLanguage] =
    useState("English");

  const [audience, setAudience] =
    useState("");

  const [instruction, setInstruction] =
    useState("");

  const [cta, setCta] =
    useState("Shop Now");

  const {
    create,
    loading,
    result,
    error,
  } = useCreateAd();

  const handleGenerate = async () => {

    await create({
      product_id: productId,
      platform,
      objective,
      language,
      target_audience: audience,
      additional_instruction: instruction,
      cta,
    });

  };

  return (
    <div className="mx-auto max-w-7xl p-6">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Create Ad
        </h1>

        <p className="mt-2 text-text-muted">
          Generate AI-powered advertising creatives.
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="space-y-6 rounded-2xl border border-border bg-surface p-6 lg:col-span-2 shadow-lg">

          {/* Product */}

          <div>

            <label className="mb-2 block font-semibold text-white">
              Product
            </label>

            <input
              value={productId}
              onChange={(e) =>
                setProductId(e.target.value)
              }
              placeholder="Select Product ID"
              className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none"
            />

          </div>

          <PlatformSelector
            value={platform}
            onChange={setPlatform}
          />

          <ObjectiveSelector
            value={objective}
            onChange={setObjective}
          />

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-semibold text-white">
                Language
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block font-semibold text-white">
                CTA
              </label>

              <select
                value={cta}
                onChange={(e) =>
                  setCta(e.target.value)
                }
                className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none"
              >
                <option>Shop Now</option>
                <option>Buy Now</option>
                <option>Learn More</option>
                <option>Contact Us</option>
                <option>Get Offer</option>
              </select>

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold text-white">
              Target Audience
            </label>

            <input
              value={audience}
              onChange={(e) =>
                setAudience(e.target.value)
              }
              placeholder="Example: Women aged 18-35 interested in fashion"
              className="w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold text-white">
              Additional Instructions
            </label>

            <textarea
              value={instruction}
              onChange={(e) =>
                setInstruction(e.target.value)
              }
              placeholder="Describe the style you want..."
              className="min-h-28 w-full rounded-lg border border-border bg-surface-elevated text-white p-3 focus:ring-2 focus:ring-brand-purple outline-none resize-none"
            />

          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            onClick={handleGenerate}
            className="w-full rounded-xl bg-brand-gradient hover:opacity-90 transition-opacity px-6 py-4 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Generating Ad..."
              : "Generate Ad"}
          </button>

        </div>

        {/* Preview */}

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg">

          <h2 className="mb-5 text-xl font-bold text-white">
            Ad Preview
          </h2>

          {result ? (

            <div className="space-y-5">

              <img
                src={result.creative_url}
                alt="AI Ad"
                className="w-full rounded-xl"
              />

              <h3 className="text-xl font-bold text-white">
                {result.headline}
              </h3>

              <p className="text-text-secondary">
                {result.primary_text}
              </p>

              <p className="text-text-muted">
                {result.description}
              </p>

              <a 
                href="/products"
                className="block text-center w-full rounded-lg bg-brand-gradient p-3 font-semibold text-white hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                {result.cta}
              </a>

              <div className="flex flex-wrap gap-2">

                {result.hashtags?.map(
                  (tag: string) => (

                    <span
                      key={tag}
                      className="rounded-full bg-surface-elevated px-3 py-1 text-sm text-text-muted"
                    >
                      #{tag.replace("#", "")}
                    </span>

                  )
                )}

              </div>

            </div>

          ) : (

            <div className="flex min-h-[400px] items-center justify-center text-center text-text-muted">
              Your generated ad will appear here.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}
