import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/content/LikeButton";
import { articleSchema, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import { getCafeArticle, getCafeArticleMarkdown, getCafeArticles, getCafeRegions } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  const regions = getCafeRegions();
  const pairs = await Promise.all(regions.map(async (r) => ({ region: r.slug, articles: await getCafeArticles(r.slug) })));
  return pairs.flatMap(({ region, articles }) => articles.map((article) => ({ region, slug: article.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const article = await getCafeArticle(region, slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: routes.cafeArticle(region, slug),
  });
}

export default async function CafeArticlePage({ params }: PageProps) {
  const { region, slug } = await params;
  const article = await getCafeArticle(region, slug);
  const regionData = getCafeRegions().find((r) => r.slug === region);
  if (!article || !regionData) notFound();

  const markdown = await getCafeArticleMarkdown(region, slug);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "カフェガイド", href: routes.cafe },
    { name: regionData.name + "のカフェ", href: routes.cafeRegion(region) },
    { name: article.title, href: routes.cafeArticle(region, slug) },
  ];

  return (
    <article className="cafe-theme section-shell max-w-4xl">
      <JsonLd data={articleSchema(article, routes.cafeArticle(region, slug))} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(article.faqs)} />
      <Breadcrumbs
        items={breadcrumbs.map((item, index) => ({
          label: item.name,
          href: index === breadcrumbs.length - 1 ? undefined : item.href,
        }))}
      />

      <div className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-soft sm:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge>{article.category}</Badge>
          {article.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
        <h1 data-speakable="title" className="mt-5 text-3xl font-bold leading-tight tracking-normal text-slate-950 sm:text-5xl">{article.title}</h1>
        <p data-speakable="description" className="mt-4 text-base leading-8 text-slate-600">{article.description}</p>
        <div className="mt-5 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
          <p>公開日: {article.publishedAt}</p>
          <p>更新日: {article.updatedAt}</p>
          <p>著者: {article.author.name}</p>
          <p>カテゴリ: {article.category}</p>
        </div>
        <LikeButton contentType="article" contentId={article.slug} regionSlug={region} className="mt-5" />
      </div>

      {article.summary.length > 0 && (
        <section className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-5">
          <h2 className="text-lg font-semibold text-slate-900">要点まとめ</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
            {article.summary.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </section>
      )}

      {article.whatYouLearn.length > 0 && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">このページで分かること</h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
            {article.whatYouLearn.map((item) => <li key={item} className="rounded-md bg-slate-50 p-3">{item}</li>)}
          </ul>
        </section>
      )}

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
        <MarkdownRenderer markdown={markdown} />
      </div>

      <div className="mt-8 grid gap-6">
        <FaqSection faqs={article.faqs} />
        <SourceList sources={article.sources} />
      </div>
    </article>
  );
}
