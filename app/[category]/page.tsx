import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/seo";
import { getGenericArticles, getGenericArticlesByCategory } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ category: string }> };

function categoryLabel(category: string) {
  return category
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const articles = await getGenericArticles();
  return Array.from(new Set(articles.map((article) => article.category))).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const articles = await getGenericArticlesByCategory(category);
  if (articles.length === 0) return {};
  const label = categoryLabel(category);
  return pageMetadata({
    title: label + "の記事一覧",
    description: label + "カテゴリの記事を新着順にまとめています。",
    path: routes.genericCategory(category),
  });
}

export default async function GenericCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const articles = await getGenericArticlesByCategory(category);
  if (articles.length === 0) notFound();

  const label = categoryLabel(category);
  return (
    <main className="section-shell">
      <Breadcrumbs items={[{ label: "トップ", href: routes.home }, { label }]} />
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <Badge>{label}</Badge>
        <h1 className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-5xl">{label}の記事一覧</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          {label}カテゴリの記事を新着順にまとめています。
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={routes.genericArticle(article.category, article.slug)}
            className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-md"
          >
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </div>
            <h2 className="mt-4 text-xl font-bold leading-snug text-slate-950 group-hover:text-[var(--primary)]">{article.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{article.description}</p>
            <div className="mt-5 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{article.updatedAt}</span>
              <span className="inline-flex items-center gap-1 text-[var(--primary)]">
                読む <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
