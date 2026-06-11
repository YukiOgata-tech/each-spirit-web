import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { MarkdownRenderer } from "@/components/cards/MarkdownRenderer";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { articleSchema, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import { getArticleMarkdown, getRamenArticle, getRamenArticles } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getRamenArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getRamenArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: routes.ramenArticle(article.slug),
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getRamenArticle(slug);
  if (!article) notFound();
  const markdown = await getArticleMarkdown(article.slug);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "ラーメン", href: routes.ramen },
    { name: article.title, href: routes.ramenArticle(article.slug) },
  ];
  return (
    <article className="ramen-theme section-shell max-w-4xl">
      <JsonLd data={articleSchema(article, routes.ramenArticle(article.slug))} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(article.faqs)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />
      <div className="rounded-lg border border-orange-200 bg-white p-5 shadow-soft sm:p-8">
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
      </div>
      <section className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-5">
        <h2 className="text-lg font-semibold">要点まとめ</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
          {article.summary.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">このページで分かること</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
          {article.whatYouLearn.map((item) => <li key={item} className="rounded-md bg-slate-50 p-3">{item}</li>)}
        </ul>
      </section>
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
