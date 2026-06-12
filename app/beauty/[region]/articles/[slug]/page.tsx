import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import { getBeautyArticle, getBeautyArticleMarkdown, getBeautyArticles, getBeautyRegions } from "@/lib/content";
import { LikeButton } from "@/components/content/LikeButton";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  const regions = getBeautyRegions();
  const pairs = await Promise.all(regions.map(async (r) => ({ region: r.slug, articles: await getBeautyArticles(r.slug) })));
  return pairs.flatMap(({ region, articles }) => articles.map((a) => ({ region, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const article = await getBeautyArticle(region, slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: routes.beautyArticle(region, slug),
  });
}

const REGION_NAME: Record<string, string> = {
  niigata: "新潟", yamagata: "山形",
};

export default async function BeautyArticlePage({ params }: PageProps) {
  const { region, slug } = await params;
  const article = await getBeautyArticle(region, slug);
  if (!article) notFound();

  const markdown = await getBeautyArticleMarkdown(region, slug);
  const regionName = REGION_NAME[region] ?? region;
  const breadcrumbs = [
    { name: "トップ",     href: routes.home },
    { name: "美容室",     href: routes.beauty },
    { name: `${regionName}の美容室`, href: routes.beautyRegion(region) },
    { name: article.title, href: routes.beautyArticle(region, slug) },
  ];

  return (
    <article className="beauty-theme section-shell max-w-4xl">
      <JsonLd data={articleSchema(article, routes.beautyArticle(region, slug))} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(article.faqs)} />
      <Breadcrumbs
        items={breadcrumbs.map((item, i) => ({
          label: item.name,
          href: i === breadcrumbs.length - 1 ? undefined : item.href,
        }))}
      />
      <div className="rounded-2xl border border-[#f2d5e8] bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#fef0f6] px-2.5 py-1 text-[11px] font-semibold text-[#8b3a7e]">{tag}</span>
          ))}
        </div>
        <h1 data-speakable="title" className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">{article.title}</h1>
        <p data-speakable="description" className="mt-4 text-base leading-8 text-slate-600">{article.description}</p>
        <div className="mt-5 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
          <p>公開日: {article.publishedAt}</p>
          <p>更新日: {article.updatedAt}</p>
          <p>著者: {article.author.name}</p>
          <p>カテゴリ: {article.category}</p>
        </div>
        <LikeButton contentType="article" contentId={article.slug} regionSlug={region} className="mt-5" />
      </div>
      <section className="mt-6 rounded-2xl border border-[#f2d5e8] bg-[#fef0f6] p-5">
        <h2 className="text-base font-bold text-[#8b3a7e]">要点まとめ</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
          {article.summary.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>
      <section className="mt-6 rounded-2xl border border-[#f2d5e8] bg-white p-5">
        <h2 className="text-base font-bold text-slate-800">このページで分かること</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
          {article.whatYouLearn.map((item) => (
            <li key={item} className="rounded-xl bg-[#fef0f6] p-3">{item}</li>
          ))}
        </ul>
      </section>
      <div className="mt-8 rounded-2xl border border-[#f2d5e8] bg-white p-5 sm:p-8">
        <MarkdownRenderer markdown={markdown} />
      </div>
      <div className="mt-8 grid gap-6">
        <FaqSection faqs={article.faqs} />
        <SourceList sources={article.sources} />
      </div>
    </article>
  );
}
