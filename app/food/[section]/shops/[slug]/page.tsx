import { notFound } from "next/navigation";
import { GenericItemDetailPage, genericItemMetadata } from "@/components/generic/GenericSectionPages";
import { ItemDetail } from "@/components/detail/ItemDetail";
import {
  getGenericItemsBySection, getRamenItems,
  getContentSection, getGenericItemBySection, getItemEditorialScore,
} from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section, slug } = await params;
  // ramen/cafe/汎用すべて genericItemMetadata で per-page metadata を付与（旧 return {} の不備を解消）
  return genericItemMetadata("food", section, "shops", slug);
}

export async function generateStaticParams() {
  // region 有無に関わらず全件を事前生成する（region は任意のため region 列挙に依存しない）。
  const [ramenItems, cafeItems] = await Promise.all([
    getRamenItems(),
    getGenericItemsBySection("food", "cafe"),
  ]);
  return [
    ...ramenItems.map((item) => ({ section: "ramen", slug: item.slug })),
    ...cafeItems.map((item) => ({ section: "cafe", slug: item.slug })),
  ];
}

export default async function FoodSectionShopPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section === "ramen") {
    const [sectionRow, item] = await Promise.all([
      getContentSection("food", "ramen"),
      getGenericItemBySection("food", "ramen", slug),
    ]);
    if (!sectionRow || !item) notFound();
    const path = item.canonicalPath ?? routes.ramenItem(slug);
    const score = await getItemEditorialScore(item.id);
    const breadcrumbs = [
      { name: "トップ", href: routes.home },
      { name: "グルメ", href: routes.majorCategory("food") },
      { name: "ラーメン", href: routes.ramen },
      { name: item.name, href: path },
    ];
    return <ItemDetail item={item} section={sectionRow} majorLabel="グルメ" path={path} breadcrumbs={breadcrumbs} aggregateRating={score} />;
  }
  if (section === "cafe") {
    const [sectionRow, item] = await Promise.all([
      getContentSection("food", "cafe"),
      getGenericItemBySection("food", "cafe", slug),
    ]);
    if (!sectionRow || !item) notFound();
    const path = item.canonicalPath ?? `/food/cafe/shops/${slug}`;
    const score = await getItemEditorialScore(item.id);
    const breadcrumbs = [
      { name: "トップ", href: routes.home },
      { name: "グルメ", href: routes.majorCategory("food") },
      { name: "カフェ", href: routes.cafe },
      { name: item.name, href: path },
    ];
    return <ItemDetail item={item} section={sectionRow} majorLabel="グルメ" path={path} breadcrumbs={breadcrumbs} aggregateRating={score} />;
  }
  return <GenericItemDetailPage majorCategory="food" sectionSlug={section} itemPathSegment="shops" slug={slug} />;
}
