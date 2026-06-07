"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import type { Category, SearchResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const typeLabels: Record<SearchResult["type"], string> = {
  article: "記事",
  ranking: "ランキング",
  item: "店舗",
  category: "カテゴリ",
};

export function DiscoverySearch({
  categories,
  results,
}: {
  categories: Category[];
  results: SearchResult[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState<SearchResult["type"] | "all">("all");

  const filtered = useMemo(() => {
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
      })
      .slice(0, 8);
  }, [category, query, results, type]);

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
            {filtered.length}件を表示
          </span>
          <span>カテゴリ追加後も同じ検索UIに統合</span>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035, duration: 0.28 }}
              whileHover={{ y: -3 }}
            >
              <Link
                href={result.href}
                className={cn(
                  "group block rounded-md border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-md",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{result.category}</Badge>
                    <Badge className="bg-slate-950 text-white">{typeLabels[result.type]}</Badge>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-[var(--primary)]" />
                </div>
                <h3 className="mt-3 text-base font-bold leading-6 text-slate-950">{result.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{result.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {result.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
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
