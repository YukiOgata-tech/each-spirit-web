import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ArticleDetailPage } from "@/components/articles/ArticleDetailPage";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArticleBySection, getArticleMarkdown, getArticlesBySection } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/seo";
import { routes } from "@/lib/routes";

export type SectionConfig = {
  majorCategory: string;
  sectionSlug: string;
  majorLabel: string;
  sectionLabel: string;
  sectionHref: string;
};

export async function SectionArticlesIndex({ config }: { config: SectionConfig }) {
  const articles = await getArticlesBySection(config.majorCategory, config.sectionSlug);
  const path = routes.sectionArticles(config.majorCategory, config.sectionSlug);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: config.majorLabel, href: routes.majorCategory(config.majorCategory) },
    { name: config.sectionLabel, href: config.sectionHref },
    { name: "記事一覧", href: path },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />
      <div className="mb-6">
        <p className="text-sm font-semibold text-[var(--primary)]">{config.majorLabel} / {config.sectionLabel}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">{config.sectionLabel}の記事一覧</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">公開済みの記事を新しい順に表示しています。</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} href={routes.sectionArticle(config.majorCategory, config.sectionSlug, article.slug)} />
        ))}
      </div>
    </main>
  );
}

export async function SectionArticleDetail({ config, slug }: { config: SectionConfig; slug: string }) {
  const article = await getArticleBySection(config.majorCategory, config.sectionSlug, slug);
  if (!article) notFound();
  const markdown = await getArticleMarkdown(slug);
  return (
    <ArticleDetailPage
      article={article}
      markdown={markdown}
      path={routes.sectionArticle(config.majorCategory, config.sectionSlug, slug)}
      categoryLabel={config.sectionLabel}
      categoryHref={routes.sectionArticles(config.majorCategory, config.sectionSlug)}
    />
  );
}
