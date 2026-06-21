import { notFound } from "next/navigation";
import NiigataLeisurePage, { metadata } from "@/components/legacy-pages/leisure/spots/niigata/page";

type PageProps = { params: Promise<{ section: string; segment: string }> };

export { metadata };

export function generateStaticParams() {
  return [{ section: "spots", segment: "niigata" }];
}

export default async function LeisureSectionRegionPage({ params }: PageProps) {
  const { section, segment } = await params;
  if (section !== "spots" || segment !== "niigata") notFound();
  return <NiigataLeisurePage />;
}
