import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { notFound } from "next/navigation";

const config = { majorCategory: "health", sectionSlug: "protein", majorLabel: "健康", sectionLabel: "プロテイン", sectionHref: routes.healthProtein };
type PageProps = { params: Promise<{ section: string }> };

export const metadata = pageMetadata({
  title: "プロテインの記事一覧",
  description: "プロテインに関するガイド記事、調査記事、比較記事をまとめています。",
  path: routes.sectionArticles("health", "protein"),
});

export function generateStaticParams() {
  return [{ section: "protein" }];
}

export default async function ProteinArticlesPage({ params }: PageProps) {
  const { section } = await params;
  if (section !== "protein") notFound();
  return <SectionArticlesIndex config={config} />;
}
