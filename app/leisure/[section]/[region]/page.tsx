import { notFound } from "next/navigation";
import NiigataLeisurePage, { metadata } from "@/components/legacy-pages/leisure/spots/niigata/page";

type PageProps = { params: Promise<{ section: string; region: string }> };

export { metadata };

export function generateStaticParams() {
  return [{ section: "spots", region: "niigata" }];
}

export default async function LeisureSectionRegionPage({ params }: PageProps) {
  const { section, region } = await params;
  if (section !== "spots" || region !== "niigata") notFound();
  return <NiigataLeisurePage />;
}
