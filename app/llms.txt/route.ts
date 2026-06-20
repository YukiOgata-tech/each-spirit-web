import { getCategories, getLeisureRankings, getLeisureRegions, getLeisureSpots, getRamenArticles, getRamenItems, getRamenRankings } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/routes";

export async function GET() {
  const leisureRegions = await getLeisureRegions();
  const [ramenArticles, ramenRankings, ramenItems, ...leisurePairs] = await Promise.all([
    getRamenArticles(),
    getRamenRankings(),
    getRamenItems(),
    ...leisureRegions.map(async (region) => ({
      region,
      rankings: await getLeisureRankings(region),
      spots: await getLeisureSpots(region),
    })),
  ]);

  const lines = [
    "# Each Spirit",
    "",
    "Each Spirit is a Japanese information media site focused on recommendations, rankings, comparisons, and local guides.",
    "",
    "## Core pages",
    "- Home: " + absoluteUrl(routes.home),
    "- About: " + absoluteUrl(routes.about),
    "- Contact: " + absoluteUrl(routes.contact),
    "",
    "## Categories",
    ...getCategories().map((category) => "- " + category.name + ": " + absoluteUrl(category.href)),
    "",
    "## Ramen articles",
    ...ramenArticles.map((article) => "- " + article.title + ": " + absoluteUrl(routes.ramenArticle(article.slug))),
    "",
    "## Ramen rankings",
    ...ramenRankings.map((ranking) => "- " + ranking.title + ": " + absoluteUrl(routes.ramenRanking(ranking.slug))),
    "",
    "## Ramen items",
    ...ramenItems.map((item) => "- " + item.name + ": " + absoluteUrl(routes.ramenItem(item.slug))),
    "",
    "## Leisure regions",
    ...leisureRegions.map((region) => "- " + region + ": " + absoluteUrl(routes.leisureRegion(region))),
    "",
    "## Leisure rankings",
    ...(leisurePairs as Array<{ region: string; rankings: Awaited<ReturnType<typeof getLeisureRankings>>; spots: Awaited<ReturnType<typeof getLeisureSpots>> }>).flatMap(({ region, rankings }) =>
      rankings.map((ranking) => "- " + ranking.title + ": " + absoluteUrl(routes.leisureRanking(region, ranking.slug)))
    ),
    "",
    "## Leisure spots",
    ...(leisurePairs as Array<{ region: string; rankings: Awaited<ReturnType<typeof getLeisureRankings>>; spots: Awaited<ReturnType<typeof getLeisureSpots>> }>).flatMap(({ region, spots }) =>
      spots.map((spot) => "- " + spot.name + ": " + absoluteUrl(routes.leisureSpot(region, spot.slug)))
    ),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
