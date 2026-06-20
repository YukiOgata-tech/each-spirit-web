import { notFound } from "next/navigation";
import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string }> };
const config = { majorCategory: "leisure", sectionSlug: "spots", majorLabel: "レジャー", sectionLabel: "スポット", sectionHref: routes.leisureSpots };

export function generateStaticParams() {
  return [{ section: "spots" }];
}

export default async function LeisureSectionArticlesPage({ params }: PageProps) {
  const { section } = await params;
  if (section !== "spots") notFound();
  return <SectionArticlesIndex config={config} />;
}
