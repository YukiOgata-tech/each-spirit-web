import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { getGenericSectionConfig } from "@/components/generic/GenericSectionPages";
import { getArticleBySection } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ section: string; slug: string }> };
const config = { majorCategory: "health", sectionSlug: "protein", majorLabel: "健康", sectionLabel: "プロテイン", sectionHref: routes.healthProtein };

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "protein") return {};
  const article = await getArticleBySection("health", "protein", slug);
  if (!article) return {};
  return pageMetadata({ title: article.title, description: article.description, path: routes.sectionArticle("health", "protein", slug), image: article.coverImageUrl ?? site.icon });
}

export default async function ProteinArticlePage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section === "protein") return <SectionArticleDetail config={config} slug={slug} />;
  const genericConfig = await getGenericSectionConfig("health", section);
  if (!genericConfig) notFound();
  return <SectionArticleDetail config={genericConfig} slug={slug} />;
}
