import type { MetadataRoute } from "next";

export const revalidate = 3600;
import { getCafeItemsByRegion, getCafeRankingsByRegion, getCafeRegions, getLeisureRankings, getLeisureRegions, getLeisureSpots, getRamenArticles, getRamenItems, getRamenRankings, getRamenRegions, getTravelHotels, getTravelRankings, getTravelRegions } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const leisureRegions = getLeisureRegions();
  const travelRegions = getTravelRegions().filter((r) => r.status === "live");
  const cafeRegions = getCafeRegions().filter((r) => r.status === "live");

  const [ramenArticles, ramenRankings, ramenItems] = await Promise.all([
    getRamenArticles(),
    getRamenRankings(),
    getRamenItems(),
  ]);

  const leisurePairs = await Promise.all(
    leisureRegions.map(async (region) => ({
      region,
      rankings: await getLeisureRankings(region),
      spots: await getLeisureSpots(region),
    }))
  );

  const travelPairs = await Promise.all(
    travelRegions.map(async (r) => ({
      region: r.slug,
      rankings: await getTravelRankings(r.slug),
      hotels: await getTravelHotels(r.slug),
    }))
  );

  const cafePairs = await Promise.all(
    cafeRegions.map(async (r) => ({
      region: r.slug,
      rankings: await getCafeRankingsByRegion(r.slug),
      items: await getCafeItemsByRegion(r.slug),
    }))
  );

  const staticRoutes = [routes.home, routes.about, routes.contact, routes.privacy, routes.disclaimer, routes.ramen, routes.leisure, routes.travel, routes.cafe];

  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), lastModified: new Date("2026-06-01") })),
    ...getRamenRegions().map((region) => ({ url: absoluteUrl(routes.ramenRegion(region.slug)), lastModified: new Date("2026-06-08") })),
    ...ramenArticles.map((article) => ({ url: absoluteUrl(routes.ramenArticle(article.slug)), lastModified: new Date(article.updatedAt) })),
    ...ramenRankings.map((ranking) => ({ url: absoluteUrl(routes.ramenRanking(ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) })),
    ...ramenItems.map((item) => ({ url: absoluteUrl(routes.ramenItem(item.slug)), lastModified: new Date(item.lastVerifiedAt) })),
    ...leisurePairs.map(({ region }) => ({ url: absoluteUrl(routes.leisureRegion(region)), lastModified: new Date("2026-06-08") })),
    ...leisurePairs.flatMap(({ region, rankings }) => rankings.map((r) => ({ url: absoluteUrl(routes.leisureRanking(region, r.slug)), lastModified: new Date(r.lastUpdatedAt) }))),
    ...leisurePairs.flatMap(({ region, spots }) => spots.map((s) => ({ url: absoluteUrl(routes.leisureSpot(region, s.slug)), lastModified: new Date(s.lastVerifiedAt) }))),
    ...travelPairs.map(({ region }) => ({ url: absoluteUrl(routes.travelRegion(region)), lastModified: new Date("2026-06-08") })),
    ...travelPairs.flatMap(({ region, rankings }) => rankings.map((r) => ({ url: absoluteUrl(routes.travelRanking(region, r.slug)), lastModified: new Date(r.lastUpdatedAt) }))),
    ...travelPairs.flatMap(({ region, hotels }) => hotels.map((h) => ({ url: absoluteUrl(routes.travelHotel(region, h.slug)), lastModified: new Date(h.lastVerifiedAt) }))),
    ...cafePairs.map(({ region }) => ({ url: absoluteUrl(routes.cafeRegion(region)), lastModified: new Date("2026-06-09") })),
    ...cafePairs.flatMap(({ region, rankings }) => rankings.map((r) => ({ url: absoluteUrl(routes.cafeRanking(region, r.slug)), lastModified: new Date(r.lastUpdatedAt) }))),
    ...cafePairs.flatMap(({ region, items }) => items.map((c) => ({ url: absoluteUrl(routes.cafeItem(region, c.slug)), lastModified: new Date(c.lastVerifiedAt) }))),
  ];
}
