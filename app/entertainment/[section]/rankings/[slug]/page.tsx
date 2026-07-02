import type { Metadata } from "next";
import { GenericRankingDetailPage, genericRankingMetadata } from "@/components/generic/GenericSectionPages";
import { getContentSections, getRankingsBySection } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const sections = await getContentSections("entertainment");
  const pairs = await Promise.all(
    sections.map(async (section) => ({
      section: section.sectionSlug,
      rankings: await getRankingsBySection("entertainment", section.sectionSlug),
    })),
  );
  return pairs.flatMap(({ section, rankings }) => rankings.map((ranking) => ({ section, slug: ranking.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section, slug } = await params;
  return genericRankingMetadata("entertainment", section, slug);
}

export default async function EntertainmentSectionRankingPage({ params }: PageProps) {
  const { section, slug } = await params;
  return <GenericRankingDetailPage majorCategory="entertainment" sectionSlug={section} slug={slug} />;
}
