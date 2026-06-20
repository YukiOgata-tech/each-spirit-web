import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

const config = { majorCategory: "food", sectionSlug: "ramen", majorLabel: "グルメ", sectionLabel: "ラーメン", sectionHref: routes.foodRamen };

export const metadata = pageMetadata({
  title: "ラーメンの記事一覧",
  description: "ラーメンに関するガイド記事、調査記事、比較記事をまとめています。",
  path: routes.sectionArticles("food", "ramen"),
});

export default function RamenArticlesPage() {
  return <SectionArticlesIndex config={config} />;
}
