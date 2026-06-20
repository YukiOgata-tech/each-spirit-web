import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { RelatedLinks } from "@/components/cards/RelatedLinks";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/content/LikeButton";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { routes } from "@/lib/routes";
import type { Article } from "@/lib/types";

type ArticleDetailPageProps = {
  article: Article;
  markdown: string;
  path: string;
  categoryLabel: string;
  categoryHref: string;
};

export function ArticleDetailPage({ article, markdown, path, categoryLabel, categoryHref }: ArticleDetailPageProps) {
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: categoryLabel, href: categoryHref },
    { name: article.title, href: path },
  ];

  return (
    <article className="section-shell max-w-4xl">
      <JsonLd data={articleSchema(article, path)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(article.faqs)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-8 max-sm:shadow-none">
        <div className="flex flex-wrap gap-2">
          <Badge>{categoryLabel}</Badge>
          {article.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
        <h1 data-speakable="title" className="mt-4 text-[1.75rem] font-bold leading-[1.15] tracking-normal text-slate-950 sm:mt-5 sm:text-5xl">{article.title}</h1>
        <p data-speakable="description" className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">{article.description}</p>
        <div className="mt-5 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
          <p>公開日: {article.publishedAt}</p>
          <p>更新日: {article.updatedAt}</p>
          <p>著者: {article.author.name}</p>
          <p>カテゴリ: {categoryLabel}</p>
        </div>
        <LikeButton contentType="article" contentId={article.slug} className="mt-5" />
      </div>

      {article.summary.length > 0 && (
        <section className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:mt-6 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">要点まとめ</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
            {article.summary.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </section>
      )}

      {article.whatYouLearn.length > 0 && (
        <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4 sm:mt-6 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">このページで分かること</h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
            {article.whatYouLearn.map((item) => <li key={item} className="rounded-md bg-slate-50 p-3">{item}</li>)}
          </ul>
        </section>
      )}

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 sm:mt-8 sm:p-8">
        <MarkdownRenderer markdown={markdown} />
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6">
        <RelatedLinks links={article.relatedLinks} />
        <FaqSection faqs={article.faqs} />
        <SourceList sources={article.sources} />
      </div>
    </article>
  );
}
