import { notFound } from "next/navigation";
import BeautyRegionPage from "@/components/legacy-pages/beauty/hair-salon/[region]/page";
import { getBeautyRegions } from "@/lib/content";

type PageProps = { params: Promise<{ section: string; segment: string }> };

export async function generateStaticParams() {
  return (await getBeautyRegions()).map((region) => ({ section: "hair-salon", segment: region.slug }));
}

export default async function BeautySectionRegionPage({ params }: PageProps) {
  const { section, segment } = await params;
  if (section !== "hair-salon") notFound();
  return <BeautyRegionPage params={Promise.resolve({ region: segment })} />;
}
