import { GenericItemDetailPage, genericItemMetadata } from "@/components/generic/GenericSectionPages";

type PageProps = { params: Promise<{ section: string; segment: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section, segment, slug } = await params;
  return genericItemMetadata("food", section, segment, slug);
}

export default async function FoodGenericItemPage({ params }: PageProps) {
  const { section, segment, slug } = await params;
  return <GenericItemDetailPage majorCategory="food" sectionSlug={section} itemPathSegment={segment} slug={slug} />;
}
