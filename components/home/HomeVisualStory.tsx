"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

const visuals = [
  {
    label: "Food",
    title: "地域グルメ",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Travel",
    title: "旅と街歩き",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Tools",
    title: "道具と比較",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
];

export function HomeVisualStory({ categories }: { categories: Category[] }) {
  const storyVisuals = visuals.map((visual, index) => {
    const category = categories[index];
    return {
      label: category?.name ?? visual.label,
      title: category?.tagline ?? visual.title,
      image: category?.images?.[0]?.url ?? visual.image,
    };
  });

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-2 shadow-soft sm:min-h-[520px] sm:rounded-lg sm:p-3"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,0.68))]" />
      <div className="relative grid gap-3 sm:h-full sm:min-h-[494px] sm:grid-rows-[1fr_auto]">
        <div className="flex snap-x gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:overflow-visible sm:pb-0 sm:grid-cols-[1.08fr_0.92fr] sm:gap-3">
          <motion.div
            className="group relative h-[238px] min-w-full snap-center overflow-hidden rounded-xl sm:h-auto sm:min-w-0 sm:rounded-md"
            whileHover={{ scale: 0.992 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <Image
              src={storyVisuals[0].image}
              alt={storyVisuals[0].title}
              fill
              sizes="(min-width: 1024px) 540px, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
              priority
            />
            <VisualCaption label={storyVisuals[0].label} title={storyVisuals[0].title} />
          </motion.div>
          <div className="contents sm:grid sm:gap-3">
            {storyVisuals.slice(1).map((visual, index) => (
              <motion.div
                key={visual.label}
                className="group relative h-[238px] min-w-full snap-center overflow-hidden rounded-xl sm:min-h-48 sm:min-w-0 sm:rounded-md"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.16 + index * 0.09, duration: 0.55 }}
                whileHover={{ y: -4 }}
              >
                <Image
                  src={visual.image}
                  alt={visual.title}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <VisualCaption label={visual.label} title={visual.title} compact />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function VisualCaption({ label, title, compact = false }: { label: string; title: string; compact?: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/52 to-transparent p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/72">{label}</p>
          <p className={compact ? "line-clamp-2 text-xl font-black leading-tight sm:text-lg" : "line-clamp-2 text-xl font-black leading-tight sm:text-2xl"}>{title}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-white/80" />
      </div>
    </div>
  );
}
