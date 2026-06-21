"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

const fallbackImage =
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80";

export function HomeVisualStory({ categories }: { categories: Category[] }) {
  const tiles = categories
    .filter((category) => category.status === "live")
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      tagline: category.tagline,
      href: category.href,
      image: category.images?.[0]?.url ?? fallbackImage,
    }));

  if (tiles.length === 0) return null;

  const [featured, ...rest] = tiles;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-2 shadow-soft sm:rounded-lg sm:p-3"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,0.55))]" />
      <div className="relative">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Categories</p>
          <p className="text-[10px] font-semibold text-white/55">タップでカテゴリへ</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <CategoryTile tile={featured} featured priority />
          {rest.map((tile, index) => (
            <CategoryTile key={tile.slug} tile={tile} delay={0.12 + index * 0.07} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

type Tile = { slug: string; name: string; tagline: string; href: string; image: string };

function CategoryTile({ tile, featured = false, priority = false, delay = 0 }: { tile: Tile; featured?: boolean; priority?: boolean; delay?: number }) {
  return (
    <motion.div
      className={featured ? "col-span-2" : ""}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        href={tile.href}
        aria-label={`${tile.name}カテゴリを見る`}
        className={`group relative block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
          featured ? "h-[200px] sm:h-[264px]" : "h-[132px] sm:h-[168px]"
        }`}
      >
        <Image
          src={tile.image}
          alt={tile.name}
          fill
          priority={priority}
          sizes={featured ? "(min-width: 1024px) 540px, 100vw" : "(min-width: 1024px) 270px, 50vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className={`font-black leading-tight ${featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>{tile.name}</p>
              {featured && <p className="mt-1 line-clamp-1 text-xs font-medium text-white/75 sm:text-sm">{tile.tagline}</p>}
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white/30">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
