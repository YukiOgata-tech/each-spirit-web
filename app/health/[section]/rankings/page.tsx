import { notFound } from "next/navigation";
import { SectionRankingsIndex } from "@/components/articles/SectionRankingRoutes";
import { getGenericSectionConfig } from "@/components/generic/GenericSectionPages";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string }> };

const config = { majorCategory: "health", sectionSlug: "protein", majorLabel: "健康", sectionLabel: "プロテイン", sectionHref: routes.healthProtein };

export function generateStaticParams() {
  return [{ section: "protein" }];
}

export default async function HealthSectionRankingsPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "protein") return <SectionRankingsIndex config={config} />;
  const genericConfig = await getGenericSectionConfig("health", section);
  if (!genericConfig) notFound();
  return <SectionRankingsIndex config={genericConfig} />;
}
