import { notFound } from "next/navigation";
import BeautyRegionPage from "@/components/legacy-pages/beauty/hair-salon/[region]/page";
import { getBeautyRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; region: string }> };

export function generateStaticParams() {
  return getBeautyRegions().map((region) => ({ section: "hair-salon", region: region.slug }));
}

export default async function BeautySectionRegionPage({ params }: PageProps) {
  const { section, region } = await params;
  if (section !== "hair-salon") notFound();
  return <BeautyRegionPage params={Promise.resolve({ region })} />;
}
