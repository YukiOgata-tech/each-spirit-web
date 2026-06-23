import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/detail/ItemDetail";
import { genericItemMetadata } from "@/components/generic/GenericSectionPages";
import { getContentSection, getGenericItemBySection, getItemEditorialScore, getTravelAgencies, getTravelServiceRegions } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  const pairs = await Promise.all((await getTravelServiceRegions()).map(async (region) => ({ agencies: await getTravelAgencies(region.slug) })));
  return pairs.flatMap(({ agencies }) => agencies.map((agency) => ({ section: "services", slug: agency.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "services") return {};
  return genericItemMetadata("travel", "services", "agencies", slug);
}

export default async function TravelSectionAgencyPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "services") notFound();
  const [sectionRow, item] = await Promise.all([
    getContentSection("travel", "services"),
    getGenericItemBySection("travel", "services", slug),
  ]);
  if (!sectionRow || !item) notFound();
  const path = item.canonicalPath ?? `/travel/services/agencies/${slug}`;
  const score = await getItemEditorialScore(item.id);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行", href: routes.majorCategory("travel") },
    { name: "サービス", href: routes.travelServices },
    { name: item.name, href: path },
  ];
  return <ItemDetail item={item} section={sectionRow} majorLabel="旅行" path={path} breadcrumbs={breadcrumbs} aggregateRating={score} />;
}
