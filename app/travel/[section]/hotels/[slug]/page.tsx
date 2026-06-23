import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/detail/ItemDetail";
import { genericItemMetadata } from "@/components/generic/GenericSectionPages";
import { getContentSection, getGenericItemBySection, getItemEditorialScore, getTravelHotels, getTravelRegions } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const pairs = await Promise.all((await getTravelRegions()).map(async (region) => ({ hotels: await getTravelHotels(region.slug) })));
  return pairs.flatMap(({ hotels }) => hotels.map((hotel) => ({ section: "stays", slug: hotel.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "stays") return {};
  return genericItemMetadata("travel", "stays", "hotels", slug);
}

export default async function TravelSectionHotelPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "stays") notFound();
  const [sectionRow, item] = await Promise.all([
    getContentSection("travel", "stays"),
    getGenericItemBySection("travel", "stays", slug),
  ]);
  if (!sectionRow || !item) notFound();
  const path = item.canonicalPath ?? `/travel/stays/hotels/${slug}`;
  const score = await getItemEditorialScore(item.id);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行", href: routes.majorCategory("travel") },
    { name: "宿泊", href: routes.travelStays },
    { name: item.name, href: path },
  ];
  return <ItemDetail item={item} section={sectionRow} majorLabel="旅行" path={path} breadcrumbs={breadcrumbs} aggregateRating={score} />;
}
