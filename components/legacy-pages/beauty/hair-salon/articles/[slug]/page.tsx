import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { getArticleBySection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };
const config = { majorCategory: "beauty", sectionSlug: "hair-salon", majorLabel: "美容", sectionLabel: "美容室", sectionHref: routes.beautyHairSalon };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySection("beauty", "hair-salon", slug);
  if (!article) return {};
  return pageMetadata({ title: article.title, description: article.description, path: routes.sectionArticle("beauty", "hair-salon", slug), image: article.coverImageUrl ?? site.icon });
}

export default async function HairSalonArticlePage({ params }: PageProps) {
  const { slug } = await params;
  return <SectionArticleDetail config={config} slug={slug} />;
}
