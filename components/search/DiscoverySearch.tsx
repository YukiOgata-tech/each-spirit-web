"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText, MapPin, Search, SlidersHorizontal, Trophy } from "lucide-react";
import type { Category, SearchResult } from "@/lib/types";
import { isAllowedImageSrc, shouldUnoptimizeImage } from "@/lib/image-hosts";
import { Button } from "@/components/ui/button";

const typeLabels: Record<SearchResult["type"], string> = {
  article: "記事",
  ranking: "ランキング",
  item: "店舗",
  category: "カテゴリ",
};

export function DiscoverySearch({
  categories,
  initialResults = [],
  initialQuery = "",
  maxResults = 8,
  expanded = false,
}: {
  categories: Category[];
  /** SSR で初期クエリ結果を渡す場合のみ（/search ページ）。無ければ空でクライアント取得。 */
  initialResults?: SearchResult[];
  initialQuery?: string;
  maxResults?: number;
  expanded?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [type, setType] = useState<SearchResult["type"] | "all">("all");
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const liveCategories = useMemo(() => categories.filter((item) => item.status === "live"), [categories]);
  const [randomCategories, setRandomCategories] = useState<Category[]>(() => liveCategories.slice(0, 6));
  const isDefaultView = query.trim() === "";

  useEffect(() => {
    setRandomCategories([...liveCategories].sort(() => Math.random() - 0.5).slice(0, 6));
  }, [liveCategories]);

  // 検索本体: デバウンスして /api/search を叩く。空クエリは即クリア（DBを叩かない）。
  // 種別フィルタはサーバ側に委譲。初回は SSR の initialResults を尊重して二重取得しない。
  const skipFirstFetch = useRef(initialQuery.trim() !== "" && initialResults.length > 0);
  useEffect(() => {
    const q = query.trim();
    if (q === "") {
      setResults([]);
      setLoading(false);
      return;
    }
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q, limit: String(maxResults) });
        if (type !== "all") params.set("type", type);
        const res = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal });
        const json = (await res.json()) as { results?: SearchResult[] };
        setResults(json.results ?? []);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, type, maxResults]);

  // カテゴリ絞り込みのみ返却済み集合にクライアント適用（種別はサーバ側で適用済み）。
  const filtered = useMemo(
    () => (category === "all" ? results : results.filter((result) => result.category === category)),
    [results, category],
  );

  // カテゴリ名 → テーマ色。検索結果では画像を安易にカテゴリ代用しない。
  const catVisual = useMemo(() => {
    const m = new Map<string, { color: string }>();
    for (const c of liveCategories) m.set(c.name, { color: c.theme.primary });
    return m;
  }, [liveCategories]);

  function visualFor(name: string): { color: string } {
    const exact = catVisual.get(name);
    if (exact) return exact;
    for (const [key, v] of catVisual) if (name.includes(key) || key.includes(name)) return v;
    return { color: "#1d4f8f" };
  }

  function iconFor(typeValue: SearchResult["type"]) {
    if (typeValue === "ranking") return Trophy;
    if (typeValue === "item") return MapPin;
    return FileText;
  }

  return (
    <div className="media-card overflow-hidden max-sm:border-0 max-sm:shadow-none" id="search">
      <div className="grid gap-3 border-b border-slate-200 bg-white p-3 sm:gap-4 sm:p-4 lg:grid-cols-[1fr_auto_auto]">
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
          {liveCategories.map((item) => (
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

      <div className="grid gap-3 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 sm:gap-3 sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {isDefaultView ? "おすすめカテゴリを6件表示" : loading ? "検索中…" : `${filtered.length}件を表示`}
          </span>
          <span>{expanded ? "検索ページで詳細に絞り込み" : "公開カテゴリから探せます"}</span>
        </div>
        {isDefaultView ? (
          <div className={expanded ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
            {randomCategories.map((item, index) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035, duration: 0.28 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  href={item.href}
                  className="group relative flex min-h-[136px] flex-col justify-end overflow-hidden rounded-lg border border-slate-300 shadow-sm transition hover:shadow-lg sm:min-h-[150px] sm:rounded-xl"
                >
                  {item.images?.[0]?.url ? (
                    <Image src={item.images[0].url} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" unoptimized={shouldUnoptimizeImage(item.images[0].url)} className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${item.theme.primary}, ${item.theme.accent})` }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950/85" />
                  <ArrowUpRight className="absolute right-3 top-3 z-10 h-4 w-4 text-white/85 transition group-hover:scale-110" />
                  <div className="relative z-10 p-3 text-white sm:p-4">
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-900">公開中</span>
                    <h3 className="mt-2 text-lg font-bold leading-tight [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{item.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/90">{item.tagline}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={expanded ? "grid gap-3 lg:grid-cols-2" : "grid gap-3 lg:grid-cols-2"}>
            {filtered.map((result, index) => {
            const v = visualFor(result.category);
            const Icon = iconFor(result.type);
            // 未許可ホスト（next.config 未登録の外部画像）はクラッシュさせずプレースホルダへ
            const imageUrl = isAllowedImageSrc(result.imageUrl) ? result.imageUrl : undefined;
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
                  className="group grid min-h-[156px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:grid-cols-[168px_minmax(0,1fr)]"
                >
                  <div className="relative min-h-[118px] overflow-hidden bg-slate-100 sm:min-h-full">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 168px, 100vw"
                        unoptimized={shouldUnoptimizeImage(imageUrl)}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${v.color}18, #ffffff 54%, ${v.color}2b)` }}>
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15" style={{ backgroundColor: v.color }} />
                        <div className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-xl text-white shadow-sm" style={{ backgroundColor: v.color }}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-black text-slate-900 shadow-sm">{typeLabels[result.type]}</span>
                  </div>

                  <div className="relative flex min-w-0 flex-col p-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-black text-white" style={{ backgroundColor: v.color }}>{result.category}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        {typeLabels[result.type]}
                      </span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-base font-black leading-snug text-slate-950 transition group-hover:text-[var(--primary)] sm:text-lg">{result.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600">{result.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--primary)]" />
                  </div>
                </Link>
              </motion.div>
            );
            })}
          </div>
        )}
        {!isDefaultView && !loading && filtered.length === 0 ? (
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
