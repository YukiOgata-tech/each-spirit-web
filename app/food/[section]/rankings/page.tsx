import { notFound } from "next/navigation";
import { SectionRankingsIndex } from "@/components/articles/SectionRankingRoutes";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string }> };

const configs = {
  ramen: { majorCategory: "food", sectionSlug: "ramen", majorLabel: "グルメ", sectionLabel: "ラーメン", sectionHref: routes.foodRamen },
  cafe: { majorCategory: "food", sectionSlug: "cafe", majorLabel: "グルメ", sectionLabel: "カフェ", sectionHref: routes.foodCafe },
};

export function generateStaticParams() {
  return Object.keys(configs).map((section) => ({ section }));
}

export default async function FoodSectionRankingsPage({ params }: PageProps) {
  const { section } = await params;
  const config = configs[section as keyof typeof configs];
  if (!config) notFound();
  return <SectionRankingsIndex config={config} />;
}
