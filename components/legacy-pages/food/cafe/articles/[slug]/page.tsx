import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { getArticleBySection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };
const config = { majorCategory: "food", sectionSlug: "cafe", majorLabel: "グルメ", sectionLabel: "カフェ", sectionHref: routes.foodCafe };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySection("food", "cafe", slug);
  if (!article) return {};
  return pageMetadata({ title: article.title, description: article.description, path: routes.sectionArticle("food", "cafe", slug), image: article.coverImageUrl ?? site.icon });
}

export default async function CafeArticlePage({ params }: PageProps) {
  const { slug } = await params;
  return <SectionArticleDetail config={config} slug={slug} />;
}
