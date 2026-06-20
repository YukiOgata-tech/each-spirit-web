import { notFound } from "next/navigation";
import BeautyRankingPage from "@/components/legacy-pages/beauty/hair-salon/[region]/rankings/[slug]/page";
import { GenericRankingDetailPage } from "@/components/generic/GenericSectionPages";
import { getBeautyRankings, getBeautyRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const pairs = await Promise.all((await getBeautyRegions()).map(async (region) => ({ rankings: await getBeautyRankings(region.slug) })));
  return pairs.flatMap(({ rankings }) => rankings.map((ranking) => ({ section: "hair-salon", slug: ranking.slug })));
}

export default async function BeautySectionRankingPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "hair-salon") return <GenericRankingDetailPage majorCategory="beauty" sectionSlug={section} slug={slug} />;
  const pairs = await Promise.all((await getBeautyRegions()).map(async (region) => ({ region: region.slug, rankings: await getBeautyRankings(region.slug) })));
  const match = pairs.find((pair) => pair.rankings.some((ranking) => ranking.slug === slug));
  if (!match) notFound();
  return <BeautyRankingPage params={Promise.resolve({ region: match.region, slug })} />;
}
