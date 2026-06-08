import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { categories } from "@/content/categories";
import { ramenArticles } from "@/content/ramen/articles";
import { ramenItems } from "@/content/ramen/items";
import { ramenRankings } from "@/content/ramen/rankings";
import { yamagataRamenItems } from "@/content/ramen/yamagata/items";
import { yamagataRamenRankings } from "@/content/ramen/yamagata/rankings";
import { proteinTargets } from "@/content/protein/targets";
import { proteinProducts } from "@/content/protein/products";
import { proteinRankings } from "@/content/protein/rankings";
import { niigataLeisureSpots } from "@/content/leisure/niigata/spots";
import { niigataLeisureRankings } from "@/content/leisure/niigata/rankings";
import { beautyRegions } from "@/content/beauty/regions";
import { ramenRegions } from "@/content/ramen/regions";
import { beautySalons as niigataBeautySalons } from "@/content/beauty/niigata/salons";
import { beautyRankings as niigataBeautyRankings } from "@/content/beauty/niigata/rankings";
import { beautyArticles as niigataBeautyArticles } from "@/content/beauty/niigata/articles";
import { beautySalons as yamagataBeautySalons } from "@/content/beauty/yamagata/salons";
import { beautyRankings as yamagataBeautyRankings } from "@/content/beauty/yamagata/rankings";
import { beautyArticles as yamagataBeautyArticles } from "@/content/beauty/yamagata/articles";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import type { Item, LeisureRanking, LeisureSpot, ProteinProduct, ProteinRankingEntry, ProteinTarget, Ranking, RankingItem, Salon, SearchResult } from "@/lib/types";

const ramenRegistry: Record<string, { items: Item[]; rankings: Ranking[] }> = {
  niigata: { items: ramenItems, rankings: ramenRankings },
  yamagata: { items: yamagataRamenItems, rankings: yamagataRamenRankings },
};

const beautyRegistry: Record<string, { salons: Salon[]; rankings: ReturnType<typeof niigataBeautyRankings.slice>; articles: ReturnType<typeof niigataBeautyArticles.slice> }> = {
  niigata:  { salons: niigataBeautySalons,  rankings: niigataBeautyRankings,  articles: niigataBeautyArticles },
  yamagata: { salons: yamagataBeautySalons, rankings: yamagataBeautyRankings, articles: yamagataBeautyArticles },
};

const leisureRegistry: Record<string, { spots: LeisureSpot[]; rankings: LeisureRanking[] }> = {
  niigata: { spots: niigataLeisureSpots, rankings: niigataLeisureRankings },
};

export function getSite() {
  return site;
}

export function getCategories() {
  return categories;
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getLatestArticles(limit?: number) {
  const sorted = [...ramenArticles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function getPopularRankings(limit?: number) {
  return typeof limit === "number" ? ramenRankings.slice(0, limit) : ramenRankings;
}

export function getSearchResults(): SearchResult[] {
  const categoryResults: SearchResult[] = categories.map((category) => ({
    id: "category-" + category.slug,
    type: "category",
    title: category.name,
    description: category.description,
    category: category.name,
    href: category.href,
    tags: [...category.searchFacets, ...category.contentTypes, category.status === "live" ? "公開中" : "準備中"],
  }));

  const articleResults: SearchResult[] = ramenArticles.map((article) => ({
    id: "article-" + article.slug,
    type: "article",
    title: article.title,
    description: article.description,
    category: article.category,
    href: "/ramen/articles/" + article.slug,
    tags: article.tags,
    updatedAt: article.updatedAt,
  }));

  const rankingResults: SearchResult[] = ramenRankings.map((ranking) => ({
    id: "ranking-" + ranking.slug,
    type: "ranking",
    title: ranking.title,
    description: ranking.description,
    category: "ラーメン",
    href: "/ramen/rankings/" + ranking.slug,
    tags: ranking.criteria,
    updatedAt: ranking.lastUpdatedAt,
  }));

  const itemResults: SearchResult[] = ramenItems.map((item) => ({
    id: "item-" + item.slug,
    type: "item",
    title: item.name,
    description: item.description,
    category: "ラーメン",
    href: "/ramen/items/" + item.slug,
    tags: [item.area, item.genre, ...item.tags, item.parking ? "駐車場あり" : "駐車場要確認"],
    updatedAt: item.lastVerifiedAt,
  }));

  const leisureRankingResults: SearchResult[] = Object.entries(leisureRegistry).flatMap(([region, registry]) =>
    registry.rankings.map((ranking) => ({
      id: "leisure-ranking-" + region + "-" + ranking.slug,
      type: "ranking",
      title: ranking.title,
      description: ranking.description,
      category: "レジャー",
      href: routes.leisureRanking(region, ranking.slug),
      tags: ranking.criteria,
      updatedAt: ranking.lastUpdatedAt,
    })),
  );

  const leisureSpotResults: SearchResult[] = Object.entries(leisureRegistry).flatMap(([region, registry]) =>
    registry.spots.map((spot) => ({
      id: "leisure-spot-" + region + "-" + spot.slug,
      type: "item",
      title: spot.name,
      description: spot.description,
      category: "レジャー",
      href: routes.leisureSpot(region, spot.slug),
      tags: [spot.area, spot.genre, ...spot.tags, spot.parking ? "駐車場あり" : "駐車場要確認"],
      updatedAt: spot.lastVerifiedAt,
    })),
  );

  return [...categoryResults, ...articleResults, ...rankingResults, ...itemResults, ...leisureRankingResults, ...leisureSpotResults];
}

export function getRamenArticles() {
  return ramenArticles;
}

export function getRamenArticle(slug: string) {
  return ramenArticles.find((article) => article.slug === slug);
}

export function getArticleMarkdown(articleSlug: string) {
  const article = getRamenArticle(articleSlug);
  if (!article) return "";
  return readFileSync(join(process.cwd(), "content", "ramen", "articles", article.markdownFile), "utf8");
}

export function getRamenRegions() {
  return ramenRegions;
}

export function getRamenRegion(slug: string) {
  return ramenRegions.find((r) => r.slug === slug);
}

export function getRamenItems() {
  return Object.values(ramenRegistry).flatMap((r) => r.items);
}

export function getRamenItemsByRegion(region: string): Item[] {
  return ramenRegistry[region]?.items ?? [];
}

export function getRamenItem(slug: string) {
  return getRamenItems().find((item) => item.slug === slug);
}

export function getRamenRankings() {
  return Object.values(ramenRegistry).flatMap((r) => r.rankings);
}

export function getRamenRankingsByRegion(region: string): Ranking[] {
  return ramenRegistry[region]?.rankings ?? [];
}

export function getRamenRanking(slug: string) {
  return getRamenRankings().find((ranking) => ranking.slug === slug);
}

export function getRankingEntries(slug: string) {
  const ranking = getRamenRanking(slug);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, item: getRamenItem(entry.itemSlug) }))
    .filter((value): value is { entry: NonNullable<typeof value.entry>; item: NonNullable<typeof value.item> } => Boolean(value.item));
}

