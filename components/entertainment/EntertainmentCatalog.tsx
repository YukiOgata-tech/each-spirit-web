"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TitleCard } from "@/components/entertainment/TitleCard";
import { originLabel, type CatalogTitle } from "@/components/entertainment/labels";

const controlClass =
  "min-h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";

/** 作品一覧（原作タイプ × ジャンル × 名前検索でクライアント絞り込み）。
 *  ファセットはデータから動的生成するため、tv/drama 等のセクションでもそのまま使える。 */
export function EntertainmentCatalog({ titles }: { titles: CatalogTitle[] }) {
  const [origin, setOrigin] = useState("all");
  const [genre, setGenre] = useState("all");
  const [query, setQuery] = useState("");

  const origins = useMemo(() => {
    const set = new Map<string, string>(); // itemKind -> label
    for (const t of titles) if (!set.has(t.itemKind)) set.set(t.itemKind, originLabel(t.itemKind));
    return Array.from(set.entries()).sort((a, b) => a[1].localeCompare(b[1], "ja"));
  }, [titles]);

  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const t of titles) for (const g of t.genres) set.add(g);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [titles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return titles.filter((t) => {
      if (origin !== "all" && t.itemKind !== origin) return false;
      if (genre !== "all" && !t.genres.includes(genre)) return false;
      if (!q) return true;
      const hay = [t.name, t.description, ...t.tags, ...t.genres].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [titles, origin, genre, query]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="作品名・ジャンルで検索"
            className={`${controlClass} w-full pl-9`}
          />
        </label>
        {/* モバイルは2列、sm以上は親グリッドへ展開（検索=全幅 / セレクト2つ横並び） */}
        <div className="grid grid-cols-2 gap-3 sm:contents">
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={`${controlClass} w-full`} aria-label="原作タイプで絞り込み">
            <option value="all">すべての原作</option>
            {origins.map(([kind, label]) => <option key={kind} value={kind}>{label}</option>)}
          </select>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className={`${controlClass} w-full`} aria-label="ジャンルで絞り込み">
            <option value="all">すべてのジャンル</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-500">{filtered.length} 作品</p>

      {filtered.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
          条件に合う作品がありません。
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t) => <TitleCard key={t.slug} title={t} />)}
        </div>
      )}
    </div>
  );
}
