import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

const config = { majorCategory: "travel", sectionSlug: "services", majorLabel: "旅行", sectionLabel: "旅行サービス", sectionHref: routes.travelServices };

export const metadata = pageMetadata({
  title: "旅行サービスの記事一覧",
  description: "旅行会社や旅行アプリに関するガイド記事、調査記事、比較記事をまとめています。",
  path: routes.sectionArticles("travel", "services"),
});

export default function TravelServiceArticlesPage() {
  return <SectionArticlesIndex config={config} />;
}
