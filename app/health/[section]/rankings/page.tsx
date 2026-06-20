import { notFound } from "next/navigation";
import { SectionRankingsIndex } from "@/components/articles/SectionRankingRoutes";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string }> };

const config = { majorCategory: "health", sectionSlug: "protein", majorLabel: "健康", sectionLabel: "プロテイン", sectionHref: routes.healthProtein };

export function generateStaticParams() {
  return [{ section: "protein" }];
}

export default async function HealthSectionRankingsPage({ params }: PageProps) {
  const { section } = await params;
  if (section !== "protein") notFound();
  return <SectionRankingsIndex config={config} />;
}
