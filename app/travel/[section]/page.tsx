import TravelStaysPage from "@/components/legacy-pages/travel/stays/page";
import TravelServicesPage from "@/components/legacy-pages/travel/services/page";
import { GenericSectionIndex, genericSectionMetadata } from "@/components/generic/GenericSectionPages";

type PageProps = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  if (section === "stays" || section === "services") return {};
  return genericSectionMetadata("travel", section);
}

export function generateStaticParams() {
  return [{ section: "stays" }, { section: "services" }];
}

export default async function TravelSectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "stays") return <TravelStaysPage />;
  if (section === "services") return <TravelServicesPage />;
  return <GenericSectionIndex majorCategory="travel" sectionSlug={section} />;
}
