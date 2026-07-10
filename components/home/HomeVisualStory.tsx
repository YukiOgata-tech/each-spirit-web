"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";

const fallbackImage =
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80";

const ROTATE_MS = 3000;

type Tile = { slug: string; name: string; tagline: string; href: string; image: string };

export function HomeVisualStory({ categories }: { categories: Category[] }) {
  const tiles: Tile[] = categories
    .filter((category) => category.status === "live")
    .slice(0, 3)
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      tagline: category.tagline,
      href: category.href,
      image: category.images?.[0]?.url ?? fallbackImage,
    }));

  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // 3秒ごとに次のカテゴリへ。ホバー/フォーカス中は一時停止。
  useEffect(() => {
    if (tiles.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % tiles.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [tiles.length, paused]);

  if (tiles.length === 0) return null;

  const current = tiles[active] ?? tiles[0];

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-2 shadow-soft sm:rounded-lg sm:p-3"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_28%)]" />
      <div className="relative">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Categories</p>
          <p className="text-[10px] font-semibold text-white/55">タップでカテゴリへ</p>
        </div>

        {/* 切り替わるステージ（前後のスライドを重ねて bounce で入れ替え） */}
        <div className="relative h-[220px] overflow-hidden rounded-xl sm:h-[300px]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current.slug}
              className="absolute inset-0"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 26 }}
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: [0.8, 1.06, 1], y: [26, -8, 0] }
              }
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={
                reduceMotion
                  ? { duration: 0.3 }
                  : { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
              }
            >
              <CategoryStage tile={current} priority={active === 0} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* インジケーター（クリックで手動切り替え） */}
        {tiles.length > 1 && (
          <div className="mt-2.5 flex items-center justify-center gap-2">
            {tiles.map((tile, index) => (
              <button
                key={tile.slug}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${tile.name}を表示`}
                aria-current={index === active}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  index === active ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CategoryStage({ tile, priority }: { tile: Tile; priority: boolean }) {
  return (
    <Link
      href={tile.href}
      aria-label={`${tile.name}カテゴリを見る`}
      className="group relative block h-full w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <Image
        src={tile.image}
        alt={tile.name}
        fill
        priority={priority}
        unoptimized={shouldUnoptimizeImage(tile.image)}
        sizes="(min-width: 1024px) 540px, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-2xl font-black leading-tight sm:text-3xl">{tile.name}</p>
            <p className="mt-1 line-clamp-1 text-xs font-medium text-white/75 sm:text-sm">{tile.tagline}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white/30">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </span>
        </div>
      </div>
    </Link>
  );
}
