import { GenericItemDetailPage, genericItemMetadata } from "@/components/generic/GenericSectionPages";

type PageProps = { params: Promise<{ section: string; segment: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section, segment, slug } = await params;
  return genericItemMetadata("beauty", section, segment, slug);
}

export default async function BeautyGenericItemPage({ params }: PageProps) {
  const { section, segment, slug } = await params;
  return <GenericItemDetailPage majorCategory="beauty" sectionSlug={section} itemPathSegment={segment} slug={slug} />;
}
