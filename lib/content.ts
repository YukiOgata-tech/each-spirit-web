import "server-only";

import { createServerClient } from "@/lib/supabase-server";
import { categories } from "@/content/categories";
import { ramenRegions } from "@/content/ramen/regions";
import { beautyRegions } from "@/content/beauty/regions";
import { travelRegions } from "@/content/travel/regions";
import { travelServiceRegions } from "@/content/travel-services/regions";
import { cafeRegions } from "@/content/cafe/regions";
import { proteinTargets } from "@/content/protein/targets";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { deriveItemClass } from "@/lib/content-models";
import type { LuckyItem } from "@/lib/fortune";
import { SECTION_ITEM_SCHEMAS, type SectionItemSchema, type ItemField } from "@/lib/admin-item-schema";
import type {
  Article,
  CafeItem,
  CafeRanking,
  CafeRankingItem,
  CafeRegion,
  ContentSection,
  HistoryEntry,
  Hotel,
  Item,
  NutritionFacts,
  LeisureRanking,
  LeisureSpot,
  OfficialLink,
  ProteinProduct,
  ProteinRanking,
  ProteinRankingEntry,
  ProteinTarget,
  ProteinTargetInfo,
  RamenRegion,
  BeautyRegion,
  TravelRegion,
  Ranking,
  RankingItem,
  RelatedLink,
  ItemRelatedLink,
  Salon,
  SearchResult,
  ServiceModelEntry,
  Source,
  FAQ,
  GenericItem,
  TravelAgency,
  TravelApp,
  TravelServiceRegion,
} from "@/lib/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(v: string | null | undefined): string {
  if (!v) return "";
  return v.slice(0, 10);
}

