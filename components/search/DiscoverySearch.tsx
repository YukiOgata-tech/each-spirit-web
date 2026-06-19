"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import type { Category, SearchResult } from "@/lib/types";
import { Button } from "@/components/ui/button";

const typeLabels: Record<SearchResult["type"], string> = {
  article: "記事",
  ranking: "ランキング",
  item: "店舗",
  category: "カテゴリ",
};

export function DiscoverySearch({
  categories,
  results,
  initialQuery = "",
  maxResults = 8,
  expanded = false,
}: {
  categories: Category[];
  results: SearchResult[];
  initialQuery?: string;
  maxResults?: number;
  expanded?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [type, setType] = useState<SearchResult["type"] | "all">("all");

  const matched = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return results
      .filter((result) => category === "all" || result.category === category)
      .filter((result) => type === "all" || result.type === type)
      .filter((result) => {
        if (!normalized) return true;
        return [result.title, result.description, result.category, ...result.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      });
  }, [category, query, results, type]);
  const filtered = useMemo(() => matched.slice(0, maxResults), [matched, maxResults]);

  // カテゴリ名 → 背景画像・テーマ色（カテゴリデータの実URLを利用）
  const catVisual = useMemo(() => {
    const m = new Map<string, { image?: string; color: string }>();
    for (const c of categories) m.set(c.name, { image: c.images?.[0]?.url, color: c.theme.primary });
    return m;
  }, [categories]);

  function visualFor(name: string): { image?: string; color: string } {
    const exact = catVisual.get(name);
    if (exact) return exact;
    for (const [key, v] of catVisual) if (name.includes(key) || key.includes(name)) return v;
    return { color: "#1d4f8f" };
  }

  return (
    <div className="media-card overflow-hidden" id="search">
      <div className="grid gap-4 border-b border-slate-200 bg-white p-4 lg:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <span className="sr-only">キーワード検索</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例: 駐車場あり、週末旅、AIツール、濃厚味噌"
            className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[var(--primary)]"
          aria-label="カテゴリ"
        >
          <option value="all">全カテゴリ</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(event) => setType(event.target.value as SearchResult["type"] | "all")}
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[var(--primary)]"
          aria-label="コンテンツ種別"
        >
          <option value="all">全種別</option>
          {Object.entries(typeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 p-4">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {matched.length}件中 {filtered.length}件を表示
          </span>
          <span>{expanded ? "検索ページで詳細に絞り込み" : "カテゴリ追加後も同じ検索UIに統合"}</span>
        </div>
        <div className={expanded ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-3 sm:grid-cols-2"}>
          {filtered.map((result, index) => {
            const v = visualFor(result.category);
            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035, duration: 0.28 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  href={result.href}
                  className="group relative flex min-h-[150px] flex-col justify-end overflow-hidden rounded-xl border border-slate-300 shadow-sm transition hover:shadow-lg"
                >
                  {/* 背景: カテゴリ画像 or テーマ色 */}
                  {v.image ? (
                    <Image
                      src={v.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${v.color}, ${v.color}bb)` }} />
                  )}
                  {/* 可読性のための暗オーバーレイ（どんな画像でも文字が読める） */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(2,6,23,0.12) 0%, rgba(2,6,23,0.55) 52%, rgba(2,6,23,0.88) 100%)" }}
                  />
                  <ArrowUpRight className="absolute right-3 top-3 z-10 h-4 w-4 text-white/85 transition group-hover:scale-110" />

                  {/* コンテンツ */}
                  <div className="relative z-10 p-4 text-white max-sm:text-center">
                    <div className="flex flex-wrap items-center gap-1.5 max-sm:justify-center">
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-900">{result.category}</span>
                      <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold text-white ring-1 ring-white/25">
                        {typeLabels[result.type]}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-bold leading-tight [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:text-lg">{result.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/90 max-sm:hidden">{result.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5 max-sm:justify-center">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
            条件に合う項目がありません。カテゴリや種別を広げて検索してください。
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
          {["駐車場あり", "初心者", "ランキング", "準備中", "AI対応", "週末旅"].map((word) => (
            <Button key={word} type="button" variant="secondary" size="sm" onClick={() => setQuery(word)}>
              {word}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
