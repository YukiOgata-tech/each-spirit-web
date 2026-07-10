"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gem, TrendingUp, ShieldAlert } from "lucide-react";
import { CATEGORY_LABEL, LEVEL, type FortuneCategoryKey, type FortuneResult, type FortuneScore } from "@/lib/fortune";
import { categoryIcon } from "@/components/fortune/FortuneCategoryDetails";
import { CATEGORY_THEME, CategoryMotif } from "@/components/fortune/category-theme";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";

/**
 * 画面幅に追従する、大きく読みやすい運勢データ表示。
 * 3D体験モードのヒーロー直下に置く想定。hovered/onHover を渡すと結晶軸とホバー同期する。
 */
export function FortuneDataReport({
  result,
  hovered,
  onHover,
}: {
  result: FortuneResult;
  hovered?: string | null;
  onHover?: (key: string | null) => void;
}) {
  const sorted = [...result.categories].sort((a, b) => b.score - a.score);
  const strongestKey = sorted[0]?.key;
  const focusKey = sorted[sorted.length - 1]?.key;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 xl:max-w-6xl">
      {/* ヘッダー */}
      <div className="mb-7 flex items-end justify-between gap-4 sm:mb-10">
        <div>
          <p className="font-cinzel fortune-shimmer-text text-[11px] font-black uppercase tracking-[0.3em] sm:text-xs">Today&apos;s Reading</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">今日の運勢レポート</h2>
        </div>
        <span className="font-cinzel shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-widest text-white/75 sm:text-sm">
          {result.date}
        </span>
      </div>

      {/* 6カテゴリ（カテゴリごとに固有の表情・解説文つき）。総合運はヒーローに集約済み */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {result.categories.map((c, i) => (
          <CategoryCard
            key={c.key}
            c={c}
            index={i}
            badge={c.key === strongestKey ? "tailwind" : c.key === focusKey ? "care" : null}
            active={hovered === c.key}
            onHover={onHover}
          />
        ))}
      </div>

      {/* ラッキー */}
      <section className="mt-5 grid grid-cols-3 gap-3 sm:mt-6 sm:gap-4">
        <LuckyCard label="ラッキーカラー">
          <span className="mx-auto mt-3 block h-11 w-11 rounded-full border-4 border-white/70 shadow-lg shadow-black/30 sm:h-14 sm:w-14" style={{ backgroundColor: result.lucky.color.hex }} />
          <p className="mt-2.5 text-xs font-bold text-white/90 sm:text-sm">{result.lucky.color.name}</p>
        </LuckyCard>
        <LuckyCard label="ナンバー">
          <p className="font-cinzel mt-2 text-4xl font-black tabular-nums text-violet-200 sm:text-6xl">{result.lucky.number}</p>
        </LuckyCard>
        <LuckyCard label="キーアイテム">
          {result.lucky.item ? (
            <Link href={result.lucky.item.href} className="group mt-2 block">
              {result.lucky.item.image ? (
                <Image
                  src={result.lucky.item.image}
                  alt={result.lucky.item.name}
                  width={72}
                  height={72}
                  unoptimized={shouldUnoptimizeImage(result.lucky.item.image)}
                  className="mx-auto h-14 w-14 rounded-xl object-cover ring-1 ring-white/20 transition group-hover:ring-white/50 sm:h-16 sm:w-16"
                />
              ) : (
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-white/10 sm:h-16 sm:w-16">
                  <Gem className="h-6 w-6 text-sky-200" />
                </span>
              )}
              <span className="mt-2 block truncate text-xs font-bold text-sky-200 group-hover:underline sm:text-sm">{result.lucky.item.name}</span>
            </Link>
          ) : (
            <p className="mt-3 text-sm text-white/45">—</p>
          )}
        </LuckyCard>
      </section>
    </div>
  );
}

function CategoryCard({
  c,
  index,
  badge,
  active,
  onHover,
}: {
  c: FortuneScore;
  index: number;
  badge: "tailwind" | "care" | null;
  active: boolean;
  onHover?: (key: string | null) => void;
}) {
  const lv = LEVEL[c.band];
  const theme = CATEGORY_THEME[c.key as Exclude<FortuneCategoryKey, "overall">];
  const accent = theme?.accent ?? "#a78bfa";
  const progress = Math.max(0, Math.min(100, (c.score / 5) * 100));

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05 }}
      onPointerEnter={() => onHover?.(c.key)}
      onPointerLeave={() => onHover?.(null)}
      className={`group relative flex flex-col overflow-hidden rounded-[26px] border p-5 backdrop-blur-xl transition-all duration-300 sm:p-6 ${
        active ? "shadow-2xl shadow-black/40 sm:scale-[1.02]" : ""
      }`}
      style={{
        borderColor: active ? `${accent}aa` : "rgba(255,255,255,0.12)",
        background: `radial-gradient(135% 120% at 100% 0%, ${theme?.soft ?? "rgba(167,139,250,0.16)"}, rgba(2,6,23,0.62) 62%)`,
      }}
    >
      {/* カテゴリ固有モチーフ（右上に薄く） */}
      <span className="pointer-events-none absolute -right-2 -top-2 h-28 w-28 sm:h-32 sm:w-32" style={{ color: accent }} aria-hidden>
        <CategoryMotif motif={theme?.motif ?? "social"} className="h-full w-full opacity-[0.18] transition-opacity duration-300 group-hover:opacity-30" />
      </span>
      {/* アクセントのグロー */}
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full opacity-25 blur-3xl" style={{ backgroundColor: accent }} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border sm:h-14 sm:w-14"
            style={{ color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}14` }}
          >
            {categoryIcon(c.key, "h-6 w-6 sm:h-7 sm:w-7")}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.08em]" style={{ color: accent }}>{theme?.vibe}</p>
            <h3 className="truncate text-lg font-bold text-white sm:text-xl">{CATEGORY_LABEL[c.key]}</h3>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-cinzel text-4xl font-black leading-none tabular-nums sm:text-5xl" style={{ color: lv.color }}>
            {c.score.toFixed(1)}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: lv.color }}>{lv.label}</p>
        </div>
      </div>

      {badge && (
        <div className="relative mt-3">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black"
            style={
              badge === "tailwind"
                ? { color: "#bbf7d0", backgroundColor: "rgba(34,197,94,0.18)" }
                : { color: "#fecaca", backgroundColor: "rgba(244,63,94,0.18)" }
            }
          >
            {badge === "tailwind" ? <TrendingUp className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
            {badge === "tailwind" ? "今日の追い風" : "要ケア"}
          </span>
        </div>
      )}

      <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}, ${lv.color})` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>

      <p className="relative mt-4 text-sm leading-7 text-white/85 sm:text-[15px]">{c.text}</p>
    </motion.article>
  );
}

function LuckyCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-slate-950/55 p-3 text-center backdrop-blur-xl sm:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55 sm:text-[11px] sm:tracking-[0.18em]">{label}</p>
      {children}
    </div>
  );
}
