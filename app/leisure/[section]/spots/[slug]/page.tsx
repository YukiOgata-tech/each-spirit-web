import { notFound } from "next/navigation";
import LeisureSpotPage from "@/components/legacy-pages/leisure/spots/niigata/spots/[slug]/page";
import { getLeisureSpots } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

const region = "niigata";

export async function generateStaticParams() {
  const spots = await getLeisureSpots(region);
  return spots.map((spot) => ({ section: "spots", slug: spot.slug }));
}

export default async function LeisureSectionSpotPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "spots") notFound();
  return <LeisureSpotPage params={Promise.resolve({ slug })} />;
}
