import { notFound } from "next/navigation";
import { SectionRankingsIndex } from "@/components/articles/SectionRankingRoutes";
import { getGenericSectionConfig } from "@/components/generic/GenericSectionPages";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string }> };

const configs = {
  stays: { majorCategory: "travel", sectionSlug: "stays", majorLabel: "旅行", sectionLabel: "宿・温泉", sectionHref: routes.travelStays },
  services: { majorCategory: "travel", sectionSlug: "services", majorLabel: "旅行", sectionLabel: "旅行サービス", sectionHref: routes.travelServices },
};

export function generateStaticParams() {
  return Object.keys(configs).map((section) => ({ section }));
}

export default async function TravelSectionRankingsPage({ params }: PageProps) {
  const { section } = await params;
  const config = configs[section as keyof typeof configs];
  if (config) return <SectionRankingsIndex config={config} />;
  const genericConfig = await getGenericSectionConfig("travel", section);
  if (!genericConfig) notFound();
  return <SectionRankingsIndex config={genericConfig} />;
}