const fallbackContentSections: ContentSection[] = [
  { majorCategory: "food", sectionSlug: "ramen", label: "ラーメン", description: "地域、味、移動手段で選べるラーメンガイド。", href: routes.foodRamen, contentModel: "restaurant", itemPathSegment: "shops", regionMode: "optional", targetMode: "none", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "food", sectionSlug: "cafe", label: "カフェ", description: "雰囲気、コーヒー、作業環境で選べるカフェガイド。", href: routes.foodCafe, contentModel: "restaurant", itemPathSegment: "shops", regionMode: "optional", targetMode: "none", status: "published", sortOrder: 20, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "food", sectionSlug: "teishoku", label: "定食", description: "地域、ボリューム、価格帯で選べる定食ガイド。", href: "/food/teishoku", contentModel: "restaurant", itemPathSegment: "shops", regionMode: "optional", targetMode: "none", status: "published", sortOrder: 30, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "health", sectionSlug: "protein", label: "プロテイン", description: "目的、成分、価格帯で選べるプロテイン比較。", href: routes.healthProtein, contentModel: "product", itemPathSegment: "products", regionMode: "none", targetMode: "optional", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "beauty", sectionSlug: "hair-salon", label: "美容室", description: "年代、施術、エリアで選べる美容室ガイド。", href: routes.beautyHairSalon, contentModel: "salon", itemPathSegment: "salons", regionMode: "optional", targetMode: "none", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "travel", sectionSlug: "stays", label: "宿・温泉", description: "温泉旅館や宿泊施設を旅スタイルで選べる旅行ガイド。", href: routes.travelStays, contentModel: "hotel", itemPathSegment: "hotels", regionMode: "optional", targetMode: "none", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "travel", sectionSlug: "services", label: "旅行サービス", description: "旅行会社と旅行アプリを比較する旅行サービスガイド。", href: routes.travelServices, contentModel: "travel-service", itemPathSegment: "agencies", regionMode: "optional", targetMode: "none", status: "published", sortOrder: 20, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "leisure", sectionSlug: "spots", label: "スポット", description: "天候、同行者、移動手段で選べるレジャースポットガイド。", href: routes.leisureSpots, contentModel: "spot", itemPathSegment: "spots", regionMode: "optional", targetMode: "none", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapContentSection(row: any): ContentSection {
  return {
    majorCategory: row.major_category,
    sectionSlug: row.section_slug,
    label: row.label,
    description: row.description ?? "",
    href: row.href,
    contentModel: row.content_model ?? row.metadata?.content_model ?? "directory",
    itemPathSegment: row.item_path_segment ?? row.metadata?.item_path_segment ?? undefined,
    regionMode: row.region_mode ?? "optional",
    targetMode: row.target_mode ?? "none",
    status: row.status ?? "published",
    sortOrder: row.sort_order ?? 100,
    displayConfig: row.display_config ?? {},
    seoConfig: row.seo_config ?? {},
    metadata: row.metadata ?? {},
    itemSchema: row.item_schema ?? {},
  };
}

// JSONB アクセサ（新カラム image / address_info / seo から値を取り出す）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jstr(o: any, k: string): string | undefined {
  const v = o?.[k];
  return typeof v === "string" && v !== "" ? v : undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jnum(o: any, k: string): number | undefined {
  const v = o?.[k];
  return v != null && Number.isFinite(Number(v)) ? Number(v) : undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jstrarr(o: any, k: string): string[] | undefined {
  const v = o?.[k];
  if (!Array.isArray(v)) return undefined;
  const arr = v.filter((x: unknown): x is string => typeof x === "string" && x !== "");
  return arr.length ? arr : undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jcredit(o: any): { name: string; url: string } | undefined {
  const c = o?.credit;
  return c && typeof c === "object" && typeof c.url === "string"
    ? { name: String(c.name ?? ""), url: String(c.url) } : undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jarr<T>(v: any): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGenericItem(row: any): GenericItem {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    bodyMd: row.body_md ?? "",
    majorCategory: row.major_category,
    sectionSlug: row.section_slug,
    itemKind: row.item_kind ?? "item",
    itemClass: deriveItemClass({ itemClass: row.item_class, majorCategory: row.major_category, itemKind: row.item_kind }),
    canonicalPath: row.canonical_path ?? undefined,
    region: row.region ?? undefined,
    area: jstr(row.address_info, "area") ?? "",
    address: jstr(row.address_info, "address") ?? "",
    addressRegion: jstr(row.address_info, "prefecture"),
    latitude: jnum(row.address_info, "lat"),
    longitude: jnum(row.address_info, "lng"),
    phone: row.phone ?? undefined,
    imageUrl: jstr(row.image, "url"),
    imageAlt: jstr(row.image, "alt"),
    imageCredit: jcredit(row.image),
    seoTitle: jstr(row.seo, "title"),
    seoDescription: jstr(row.seo, "description"),
    seoKeywords: jstrarr(row.seo, "keywords"),
    seoOgImage: jstr(row.seo, "og_image"),
    tags: (row.tags ?? []) as string[],
    genres: (Array.isArray(row.genres) ? row.genres : []) as string[],
    priceRange: row.price_range ?? "",
    officialUrl: row.official_url ?? "",
    mapUrl: jstr(row.address_info, "map_url") ?? "",
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.updated_at),
    metadata: m,
    sources: (Array.isArray(row.sources) && row.sources.length ? row.sources : (m.sources ?? [])) as Source[],
    faqs: (Array.isArray(row.faq) && row.faq.length ? row.faq : (m.faqs ?? [])) as FAQ[],
    history: jarr<HistoryEntry>(row.history),
    serviceModel: jarr<ServiceModelEntry>(row.service_model),
    relatedLink: jarr<ItemRelatedLink>(row.related_link),
    nutrition: (row.nutrition && typeof row.nutrition === "object" && Object.keys(row.nutrition).length > 0) ? (row.nutrition as NutritionFacts) : undefined,
  };
}

function majorCategoryFromArticleCategory(category: string | null | undefined): string | undefined {
  if (!category) return undefined;
  if (category === "ramen" || category === "cafe") return "food";
  if (category === "protein") return "health";
  if (category === "beauty") return "beauty";
  if (category === "travel" || category === "travel-services") return "travel";
  if (category === "leisure") return "leisure";
  return category;
}

function sectionSlugFromArticleCategory(category: string | null | undefined): string | undefined {
  if (category === "ramen") return "ramen";
  if (category === "cafe") return "cafe";
  if (category === "protein") return "protein";
  if (category === "beauty") return "hair-salon";
  if (category === "travel") return "stays";
  if (category === "travel-services") return "services";
  if (category === "leisure") return "spots";
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRamenItem(row: any): Item {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    area: jstr(row.address_info, "area") ?? "",
    address: jstr(row.address_info, "address") ?? "",
    phone: row.phone ?? undefined,
    imageUrl: jstr(row.image, "url"),
    genre: m.genre ?? "",
    tags: row.tags ?? [],
    recommendedMenu: m.recommended_menu ?? "",
    priceRange: row.price_range ?? "",
    parking: m.parking ?? false,
    parkingNote: m.parking_note ?? undefined,
    businessHours: m.business_hours ?? "",
    closedDays: m.closed_days ?? "",
    officialUrl: row.official_url ?? "",
    mapUrl: jstr(row.address_info, "map_url") ?? "",
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.updated_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCafeItem(row: any): CafeItem {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    area: jstr(row.address_info, "area") ?? "",
    address: jstr(row.address_info, "address") ?? "",
    phone: row.phone ?? undefined,
    imageUrl: jstr(row.image, "url"),
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
    mapUrl: jstr(row.address_info, "map_url") ?? "",
    instagramUrl: m.instagram_url ?? undefined,
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    highlight: m.highlight ?? "",
    lastVerifiedAt: toDateStr(row.updated_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapHotelItem(row: any): Hotel {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    area: jstr(row.address_info, "area") ?? "",
    address: jstr(row.address_info, "address") ?? "",
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
    mapUrl: jstr(row.address_info, "map_url") ?? "",
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    imageUrl: jstr(row.image, "url") ?? "",
    lastVerifiedAt: toDateStr(row.updated_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTravelAgencyItem(row: any): TravelAgency {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: m.tagline ?? "",
    description: row.description,
    area: jstr(row.address_info, "area") ?? "",
    address: jstr(row.address_info, "address") ?? "",
    phone: row.phone ?? undefined,
    services: (m.services ?? []) as TravelAgency["services"],
    bestFor: (m.best_for ?? []) as string[],
    tags: row.tags ?? [],
    priceRange: row.price_range ?? "",
    consultationStyle: m.consultation_style ?? "",
    businessHours: m.business_hours ?? "",
    closedDays: m.closed_days ?? "",
    registeredTravelAgency: m.registered_travel_agency ?? "",
    officialUrl: row.official_url ?? "",
    mapUrl: jstr(row.address_info, "map_url") ?? "",
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    highlight: m.highlight ?? "",
    imageUrl: jstr(row.image, "url") ?? "",
    lastVerifiedAt: toDateStr(row.updated_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTravelAppItem(row: any): TravelApp {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    name: row.name,
    brand: m.brand ?? "",
    description: row.description,
    useCase: jstr(row.address_info, "area") ?? "",
    platforms: (m.platforms ?? []) as string[],
    priceRange: row.price_range ?? "",
    features: row.tags ?? [],
    bestFor: (m.best_for ?? []) as string[],
    officialUrl: row.official_url ?? "",
    imageUrl: jstr(row.image, "url") ?? "",
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.updated_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLeisureItem(row: any): LeisureSpot {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    region: row.region ?? "",
    area: jstr(row.address_info, "area") ?? "",
    address: jstr(row.address_info, "address") ?? "",
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
    mapUrl: jstr(row.address_info, "map_url") ?? "",
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    imageUrl: jstr(row.image, "url"),
    lastVerifiedAt: toDateStr(row.updated_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSalonItem(row: any): Salon {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: m.tagline ?? "",
    description: row.description,
    area: jstr(row.address_info, "area") ?? "",
    address: jstr(row.address_info, "address") ?? "",
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
    mapUrl: jstr(row.address_info, "map_url") ?? "",
    instagram: m.instagram ?? undefined,
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.updated_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedRankingSlugs: (m.related_ranking_slugs ?? []) as string[],
    imageUrl: jstr(row.image, "url") ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRanking(row: any, items: any[]): Ranking {
  const m = row.metadata ?? {};
  const sorted = [...items].sort((a, b) => a.rank - b.rank);
  // ランキング専用画像が無ければ、上位アイテムの画像をカード/メタ画像に流用する
  const topItemImage = sorted.find((ri) => ri.items?.image?.url)?.items?.image?.url as string | undefined;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    majorCategory: row.major_category ?? undefined,
    sectionSlug: row.section_slug ?? undefined,
    canonicalPath: row.canonical_path ?? undefined,
    imageUrl: jstr(row.image, "url") ?? topItemImage ?? undefined,
    region: row.region ?? undefined,
    target: m.target ?? undefined,
    criteria: (row.criteria ?? []) as string[],
    conclusion: row.conclusion ?? "",
    quickTableLabel: row.quick_table_label ?? "",
    lastUpdatedAt: toDateStr(row.last_updated_at),
    items: sorted.map((ri): RankingItem => ({
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
  const topItemImage = [...items].sort((a, b) => a.rank - b.rank).find((ri) => ri.items?.image?.url)?.items?.image?.url as string | undefined;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    imageUrl: jstr(row.image, "url") ?? topItemImage ?? undefined,
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
  const majorCategory = row.major_category ?? majorCategoryFromArticleCategory(row.category);
  const sectionSlug = row.section_slug ?? sectionSlugFromArticleCategory(row.category);
  const categoryPath = routes.articleByCategory(row.category || "general", row.slug);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    majorCategory,
    sectionSlug,
    canonicalPath: categoryPath,
    region: row.region ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
    tags: (row.tags ?? []) as string[],
    publishedAt: toDateStr(row.published_at),
    updatedAt: toDateStr(row.updated_at),
    author: m.author ?? { name: row.author_name ?? "", role: "", url: "" },
    summary: (m.summary ?? []) as string[],
    whatYouLearn: (m.what_you_learn ?? []) as string[],
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
    relatedSlugs: (m.related_slugs ?? []) as string[],
    relatedLinks: (m.related_links ?? []) as RelatedLink[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProteinProduct(row: any): ProteinProduct {
  const m = row.metadata ?? {};
  const n = (row.nutrition && typeof row.nutrition === "object") ? row.nutrition : {};
  return {
    slug: row.slug,
    brand: m.brand ?? "",
    name: row.name,
    description: row.description,
    proteinType: m.product_type ?? m.protein_type ?? "whey-wpc",
    targets: (m.targets ?? []) as ProteinTarget[],
    servingSize: Number(n.serving_size ?? 0),
    protein: Number(n.protein ?? 0),
    calories: Number(n.calories ?? 0),
    carbs: Number(n.carbs ?? 0),
    fat: Number(n.fat ?? 0),
    packageWeight: Number(m.package_weight ?? 0),
    packagePrice: Number(m.package_price ?? 0),
    pricePerKg: Number(m.price_per_kg ?? 0),
    flavors: (m.variants ?? m.flavors ?? []) as string[],
    features: (row.tags ?? []) as string[],
    pros: (m.pros ?? []) as string[],
    cons: (m.cons ?? []) as string[],
    officialUrl: row.official_url ?? "",
    imageUrl: jstr(row.image, "url") ?? "",
    editorNote: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.updated_at),
    sources: (Array.isArray(row.sources) && row.sources.length ? row.sources : (m.sources ?? [])) as Source[],
    faqs: (Array.isArray(row.faq) && row.faq.length ? row.faq : (m.faqs ?? [])) as FAQ[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProteinRanking(row: any, items: any[]): ProteinRanking {
  const m = row.metadata ?? {};
  const topItemImage = [...items].sort((a, b) => a.rank - b.rank).find((ri) => ri.items?.image?.url)?.items?.image?.url as string | undefined;
  return {
    slug: row.slug,
    target: (m.target ?? "beginner") as ProteinTarget,
    title: row.title,
    description: row.description,
    imageUrl: jstr(row.image, "url") ?? topItemImage ?? undefined,
    criteria: (row.criteria ?? []) as string[],
    conclusion: row.conclusion ?? "",
    quickTableLabel: row.quick_table_label ?? "",
    lastUpdatedAt: toDateStr(row.last_updated_at),
    items: items
      .sort((a, b) => a.rank - b.rank)
      .map((ri): ProteinRankingEntry => ({
        rank: ri.rank,
        productSlug: ri.item_slug,
        score: Number(ri.score ?? 0),
        reason: ri.reason ?? "",
      })),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
  };
}

// ── Static (no DB) ─────────────────────────────────────────────────────────

export function getSite() { return site; }
export function getCategories() { return categories; }
export function getCategory(slug: string) { return categories.find((c) => c.slug === slug); }
export async function getContentSections(
  majorCategory?: string,
  options?: { includeUnpublished?: boolean },
): Promise<ContentSection[]> {
  const sb = createServerClient();
  let query = sb.from("content_sections").select("*").order("sort_order", { ascending: true });
  if (!options?.includeUnpublished) query = query.eq("status", "published");
  if (majorCategory) query = query.eq("major_category", majorCategory);
  const { data, error } = await query;
  if (error) {
    return fallbackContentSections
      .filter((section) => !majorCategory || section.majorCategory === majorCategory)
      .filter((section) => options?.includeUnpublished || section.status === "published")
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return (data ?? []).map(mapContentSection);
}

export async function getContentSection(majorCategory: string, sectionSlug: string): Promise<ContentSection | undefined> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("content_sections")
    .select("*")
    .eq("major_category", majorCategory)
    .eq("section_slug", sectionSlug)
    .eq("status", "published")
    .maybeSingle();

  if (!error && data) return mapContentSection(data);

  return fallbackContentSections.find(
    (section) => section.majorCategory === majorCategory && section.sectionSlug === sectionSlug,
  );
}

// ── 作成/編集フォームのスキーマ（DB駆動 + コード fallback） ───────────────────
// content_sections.item_schema があればそれを SectionItemSchema に変換。無い section は
// コードの SECTION_ITEM_SCHEMAS を使う（travel:services の agency/app など kind 別はコード側）。
function dbSectionToItemSchema(section: ContentSection): SectionItemSchema | null {
  const is = (section.itemSchema ?? {}) as {
    itemClass?: string; itemKind?: string;
    itemKinds?: { value: string; label: string }[];
    fields?: ItemField[];
  };
  if (!Array.isArray(is.fields)) return null;
  return {
    key: `${section.majorCategory}:${section.sectionSlug}`,
    majorCategory: section.majorCategory,
    sectionSlug: section.sectionSlug,
    itemKind: is.itemKind ?? "item",
    itemPathSegment: section.itemPathSegment ?? "items",
    label: section.label,
    itemClass: deriveItemClass({ itemClass: is.itemClass, majorCategory: section.majorCategory, itemKind: is.itemKind }),
    regionMode: section.regionMode,
    itemKinds: is.itemKinds,
    fields: is.fields,
  };
}

/** 作成/編集UIに出すセクションのスキーマ一覧（DB item_schema 優先、無い section はコード fallback） */
export async function getEditorSectionSchemas(): Promise<SectionItemSchema[]> {
  const sections = await getContentSections();
  const dbSchemas = sections
    .map(dbSectionToItemSchema)
    .filter((s): s is SectionItemSchema => s !== null);
  const covered = new Set(dbSchemas.map((s) => `${s.majorCategory}:${s.sectionSlug}`));
  const codeExtra = SECTION_ITEM_SCHEMAS.filter((s) => !covered.has(`${s.majorCategory}:${s.sectionSlug}`));
  return [...dbSchemas, ...codeExtra];
}

export async function getEditorSectionSchema(key: string): Promise<SectionItemSchema | undefined> {
  return (await getEditorSectionSchemas()).find((s) => s.key === key);
}

/** item がランキングで得ている編集スコア（0-100）の最大値。JSON-LD aggregateRating 用。 */
export async function getItemEditorialScore(itemId: string | undefined): Promise<number | undefined> {
  if (!itemId) return undefined;
  const sb = createServerClient();
  const { data } = await sb.from("ranking_items").select("score").eq("item_id", itemId);
  const scores = (data ?? []).map((r) => Number(r.score)).filter((n) => Number.isFinite(n));
  return scores.length ? Math.max(...scores) : undefined;
}

export async function getGenericItemsBySection(majorCategory: string, sectionSlug: string): Promise<GenericItem[]> {
  const sb = createServerClient();
  const { data } = await sb
    .from("items")
    .select("*")
    .eq("major_category", majorCategory)
    .eq("section_slug", sectionSlug)
    .eq("status", "published")
    .order("name", { ascending: true });
  return (data ?? []).map(mapGenericItem);
}

/** キーアイテム候補プール: es.items から公開アイテムを横断取得（運勢のキーアイテム表示用）。
 *  必要列だけ取得（body_md 等を含めると数MBになりキャッシュ上限を超えるため）。 */
export async function getKeyItemPool(limit = 400): Promise<LuckyItem[]> {
  const sb = createServerClient();
  const { data } = await sb
    .from("items")
    .select("slug, name, canonical_path, image, item_kind")
    .eq("status", "published")
    .not("canonical_path", "is", null)
    .limit(limit);
  return (data ?? [])
    .filter((r) => r.canonical_path && r.name)
    .map((r) => ({
      type: r.item_kind ?? "item",
      slug: r.slug,
      name: r.name,
      href: r.canonical_path as string,
      image: jstr(r.image, "url"),
    }));
}

export async function getGenericItemBySection(majorCategory: string, sectionSlug: string, slug: string): Promise<GenericItem | undefined> {
  const sb = createServerClient();
  const { data } = await sb
    .from("items")
    .select("*")
    .eq("major_category", majorCategory)
    .eq("section_slug", sectionSlug)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? mapGenericItem(data) : undefined;
}

export async function getRankingBySection(majorCategory: string, sectionSlug: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb
    .from("rankings")
    .select("*, ranking_items(*, items(image))")
    .eq("major_category", majorCategory)
    .eq("section_slug", sectionSlug)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? mapRanking(data, data.ranking_items ?? []) : undefined;
}
// region / target は es.content_regions / es.content_targets を正とし、
// 取得失敗・空のときだけ静的 content/** にフォールバックする（静的=seed入力 / DB=配信）。
async function fetchRegionData<T>(major: string, section: string): Promise<T[] | null> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("content_regions")
    .select("data")
    .eq("major_category", major)
    .eq("section_slug", section)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return null;
  return data.map((row) => row.data as T);
}

export async function getRamenRegions(): Promise<RamenRegion[]> {
  return (await fetchRegionData<RamenRegion>("food", "ramen")) ?? ramenRegions;
}
export async function getRamenRegion(slug: string): Promise<RamenRegion | undefined> {
  return (await getRamenRegions()).find((r) => r.slug === slug);
}
export async function getLeisureRegions(): Promise<string[]> {
  const rows = await fetchRegionData<{ slug: string }>("leisure", "spots");
  return rows ? rows.map((r) => r.slug) : ["niigata"];
}
export async function getBeautyRegions(): Promise<BeautyRegion[]> {
  return (await fetchRegionData<BeautyRegion>("beauty", "hair-salon")) ?? beautyRegions;
}
export async function getBeautyRegion(slug: string): Promise<BeautyRegion | undefined> {
  return (await getBeautyRegions()).find((r) => r.slug === slug);
}
export async function getTravelRegions(): Promise<TravelRegion[]> {
  return (await fetchRegionData<TravelRegion>("travel", "stays")) ?? travelRegions;
}
export async function getTravelRegion(slug: string): Promise<TravelRegion | undefined> {
  return (await getTravelRegions()).find((r) => r.slug === slug);
}
export async function getTravelServiceRegions(): Promise<TravelServiceRegion[]> {
  return (await fetchRegionData<TravelServiceRegion>("travel", "services")) ?? travelServiceRegions;
}
export async function getTravelServiceRegion(slug: string): Promise<TravelServiceRegion | undefined> {
  return (await getTravelServiceRegions()).find((r) => r.slug === slug);
}
export async function getCafeRegions(): Promise<CafeRegion[]> {
  return (await fetchRegionData<CafeRegion>("food", "cafe")) ?? cafeRegions;
}
export async function getCafeRegion(slug: string): Promise<CafeRegion | undefined> {
  return (await getCafeRegions()).find((r) => r.slug === slug);
}
export async function getProteinTargets(): Promise<ProteinTargetInfo[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("content_targets")
    .select("data")
    .eq("major_category", "health")
    .eq("section_slug", "protein")
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return proteinTargets;
  return data.map((row) => row.data as ProteinTargetInfo);
}
export async function getProteinTarget(slug: ProteinTarget): Promise<ProteinTargetInfo | undefined> {
  return (await getProteinTargets()).find((t) => t.slug === slug);
}

export async function getProteinProducts(): Promise<ProteinProduct[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "health").eq("section_slug", "protein");
  return (data ?? []).map(mapProteinProduct);
}

export async function getProteinProduct(slug: string): Promise<ProteinProduct | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "health").eq("section_slug", "protein").eq("slug", slug).maybeSingle();
  return data ? mapProteinProduct(data) : undefined;
}

export async function getProteinProductsByTarget(target: ProteinTarget): Promise<ProteinProduct[]> {
  const products = await getProteinProducts();
  return products.filter((p) => p.targets.includes(target));
}

export async function getProteinRankings(): Promise<ProteinRanking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "health").eq("section_slug", "protein");
  return (data ?? []).map((r) => mapProteinRanking(r, r.ranking_items ?? []));
}

export async function getProteinRankingsByTarget(target: ProteinTarget): Promise<ProteinRanking[]> {
  const rankings = await getProteinRankings();
  return rankings.filter((r) => r.target === target);
}

export async function getProteinRanking(slug: string): Promise<ProteinRanking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "health").eq("section_slug", "protein").eq("slug", slug).maybeSingle();
  return data ? mapProteinRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getProteinRankingEntries(slug: string) {
  const [ranking, products] = await Promise.all([getProteinRanking(slug), getProteinProducts()]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, product: products.find((p) => p.slug === entry.productSlug) }))
    .filter((v): v is { entry: ProteinRankingEntry; product: ProteinProduct } => Boolean(v.product));
}

// ── Articles ────────────────────────────────────────────────────────────────

export async function getRamenArticles(): Promise<Article[]> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("major_category", "food").eq("section_slug", "ramen").eq("status", "published").order("updated_at", { ascending: false });
  return (data ?? []).map(mapArticle);
}

export async function getRamenArticle(slug: string): Promise<Article | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("slug", slug).eq("major_category", "food").eq("section_slug", "ramen").eq("status", "published").maybeSingle();
  return data ? mapArticle(data) : undefined;
}

export async function getArticleMarkdown(slug: string): Promise<string> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("body_md").eq("slug", slug).eq("status", "published").maybeSingle();
  return data?.body_md ?? "";
}

export function articleHref(article: Pick<Article, "category" | "region" | "slug">) {
  return routes.articleByCategory(article.category || "general", article.slug);
}

export function rankingHref(ranking: Pick<Ranking, "region" | "slug" | "target">) {
  const r = ranking as Pick<Ranking, "region" | "slug" | "target" | "canonicalPath" | "majorCategory" | "sectionSlug">;
  if (r.canonicalPath) return r.canonicalPath;
  if (r.majorCategory && r.sectionSlug) return routes.sectionRanking(r.majorCategory, r.sectionSlug, r.slug);
  if (r.target) return routes.proteinRanking(r.target, r.slug);
  return routes.ramenRanking(ranking.slug);
}

export async function getGenericArticles(): Promise<Article[]> {
  const sb = createServerClient();
  const { data } = await sb
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false });
  return (data ?? []).map(mapArticle);
}

export async function getArticlesByMajorCategory(majorCategory: string): Promise<Article[]> {
  const articles = await getLatestArticles();
  return articles.filter((article) => article.majorCategory === majorCategory);
}

export async function getArticlesBySection(majorCategory: string, sectionSlug: string): Promise<Article[]> {
  const articles = await getLatestArticles();
  return articles.filter((article) => article.majorCategory === majorCategory && article.sectionSlug === sectionSlug);
}

/** 管理UI用: section 配下の item の slug/name を一覧（ranking_items の選択肢など） */
export async function getItemOptionsBySection(majorCategory: string, sectionSlug: string): Promise<{ slug: string; name: string }[]> {
  const sb = createServerClient();
  const { data } = await sb
    .from("items")
    .select("slug, name")
    .eq("major_category", majorCategory)
    .eq("section_slug", sectionSlug)
    .order("name", { ascending: true });
  return (data ?? []).map((row) => ({ slug: row.slug as string, name: row.name as string }));
}

export async function getRankingsBySection(majorCategory: string, sectionSlug: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb
    .from("rankings")
    .select("*, ranking_items(*, items(image))")
    .eq("major_category", majorCategory)
    .eq("section_slug", sectionSlug)
    .eq("status", "published")
    .order("last_updated_at", { ascending: false });
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

/** 公開記事のカテゴリ一覧（/articles のカテゴリ一覧ページ用）。件数の多い順 */
export async function getArticleCategories(): Promise<{ category: string; count: number; latestUpdatedAt: string; coverImageUrl?: string }[]> {
  const articles = await getLatestArticles();
  const map = new Map<string, { category: string; count: number; latestUpdatedAt: string; coverImageUrl?: string }>();
  for (const article of articles) {
    const category = article.category || "general";
    const existing = map.get(category);
    if (existing) {
      existing.count += 1;
      if (!existing.coverImageUrl && article.coverImageUrl) existing.coverImageUrl = article.coverImageUrl;
    } else {
      map.set(category, { category, count: 1, latestUpdatedAt: article.updatedAt, coverImageUrl: article.coverImageUrl });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

/** ランキング詳細用: 各順位項目に section の item（名前/画像/URL等）を解決して紐付ける */
export async function getRankingEntriesBySection(
  majorCategory: string,
  sectionSlug: string,
  slug: string,
): Promise<{ ranking: Ranking; entries: { entry: RankingItem; item?: GenericItem }[] } | undefined> {
  const [ranking, items] = await Promise.all([
    getRankingBySection(majorCategory, sectionSlug, slug),
    getGenericItemsBySection(majorCategory, sectionSlug),
  ]);
  if (!ranking) return undefined;
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const entries = ranking.items.map((entry) => ({ entry, item: bySlug.get(entry.itemSlug) }));
  return { ranking, entries };
}

export async function getGenericArticlesByCategory(category: string): Promise<Article[]> {
  const sb = createServerClient();
  const { data } = await sb
    .from("articles")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("updated_at", { ascending: false });
  return (data ?? []).map(mapArticle);
}

export async function getGenericArticle(category: string, slug: string): Promise<Article | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("slug", slug).eq("category", category).eq("status", "published").maybeSingle();
  return data ? mapArticle(data) : undefined;
}

export async function getGenericArticleMarkdown(category: string, slug: string): Promise<string> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("body_md").eq("slug", slug).eq("category", category).eq("status", "published").maybeSingle();
  return data?.body_md ?? "";
}

export async function getLatestArticles(limit?: number): Promise<Article[]> {
  const sb = createServerClient();
  let q = sb.from("articles").select("*").eq("status", "published").order("updated_at", { ascending: false });
  if (typeof limit === "number") q = q.limit(limit);
  const { data } = await q;
  return (data ?? []).map(mapArticle);
}

export async function getBeautyArticles(region: string): Promise<Article[]> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("region", region).eq("status", "published");
  return (data ?? []).map(mapArticle);
}

export async function getBeautyArticle(region: string, slug: string): Promise<Article | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("slug", slug).eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("region", region).eq("status", "published").maybeSingle();
  return data ? mapArticle(data) : undefined;
}

export async function getBeautyArticleMarkdown(region: string, slug: string): Promise<string> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("body_md").eq("slug", slug).eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("region", region).eq("status", "published").maybeSingle();
  return data?.body_md ?? "";
}

export async function getCafeArticles(region: string): Promise<Article[]> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("major_category", "food").eq("section_slug", "cafe").eq("region", region).eq("status", "published").order("updated_at", { ascending: false });
  return (data ?? []).map(mapArticle);
}

export async function getCafeArticle(region: string, slug: string): Promise<Article | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("*").eq("slug", slug).eq("major_category", "food").eq("section_slug", "cafe").eq("region", region).eq("status", "published").maybeSingle();
  return data ? mapArticle(data) : undefined;
}

export async function getCafeArticleMarkdown(region: string, slug: string): Promise<string> {
  const sb = createServerClient();
  const { data } = await sb.from("articles").select("body_md").eq("slug", slug).eq("major_category", "food").eq("section_slug", "cafe").eq("region", region).eq("status", "published").maybeSingle();
  return data?.body_md ?? "";
}

// ── Ramen items ──────────────────────────────────────────────────────────────

export async function getRamenItems(): Promise<Item[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "food").eq("section_slug", "ramen");
  return (data ?? []).map(mapRamenItem);
}

export async function getRamenItemsByRegion(region: string): Promise<Item[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "food").eq("section_slug", "ramen").eq("region", region);
  return (data ?? []).map(mapRamenItem);
}

export async function getRamenItem(slug: string): Promise<Item | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "food").eq("section_slug", "ramen").eq("slug", slug).maybeSingle();
  return data ? mapRamenItem(data) : undefined;
}

// ── Ramen rankings ───────────────────────────────────────────────────────────

export async function getRamenRankings(): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "food").eq("section_slug", "ramen");
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getRamenRankingsByRegion(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "food").eq("section_slug", "ramen").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getRamenRanking(slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "food").eq("section_slug", "ramen").eq("slug", slug).maybeSingle();
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
  let q = sb.from("rankings").select("*, ranking_items(*, items(image))").order("last_updated_at", { ascending: false });
  if (typeof limit === "number") q = q.limit(limit);
  const { data } = await q;
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

