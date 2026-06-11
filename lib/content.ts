import "server-only";

import { createServerClient } from "@/lib/supabase-server";
import { categories } from "@/content/categories";
import { ramenRegions } from "@/content/ramen/regions";
import { beautyRegions } from "@/content/beauty/regions";
import { travelRegions } from "@/content/travel/regions";
import { cafeRegions } from "@/content/cafe/regions";
import { proteinTargets } from "@/content/protein/targets";
import { proteinProducts } from "@/content/protein/products";
import { proteinRankings } from "@/content/protein/rankings";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import type {
  Article,
  CafeItem,
  CafeRanking,
  CafeRankingItem,
  CafeRegion,
  Hotel,
  Item,
  LeisureRanking,
  LeisureSpot,
  OfficialLink,
  ProteinProduct,
  ProteinRanking,
  ProteinRankingEntry,
  ProteinTarget,
  Ranking,
  RankingItem,
  Salon,
  SearchResult,
  Source,
  FAQ,
} from "@/lib/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(v: string | null | undefined): string {
  if (!v) return "";
  return v.slice(0, 10);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRamenItem(row: any): Item {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    area: row.area ?? "",
    address: row.address ?? "",
    phone: row.phone ?? undefined,
    imageUrl: row.image_url ?? undefined,
    genre: m.genre ?? "",
    tags: row.tags ?? [],
    recommendedMenu: m.recommended_menu ?? "",
    priceRange: row.price_range ?? "",
    parking: m.parking ?? false,
    parkingNote: m.parking_note ?? undefined,
    businessHours: m.business_hours ?? "",
    closedDays: m.closed_days ?? "",
    officialUrl: row.official_url ?? "",
    mapUrl: row.map_url ?? "",
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCafeItem(row: any): CafeItem {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    area: row.area ?? "",
    address: row.address ?? "",
    phone: row.phone ?? undefined,
    imageUrl: row.image_url ?? undefined,
    style: m.style ?? "スペシャルティコーヒー",
    tags: row.tags ?? [],
    signatureMenu: m.signature_menu ?? "",
    priceRange: row.price_range ?? "",
    wifi: m.wifi ?? false,
    power: m.power ?? false,
    parking: m.parking ?? false,
    parkingNote: m.parking_note ?? undefined,
    petFriendly: m.pet_friendly ?? undefined,
    reservation: m.reservation ?? "not-needed",
    businessHours: m.business_hours ?? "",
    closedDays: m.closed_days ?? "",
    officialUrl: row.official_url ?? "",
    mapUrl: row.map_url ?? "",
    instagramUrl: m.instagram_url ?? undefined,
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    highlight: m.highlight ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapHotelItem(row: any): Hotel {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    area: row.area ?? "",
    address: row.address ?? "",
    phone: row.phone ?? undefined,
    style: m.style ?? "温泉旅館",
    tags: row.tags ?? [],
    highlight: m.highlight ?? "",
    pricePerPerson: row.price_range ?? "",
    checkIn: m.check_in ?? "",
    checkOut: m.check_out ?? "",
    meals: m.meals ?? "素泊まり",
    onsen: m.onsen ?? false,
    onsenNote: m.onsen_note ?? undefined,
    parking: m.parking ?? false,
    parkingNote: m.parking_note ?? undefined,
    officialUrl: row.official_url ?? "",
    mapUrl: row.map_url ?? "",
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    imageUrl: row.image_url ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLeisureItem(row: any): LeisureSpot {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    region: row.region ?? "",
    area: row.area ?? "",
    address: row.address ?? "",
    phone: row.phone ?? undefined,
    kind: m.kind ?? "outdoor",
    genre: m.genre ?? "",
    tags: row.tags ?? [],
    bestFor: (m.best_for ?? []) as string[],
    highlight: m.highlight ?? "",
    priceRange: row.price_range ?? "",
    parking: m.parking ?? false,
    parkingNote: m.parking_note ?? undefined,
    businessHours: m.business_hours ?? "",
    closedDays: m.closed_days ?? "",
    officialUrl: row.official_url ?? "",
    mapUrl: row.map_url ?? "",
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSalonItem(row: any): Salon {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    name: row.name,
    tagline: m.tagline ?? "",
    description: row.description,
    area: row.area ?? "",
    address: row.address ?? "",
    phone: row.phone ?? undefined,
    access: m.access ?? "",
    treatments: (m.treatments ?? []) as Salon["treatments"],
    ageGroups: (m.age_groups ?? []) as Salon["ageGroups"],
    priceRange: row.price_range ?? "",
    cutPrice: m.cut_price ?? "",
    colorPrice: m.color_price ?? undefined,
    parking: m.parking ?? false,
    parkingNote: m.parking_note ?? undefined,
    childrenWelcome: m.children_welcome ?? false,
    menWelcome: m.men_welcome ?? false,
    businessHours: m.business_hours ?? "",
    closedDays: m.closed_days ?? "",
    officialUrl: row.official_url ?? "",
    mapUrl: row.map_url ?? "",
    instagram: m.instagram ?? undefined,
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
    imageUrl: row.image_url ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRanking(row: any, items: any[]): Ranking {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    criteria: (row.criteria ?? []) as string[],
    conclusion: row.conclusion ?? "",
    quickTableLabel: row.quick_table_label ?? "",
    lastUpdatedAt: toDateStr(row.last_updated_at),
    items: items
      .sort((a, b) => a.rank - b.rank)
      .map((ri): RankingItem => ({
        rank: ri.rank,
        itemSlug: ri.item_slug,
        score: Number(ri.score ?? 0),
        reason: ri.reason ?? "",
        isPr: ri.is_pr ?? false,
      })),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCafeRanking(row: any, items: any[]): CafeRanking {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    criteria: (row.criteria ?? []) as string[],
    conclusion: row.conclusion ?? "",
    quickTableLabel: row.quick_table_label ?? "",
    lastUpdatedAt: toDateStr(row.last_updated_at),
    items: items
      .sort((a, b) => a.rank - b.rank)
      .map((ri): CafeRankingItem => ({
        rank: ri.rank,
        cafeSlug: ri.item_slug,
        score: Number(ri.score ?? 0),
        reason: ri.reason ?? "",
        isPr: ri.is_pr ?? false,
      })),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArticle(row: any): Article {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    tags: (row.tags ?? []) as string[],
    publishedAt: toDateStr(row.published_at),
    updatedAt: toDateStr(row.updated_at),
    author: m.author ?? { name: row.author_name ?? "", role: "", url: "" },
    summary: (m.summary ?? []) as string[],
    whatYouLearn: (m.what_you_learn ?? []) as string[],
    markdownFile: "",
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedSlugs: (m.related_slugs ?? []) as string[],
  };
}

// ── Static (no DB) ─────────────────────────────────────────────────────────

export function getSite() { return site; }
export function getCategories() { return categories; }
export function getCategory(slug: string) { return categories.find((c) => c.slug === slug); }
export function getRamenRegions() { return ramenRegions; }
export function getRamenRegion(slug: string) { return ramenRegions.find((r) => r.slug === slug); }
export function getLeisureRegions() { return ["niigata"]; }
export function getBeautyRegions() { return beautyRegions; }
export function getBeautyRegion(slug: string) { return beautyRegions.find((r) => r.slug === slug); }
export function getTravelRegions() { return travelRegions; }
export function getTravelRegion(slug: string) { return travelRegions.find((r) => r.slug === slug); }
export function getCafeRegions(): CafeRegion[] { return cafeRegions; }
export function getCafeRegion(slug: string): CafeRegion | undefined { return cafeRegions.find((r) => r.slug === slug); }
export function getProteinTargets() { return proteinTargets; }
export function getProteinTarget(slug: ProteinTarget) { return proteinTargets.find((t) => t.slug === slug); }
export function getProteinProducts() { return proteinProducts; }
export function getProteinProduct(slug: string) { return proteinProducts.find((p) => p.slug === slug); }
export function getProteinProductsByTarget(target: ProteinTarget) { return proteinProducts.filter((p) => p.targets.includes(target)); }
export function getProteinRankings() { return proteinRankings; }
export function getProteinRankingsByTarget(target: ProteinTarget) { return proteinRankings.filter((r) => r.target === target); }
export function getProteinRanking(slug: string) { return proteinRankings.find((r) => r.slug === slug); }
export function getProteinRankingEntries(slug: string) {
  const ranking = getProteinRanking(slug);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, product: getProteinProduct(entry.productSlug) }))
    .filter((v): v is { entry: ProteinRankingEntry; product: ProteinProduct } => Boolean(v.product));
}

// ── Articles ────────────────────────────────────────────────────────────────

export async function getRamenArticles(): Promise<Article[]> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("category", "ramen").order("updated_at", { ascending: false });
  return (data ?? []).map(mapArticle);
}

export async function getRamenArticle(slug: string): Promise<Article | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("slug", slug).eq("category", "ramen").maybeSingle();
  return data ? mapArticle(data) : undefined;
}

export async function getArticleMarkdown(slug: string): Promise<string> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("body_md").eq("slug", slug).maybeSingle();
  return data?.body_md ?? "";
}

