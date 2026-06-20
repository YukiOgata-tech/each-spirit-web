import { ArticleCard } from "@/components/cards/ArticleCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleHref, getGenericArticlesByCategory, getLatestArticles } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const articles = await getLatestArticles();
  return Array.from(new Set(articles.map((article) => article.category).filter(Boolean))).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  return pageMetadata({
    title: `${category}の記事一覧`,
    description: `Each Spirit の ${category} に関する記事を掲載しています。`,
    path: routes.articleCategory(category),
  });
}

export default async function ArticleCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const articles = await getGenericArticlesByCategory(category);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "記事一覧", href: routes.articles },
    { name: category, href: routes.articleCategory(category) },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />
      <div className="mb-6">
        <p className="text-sm font-semibold text-[var(--primary)]">Articles / {category}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">{category}の記事一覧</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">このカテゴリに紐づく公開記事を新しい順に表示しています。</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} href={articleHref(article)} />
        ))}
      </div>
    </main>
  );
}
