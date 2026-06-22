import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { getArticleCategories } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "記事カテゴリ一覧 気になることは記事でチェック",
  description: "Each Spirit の記事をカテゴリ別に掲載しています。気になるカテゴリから記事を探せます。",
  path: routes.articles,
  image: "/images/articles/meta.jpg",
});

export default async function ArticleCategoriesPage() {
  const categories = await getArticleCategories();
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "記事一覧", href: routes.articles },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <div className="mb-6">
        <p className="text-sm font-semibold text-[var(--primary)]">Articles</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">記事カテゴリ一覧</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">記事をカテゴリ別にまとめています。気になるカテゴリを選ぶと、その記事一覧を新しい順で表示します。</p>
      </div>
      {categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.category}
              href={routes.articleCategory(category.category)}
              className="group flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <FileText className="h-5 w-5 shrink-0" />
                  <span className="text-lg font-bold tracking-normal text-slate-950 transition group-hover:text-[var(--primary)]">{category.category}</span>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--primary)] transition group-hover:translate-x-1" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge>{category.count}記事</Badge>
                <span className="text-xs text-slate-500">更新 {category.latestUpdatedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">公開中の記事はまだありません。</div>
      )}
    </main>
  );
}
