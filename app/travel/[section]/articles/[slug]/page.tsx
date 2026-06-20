import { notFound } from "next/navigation";
import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { getGenericSectionConfig } from "@/components/generic/GenericSectionPages";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

const configs = {
  stays: { majorCategory: "travel", sectionSlug: "stays", majorLabel: "旅行", sectionLabel: "宿・温泉", sectionHref: routes.travelStays },
  services: { majorCategory: "travel", sectionSlug: "services", majorLabel: "旅行", sectionLabel: "旅行サービス", sectionHref: routes.travelServices },
};

export default async function TravelSectionArticlePage({ params }: PageProps) {
  const { section, slug } = await params;
  const config = configs[section as keyof typeof configs];
  if (config) return <SectionArticleDetail config={config} slug={slug} />;
  const genericConfig = await getGenericSectionConfig("travel", section);
  if (!genericConfig) notFound();
  return <SectionArticleDetail config={genericConfig} slug={slug} />;
}
