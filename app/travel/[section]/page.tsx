import { notFound } from "next/navigation";
import TravelStaysPage from "@/components/legacy-pages/travel/stays/page";
import TravelServicesPage from "@/components/legacy-pages/travel/services/page";

type PageProps = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return [{ section: "stays" }, { section: "services" }];
}

export default async function TravelSectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "stays") return <TravelStaysPage />;
  if (section === "services") return <TravelServicesPage />;
  notFound();
}
