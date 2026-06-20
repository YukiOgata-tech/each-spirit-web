import { notFound } from "next/navigation";
import RamenItemPage from "@/components/legacy-pages/food/ramen/shops/[slug]/page";
import CafeItemPage from "@/components/legacy-pages/food/cafe/[region]/shops/[slug]/page";
import { getCafeItemsByRegion, getCafeRegions, getRamenItems } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const [ramenItems, cafePairs] = await Promise.all([
    getRamenItems(),
    Promise.all(getCafeRegions().map(async (region) => ({ region: region.slug, items: await getCafeItemsByRegion(region.slug) }))),
  ]);
  return [
    ...ramenItems.map((item) => ({ section: "ramen", slug: item.slug })),
    ...cafePairs.flatMap(({ items }) => items.map((item) => ({ section: "cafe", slug: item.slug }))),
  ];
}

export default async function FoodSectionShopPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section === "ramen") return <RamenItemPage params={Promise.resolve({ slug })} />;
  if (section === "cafe") {
    const pairs = await Promise.all(getCafeRegions().map(async (region) => ({ region: region.slug, item: await getCafeItemBySlug(region.slug, slug) })));
    const match = pairs.find((pair) => pair.item);
    if (!match) notFound();
    return <CafeItemPage params={Promise.resolve({ region: match.region, slug })} />;
  }
  notFound();
}

async function getCafeItemBySlug(region: string, slug: string) {
  const items = await getCafeItemsByRegion(region);
  return items.find((item) => item.slug === slug);
}