// ── Search ───────────────────────────────────────────────────────────────────

type SearchRow = {
  type: SearchResult["type"];
  ref_id: string;
  title: string;
  description: string | null;
  href: string;
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
  updated_at: string | null;
  score: number;
};

/**
 * 横断検索。pgroonga 全文検索 RPC（es.search_content）を1回呼ぶだけ（内部は種別ごとの索引スキャン）。
 * items / articles / rankings / カテゴリ(section) を関連度（pgroonga_score）降順で返す（published のみ）。
 * section が増えても自動的に対象になる。空クエリは何もせず空配列（呼び出し側でDBを叩かない）。
 */
export async function searchContent(
  query: string,
  opts?: { type?: SearchResult["type"]; limit?: number },
): Promise<SearchResult[]> {
  const q = query.trim();
  if (q === "") return [];
  const sb = createServerClient();
  const { data, error } = await sb.rpc("search_content", {
    q,
    p_type: opts?.type ?? null,
    p_limit: opts?.limit ?? 48,
  });
  if (error || !data) return [];
  return (data as SearchRow[]).map((r) => ({
    id: `${r.type}-${r.ref_id}`,
    type: r.type,
    title: r.title,
    description: r.description ?? "",
    category: r.category ?? "",
    href: r.href,
    tags: r.tags ?? [],
    updatedAt: r.updated_at ?? undefined,
    imageUrl: r.image_url ?? undefined,
  }));
}