export async function getLatestArticles(limit?: number): Promise<Article[]> {
  const sb = createServerClient();
  let q = sb.from("articles").select("*").eq("category", "ramen").order("updated_at", { ascending: false });
  if (typeof limit === "number") q = q.limit(limit);
  const { data } = await q;
  return (data ?? []).map(mapArticle);
}

export async function getBeautyArticles(region: string): Promise<Article[]> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("category", "beauty").eq("region", region);
  return (data ?? []).map(mapArticle);
}

export async function getBeautyArticle(region: string, slug: string): Promise<Article | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("slug", slug).eq("category", "beauty").eq("region", region).maybeSingle();
  return data ? mapArticle(data) : undefined;
}

export async function getBeautyArticleMarkdown(region: string, slug: string): Promise<string> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("body_md").eq("slug", slug).eq("category", "beauty").eq("region", region).maybeSingle();
  return data?.body_md ?? "";
}

// ── Ramen items ──────────────────────────────────────────────────────────────

export async function getRamenItems(): Promise<Item[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "ramen_item");
  return (data ?? []).map(mapRamenItem);
}

export async function getRamenItemsByRegion(region: string): Promise<Item[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "ramen_item").eq("region", region);
  return (data ?? []).map(mapRamenItem);
}

export async function getRamenItem(slug: string): Promise<Item | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "ramen_item").eq("slug", slug).maybeSingle();
  return data ? mapRamenItem(data) : undefined;
}

