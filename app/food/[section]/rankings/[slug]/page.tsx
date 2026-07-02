import { notFound } from "next/navigation";
import RamenRankingPage from "@/components/legacy-pages/food/ramen/rankings/[slug]/page";
import CafeRankingPage from "@/components/legacy-pages/food/cafe/[region]/rankings/[slug]/page";
import { GenericRankingDetailPage } from "@/components/generic/GenericSectionPages";
import { getCafeRankingsByRegion, getCafeRegions, getRankingBySection, getRamenRankings } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const [ramenRankings, cafePairs] = await Promise.all([
    getRamenRankings(),
    getCafeRegions().then((regions) => Promise.all(regions.map(async (region) => ({ region: region.slug, rankings: await getCafeRankingsByRegion(region.slug) })))),
  ]);
  return [
    ...ramenRankings.map((ranking) => ({ section: "ramen", slug: ranking.slug })),
    ...cafePairs.flatMap(({ rankings }) => rankings.map((ranking) => ({ section: "cafe", slug: ranking.slug }))),
  ];
}

export default async function FoodSectionRankingPage({ params }: PageProps) {
  const { section, slug } = await params;
  const genericRanking = await getRankingBySection("food", section, slug);
  const hasManualEntry = genericRanking?.items.some((entry) => entry.entryKind === "manual") ?? false;
  if (hasManualEntry) return <GenericRankingDetailPage majorCategory="food" sectionSlug={section} slug={slug} />;
  if (section === "ramen") return <RamenRankingPage params={Promise.resolve({ slug })} />;
  if (section === "cafe") {
    const pairs = await Promise.all((await getCafeRegions()).map(async (region) => ({ region: region.slug, ranking: await getCafeRankingBySlug(region.slug, slug) })));
    const match = pairs.find((pair) => pair.ranking);
    if (!match) notFound();
    return <CafeRankingPage params={Promise.resolve({ region: match.region, slug })} />;
  }
  return <GenericRankingDetailPage majorCategory="food" sectionSlug={section} slug={slug} />;
}

async function getCafeRankingBySlug(region: string, slug: string) {
  const rankings = await getCafeRankingsByRegion(region);
  return rankings.find((ranking) => ranking.slug === slug);
}
