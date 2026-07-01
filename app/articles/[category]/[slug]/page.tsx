import { notFound } from "next/navigation";
import { ArticleDetailPage } from "@/components/articles/ArticleDetailPage";
import { articleHref, getGenericArticle, getGenericArticleMarkdown, getLatestArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ogArticleImage, routes } from "@/lib/routes";
import type { Article } from "@/lib/types";

/** 同一タグを共有する記事を、共有タグ数→新しい順で最大4件返す。 */
function relatedByTags(article: Article, all: Article[]) {
  return all
    .filter((candidate) => candidate.id !== article.id && candidate.tags.some((tag) => article.tags.includes(tag)))
    .map((candidate) => ({
      candidate,
      shared: candidate.tags.filter((tag) => article.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared || b.candidate.updatedAt.localeCompare(a.candidate.updatedAt))
    .slice(0, 4)
    .map(({ candidate }) => ({ article: candidate, href: articleHref(candidate) }));
}

type PageProps = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  const articles = await getLatestArticles();
  return articles
    .filter((article) => article.category)
    .map((article) => ({ category: article.category, slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params;
  const article = await getGenericArticle(category, slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: routes.articleByCategory(category, slug),
    image: article.coverImageUrl ?? ogArticleImage(article.title),
  });
}

export default async function ArticleCategoryDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const article = await getGenericArticle(category, slug);
  if (!article) notFound();

  const [markdown, all] = await Promise.all([getGenericArticleMarkdown(category, slug), getLatestArticles()]);
  const related = relatedByTags(article, all);

  return (
    <ArticleDetailPage
      article={article}
      markdown={markdown}
      path={routes.articleByCategory(category, slug)}
      categoryLabel={category}
      categoryHref={routes.articleCategory(category)}
      related={related}
    />
  );
}
