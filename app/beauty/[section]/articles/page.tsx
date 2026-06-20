import { notFound } from "next/navigation";
import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ section: string }> };
const config = { majorCategory: "beauty", sectionSlug: "hair-salon", majorLabel: "美容", sectionLabel: "美容室", sectionHref: routes.beautyHairSalon };

export function generateStaticParams() {
  return [{ section: "hair-salon" }];
}

export default async function BeautySectionArticlesPage({ params }: PageProps) {
  const { section } = await params;
  if (section !== "hair-salon") notFound();
  return <SectionArticlesIndex config={config} />;
}
