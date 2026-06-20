import HairSalonPage from "@/components/legacy-pages/beauty/hair-salon/page";
import { GenericSectionIndex, genericSectionMetadata } from "@/components/generic/GenericSectionPages";

type PageProps = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  if (section === "hair-salon") return {};
  return genericSectionMetadata("beauty", section);
}

export function generateStaticParams() {
  return [{ section: "hair-salon" }];
}

export default async function BeautySectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "hair-salon") return <HairSalonPage />;
  return <GenericSectionIndex majorCategory="beauty" sectionSlug={section} />;
}
