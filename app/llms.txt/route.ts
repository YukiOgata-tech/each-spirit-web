import { getCategories, getRamenArticles, getRamenItems, getRamenRankings } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/routes";

export function GET() {
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
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
