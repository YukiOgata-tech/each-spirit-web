"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, Newspaper, Search, Sparkles, Tag, Trophy, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Category, SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const typeLabels: Record<SearchResult["type"], string> = {
  article: "記事",
  ranking: "ランキング",
  item: "スポット",
  category: "カテゴリ",
};

const typeIcons: Record<SearchResult["type"], typeof Newspaper> = {
  article: Newspaper,
  ranking: Trophy,
  item: Tag,
  category: Sparkles,
};

type MobileHeaderMenuProps = {
  categories: Category[];
  results: SearchResult[];
};

export function MobileHeaderMenu({ categories, results }: MobileHeaderMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const liveCategories = useMemo(() => categories.filter((category) => category.status === "live"), [categories]);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return results
      .filter((result) => activeCategory === "all" || result.category === activeCategory)
      .filter((result) => {
        if (!normalizedQuery) return true;
        const haystack = [result.title, result.description, result.category, ...result.tags].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 7);
  }, [activeCategory, query, results]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 gap-2 rounded-md px-3"
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="text-sm font-bold">メニュー</span>
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-site-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-56px)] overflow-y-auto border-t border-slate-200 bg-white shadow-2xl sm:top-16 sm:max-h-[calc(100dvh-64px)]"
          >
            <div className="mx-auto w-[calc(100%-32px)] max-w-2xl py-4">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <label className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 shadow-sm">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="記事・ジャンル・地域を検索"
                    className="h-11 min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-sm placeholder:font-semibold placeholder:text-slate-400"
                  />
                </label>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className={cn(
                      "min-h-9 rounded-full border px-3 text-xs font-bold transition",
                      activeCategory === "all" ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700",
                    )}
                  >
                    すべて
                  </button>
                  {liveCategories.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => setActiveCategory(category.name)}
                      className={cn(
                        "min-h-9 rounded-full border px-3 text-xs font-bold transition",
                        activeCategory === category.name ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700",
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href={routes.fortune}
                onClick={closeMenu}
                className="mt-3 flex min-h-14 items-center justify-between gap-3 rounded-lg bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 px-4 py-3 text-white shadow-lg shadow-violet-500/25"
              >
                <span>
                  <span className="block text-sm font-black">デイリー占い</span>
                  <span className="block text-xs font-semibold text-white/85">今日の運勢をチェック</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0" />
              </Link>

              <section className="mt-4" aria-label="検索結果">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-950">すぐ探す</h2>
                  <Link href={routes.search} onClick={closeMenu} className="text-xs font-bold text-[var(--primary)]">
                    詳細検索へ
                  </Link>
                </div>
                <div className="grid gap-2">
                  {filteredResults.map((result) => {
                    const Icon = typeIcons[result.type];
                    return (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={closeMenu}
                        className="group flex min-h-[72px] items-center gap-3 rounded-md border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <Badge className="px-2 py-0.5 text-[10px]">{typeLabels[result.type]}</Badge>
                            <span className="text-[11px] font-bold text-slate-500">{result.category}</span>
                          </span>
                          <span className="mt-1 line-clamp-1 block text-sm font-bold text-slate-950">{result.title}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5" />
                      </Link>
                    );
                  })}
                  {filteredResults.length === 0 ? (
                    <p className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold leading-6 text-slate-600">
                      該当する候補がありません。キーワードを短くするか、カテゴリを「すべて」に戻してください。
                    </p>
                  ) : null}
                </div>
              </section>

              <section className="mt-5" aria-label="カテゴリ">
                <h2 className="text-sm font-bold text-slate-950">ジャンルから探す</h2>
                <div className="mt-2 grid gap-2">
                  {liveCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={category.href}
                      onClick={closeMenu}
                      className="rounded-md border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-slate-950">{category.name}</span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{category.tagline}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
