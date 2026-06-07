"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Map, SearchCheck } from "lucide-react";
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

const signals = [
  { icon: SearchCheck, label: "検索軸", value: "横断" },
  { icon: Camera, label: "素材", value: "実写" },
  { icon: Map, label: "拡張", value: "カテゴリ" },
];

export function HomeVisualStory({ categories }: { categories: Category[] }) {
  return (
    <motion.div
      className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-soft"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,0.68))]" />
      <div className="relative grid h-full min-h-[494px] grid-rows-[1fr_auto] gap-3">
        <div className="grid gap-3 sm:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            className="group relative overflow-hidden rounded-md"
            whileHover={{ scale: 0.992 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <Image
              src={visuals[0].image}
              alt="ラーメンの器"
              fill
              sizes="(min-width: 1024px) 540px, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
              priority
            />
            <VisualCaption label={visuals[0].label} title={visuals[0].title} />
          </motion.div>
          <div className="grid gap-3">
            {visuals.slice(1).map((visual, index) => (
              <motion.div
                key={visual.label}
                className="group relative min-h-48 overflow-hidden rounded-md"
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

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-2 rounded-md bg-white/10 p-3 text-white backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-100">Live Category System</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <motion.span
                  key={category.slug}
                  className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-xs font-bold"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                >
                  {category.name}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:w-64">
            {signals.map((signal, index) => {
              const Icon = signal.icon;
              return (
                <motion.div
                  key={signal.label}
                  className="rounded-md bg-white p-3 text-slate-950"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 + index * 0.07 }}
                >
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                  <p className="mt-2 text-[10px] font-bold text-slate-500">{signal.label}</p>
                  <p className="text-sm font-black">{signal.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VisualCaption({ label, title, compact = false }: { label: string; title: string; compact?: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/86 to-transparent p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/72">{label}</p>
          <p className={compact ? "text-lg font-black" : "text-2xl font-black"}>{title}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 text-white/80" />
      </div>
    </div>
  );
}
