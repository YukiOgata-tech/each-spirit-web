import Link from "next/link";
import { ArticleDiscovery } from "@/components/articles/ArticleDiscovery";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLatestArticles } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "タグ一覧 記事をタグから探す",
  description: "Each Spirit の記事に付いたタグの一覧です。気になるタグから記事を横断的に探せます。",
  path: routes.articles + "/tags",
});

export default async function ArticleTagsIndexPage() {
  const articles = await getLatestArticles();
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) if (tag) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "記事一覧", href: routes.articles },
    { name: "タグ一覧", href: routes.articles + "/tags" },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <div className="mb-5 border-b border-slate-200 pb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Articles / Tags</p>
        <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 sm:text-4xl">タグ一覧</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">気になるタグを選ぶと、そのタグが付いた記事を横断的に表示します。</p>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2.5">
          {tags.map(([tag, count]) => (
            <Link
              key={tag}
              href={routes.articleTag(tag)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              #{tag}
              <span className="text-slate-400">{count}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">タグはまだありません。</div>
      )}

      <ArticleDiscovery showAllArticlesLink />
    </main>
  );
}
