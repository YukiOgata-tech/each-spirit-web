import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { ArticleDiscovery } from "@/components/articles/ArticleDiscovery";
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
  const articles = await getGenericArticlesByCategory(category);
  const cover = articles.find((a) => a.coverImageUrl)?.coverImageUrl;
  return pageMetadata({
    title: `${category}の記事一覧`,
    description: `Each Spirit の ${category} に関する記事を掲載しています。`,
    path: routes.articleCategory(category),
    image: cover ?? "/images/articles/meta.jpg",
  });
}

export default async function ArticleCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const articles = await getGenericArticlesByCategory(category);
  const activeMajor = articles.find((a) => a.majorCategory)?.majorCategory;
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "記事一覧", href: routes.articles },
    { name: category, href: routes.articleCategory(category) },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <div className="mb-5 border-b border-slate-400 pb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Articles / {category}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 sm:text-4xl">{category}の記事一覧</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">公開記事を新しい順に表示しています（{articles.length}件）。</p>
      </div>

      {articles.length > 0 ? (
        <div className="divide-y divide-slate-400 lg:grid lg:grid-cols-2 lg:gap-3 lg:divide-y-0">
          {articles.map((article) => (
            <ArticleListItem key={article.slug} article={article} href={articleHref(article)} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">公開中の記事はまだありません。</div>
      )}

      <ArticleDiscovery activeMajor={activeMajor} showAllArticlesLink />
    </main>
  );
}
