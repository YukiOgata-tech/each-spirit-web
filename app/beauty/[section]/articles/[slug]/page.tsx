import { notFound } from "next/navigation";
import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { getGenericSectionConfig } from "@/components/generic/GenericSectionPages";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };
const config = { majorCategory: "beauty", sectionSlug: "hair-salon", majorLabel: "美容", sectionLabel: "美容室", sectionHref: routes.beautyHairSalon };

export default async function BeautySectionArticlePage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section === "hair-salon") return <SectionArticleDetail config={config} slug={slug} />;
  const genericConfig = await getGenericSectionConfig("beauty", section);
  if (!genericConfig) notFound();
  return <SectionArticleDetail config={genericConfig} slug={slug} />;
}
