"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Article } from "@/lib/types";
import { ArticleListItem } from "@/components/articles/ArticleListItem";

type Entry = { article: Article; href: string };

/**
 * 記事一覧のタグ絞り込み UI（クライアント側で即時フィルタ、API 非依存）。
 * - 上部の入力でタグを部分一致検索、下のチップ（頻度順）でワンタップ絞り込み。
 * - 記事は SSR で取得済みのものを受け取り、選択タグを含む記事だけ表示する。
 * href はサーバ側で articleHref を解決して渡す（articleHref は server-only のため）。
 */
export function ArticleTagBrowser({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState("");

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { article } of entries) {
      for (const tag of article.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [entries]);

  const q = query.trim().toLowerCase();
  const active = query.trim();

  const filtered = useMemo(() => {
    if (q === "") return entries;
    return entries.filter(({ article }) => article.tags.some((tag) => tag.toLowerCase().includes(q)));
  }, [entries, q]);

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <label className="relative block">
            <span className="sr-only">タグで絞り込み</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="タグで絞り込み（例: 駐車場、初心者、週末）"
              className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 pl-10 pr-10 text-sm outline-none transition focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            {query !== "" && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="絞り込みを解除"
                className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            <TagChip label="すべて" active={active === ""} onClick={() => setQuery("")} />
            {tags.map(([tag, count]) => (
              <TagChip
                key={tag}
                label={tag}
                count={count}
                active={active === tag}
                onClick={() => setQuery(active === tag ? "" : tag)}
              />
            ))}
          </div>
        </div>
      )}

      <p className="mb-3 text-xs font-semibold text-slate-500">
        {active === "" ? `${filtered.length}件` : `「${active}」で${filtered.length}件`}
      </p>

      {filtered.length > 0 ? (
        <div className="divide-y divide-slate-400 lg:grid lg:grid-cols-2 lg:gap-3 lg:divide-y-0">
          {filtered.map(({ article, href }) => (
            <ArticleListItem key={article.slug} article={article} href={href} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          「{active}」に一致する記事がありません。別のタグでお試しください。
        </div>
      )}
    </div>
  );
}

function TagChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white transition"
          : "inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
      }
    >
      {label}
      {typeof count === "number" && (
        <span className={active ? "text-white/75" : "text-slate-400"}>{count}</span>
      )}
    </button>
  );
}
