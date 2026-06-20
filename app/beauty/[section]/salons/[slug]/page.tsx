import { notFound } from "next/navigation";
import BeautySalonPage from "@/components/legacy-pages/beauty/hair-salon/[region]/salons/[slug]/page";
import { getBeautyRegions, getBeautySalons } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const pairs = await Promise.all((await getBeautyRegions()).map(async (region) => ({ salons: await getBeautySalons(region.slug) })));
  return pairs.flatMap(({ salons }) => salons.map((salon) => ({ section: "hair-salon", slug: salon.slug })));
}

export default async function BeautySectionSalonPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "hair-salon") notFound();
  const pairs = await Promise.all((await getBeautyRegions()).map(async (region) => ({ region: region.slug, salons: await getBeautySalons(region.slug) })));
  const match = pairs.find((pair) => pair.salons.some((salon) => salon.slug === slug));
  if (!match) notFound();
  return <BeautySalonPage params={Promise.resolve({ region: match.region, slug })} />;
}
