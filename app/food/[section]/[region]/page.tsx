import { notFound } from "next/navigation";
import RamenRegionPage from "@/components/legacy-pages/food/ramen/[region]/page";
import CafeRegionPage from "@/components/legacy-pages/food/cafe/[region]/page";
import { getCafeRegions, getRamenRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; region: string }> };

export async function generateStaticParams() {
  const [ramenRegions, cafeRegions] = await Promise.all([getRamenRegions(), getCafeRegions()]);
  return [
    ...ramenRegions.map((region) => ({ section: "ramen", region: region.slug })),
    ...cafeRegions.map((region) => ({ section: "cafe", region: region.slug })),
  ];
}

export default async function FoodSectionRegionPage({ params }: PageProps) {
  const { section, region } = await params;
  const regionParams = Promise.resolve({ region });
  if (section === "ramen") return <RamenRegionPage params={regionParams} />;
  if (section === "cafe") return <CafeRegionPage params={regionParams} />;
  notFound();
}
