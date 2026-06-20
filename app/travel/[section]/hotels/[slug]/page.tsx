import { notFound } from "next/navigation";
import TravelHotelPage from "@/components/legacy-pages/travel/stays/[region]/hotels/[slug]/page";
import { getTravelHotels, getTravelRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const pairs = await Promise.all(getTravelRegions().map(async (region) => ({ hotels: await getTravelHotels(region.slug) })));
  return pairs.flatMap(({ hotels }) => hotels.map((hotel) => ({ section: "stays", slug: hotel.slug })));
}

export default async function TravelSectionHotelPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "stays") notFound();
  const pairs = await Promise.all(getTravelRegions().map(async (region) => ({ region: region.slug, hotels: await getTravelHotels(region.slug) })));
  const match = pairs.find((pair) => pair.hotels.some((hotel) => hotel.slug === slug));
  if (!match) notFound();
  return <TravelHotelPage params={Promise.resolve({ region: match.region, slug })} />;
}
