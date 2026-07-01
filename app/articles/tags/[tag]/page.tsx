import { notFound } from "next/navigation";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { ArticleDiscovery } from "@/components/articles/ArticleDiscovery";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleHref, getLatestArticles } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  const articles = await getLatestArticles();
  const tags = new Set<string>();
  for (const article of articles) {
    for (const tag of article.tags) if (tag) tags.add(tag);
  }
  return [...tags].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps) {
  const { tag } = await params;
  const articles = (await getLatestArticles()).filter((article) => article.tags.includes(tag));
  const cover = articles.find((article) => article.coverImageUrl)?.coverImageUrl;
  return pageMetadata({
    title: `「${tag}」の記事一覧`,
    description: `Each Spirit の「${tag}」タグが付いた記事をまとめています。`,
    path: routes.articleTag(tag),
    image: cover ?? undefined,
  });
}

export default async function ArticleTagPage({ params }: PageProps) {
  const { tag } = await params;
  const matched = (await getLatestArticles()).filter((article) => article.tags.includes(tag));
  if (matched.length === 0) notFound();

  const activeMajor = matched.find((article) => article.majorCategory)?.majorCategory;
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "記事一覧", href: routes.articles },
    { name: `#${tag}`, href: routes.articleTag(tag) },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <div className="mb-5 border-b border-slate-400 pb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Articles / Tag</p>
        <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 sm:text-4xl">#{tag} の記事</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">「{tag}」タグが付いた記事を新しい順に表示しています（{matched.length}件）。</p>
      </div>

      <div className="divide-y divide-slate-400 lg:grid lg:grid-cols-2 lg:gap-3 lg:divide-y-0">
        {matched.map((article) => (
          <ArticleListItem key={article.id} article={article} href={articleHref(article)} />
        ))}
      </div>

      <ArticleDiscovery activeMajor={activeMajor} showAllArticlesLink />
    </main>
  );
}
