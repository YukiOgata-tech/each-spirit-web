import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/content/LikeButton";
import { articleSchema, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import { getGenericArticle, getGenericArticleMarkdown, getGenericArticles } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ category: string; slug: string }> };

function categoryLabel(category: string) {
  return category
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const articles = await getGenericArticles();
  return articles.map((article) => ({ category: article.category, slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params;
  const article = await getGenericArticle(category, slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: routes.genericArticle(category, slug),
  });
}

export default async function GenericArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const article = await getGenericArticle(category, slug);
  if (!article) notFound();

  const markdown = await getGenericArticleMarkdown(category, slug);
  const label = categoryLabel(category);
  const path = routes.genericArticle(category, slug);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: article.title, href: path },
  ];
  const breadcrumbItems = [
    { label: "トップ", href: routes.home },
    { label },
    { label: article.title },
  ];

  return (
    <article className="section-shell max-w-4xl">
      <JsonLd data={articleSchema(article, path)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(article.faqs)} />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge>{label}</Badge>
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
        <LikeButton contentType="article" contentId={article.slug} className="mt-5" />
      </div>

      {article.summary.length > 0 && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
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
