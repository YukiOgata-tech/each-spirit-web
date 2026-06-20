import { notFound } from "next/navigation";
import TravelAppsPage from "@/components/legacy-pages/travel/services/apps/page";

type PageProps = { params: Promise<{ section: string }> };

export default async function TravelSectionAppsPage({ params }: PageProps) {
  const { section } = await params;
  if (section !== "services") notFound();
  return <TravelAppsPage />;
}
