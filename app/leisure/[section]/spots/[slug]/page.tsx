import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/detail/ItemDetail";
import { genericItemMetadata } from "@/components/generic/GenericSectionPages";
import { getContentSection, getGenericItemBySection, getGenericItemsBySection, getItemEditorialScore } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  // region 有無に関わらず全件（region は任意）。
  const spots = await getGenericItemsBySection("leisure", "spots");
  return spots.map((spot) => ({ section: "spots", slug: spot.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "spots") return {};
  return genericItemMetadata("leisure", "spots", "spots", slug);
}

export default async function LeisureSectionSpotPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "spots") notFound();
  const [sectionRow, item] = await Promise.all([
    getContentSection("leisure", "spots"),
    getGenericItemBySection("leisure", "spots", slug),
  ]);
  if (!sectionRow || !item) notFound();
  const path = item.canonicalPath ?? `/leisure/spots/spots/${slug}`;
  const score = await getItemEditorialScore(item.id);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "レジャー", href: routes.majorCategory("leisure") },
    { name: "スポット", href: routes.leisureSpots },
    { name: item.name, href: path },
  ];
  return <ItemDetail item={item} section={sectionRow} majorLabel="レジャー" path={path} breadcrumbs={breadcrumbs} aggregateRating={score} />;
}
