import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { categories } from "@/content/categories";
import { ramenArticles } from "@/content/ramen/articles";
import { ramenItems } from "@/content/ramen/items";
import { ramenRankings } from "@/content/ramen/rankings";
import { beautyRegions } from "@/content/beauty/regions";
import { beautySalons as niigataBeautySalons } from "@/content/beauty/niigata/salons";
import { beautyRankings as niigataBeautyRankings } from "@/content/beauty/niigata/rankings";
import { beautyArticles as niigataBeautyArticles } from "@/content/beauty/niigata/articles";
import { beautySalons as yamagataBeautySalons } from "@/content/beauty/yamagata/salons";
import { beautyRankings as yamagataBeautyRankings } from "@/content/beauty/yamagata/rankings";
import { beautyArticles as yamagataBeautyArticles } from "@/content/beauty/yamagata/articles";
import { site } from "@/content/site";
import type { RankingItem, Salon, SearchResult } from "@/lib/types";

const beautyRegistry: Record<string, { salons: Salon[]; rankings: ReturnType<typeof niigataBeautyRankings.slice>; articles: ReturnType<typeof niigataBeautyArticles.slice> }> = {
  niigata:  { salons: niigataBeautySalons,  rankings: niigataBeautyRankings,  articles: niigataBeautyArticles },
  yamagata: { salons: yamagataBeautySalons, rankings: yamagataBeautyRankings, articles: yamagataBeautyArticles },
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

  return [...categoryResults, ...articleResults, ...rankingResults, ...itemResults];
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

export function getRamenItems() {
  return ramenItems;
}

export function getRamenItem(slug: string) {
  return ramenItems.find((item) => item.slug === slug);
}

export function getRamenRankings() {
  return ramenRankings;
}

export function getRamenRanking(slug: string) {
  return ramenRankings.find((ranking) => ranking.slug === slug);
}

export function getRankingEntries(slug: string) {
  const ranking = getRamenRanking(slug);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, item: getRamenItem(entry.itemSlug) }))
    .filter((value): value is { entry: NonNullable<typeof value.entry>; item: NonNullable<typeof value.item> } => Boolean(value.item));
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
