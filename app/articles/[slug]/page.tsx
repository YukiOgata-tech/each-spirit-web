import { notFound } from "next/navigation";
import { ArticleDetailPage } from "@/components/articles/ArticleDetailPage";
import { getArticleMarkdown, getIndependentArticle, getIndependentArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getIndependentArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getIndependentArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: routes.article(slug),
    image: article.coverImageUrl ?? site.icon,
  });
}

export default async function IndependentArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getIndependentArticle(slug);
  if (!article) notFound();

  const markdown = await getArticleMarkdown(slug);

  return (
    <ArticleDetailPage
      article={article}
      markdown={markdown}
      path={routes.article(slug)}
      categoryLabel="記事"
      categoryHref={routes.articles}
    />
  );
}
