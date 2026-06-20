import { notFound } from "next/navigation";
import { ArticleDetailPage } from "@/components/articles/ArticleDetailPage";
import { getGenericArticle, getGenericArticleMarkdown, getLatestArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

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
    image: article.coverImageUrl ?? site.icon,
  });
}

export default async function ArticleCategoryDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const article = await getGenericArticle(category, slug);
  if (!article) notFound();

  const markdown = await getGenericArticleMarkdown(category, slug);

  return (
    <ArticleDetailPage
      article={article}
      markdown={markdown}
      path={routes.articleByCategory(category, slug)}
      categoryLabel={category}
      categoryHref={routes.articleCategory(category)}
    />
  );
}
