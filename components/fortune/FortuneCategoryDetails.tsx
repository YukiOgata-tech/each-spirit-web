"use client";

import {
  Activity,
  BriefcaseBusiness,
  Compass,
  Heart,
  Orbit,
  Users,
  WalletCards,
} from "lucide-react";
import { LEVEL, type FortuneCategoryKey, type FortuneScore } from "@/lib/fortune";

const CATEGORY_ACCENT: Partial<Record<FortuneCategoryKey, string>> = {
  love: "#fb7185",
  money: "#fbbf24",
  work: "#38bdf8",
  health: "#4ade80",
  social: "#c084fc",
  outing: "#fb923c",
};

export function FortuneCategoryDetails({ categories }: { categories: FortuneScore[] }) {
  return (
    <section className="mt-5 xl:hidden" aria-labelledby="fortune-details-heading">
      <div className="mb-4 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-200">Detailed Reading</p>
          <h2 id="fortune-details-heading" className="mt-1 text-xl font-bold text-white">6つの運勢を詳しく見る</h2>
        </div>
        <Orbit className="h-6 w-6 shrink-0 text-violet-300/70" />
      </div>

      <div className="grid gap-3">
        {categories.map((category, index) => (
          <CategoryDetail key={category.key} category={category} index={index + 1} />
        ))}
      </div>
    </section>
  );
}

function CategoryDetail({ category, index }: { category: FortuneScore; index: number }) {
  const level = LEVEL[category.band];
  const accent = CATEGORY_ACCENT[category.key] ?? "#a78bfa";
  const progress = Math.max(0, Math.min(100, (category.score / 5) * 100));

  return (
    <article
      id={`fortune-detail-${category.key}`}
      className="scroll-mt-28 overflow-hidden rounded-2xl border bg-slate-950/48 shadow-xl shadow-black/15 backdrop-blur"
      style={{ borderColor: `${accent}42` }}
    >
      <div
        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4"
        style={{ background: `linear-gradient(105deg, ${accent}1f, transparent 58%)` }}
      >
        <span
          className="grid h-11 w-11 place-items-center rounded-full border"
          style={{ color: accent, borderColor: `${accent}50`, backgroundColor: `${accent}12` }}
        >
          {categoryIcon(category.key, "h-5 w-5")}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
            Reading {String(index).padStart(2, "0")}
          </p>
          <h3 className="mt-0.5 text-base font-bold text-white">{category.label}</h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold leading-none tabular-nums" style={{ color: accent }}>
            {category.score.toFixed(1)}
          </p>
          <p className="mt-1 text-[10px] font-bold" style={{ color: level.color }}>{level.label}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accent}, ${level.color})`,
            }}
          />
        </div>
        <p className="mt-4 text-sm leading-5 text-white/88">{category.text}</p>
      </div>
    </article>
  );
}

export function categoryIcon(key: FortuneCategoryKey, className = "h-4 w-4") {
  switch (key) {
    case "love": return <Heart className={className} />;
    case "money": return <WalletCards className={className} />;
    case "work": return <BriefcaseBusiness className={className} />;
    case "health": return <Activity className={className} />;
    case "social": return <Users className={className} />;
    case "outing": return <Compass className={className} />;
    default: return <Orbit className={className} />;
  }
}
