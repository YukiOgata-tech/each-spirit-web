import LeisureSpotsPage from "@/components/legacy-pages/leisure/spots/page";
import { GenericSectionIndex, genericSectionMetadata } from "@/components/generic/GenericSectionPages";

type PageProps = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  if (section === "spots") return {};
  return genericSectionMetadata("leisure", section);
}

export function generateStaticParams() {
  return [{ section: "spots" }];
}

export default async function LeisureSectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "spots") return <LeisureSpotsPage />;
  return <GenericSectionIndex majorCategory="leisure" sectionSlug={section} />;
}
