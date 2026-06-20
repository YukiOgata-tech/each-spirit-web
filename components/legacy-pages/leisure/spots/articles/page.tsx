import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

const config = { majorCategory: "leisure", sectionSlug: "spots", majorLabel: "レジャー", sectionLabel: "スポット", sectionHref: routes.leisureSpots };

export const metadata = pageMetadata({
  title: "レジャースポットの記事一覧",
  description: "レジャースポットに関するガイド記事、調査記事、比較記事をまとめています。",
  path: routes.sectionArticles("leisure", "spots"),
});

export default function LeisureSpotArticlesPage() {
  return <SectionArticlesIndex config={config} />;
}
