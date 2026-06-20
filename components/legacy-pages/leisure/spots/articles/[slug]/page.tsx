import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { getArticleBySection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };
const config = { majorCategory: "leisure", sectionSlug: "spots", majorLabel: "レジャー", sectionLabel: "スポット", sectionHref: routes.leisureSpots };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySection("leisure", "spots", slug);
  if (!article) return {};
  return pageMetadata({ title: article.title, description: article.description, path: routes.sectionArticle("leisure", "spots", slug), image: article.coverImageUrl ?? site.icon });
}

export default async function LeisureSpotArticlePage({ params }: PageProps) {
  const { slug } = await params;
  return <SectionArticleDetail config={config} slug={slug} />;
}
