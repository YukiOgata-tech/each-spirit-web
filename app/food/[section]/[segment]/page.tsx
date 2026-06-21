import { notFound } from "next/navigation";
import RamenRegionPage from "@/components/legacy-pages/food/ramen/[region]/page";
import CafeRegionPage from "@/components/legacy-pages/food/cafe/[region]/page";
import { getCafeRegions, getRamenRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; segment: string }> };

export async function generateStaticParams() {
  const [ramenRegions, cafeRegions] = await Promise.all([getRamenRegions(), getCafeRegions()]);
  return [
    ...ramenRegions.map((region) => ({ section: "ramen", segment: region.slug })),
    ...cafeRegions.map((region) => ({ section: "cafe", segment: region.slug })),
  ];
}

export default async function FoodSectionRegionPage({ params }: PageProps) {
  const { section, segment } = await params;
  const region = segment;
  const regionParams = Promise.resolve({ region });
  if (section === "ramen") return <RamenRegionPage params={regionParams} />;
  if (section === "cafe") return <CafeRegionPage params={regionParams} />;
  notFound();
}
