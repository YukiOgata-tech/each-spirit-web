import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

const config = { majorCategory: "food", sectionSlug: "cafe", majorLabel: "グルメ", sectionLabel: "カフェ", sectionHref: routes.foodCafe };

export const metadata = pageMetadata({
  title: "カフェの記事一覧",
  description: "カフェに関するガイド記事、調査記事、比較記事をまとめています。",
  path: routes.sectionArticles("food", "cafe"),
});

export default function CafeArticlesPage() {
  return <SectionArticlesIndex config={config} />;
}
