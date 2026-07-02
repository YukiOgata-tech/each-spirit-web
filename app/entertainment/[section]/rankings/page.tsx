import { notFound } from "next/navigation";
import { SectionRankingsIndex } from "@/components/articles/SectionRankingRoutes";
import { getGenericSectionConfig } from "@/components/generic/GenericSectionPages";
import { getContentSections } from "@/lib/content";

type PageProps = { params: Promise<{ section: string }> };

export async function generateStaticParams() {
  const sections = await getContentSections("entertainment");
  return sections.map((section) => ({ section: section.sectionSlug }));
}

export default async function EntertainmentSectionRankingsPage({ params }: PageProps) {
  const { section } = await params;
  const config = await getGenericSectionConfig("entertainment", section);
  if (!config) notFound();
  return <SectionRankingsIndex config={config} />;
}