export function getLeisureRegions() {
  return Object.keys(leisureRegistry);
}

export function getLeisureSpots(region: string) {
  return leisureRegistry[region]?.spots ?? [];
}

export function getLeisureSpot(region: string, slug: string) {
  return getLeisureSpots(region).find((spot) => spot.slug === slug);
}

export function getLeisureRankings(region: string) {
  return leisureRegistry[region]?.rankings ?? [];
}

export function getLeisureRanking(region: string, slug: string) {
  return getLeisureRankings(region).find((ranking) => ranking.slug === slug);
}

export function getLeisureRankingEntries(region: string, slug: string) {
  const ranking = getLeisureRanking(region, slug);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, spot: getLeisureSpot(region, entry.itemSlug) }))
    .filter((value): value is { entry: RankingItem; spot: LeisureSpot } => Boolean(value.spot));
}

export function getBeautyRegions() {
  return beautyRegions;
}

export function getBeautyRegion(slug: string) {
  return beautyRegions.find((r) => r.slug === slug);
}

export function getBeautySalons(region: string): Salon[] {
  return beautyRegistry[region]?.salons ?? [];
}

export function getBeautySalon(region: string, slug: string) {
  return getBeautySalons(region).find((salon) => salon.slug === slug);
}

export function getBeautyRankings(region: string) {
  return beautyRegistry[region]?.rankings ?? [];
}

export function getBeautyRanking(region: string, slug: string) {
  return getBeautyRankings(region).find((ranking) => ranking.slug === slug);
}

export function getBeautyRankingEntries(region: string, slug: string) {
  const ranking = getBeautyRanking(region, slug);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, salon: getBeautySalon(region, entry.itemSlug) }))
    .filter((value): value is { entry: RankingItem; salon: Salon } => Boolean(value.salon));
}

export function getProteinTargets() {
  return proteinTargets;
}

export function getProteinTarget(slug: ProteinTarget) {
  return proteinTargets.find((t) => t.slug === slug);
}

export function getProteinProducts() {
  return proteinProducts;
}

export function getProteinProduct(slug: string) {
  return proteinProducts.find((p) => p.slug === slug);
}

export function getProteinProductsByTarget(target: ProteinTarget) {
  return proteinProducts.filter((p) => p.targets.includes(target));
}

export function getProteinRankings() {
  return proteinRankings;
}

export function getProteinRankingsByTarget(target: ProteinTarget) {
  return proteinRankings.filter((r) => r.target === target);
}

export function getProteinRanking(slug: string) {
  return proteinRankings.find((r) => r.slug === slug);
}

export function getProteinRankingEntries(slug: string) {
  const ranking = getProteinRanking(slug);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, product: getProteinProduct(entry.productSlug) }))
    .filter((value): value is { entry: ProteinRankingEntry; product: ProteinProduct } => Boolean(value.product));
}

export function getBeautyArticles(region: string) {
  return beautyRegistry[region]?.articles ?? [];
}

export function getBeautyArticle(region: string, slug: string) {
  return getBeautyArticles(region).find((article) => article.slug === slug);
}

export function getBeautyArticleMarkdown(region: string, slug: string) {
  const article = getBeautyArticle(region, slug);
  if (!article) return "";
  return readFileSync(join(process.cwd(), "content", "beauty", region, "articles", article.markdownFile), "utf8");
}
