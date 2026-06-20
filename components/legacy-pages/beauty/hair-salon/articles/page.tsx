import { SectionArticlesIndex } from "@/components/articles/SectionArticleRoutes";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

const config = { majorCategory: "beauty", sectionSlug: "hair-salon", majorLabel: "美容", sectionLabel: "美容室", sectionHref: routes.beautyHairSalon };

export const metadata = pageMetadata({
  title: "美容室の記事一覧",
  description: "美容室に関するガイド記事、調査記事、比較記事をまとめています。",
  path: routes.sectionArticles("beauty", "hair-salon"),
});

export default function HairSalonArticlesPage() {
  return <SectionArticlesIndex config={config} />;
}
