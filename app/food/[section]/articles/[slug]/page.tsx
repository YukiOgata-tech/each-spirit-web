import { notFound } from "next/navigation";
import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };

const configs = {
  ramen: { majorCategory: "food", sectionSlug: "ramen", majorLabel: "グルメ", sectionLabel: "ラーメン", sectionHref: routes.foodRamen },
  cafe: { majorCategory: "food", sectionSlug: "cafe", majorLabel: "グルメ", sectionLabel: "カフェ", sectionHref: routes.foodCafe },
};

export default async function FoodSectionArticlePage({ params }: PageProps) {
  const { section, slug } = await params;
  const config = configs[section as keyof typeof configs];
  if (!config) notFound();
  return <SectionArticleDetail config={config} slug={slug} />;
}
