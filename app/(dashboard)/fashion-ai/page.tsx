"use client";

import Link from "next/link";
import { Camera, Shirt, History, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function FashionAIPage() {
  const cards = [
    {
      title: "AI Photoshoot",
      description: "Create professional fashion photos using AI models. Select poses, backgrounds, and locations.",
      icon: Camera,
      href: "/fashion-ai/photoshoot",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Virtual Try-On",
      description: "See how your product looks on a real person while preserving their identity and the garment design.",
      icon: Shirt,
      href: "/fashion-ai/virtual-try-on",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      title: "Generation History",
      description: "View, download, and manage your previously generated fashion photos and virtual try-ons.",
      icon: History,
      href: "/fashion-ai/history",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-purple" />
          Fashion AI Studio
        </h1>
        <p className="text-text-muted mt-2">
          Transform your clothing products with professional AI photography and virtual try-ons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <Link href={card.href} key={idx}>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface border border-border p-6 rounded-xl hover:border-brand-purple/50 transition-colors cursor-pointer h-full flex flex-col"
            >
              <div className={`w-12 h-12 rounded-lg ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{card.title}</h3>
              <p className="text-text-muted text-sm flex-1">{card.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
