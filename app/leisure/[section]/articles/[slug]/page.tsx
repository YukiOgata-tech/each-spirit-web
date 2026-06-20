import { notFound } from "next/navigation";
import { SectionArticleDetail } from "@/components/articles/SectionArticleRoutes";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string; slug: string }> };
const config = { majorCategory: "leisure", sectionSlug: "spots", majorLabel: "レジャー", sectionLabel: "スポット", sectionHref: routes.leisureSpots };

export default async function LeisureSectionArticlePage({ params }: PageProps) {
  const { section, slug } = await params;
  if (section !== "spots") notFound();
  return <SectionArticleDetail config={config} slug={slug} />;
}
