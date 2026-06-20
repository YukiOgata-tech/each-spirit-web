import { ArticleCard } from "@/components/cards/ArticleCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getIndependentArticles } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "記事一覧",
  description: "Each Spirit のカテゴリに限定しない編集記事、特集、お知らせを掲載しています。",
  path: routes.articles,
});

export default async function IndependentArticlesPage() {
  const articles = await getIndependentArticles();
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "記事一覧", href: routes.articles },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />
      <div className="mb-6">
        <p className="text-sm font-semibold text-[var(--primary)]">Articles</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">記事一覧</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">カテゴリに限定しない編集記事、特集、お知らせを表示します。</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} href={routes.article(article.slug)} />
        ))}
      </div>
    </main>
  );
}
