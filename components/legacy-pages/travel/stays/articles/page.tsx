import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

const config = { majorCategory: "travel", sectionSlug: "stays", majorLabel: "旅行", sectionLabel: "宿・温泉", sectionHref: routes.travelStays };

export const metadata = pageMetadata({
  title: "宿・温泉の記事一覧",
  description: "宿泊施設や温泉旅館に関するガイド記事、調査記事、比較記事をまとめています。",
  path: routes.sectionArticles("travel", "stays"),
});

export default function StayArticlesPage() {
  return <SectionArticlesIndex config={config} />;
}