// ── Ramen rankings ───────────────────────────────────────────────────────────

async function fetchRankingsWithItems(query: ReturnType<ReturnType<typeof createServerClient>["from"]>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rankings } = await (query as any).select("*, ranking_items(*)");
  if (!rankings) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rankings as any[];
}

export async function getRamenRankings(): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "ramen");
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getRamenRankingsByRegion(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "ramen").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getRamenRanking(slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("slug", slug).maybeSingle();
  return data ? mapRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getRankingEntries(slug: string) {
  const [ranking, items] = await Promise.all([getRamenRanking(slug), getRamenItems()]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, item: items.find((i) => i.slug === entry.itemSlug) }))
    .filter((v): v is { entry: RankingItem; item: Item } => Boolean(v.item));
}

export async function getPopularRankings(limit?: number): Promise<Ranking[]> {
  const sb = createServerClient();
  let q = sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "ramen");
  if (typeof limit === "number") q = q.limit(limit);
  const { data } = await q;
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

// ── Search ───────────────────────────────────────────────────────────────────

export async function getSearchResults(): Promise<SearchResult[]> {
  const [articles, rankings, items, leisureRankings, leisureSpots] = await Promise.all([
    getRamenArticles(),
    getRamenRankings(),
    getRamenItems(),
    getLeisureRankings("niigata"),
    getLeisureSpots("niigata"),
  ]);

  const categoryResults: SearchResult[] = categories.map((category) => ({
    id: "category-" + category.slug,
    type: "category",
    title: category.name,
    description: category.description,
    category: category.name,
    href: category.href,
    tags: [...category.searchFacets, ...category.contentTypes, category.status === "live" ? "公開中" : "準備中"],
  }));

  const articleResults: SearchResult[] = articles.map((article) => ({
    id: "article-" + article.slug,
    type: "article",
    title: article.title,
    description: article.description,
    category: article.category,
    href: "/ramen/articles/" + article.slug,
    tags: article.tags,
    updatedAt: article.updatedAt,
  }));

  const rankingResults: SearchResult[] = rankings.map((ranking) => ({
    id: "ranking-" + ranking.slug,
    type: "ranking",
    title: ranking.title,
    description: ranking.description,
    category: "ラーメン",
    href: "/ramen/rankings/" + ranking.slug,
    tags: ranking.criteria,
    updatedAt: ranking.lastUpdatedAt,
  }));

  const itemResults: SearchResult[] = items.map((item) => ({
    id: "item-" + item.slug,
    type: "item",
    title: item.name,
    description: item.description,
    category: "ラーメン",
    href: "/ramen/items/" + item.slug,
    tags: [item.area, item.genre, ...item.tags, item.parking ? "駐車場あり" : "駐車場要確認"],
    updatedAt: item.lastVerifiedAt,
  }));

  const leisureRankingResults: SearchResult[] = leisureRankings.map((ranking) => ({
    id: "leisure-ranking-niigata-" + ranking.slug,
    type: "ranking",
    title: ranking.title,
    description: ranking.description,
    category: "レジャー",
    href: routes.leisureRanking("niigata", ranking.slug),
    tags: ranking.criteria,
    updatedAt: ranking.lastUpdatedAt,
  }));

  const leisureSpotResults: SearchResult[] = leisureSpots.map((spot) => ({
    id: "leisure-spot-niigata-" + spot.slug,
    type: "item",
    title: spot.name,
    description: spot.description,
    category: "レジャー",
    href: routes.leisureSpot("niigata", spot.slug),
    tags: [spot.area, spot.genre, ...spot.tags, spot.parking ? "駐車場あり" : "駐車場要確認"],
    updatedAt: spot.lastVerifiedAt,
  }));

  return [...categoryResults, ...articleResults, ...rankingResults, ...itemResults, ...leisureRankingResults, ...leisureSpotResults];
}

