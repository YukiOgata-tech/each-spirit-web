import { notFound } from "next/navigation";
import TravelAgencyPage from "@/components/legacy-pages/travel/services/[region]/agencies/[slug]/page";
import { getTravelAgencies, getTravelServiceRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const pairs = await Promise.all(getTravelServiceRegions().map(async (region) => ({ agencies: await getTravelAgencies(region.slug) })));
  return pairs.flatMap(({ agencies }) => agencies.map((agency) => ({ section: "services", slug: agency.slug })));
}

export default async function TravelSectionAgencyPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "services") notFound();
  const pairs = await Promise.all(getTravelServiceRegions().map(async (region) => ({ region: region.slug, agencies: await getTravelAgencies(region.slug) })));
  const match = pairs.find((pair) => pair.agencies.some((agency) => agency.slug === slug));
  if (!match) notFound();
  return <TravelAgencyPage params={Promise.resolve({ region: match.region, slug })} />;
}
