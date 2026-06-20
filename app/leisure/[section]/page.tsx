import { notFound } from "next/navigation";
import LeisureSpotsPage from "@/components/legacy-pages/leisure/spots/page";

type PageProps = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return [{ section: "spots" }];
}

export default async function LeisureSectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section !== "spots") notFound();
  return <LeisureSpotsPage />;
}
