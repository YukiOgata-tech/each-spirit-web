import type { MetadataRoute } from "next";
import { getRamenArticles, getRamenItems, getRamenRankings } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [routes.home, routes.about, routes.contact, routes.privacy, routes.disclaimer, routes.ramen];
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), lastModified: new Date("2026-06-01") })),
    ...getRamenArticles().map((article) => ({ url: absoluteUrl(routes.ramenArticle(article.slug)), lastModified: new Date(article.updatedAt) })),
    ...getRamenRankings().map((ranking) => ({ url: absoluteUrl(routes.ramenRanking(ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) })),
    ...getRamenItems().map((item) => ({ url: absoluteUrl(routes.ramenItem(item.slug)), lastModified: new Date(item.lastVerifiedAt) })),
  ];
}
