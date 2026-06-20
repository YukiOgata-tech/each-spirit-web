import RamenIndexPage from "@/components/legacy-pages/food/ramen/page";
import CafeIndexPage from "@/components/legacy-pages/food/cafe/page";
import { GenericSectionIndex, genericSectionMetadata } from "@/components/generic/GenericSectionPages";

type PageProps = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  if (section === "ramen" || section === "cafe") return {};
  return genericSectionMetadata("food", section);
}

export function generateStaticParams() {
  return [{ section: "ramen" }, { section: "cafe" }];
}

export default async function FoodSectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "ramen") return <RamenIndexPage />;
  if (section === "cafe") return <CafeIndexPage />;
  return <GenericSectionIndex majorCategory="food" sectionSlug={section} />;
}
