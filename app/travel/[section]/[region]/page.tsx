import { notFound } from "next/navigation";
import TravelRegionPage from "@/components/legacy-pages/travel/stays/[region]/page";
import TravelServiceRegionPage from "@/components/legacy-pages/travel/services/[region]/page";
import { getTravelRegions, getTravelServiceRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; region: string }> };

export async function generateStaticParams() {
  const [stays, services] = await Promise.all([getTravelRegions(), getTravelServiceRegions()]);
  return [
    ...stays.map((region) => ({ section: "stays", region: region.slug })),
    ...services.map((region) => ({ section: "services", region: region.slug })),
  ];
}

export default async function TravelSectionRegionPage({ params }: PageProps) {
  const { section, region } = await params;
  if (section === "stays") return <TravelRegionPage params={Promise.resolve({ region })} />;
  if (section === "services") return <TravelServiceRegionPage params={Promise.resolve({ region })} />;
  notFound();
}
