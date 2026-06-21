"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, FileText, PenLine, Search, Store, Trophy } from "lucide-react";

export type ManagedKind = "article" | "item" | "ranking";

export type ManagedRow = {
  id: string;
  kind: ManagedKind;
  title: string;
  slug: string;
  /** 絞り込み用の分類ラベル（記事: 記事カテゴリ / 店舗・ランキング: major/section） */
  category: string;
  status: string;
  editHref: string;
  viewHref: string | null;
  updatedAt: string | null;
};

const KIND_META: Record<ManagedKind, { label: string; icon: React.ElementType; color: string }> = {
  article: { label: "記事", icon: FileText, color: "text-sky-600" },
  item: { label: "店舗・商品", icon: Store, color: "text-emerald-600" },
  ranking: { label: "ランキング", icon: Trophy, color: "text-amber-600" },
};

const TABS: { value: ManagedKind | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "article", label: "記事" },
  { value: "item", label: "店舗・商品" },
  { value: "ranking", label: "ランキング" },
];

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" });
}

export function ContentManager({ rows }: { rows: ManagedRow[] }) {
  const [tab, setTab] = useState<ManagedKind | "all">("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  // タブで絞ったうえでカテゴリ候補を作る（タブと連動）
  const byTab = useMemo(
    () => (tab === "all" ? rows : rows.filter((r) => r.kind === tab)),
    [rows, tab],
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of byTab) if (r.category) set.add(r.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [byTab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return byTab.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q);
    });
  }, [byTab, category, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length, article: 0, item: 0, ranking: 0 };
    for (const r of rows) c[r.kind] += 1;
    return c;
  }, [rows]);

  return (
    <div className="space-y-4">
      {/* タブ */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTab(t.value);
                setCategory("all");
              }}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white"
                  : "inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-orange-400 hover:text-slate-900"
              }
            >
              {t.label}
              <span className={active ? "text-white/80" : "text-slate-400"}>
                {counts[t.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* 検索・カテゴリ絞り込み */}
      <div className="grid gap-3 sm:grid-cols-[1fr_minmax(0,220px)]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名前・slug で検索"
            className="min-h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
          />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
        >
          <option value="all">すべてのカテゴリ</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <p className="text-xs font-semibold text-slate-500">{filtered.length} 件</p>

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
          条件に一致するコンテンツがありません。
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((r) => {
            const m = KIND_META[r.kind];
            const Icon = m.icon;
            return (
              <li
                key={`${r.kind}-${r.id}`}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
              >
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold ${m.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {m.label}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{r.title || r.slug}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                    <span className="font-mono">{r.slug}</span>
                    {r.category && <span>· {r.category}</span>}
                    <span>· 更新 {formatDate(r.updatedAt)}</span>
                  </p>
                </div>

                <span
                  className={
                    r.status === "published"
                      ? "shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                      : "shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700"
                  }
                >
                  {r.status === "published" ? "公開中" : "下書き"}
                </span>

                <div className="flex shrink-0 items-center gap-2">
                  {r.viewHref && r.status === "published" && (
                    <Link
                      href={r.viewHref}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="max-sm:sr-only">表示</span>
                    </Link>
                  )}
                  <Link
                    href={r.editHref}
                    className="inline-flex items-center gap-1 rounded-md bg-orange-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-orange-600"
                  >
                    <PenLine className="h-3.5 w-3.5" />
                    編集
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
