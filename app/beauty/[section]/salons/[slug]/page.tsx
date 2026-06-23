import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/detail/ItemDetail";
import { genericItemMetadata } from "@/components/generic/GenericSectionPages";
import { getBeautyRegions, getBeautySalons, getContentSection, getGenericItemBySection, getItemEditorialScore } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const pairs = await Promise.all((await getBeautyRegions()).map(async (region) => ({ salons: await getBeautySalons(region.slug) })));
  return pairs.flatMap(({ salons }) => salons.map((salon) => ({ section: "hair-salon", slug: salon.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "hair-salon") return {};
  return genericItemMetadata("beauty", "hair-salon", "salons", slug);
}

export default async function BeautySectionSalonPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "hair-salon") notFound();
  const [sectionRow, item] = await Promise.all([
    getContentSection("beauty", "hair-salon"),
    getGenericItemBySection("beauty", "hair-salon", slug),
  ]);
  if (!sectionRow || !item) notFound();
  const path = item.canonicalPath ?? `/beauty/hair-salon/salons/${slug}`;
  const score = await getItemEditorialScore(item.id);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "美容", href: routes.majorCategory("beauty") },
    { name: "美容室", href: routes.beautyHairSalon },
    { name: item.name, href: path },
  ];
  return <ItemDetail item={item} section={sectionRow} majorLabel="美容" path={path} breadcrumbs={breadcrumbs} aggregateRating={score} />;
}
