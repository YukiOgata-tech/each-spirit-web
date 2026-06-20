import { GenericItemDetailPage, genericItemMetadata } from "@/components/generic/GenericSectionPages";

type PageProps = { params: Promise<{ section: string; itemPathSegment: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section, itemPathSegment, slug } = await params;
  return genericItemMetadata("travel", section, itemPathSegment, slug);
}

export default async function TravelGenericItemPage({ params }: PageProps) {
  const { section, itemPathSegment, slug } = await params;
  return <GenericItemDetailPage majorCategory="travel" sectionSlug={section} itemPathSegment={itemPathSegment} slug={slug} />;
}
