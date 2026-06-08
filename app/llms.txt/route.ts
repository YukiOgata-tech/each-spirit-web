import { getCategories, getLeisureRankings, getLeisureRegions, getLeisureSpots, getRamenArticles, getRamenItems, getRamenRankings } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/routes";

export function GET() {
  const leisureRegions = getLeisureRegions();
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
    ...getRamenArticles().map((article) => "- " + article.title + ": " + absoluteUrl(routes.ramenArticle(article.slug))),
    "",
    "## Ramen rankings",
    ...getRamenRankings().map((ranking) => "- " + ranking.title + ": " + absoluteUrl(routes.ramenRanking(ranking.slug))),
    "",
    "## Ramen items",
    ...getRamenItems().map((item) => "- " + item.name + ": " + absoluteUrl(routes.ramenItem(item.slug))),
    "",
    "## Leisure regions",
    ...leisureRegions.map((region) => "- " + region + ": " + absoluteUrl(routes.leisureRegion(region))),
    "",
    "## Leisure rankings",
    ...leisureRegions.flatMap((region) => getLeisureRankings(region).map((ranking) => "- " + ranking.title + ": " + absoluteUrl(routes.leisureRanking(region, ranking.slug)))),
    "",
    "## Leisure spots",
    ...leisureRegions.flatMap((region) => getLeisureSpots(region).map((spot) => "- " + spot.name + ": " + absoluteUrl(routes.leisureSpot(region, spot.slug)))),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
