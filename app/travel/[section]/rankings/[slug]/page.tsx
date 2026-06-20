import { notFound } from "next/navigation";
import TravelRankingPage from "@/components/legacy-pages/travel/stays/[region]/rankings/[slug]/page";
import TravelServiceRankingPage from "@/components/legacy-pages/travel/services/[region]/rankings/[slug]/page";
import { getTravelRankings, getTravelRegions, getTravelServiceRankings, getTravelServiceRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const [stayPairs, servicePairs] = await Promise.all([
    Promise.all(getTravelRegions().map(async (region) => ({ section: "stays", rankings: await getTravelRankings(region.slug) }))),
    Promise.all(getTravelServiceRegions().map(async (region) => ({ section: "services", rankings: await getTravelServiceRankings(region.slug) }))),
  ]);
  return [...stayPairs, ...servicePairs].flatMap(({ section, rankings }) => rankings.map((ranking) => ({ section, slug: ranking.slug })));
}

export default async function TravelSectionRankingPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section === "stays") {
    const pairs = await Promise.all(getTravelRegions().map(async (region) => ({ region: region.slug, rankings: await getTravelRankings(region.slug) })));
    const match = pairs.find((pair) => pair.rankings.some((ranking) => ranking.slug === slug));
    if (!match) notFound();
    return <TravelRankingPage params={Promise.resolve({ region: match.region, slug })} />;
  }
  if (section === "services") {
    const pairs = await Promise.all(getTravelServiceRegions().map(async (region) => ({ region: region.slug, rankings: await getTravelServiceRankings(region.slug) })));
    const match = pairs.find((pair) => pair.rankings.some((ranking) => ranking.slug === slug));
    if (!match) notFound();
    return <TravelServiceRankingPage params={Promise.resolve({ region: match.region, slug })} />;
  }
  notFound();
}
