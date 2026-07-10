import Link from "next/link";
import { ArrowRight, Clover, Compass, Tags } from "lucide-react";
import { getCategories } from "@/lib/content";
import { routes } from "@/lib/routes";

/**
 * 記事ページ（/articles・/articles/[category]）の回遊導線。
 * - 占いページへの CTA
 * - 記事カテゴリがサイトの major カテゴリと対応する場合、その major トップへの強調導線
 * - ほかの major カテゴリトップ一覧
 * - 記事一覧トップへの導線（カテゴリページのみ）
 *
 * getCategories() は lib/content.ts 経由（live のみ表示）。サーバーコンポーネント。
 */
export function ArticleDiscovery({
  activeMajor,
  showAllArticlesLink = false,
}: {
  activeMajor?: string;
  showAllArticlesLink?: boolean;
}) {
  const categories = getCategories().filter((c) => c.status === "live");
  const related = activeMajor ? categories.find((c) => c.slug === activeMajor) : undefined;
  const others = related ? categories.filter((c) => c.slug !== related.slug) : categories;

  return (
    <section className="mt-12 space-y-8 border-t border-slate-200 pt-8">
      {/* 占い CTA */}
      <Link
        href={routes.fortune}
        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-violet-200 bg-[linear-gradient(120deg,#f5f3ff_0%,#ffffff_45%,#fce7f3_100%)] p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 sm:p-6"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-violet-600 shadow-sm sm:h-14 sm:w-14">
          <Clover className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Daily Fortune</p>
          <h2 className="mt-0.5 text-lg font-bold tracking-normal text-slate-900 sm:text-xl">今日の運勢をチェックする</h2>
          <p className="mt-1 hidden text-sm leading-6 text-slate-500 sm:block">7つのカテゴリで今日の運勢を診断。結果は画像でシェアできます。</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-violet-600 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* 関連 major カテゴリトップ（記事カテゴリと対応する場合） */}
      {related && (
        <Link
          href={related.href}
          className="group flex items-center gap-4 rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:p-6"
          style={{ borderColor: `${related.theme.primary}33` }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm sm:h-14 sm:w-14"
            style={{ backgroundColor: related.theme.primary }}
          >
            <Compass className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: related.theme.primary }}>
              関連カテゴリ
            </p>
            <h2 className="mt-0.5 text-lg font-bold tracking-normal text-slate-900 sm:text-xl">{related.name}のトップを見る</h2>
            <p className="mt-1 hidden text-sm leading-6 text-slate-500 sm:block">{related.tagline}</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: related.theme.primary }} />
        </Link>
      )}

      {/* ほかの major カテゴリ */}
      <div>
        <h2 className="text-base font-bold tracking-normal text-slate-900">ほかのカテゴリも見る</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {others.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: category.theme.primary }} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-slate-900 group-hover:text-[var(--primary)]">{category.name}</span>
                <span className="block truncate text-[11px] text-slate-400">{category.tagline}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {showAllArticlesLink && (
          <Link
            href={routes.articles}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]"
          >
            記事一覧をすべて見る
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
        <Link
          href={routes.articles + "/tags"}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]"
        >
          <Tags className="h-4 w-4" />
          タグ一覧から探す
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
