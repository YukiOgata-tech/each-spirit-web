"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  MoonStar,
} from "lucide-react";
import { categoryIcon } from "@/components/fortune/FortuneCategoryDetails";
import { FortuneScoreVisual } from "@/components/fortune/FortuneScoreVisual";
import { LEVEL, type FortuneCategoryKey, type FortuneResult, type FortuneScore } from "@/lib/fortune";

const CATEGORY_ACCENT: Partial<Record<FortuneCategoryKey, string>> = {
  love: "#fb7185",
  money: "#fbbf24",
  work: "#38bdf8",
  health: "#4ade80",
  social: "#c084fc",
  outing: "#fb923c",
};

export function MobileFortuneResult({
  result,
  overallLevel,
  strongest,
  focus,
  fullStars,
}: {
  result: FortuneResult;
  overallLevel: { label: string; color: string };
  strongest?: FortuneScore;
  focus?: FortuneScore;
  fullStars: number;
}) {
  return (
    <div className="xl:hidden">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#100d28] px-4 py-4 sm:py-6 text-white shadow-2xl shadow-black/40 sm:px-7 sm:py-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(168,85,247,0.28),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(59,130,246,0.24),transparent_34%),linear-gradient(180deg,#19113d_0%,#100d28_45%,#090b1d_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative">
          <header className="text-center">
            <p className="text-[11px] font-semibold text-white/70">{result.date}</p>
            <h1 className="mt-1 sm:mt-3 text-2xl font-bold tracking-normal text-white flex items-center justify-center gap-3">
              <MoonStar className="h-3.5 w-3.5 text-amber-300" />
              今日の運勢レポート
              <MoonStar className="h-3.5 w-3.5 text-amber-300" />
            </h1>
            <p className="mt-1 text-sm font-semibold" style={{ color: overallLevel.color }}>
              {overallLevel.label}な一日
            </p>
          </header>

          <p className="mx-auto max-w-md text-center text-sm leading-6 text-white/90">
            {result.overall.text}
          </p>

          <section className="mt-1 sm:mt-3 rounded-xl border-none px-3 py-1 sm:py-5 text-center shadow-xl shadow-black/20">
            <SectionTitle>総合運</SectionTitle>
            <FortuneScoreVisual
              score={result.overall.score}
              label={overallLevel.label}
              color={overallLevel.color}
              fullStars={fullStars}
              compact
            />
          </section>

          <section className="mt-1 sm:mt-4">
            <h2 className="sr-only">6つの運勢</h2>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-3 sm:grid-cols-3">
              {result.categories.map((category) => (
                <CategoryCard key={category.key} category={category} />
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-white/10 bg-white/6 px-3 sm:px-5 py-3 sm:py-6 text-center backdrop-blur">
            <SectionTitle>今日のメッセージ</SectionTitle>
            <p className="mt-2 text-sm leading-5 text-white/90 sm:mt-4">
              {strongest ? `${strongest.label}が今日の追い風です。${strongest.text}` : result.overall.text}
            </p>
            {focus ? (
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/70">
                {focus.label}は無理をせず、ひと呼吸おいて整えることを意識しましょう。
              </p>
            ) : null}
          </section>

          <section className="mt-3 sm:mt-6">
            <SectionTitle>今日のラッキー</SectionTitle>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <LuckyColor result={result} />
              <LuckyNumber number={result.lucky.number} />
              <LuckySpot item={result.lucky.item} />
            </div>
          </section>
        </div>
      </motion.article>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300" />
      <h2 className="text-sm font-bold tracking-[0.14em] text-violet-200">{children}</h2>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-300" />
    </div>
  );
}

function CategoryCard({ category }: { category: FortuneScore }) {
  const level = LEVEL[category.band];
  const score = Math.round(category.score * 20);
  const accent = CATEGORY_ACCENT[category.key] ?? "#a78bfa";

  return (
    <a
      href={`#fortune-detail-${category.key}`}
      aria-label={`${category.label}の詳しい説明を見る`}
      className="group relative min-w-0 overflow-hidden rounded-2xl border px-3 py-1.5 shadow-lg shadow-black/20 transition active:scale-[0.98] sm:py-3"
      style={{
        borderColor: `${accent}38`,
        background: `radial-gradient(circle at 100% 0%, ${accent}24, transparent 48%), rgba(255,255,255,0.055)`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="relative grid h-14.5 w-14.5 shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(${accent} ${score}%, rgba(255,255,255,0.1) 0)` }}
        >
          <div className="absolute inset-[5px] rounded-full bg-[#15112d]" />
          <span className="relative" style={{ color: accent }}>{categoryIcon(category.key)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold text-white/85">{category.label}</p>
          <div className="mt-1 flex items-end gap-1">
            <p className="text-2xl font-bold leading-none tabular-nums text-white">{score}</p>
            <span className="mb-0.5 text-[9px] font-bold text-white/55">/100</span>
          </div>
          <p className="mt-1 text-[10px] font-bold" style={{ color: level.color }}>{level.label}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/55 transition-transform group-hover:translate-y-0.5" />
      </div>
    </a>
  );
}

function LuckyColor({ result }: { result: FortuneResult }) {
  return (
    <div className="text-center">
      <span
        className="mx-auto grid h-14 w-14 place-items-center rounded-full border-4 border-white/80 shadow-lg shadow-black/30"
        style={{ backgroundColor: result.lucky.color.hex }}
      />
      <p className="mt-2 text-[10px] font-bold text-white/65">カラー</p>
      <p className="mt-1 text-xs font-bold text-white/90">{result.lucky.color.name}</p>
    </div>
  );
}

function LuckyNumber({ number }: { number: number }) {
  return (
    <div className="text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-violet-300/30 bg-violet-400/12 text-2xl font-bold text-violet-200 shadow-lg shadow-black/30">
        {number}
      </span>
      <p className="mt-2 text-[10px] font-bold text-white/65">ナンバー</p>
      <p className="mt-1 text-xs font-bold text-white/90">{number}</p>
    </div>
  );
}

function LuckySpot({ item }: { item: FortuneResult["lucky"]["item"] }) {
  return (
    <div className="min-w-0 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-sky-300/30 bg-sky-400/12 text-sky-200 shadow-lg shadow-black/30">
        <MapPin className="h-6 w-6" />
      </span>
      <p className="mt-2 text-[10px] font-bold text-white/65">スポット</p>
      {item ? (
        <Link href={item.href} className="mt-1 block truncate text-xs font-bold text-sky-200 underline-offset-2 hover:underline">
          {item.name}
        </Link>
      ) : (
        <p className="mt-1 text-xs font-bold text-white/65">未設定</p>
      )}
    </div>
  );
}
