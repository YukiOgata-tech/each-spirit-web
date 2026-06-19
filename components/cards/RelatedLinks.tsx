import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { RelatedLink } from "@/lib/types";

const typeLabel: Record<RelatedLink["type"], string> = {
  article: "関連記事",
  item: "関連店舗・商品",
  ranking: "関連ランキング",
  category: "関連カテゴリ",
  external: "外部リンク",
};

export function RelatedLinks({ links }: { links?: RelatedLink[] }) {
  if (!links || links.length === 0) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 max-sm:border-slate-100">
      <h2 className="text-lg font-semibold text-slate-950">関連コンテンツ</h2>
      <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
        {links.map((link) => {
          const content = (
            <>
              <span className="text-[11px] font-bold uppercase tracking-normal text-[var(--primary)]">{typeLabel[link.type]}</span>
              <span className="mt-1 block text-sm font-bold leading-6 text-slate-950">{link.title}</span>
              {link.note && <span className="mt-1 block text-xs leading-5 text-slate-600">{link.note}</span>}
              <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-slate-400 transition group-hover:text-[var(--primary)]" />
            </>
          );
          const className = "group relative block min-h-24 rounded-lg border border-slate-200 bg-slate-50 p-3 pr-10 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:bg-white hover:shadow-md sm:min-h-28 sm:p-4 sm:pr-10";

          return link.url.startsWith("/") ? (
            <Link key={link.title + link.url} href={link.url} className={className}>{content}</Link>
          ) : (
            <a key={link.title + link.url} href={link.url} target="_blank" rel="noreferrer" className={className}>{content}</a>
          );
        })}
      </div>
    </section>
  );
}
