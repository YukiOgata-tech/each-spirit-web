import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/detail/ItemDetail";
import { genericItemMetadata } from "@/components/generic/GenericSectionPages";
import { getContentSection, getGenericItemBySection, getItemEditorialScore, getProteinProducts } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  return (await getProteinProducts()).map((p) => ({ section: "protein", slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "protein") return {};
  return genericItemMetadata("health", "protein", "products", slug);
}

export default async function HealthProductPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "protein") notFound();
  const [sectionRow, item] = await Promise.all([
    getContentSection("health", "protein"),
    getGenericItemBySection("health", "protein", slug),
  ]);
  if (!sectionRow || !item) notFound();
  const path = item.canonicalPath ?? routes.proteinProduct(slug);
  const score = await getItemEditorialScore(item.id);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "健康", href: routes.majorCategory("health") },
    { name: "プロテイン", href: routes.protein },
    { name: item.name, href: path },
  ];
  return <ItemDetail item={item} section={sectionRow} majorLabel="健康" path={path} breadcrumbs={breadcrumbs} aggregateRating={score} />;
}