// ── Leisure ──────────────────────────────────────────────────────────────────

export async function getLeisureSpots(region: string): Promise<LeisureSpot[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "leisure_spot").eq("region", region);
  return (data ?? []).map(mapLeisureItem);
}

export async function getLeisureSpot(region: string, slug: string): Promise<LeisureSpot | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "leisure_spot").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapLeisureItem(data) : undefined;
}

export async function getLeisureRankings(region: string): Promise<LeisureRanking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "leisure").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getLeisureRanking(region: string, slug: string): Promise<LeisureRanking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "leisure").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getLeisureRankingEntries(region: string, slug: string) {
  const [ranking, spots] = await Promise.all([getLeisureRanking(region, slug), getLeisureSpots(region)]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, spot: spots.find((s) => s.slug === entry.itemSlug) }))
    .filter((v): v is { entry: RankingItem; spot: LeisureSpot } => Boolean(v.spot));
}

// ── Beauty ───────────────────────────────────────────────────────────────────

export async function getBeautySalons(region: string): Promise<Salon[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "beauty_salon").eq("region", region);
  return (data ?? []).map(mapSalonItem);
}

export async function getBeautySalon(region: string, slug: string): Promise<Salon | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "beauty_salon").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapSalonItem(data) : undefined;
}

export async function getBeautyRankings(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "beauty").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getBeautyRanking(region: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "beauty").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getBeautyRankingEntries(region: string, slug: string) {
  const [ranking, salons] = await Promise.all([getBeautyRanking(region, slug), getBeautySalons(region)]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, salon: salons.find((s) => s.slug === entry.itemSlug) }))
    .filter((v): v is { entry: RankingItem; salon: Salon } => Boolean(v.salon));
}

// ── Travel ───────────────────────────────────────────────────────────────────

export async function getTravelHotels(region: string): Promise<Hotel[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "hotel").eq("region", region);
  return (data ?? []).map(mapHotelItem);
}

export async function getTravelHotel(region: string, slug: string): Promise<Hotel | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "hotel").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapHotelItem(data) : undefined;
}

export async function getTravelAllHotels(): Promise<Hotel[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "hotel");
  return (data ?? []).map(mapHotelItem);
}

export async function getTravelRankings(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "hotel").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getTravelRanking(region: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "hotel").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getTravelRankingEntries(region: string, slug: string) {
  const [ranking, hotels] = await Promise.all([getTravelRanking(region, slug), getTravelHotels(region)]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, hotel: hotels.find((h) => h.slug === entry.itemSlug) }))
    .filter((v): v is { entry: RankingItem; hotel: Hotel } => Boolean(v.hotel));
}

// ── Cafe ─────────────────────────────────────────────────────────────────────

export async function getCafeItemsByRegion(region: string): Promise<CafeItem[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "cafe").eq("region", region);
  return (data ?? []).map(mapCafeItem);
}

export async function getCafeItem(region: string, slug: string): Promise<CafeItem | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("content_type", "cafe").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapCafeItem(data) : undefined;
}

export async function getCafeRankingsByRegion(region: string): Promise<CafeRanking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "cafe").eq("region", region);
  return (data ?? []).map((r) => mapCafeRanking(r, r.ranking_items ?? []));
}

export async function getCafeRanking(region: string, slug: string): Promise<CafeRanking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*)").eq("content_type", "cafe").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapCafeRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getCafeRankingEntries(region: string, slug: string) {
  const [ranking, cafes] = await Promise.all([getCafeRanking(region, slug), getCafeItemsByRegion(region)]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, cafe: cafes.find((c) => c.slug === entry.cafeSlug) }))
    .filter((v): v is { entry: CafeRankingItem; cafe: CafeItem } => Boolean(v.cafe));
}