// ── Leisure ──────────────────────────────────────────────────────────────────

export async function getLeisureSpots(region: string): Promise<LeisureSpot[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "leisure").eq("section_slug", "spots").eq("region", region);
  return (data ?? []).map(mapLeisureItem);
}

export async function getLeisureSpot(region: string, slug: string): Promise<LeisureSpot | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "leisure").eq("section_slug", "spots").eq("slug", slug).maybeSingle();
  return data ? mapLeisureItem(data) : undefined;
}

export async function getLeisureRankings(region: string): Promise<LeisureRanking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "leisure").eq("section_slug", "spots").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getLeisureRanking(region: string, slug: string): Promise<LeisureRanking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "leisure").eq("section_slug", "spots").eq("slug", slug).maybeSingle();
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
  const { data } = await sb.from("items").select("*").eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("region", region);
  return (data ?? []).map(mapSalonItem);
}

export async function getBeautySalon(region: string, slug: string): Promise<Salon | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("slug", slug).maybeSingle();
  return data ? mapSalonItem(data) : undefined;
}

export async function getBeautyRankings(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getBeautyRanking(region: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("slug", slug).maybeSingle();
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
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "stays").eq("region", region);
  return (data ?? []).map(mapHotelItem);
}

export async function getTravelHotel(region: string, slug: string): Promise<Hotel | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "stays").eq("slug", slug).maybeSingle();
  return data ? mapHotelItem(data) : undefined;
}

