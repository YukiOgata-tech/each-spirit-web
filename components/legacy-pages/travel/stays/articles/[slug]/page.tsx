import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { getArticleBySection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };
const config = { majorCategory: "travel", sectionSlug: "stays", majorLabel: "旅行", sectionLabel: "宿・温泉", sectionHref: routes.travelStays };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySection("travel", "stays", slug);
  if (!article) return {};
  return pageMetadata({ title: article.title, description: article.description, path: routes.sectionArticle("travel", "stays", slug), image: article.coverImageUrl ?? site.icon });
}

export default async function StayArticlePage({ params }: PageProps) {
  const { slug } = await params;
  return <SectionArticleDetail config={config} slug={slug} />;
}
