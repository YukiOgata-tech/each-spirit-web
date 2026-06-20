import { notFound } from "next/navigation";
import { SectionRankingsIndex } from "@/components/articles/SectionRankingRoutes";
import { getGenericSectionConfig } from "@/components/generic/GenericSectionPages";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string }> };

const config = { majorCategory: "beauty", sectionSlug: "hair-salon", majorLabel: "美容", sectionLabel: "美容室", sectionHref: routes.beautyHairSalon };

export function generateStaticParams() {
  return [{ section: "hair-salon" }];
}

export default async function BeautySectionRankingsPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "hair-salon") return <SectionRankingsIndex config={config} />;
  const genericConfig = await getGenericSectionConfig("beauty", section);
  if (!genericConfig) notFound();
  return <SectionRankingsIndex config={genericConfig} />;
}
