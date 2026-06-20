import type { MetadataRoute } from "next";

export const revalidate = 2592000;
import { articleHref, getBeautyRankings, getBeautyRegions, getBeautySalons, getCafeItemsByRegion, getCafeRankingsByRegion, getCafeRegions, getContentSections, getLatestArticles, getLeisureRankings, getLeisureRegions, getLeisureSpots, getProteinProducts, getProteinRankings, getProteinTargets, getRamenItems, getRamenRankings, getRamenRegions, getTravelAgencies, getTravelHotels, getTravelRankings, getTravelRegions, getTravelServiceRankings, getTravelServiceRegions } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [leisureRegions, travelRegionsAll, travelServiceRegionsAll, cafeRegionsAll, beautyRegionsAll, proteinTargetsAll, sections] = await Promise.all([
    getLeisureRegions(),
    getTravelRegions(),
    getTravelServiceRegions(),
    getCafeRegions(),
    getBeautyRegions(),
    getProteinTargets(),
    getContentSections(),
  ]);
  const travelRegions = travelRegionsAll.filter((r) => r.status === "live");
  const travelServiceRegions = travelServiceRegionsAll.filter((r) => r.status === "live");
  const cafeRegions = cafeRegionsAll.filter((r) => r.status === "live");
  const beautyRegions = beautyRegionsAll.filter((r) => r.status === "live");
  const proteinTargets = proteinTargetsAll.filter((t) => t.status === "live");

  const [articles, ramenRankings, ramenItems] = await Promise.all([
    getLatestArticles(),
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

  const travelServicePairs = await Promise.all(
    travelServiceRegions.map(async (r) => ({
      region: r.slug,
      rankings: await getTravelServiceRankings(r.slug),
      agencies: await getTravelAgencies(r.slug),
    }))
  );

  const cafePairs = await Promise.all(
    cafeRegions.map(async (r) => ({
      region: r.slug,
      rankings: await getCafeRankingsByRegion(r.slug),
      items: await getCafeItemsByRegion(r.slug),
    }))
  );

  const beautyPairs = await Promise.all(
    beautyRegions.map(async (r) => ({
      region: r.slug,
      salons: await getBeautySalons(r.slug),
      rankings: await getBeautyRankings(r.slug),
    }))
  );

  const [proteinProducts, proteinRankings] = await Promise.all([
    getProteinProducts(),
    getProteinRankings(),
  ]);

  const staticRoutes = [routes.home, routes.search, routes.about, routes.contact, routes.privacy, routes.disclaimer, routes.ramen, routes.leisure, routes.travel, routes.travelServices, routes.travelApps, routes.cafe, routes.beauty, routes.protein];

  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), lastModified: new Date("2026-06-01") })),
    ...sections.flatMap((section) => [
      { url: absoluteUrl(routes.sectionArticles(section.majorCategory, section.sectionSlug)), lastModified: new Date("2026-06-19") },
      { url: absoluteUrl(routes.sectionRankings(section.majorCategory, section.sectionSlug)), lastModified: new Date("2026-06-20") },
    ]),
    { url: absoluteUrl(routes.articles), lastModified: new Date("2026-06-19") },
    ...(await getRamenRegions()).map((region) => ({ url: absoluteUrl(routes.ramenRegion(region.slug)), lastModified: new Date("2026-06-08") })),
    ...articles.map((article) => ({ url: absoluteUrl(articleHref(article)), lastModified: new Date(article.updatedAt) })),
    ...ramenRankings.map((ranking) => ({ url: absoluteUrl(routes.ramenRanking(ranking.slug)), lastModified: new Date(ranking.lastUpdatedAt) })),
    ...ramenItems.map((item) => ({ url: absoluteUrl(routes.ramenItem(item.slug)), lastModified: new Date(item.lastVerifiedAt) })),
    ...leisurePairs.map(({ region }) => ({ url: absoluteUrl(routes.leisureRegion(region)), lastModified: new Date("2026-06-08") })),
    ...leisurePairs.flatMap(({ region, rankings }) => rankings.map((r) => ({ url: absoluteUrl(routes.leisureRanking(region, r.slug)), lastModified: new Date(r.lastUpdatedAt) }))),
    ...leisurePairs.flatMap(({ region, spots }) => spots.map((s) => ({ url: absoluteUrl(routes.leisureSpot(region, s.slug)), lastModified: new Date(s.lastVerifiedAt) }))),
    ...travelPairs.map(({ region }) => ({ url: absoluteUrl(routes.travelRegion(region)), lastModified: new Date("2026-06-08") })),
    ...travelPairs.flatMap(({ region, rankings }) => rankings.map((r) => ({ url: absoluteUrl(routes.travelRanking(region, r.slug)), lastModified: new Date(r.lastUpdatedAt) }))),
    ...travelPairs.flatMap(({ region, hotels }) => hotels.map((h) => ({ url: absoluteUrl(routes.travelHotel(region, h.slug)), lastModified: new Date(h.lastVerifiedAt) }))),
    ...travelServicePairs.map(({ region }) => ({ url: absoluteUrl(routes.travelServicesRegion(region)), lastModified: new Date("2026-06-14") })),
    ...travelServicePairs.flatMap(({ region, rankings }) => rankings.map((r) => ({ url: absoluteUrl(routes.travelServicesRanking(region, r.slug)), lastModified: new Date(r.lastUpdatedAt) }))),
    ...travelServicePairs.flatMap(({ region, agencies }) => agencies.map((a) => ({ url: absoluteUrl(routes.travelAgency(region, a.slug)), lastModified: new Date(a.lastVerifiedAt) }))),
    ...cafePairs.map(({ region }) => ({ url: absoluteUrl(routes.cafeRegion(region)), lastModified: new Date("2026-06-09") })),
    ...cafePairs.flatMap(({ region, rankings }) => rankings.map((r) => ({ url: absoluteUrl(routes.cafeRanking(region, r.slug)), lastModified: new Date(r.lastUpdatedAt) }))),
    ...cafePairs.flatMap(({ region, items }) => items.map((c) => ({ url: absoluteUrl(routes.cafeItem(region, c.slug)), lastModified: new Date(c.lastVerifiedAt) }))),
    ...beautyPairs.map(({ region }) => ({ url: absoluteUrl(routes.beautyRegion(region)), lastModified: new Date("2026-06-09") })),
    ...beautyPairs.flatMap(({ region, salons }) => salons.map((s) => ({ url: absoluteUrl(routes.beautySalon(region, s.slug)), lastModified: new Date(s.lastVerifiedAt) }))),
    ...beautyPairs.flatMap(({ region, rankings }) => rankings.map((r) => ({ url: absoluteUrl(routes.beautyRanking(region, r.slug)), lastModified: new Date(r.lastUpdatedAt) }))),
    ...proteinTargets.map((t) => ({ url: absoluteUrl(routes.proteinTarget(t.slug)), lastModified: new Date("2026-06-09") })),
    ...proteinProducts.map((p) => ({ url: absoluteUrl(routes.proteinProduct(p.slug)), lastModified: new Date(p.lastVerifiedAt) })),
    ...proteinRankings.map((r) => ({ url: absoluteUrl(routes.proteinRanking(r.target, r.slug)), lastModified: new Date(r.lastUpdatedAt) })),
  ];
}
