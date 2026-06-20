import { notFound } from "next/navigation";
import HairSalonPage from "@/components/legacy-pages/beauty/hair-salon/page";

type PageProps = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return [{ section: "hair-salon" }];
}

export default async function BeautySectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section !== "hair-salon") notFound();
  return <HairSalonPage />;
}