export async function getTravelAllHotels(): Promise<Hotel[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "stays");
  return (data ?? []).map(mapHotelItem);
}

export async function getTravelRankings(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "travel").eq("section_slug", "stays").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getTravelRanking(region: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "travel").eq("section_slug", "stays").eq("slug", slug).maybeSingle();
  return data ? mapRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getTravelRankingEntries(region: string, slug: string) {
  const [ranking, hotels] = await Promise.all([getTravelRanking(region, slug), getTravelHotels(region)]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, hotel: hotels.find((h) => h.slug === entry.itemSlug) }))
    .filter((v): v is { entry: RankingItem; hotel: Hotel } => Boolean(v.hotel));
}

// ── Travel Services ─────────────────────────────────────────────────────────

export async function getTravelAgencies(region: string): Promise<TravelAgency[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "services").eq("item_class", "intangible_service").eq("region", region);
  return (data ?? []).map(mapTravelAgencyItem);
}

export async function getTravelAgency(region: string, slug: string): Promise<TravelAgency | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "services").eq("item_class", "intangible_service").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapTravelAgencyItem(data) : undefined;
}

export async function getTravelServiceRankings(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "travel").eq("section_slug", "services").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getTravelServiceRanking(region: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "travel").eq("section_slug", "services").eq("slug", slug).maybeSingle();
  return data ? mapRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getTravelServiceRankingEntries(region: string, slug: string) {
  const [ranking, agencies] = await Promise.all([getTravelServiceRanking(region, slug), getTravelAgencies(region)]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, agency: agencies.find((a) => a.slug === entry.itemSlug) }))
    .filter((v): v is { entry: RankingItem; agency: TravelAgency } => Boolean(v.agency));
}

