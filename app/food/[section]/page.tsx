import { notFound } from "next/navigation";
import RamenIndexPage from "@/components/legacy-pages/food/ramen/page";
import CafeIndexPage from "@/components/legacy-pages/food/cafe/page";

type PageProps = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return [{ section: "ramen" }, { section: "cafe" }];
}

export default async function FoodSectionPage({ params }: PageProps) {
  const { section } = await params;
  if (section === "ramen") return <RamenIndexPage />;
  if (section === "cafe") return <CafeIndexPage />;
  notFound();
}
