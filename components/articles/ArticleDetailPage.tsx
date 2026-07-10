import Link from "next/link";
import { FaqSection } from "@/components/cards/FaqSection";
import { getMarkdownHeadings, MarkdownRenderer, type MarkdownHeading } from "@/components/cards/MarkdownRenderer";
import { RelatedLinks } from "@/components/cards/RelatedLinks";
import { SourceList } from "@/components/cards/SourceList";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/content/LikeButton";
import { AffiliateSurface } from "@/components/affiliate/AffiliateSurface";
import { AffiliateMarkdownCard } from "@/components/affiliate/AffiliateMarkdownCard";
import Image from "next/image";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { routes, ogArticleImage } from "@/lib/routes";
import { readingTimeMinutes } from "@/lib/reading-time";
import { safeImageSrc, shouldUnoptimizeImage } from "@/lib/image-hosts";
import type { Article } from "@/lib/types";

type ArticleDetailPageProps = {
  article: Article;
  markdown: string;
  path: string;
  categoryLabel: string;
  categoryHref: string;
  related?: { article: Article; href: string }[];
};

export function ArticleDetailPage({ article, markdown, path, categoryLabel, categoryHref, related = [] }: ArticleDetailPageProps) {
  const headings = getMarkdownHeadings(markdown);
  const readingMinutes = readingTimeMinutes(markdown);
  const coverSrc = safeImageSrc(article.coverImageUrl, ogArticleImage(article.title));
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: categoryLabel, href: categoryHref },
    { name: article.title, href: path },
  ];

  return (
    <div className="section-shell max-w-7xl xl:grid xl:grid-cols-[minmax(220px,260px)_minmax(0,56rem)] xl:items-start xl:justify-center xl:gap-8">
      <JsonLd data={articleSchema(article, path)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(article.faqs)} />

      {headings.length > 0 && (
        <aside className="sticky top-32 hidden max-h-[calc(100vh-9rem)] self-start overflow-y-auto xl:block">
          <ArticleTableOfContents headings={headings} />
        </aside>
      )}

      <article className="min-w-0">
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:aspect-21/9">
        <Image
          src={coverSrc}
          alt={article.title}
          fill
          priority
          sizes="(min-width: 1024px) 56rem, 100vw"
          unoptimized={shouldUnoptimizeImage(coverSrc)}
          className="object-cover"
        />
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:mt-6 sm:p-8 max-sm:shadow-none">
        <div className="flex flex-wrap gap-2">
          <Badge>{categoryLabel}</Badge>
          {article.tags.map((tag) => (
            <Link key={tag} href={routes.articleTag(tag)} className="transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1 rounded-full">
              <Badge>#{tag}</Badge>
            </Link>
          ))}
        </div>
        <h1 data-speakable="title" className="mt-4 text-[1.75rem] font-bold leading-[1.15] tracking-normal text-slate-950 sm:mt-5 sm:text-5xl">{article.title}</h1>
        <p data-speakable="description" className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">{article.description}</p>
        <div className="mt-5 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
          <p>公開日: {article.publishedAt}</p>
          <p>更新日: {article.updatedAt}</p>
          <p>著者: {article.author.name}</p>
          <p>カテゴリ: {categoryLabel}</p>
          <p>読了時間: 約{readingMinutes}分</p>
        </div>
        <LikeButton contentKind="article" targetId={article.id} className="mt-5" />
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

      {headings.length > 0 && <ArticleTableOfContents headings={headings} className="mt-4 sm:mt-6 xl:hidden" />}

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 sm:mt-8 sm:p-8">
        <MarkdownRenderer
          markdown={markdown}
          affiliateContext={{
            kind: "article",
            title: article.title,
            targetId: article.id,
            targetSlug: article.slug,
            majorCategory: article.majorCategory,
            sectionSlug: article.sectionSlug,
          }}
          renderAffiliateCard={(fields, context) => (
            <AffiliateMarkdownCard
              query={fields.query}
              title={fields.title}
              description={fields.description}
              content={context}
            />
          )}
        />
      </div>

      <AffiliateSurface
        content={{
          kind: "article",
          title: article.title,
          targetId: article.id,
          targetSlug: article.slug,
          majorCategory: article.majorCategory,
          sectionSlug: article.sectionSlug,
        }}
        placement="article_body"
        className="mt-6 sm:mt-8"
      />

      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6">
        <RelatedLinks links={article.relatedLinks} />
        <FaqSection faqs={article.faqs} />
        <SourceList sources={article.sources} />
      </div>

      {related.length > 0 && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 sm:mt-8 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">関連記事</h2>
          <p className="mt-1 text-xs text-slate-500">同じタグが付いた記事です。</p>
          <div className="mt-4 divide-y divide-slate-200 sm:grid sm:grid-cols-2 sm:gap-3 sm:divide-y-0">
            {related.map(({ article: item, href }) => (
              <ArticleListItem key={item.id} article={item} href={href} />
            ))}
          </div>
        </section>
      )}
      </article>
    </div>
  );
}

function ArticleTableOfContents({ headings, className = "" }: { headings: MarkdownHeading[]; className?: string }) {
  return (
    <nav aria-label="この記事の目次" className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      <p className="text-sm font-bold text-slate-950">この記事の目次</p>
      <ol className="mt-3 space-y-0.5 text-sm leading-6 sm:space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-3 sm:pl-4" : undefined}>
            <a
              href={`#${heading.id}`}
              className={
                heading.level === 3
                  ? "block break-words border-l border-blue-200 pl-3 font-semibold text-blue-700 underline decoration-blue-300/70 underline-offset-4 transition hover:border-blue-500 hover:text-blue-900 hover:decoration-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/45"
                  : "block break-words font-bold text-blue-700 underline decoration-blue-300/70 underline-offset-4 transition hover:text-blue-900 hover:decoration-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/45"
              }
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
