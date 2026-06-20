import { notFound } from "next/navigation";
import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

const configs = {
  stays: { majorCategory: "travel", sectionSlug: "stays", majorLabel: "旅行", sectionLabel: "宿・温泉", sectionHref: routes.travelStays },
  services: { majorCategory: "travel", sectionSlug: "services", majorLabel: "旅行", sectionLabel: "旅行サービス", sectionHref: routes.travelServices },
};

export default async function TravelSectionArticlePage({ params }: PageProps) {
  const { section, slug } = await params;
  const config = configs[section as keyof typeof configs];
  if (!config) notFound();
  return <SectionArticleDetail config={config} slug={slug} />;
}
