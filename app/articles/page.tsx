import { CategoryHubCard } from "@/components/articles/CategoryHubCard";
import { ArticleDiscovery } from "@/components/articles/ArticleDiscovery";
import { JsonLd } from "@/components/seo/JsonLd";
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
      <div className="mb-5 border-b border-slate-200 pb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Articles</p>
        <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 sm:text-4xl">記事カテゴリ一覧</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">気になるカテゴリを選ぶと、その記事を新しい順で表示します。</p>
      </div>
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryHubCard
              key={category.category}
              category={category.category}
              count={category.count}
              latestUpdatedAt={category.latestUpdatedAt}
              coverImageUrl={category.coverImageUrl}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">公開中の記事はまだありません。</div>
      )}

      <ArticleDiscovery />
    </main>
  );
}
