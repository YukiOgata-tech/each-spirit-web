import type { MetadataRoute } from "next";
import { getCafeItemsByRegion, getCafeRankingsByRegion, getCafeRegions, getLeisureRankings, getLeisureRegions, getLeisureSpots, getRamenArticles, getRamenItems, getRamenRankings, getRamenRegions, getTravelHotels, getTravelRankings, getTravelRegions } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const leisureRegions = getLeisureRegions();
  const travelRegions = getTravelRegions().filter((r) => r.status === "live");
  const cafeRegions = getCafeRegions().filter((r) => r.status === "live");
  const staticRoutes = [routes.home, routes.about, routes.contact, routes.privacy, routes.disclaimer, routes.ramen, routes.leisure, routes.travel, routes.cafe];
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), lastModified: new Date("2026-06-01") })),
    ...getRamenRegions().map((region) => ({ url: absoluteUrl(routes.ramenRegion(region.slug)), lastModified: new Date("2026-06-08") })),
    ...getRamenArticles().map((article) => ({ url: absoluteUrl(routes.ramenArticle(article.slug)), lastModified: new Date(article.updatedAt) })),
    ...getRamenRankings().map((ranking) => ({ url: absoluteUrl(routes.ramenRanking(ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) })),
    ...getRamenItems().map((item) => ({ url: absoluteUrl(routes.ramenItem(item.slug)), lastModified: new Date(item.lastVerifiedAt) })),
    ...leisureRegions.map((region) => ({ url: absoluteUrl(routes.leisureRegion(region)), lastModified: new Date("2026-06-08") })),
    ...leisureRegions.flatMap((region) => getLeisureRankings(region).map((ranking) => ({ url: absoluteUrl(routes.leisureRanking(region, ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) }))),
    ...leisureRegions.flatMap((region) => getLeisureSpots(region).map((spot) => ({ url: absoluteUrl(routes.leisureSpot(region, spot.slug)), lastModified: new Date(spot.lastVerifiedAt) }))),
    ...travelRegions.map((region) => ({ url: absoluteUrl(routes.travelRegion(region.slug)), lastModified: new Date("2026-06-08") })),
    ...travelRegions.flatMap((region) => getTravelRankings(region.slug).map((ranking) => ({ url: absoluteUrl(routes.travelRanking(region.slug, ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) }))),
    ...travelRegions.flatMap((region) => getTravelHotels(region.slug).map((hotel) => ({ url: absoluteUrl(routes.travelHotel(region.slug, hotel.slug)), lastModified: new Date(hotel.lastVerifiedAt) }))),
    ...cafeRegions.map((region) => ({ url: absoluteUrl(routes.cafeRegion(region.slug)), lastModified: new Date("2026-06-09") })),
    ...cafeRegions.flatMap((region) => getCafeRankingsByRegion(region.slug).map((ranking) => ({ url: absoluteUrl(routes.cafeRanking(region.slug, ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) }))),
    ...cafeRegions.flatMap((region) => getCafeItemsByRegion(region.slug).map((cafe) => ({ url: absoluteUrl(routes.cafeItem(region.slug, cafe.slug)), lastModified: new Date(cafe.lastVerifiedAt) }))),
  ];
}
