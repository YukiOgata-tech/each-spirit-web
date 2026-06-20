import { GenericItemDetailPage, genericItemMetadata } from "@/components/generic/GenericSectionPages";

type PageProps = { params: Promise<{ section: string; itemPathSegment: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section, itemPathSegment, slug } = await params;
  return genericItemMetadata("leisure", section, itemPathSegment, slug);
}

export default async function LeisureGenericItemPage({ params }: PageProps) {
  const { section, itemPathSegment, slug } = await params;
  return <GenericItemDetailPage majorCategory="leisure" sectionSlug={section} itemPathSegment={itemPathSegment} slug={slug} />;
}