export async function getTravelApps(): Promise<TravelApp[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "services").eq("item_class", "product");
  return (data ?? []).map(mapTravelAppItem);
}

// ── Cafe ─────────────────────────────────────────────────────────────────────

export async function getCafeItemsByRegion(region: string): Promise<CafeItem[]> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "food").eq("section_slug", "cafe").eq("region", region);
  return (data ?? []).map(mapCafeItem);
}

export async function getCafeItem(region: string, slug: string): Promise<CafeItem | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "food").eq("section_slug", "cafe").eq("slug", slug).maybeSingle();
  return data ? mapCafeItem(data) : undefined;
}

export async function getCafeRankingsByRegion(region: string): Promise<CafeRanking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "food").eq("section_slug", "cafe").eq("region", region);
  return (data ?? []).map((r) => mapCafeRanking(r, r.ranking_items ?? []));
}

export async function getCafeRanking(region: string, slug: string): Promise<CafeRanking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image))").eq("major_category", "food").eq("section_slug", "cafe").eq("slug", slug).maybeSingle();
  return data ? mapCafeRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getCafeRankingEntries(region: string, slug: string) {
  const [ranking, cafes] = await Promise.all([getCafeRanking(region, slug), getCafeItemsByRegion(region)]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, cafe: cafes.find((c) => c.slug === entry.cafeSlug) }))
    .filter((v): v is { entry: CafeRankingItem; cafe: CafeItem } => Boolean(v.cafe));
}
