import type { MetadataRoute } from "next";
import { getLeisureRankings, getLeisureRegions, getLeisureSpots, getRamenArticles, getRamenItems, getRamenRankings, getRamenRegions } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const leisureRegions = getLeisureRegions();
  const ramenRegions = getRamenRegions();
  const staticRoutes = [routes.home, routes.about, routes.contact, routes.privacy, routes.disclaimer, routes.ramen, routes.leisure];
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), lastModified: new Date("2026-06-01") })),
    ...ramenRegions.filter((r) => r !== "niigata").map((region) => ({ url: absoluteUrl(routes.ramenRegion(region)), lastModified: new Date("2026-06-08") })),
    ...getRamenArticles().map((article) => ({ url: absoluteUrl(routes.ramenArticle(article.slug)), lastModified: new Date(article.updatedAt) })),
    ...getRamenRankings().map((ranking) => ({ url: absoluteUrl(routes.ramenRanking(ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) })),
    ...getRamenItems().map((item) => ({ url: absoluteUrl(routes.ramenItem(item.slug)), lastModified: new Date(item.lastVerifiedAt) })),
    ...leisureRegions.map((region) => ({ url: absoluteUrl(routes.leisureRegion(region)), lastModified: new Date("2026-06-08") })),
    ...leisureRegions.flatMap((region) => getLeisureRankings(region).map((ranking) => ({ url: absoluteUrl(routes.leisureRanking(region, ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) }))),
    ...leisureRegions.flatMap((region) => getLeisureSpots(region).map((spot) => ({ url: absoluteUrl(routes.leisureSpot(region, spot.slug)), lastModified: new Date(spot.lastVerifiedAt) }))),
  ];
}
