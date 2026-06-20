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
import type {
  Article,
  CafeItem,
  CafeRanking,
  CafeRankingItem,
  CafeRegion,
  ContentSection,
  Hotel,
  Item,
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
  Salon,
  SearchResult,
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
  { majorCategory: "food", sectionSlug: "cafe", label: "カフェ", description: "雰囲気、コーヒー、作業環境で選べるカフェガイド。", href: routes.foodCafe, contentModel: "restaurant", itemPathSegment: "shops", regionMode: "required", targetMode: "none", status: "published", sortOrder: 20, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "food", sectionSlug: "teishoku", label: "定食", description: "地域、ボリューム、価格帯で選べる定食ガイド。", href: "/food/teishoku", contentModel: "restaurant", itemPathSegment: "shops", regionMode: "optional", targetMode: "none", status: "published", sortOrder: 30, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "health", sectionSlug: "protein", label: "プロテイン", description: "目的、成分、価格帯で選べるプロテイン比較。", href: routes.healthProtein, contentModel: "product", itemPathSegment: "products", regionMode: "none", targetMode: "optional", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "beauty", sectionSlug: "hair-salon", label: "美容室", description: "年代、施術、エリアで選べる美容室ガイド。", href: routes.beautyHairSalon, contentModel: "salon", itemPathSegment: "salons", regionMode: "required", targetMode: "none", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "travel", sectionSlug: "stays", label: "宿・温泉", description: "温泉旅館や宿泊施設を旅スタイルで選べる旅行ガイド。", href: routes.travelStays, contentModel: "hotel", itemPathSegment: "hotels", regionMode: "required", targetMode: "none", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "travel", sectionSlug: "services", label: "旅行サービス", description: "旅行会社と旅行アプリを比較する旅行サービスガイド。", href: routes.travelServices, contentModel: "travel-service", itemPathSegment: "agencies", regionMode: "required", targetMode: "none", status: "published", sortOrder: 20, displayConfig: {}, seoConfig: {}, metadata: {} },
  { majorCategory: "leisure", sectionSlug: "spots", label: "スポット", description: "天候、同行者、移動手段で選べるレジャースポットガイド。", href: routes.leisureSpots, contentModel: "spot", itemPathSegment: "spots", regionMode: "required", targetMode: "none", status: "published", sortOrder: 10, displayConfig: {}, seoConfig: {}, metadata: {} },
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
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGenericItem(row: any): GenericItem {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    majorCategory: row.major_category,
    sectionSlug: row.section_slug,
    itemKind: row.item_kind ?? "item",
    canonicalPath: row.canonical_path ?? undefined,
    region: row.region ?? undefined,
    area: row.area ?? "",
    address: row.address ?? "",
    phone: row.phone ?? undefined,
    imageUrl: row.image_url ?? undefined,
    tags: (row.tags ?? []) as string[],
    priceRange: row.price_range ?? "",
    officialUrl: row.official_url ?? "",
    mapUrl: row.map_url ?? "",
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
    metadata: m,
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
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
    id: row.id,
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
    id: row.id,
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
function mapTravelAgencyItem(row: any): TravelAgency {
  const m = row.metadata ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: m.tagline ?? "",
    description: row.description,
    area: row.area ?? "",
    address: row.address ?? "",
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
    mapUrl: row.map_url ?? "",
    officialLinks: (m.official_links ?? []) as OfficialLink[],
    editorComment: row.editor_comment ?? "",
    highlight: m.highlight ?? "",
    imageUrl: row.image_url ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
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
    useCase: row.area ?? "",
    platforms: (m.platforms ?? []) as string[],
    priceRange: row.price_range ?? "",
    features: row.tags ?? [],
    bestFor: (m.best_for ?? []) as string[],
    officialUrl: row.official_url ?? "",
    imageUrl: row.image_url ?? "",
    editorComment: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
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
    imageUrl: row.image_url ?? undefined,
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
    id: row.id,
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
  const sorted = [...items].sort((a, b) => a.rank - b.rank);
  // ランキング専用画像が無ければ、上位アイテムの画像をカード/メタ画像に流用する
  const topItemImage = sorted.find((ri) => ri.items?.image_url)?.items?.image_url as string | undefined;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    majorCategory: row.major_category ?? undefined,
    sectionSlug: row.section_slug ?? undefined,
    canonicalPath: row.canonical_path ?? undefined,
    imageUrl: row.image_url ?? topItemImage ?? undefined,
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
  return {
    slug: row.slug,
    brand: m.brand ?? "",
    name: row.name,
    description: row.description,
    proteinType: m.protein_type ?? "whey-wpc",
    targets: (m.targets ?? []) as ProteinTarget[],
    servingSize: Number(m.serving_size ?? 0),
    protein: Number(m.protein ?? 0),
    calories: Number(m.calories ?? 0),
    carbs: Number(m.carbs ?? 0),
    fat: Number(m.fat ?? 0),
    packageWeight: Number(m.package_weight ?? 0),
    packagePrice: Number(m.package_price ?? 0),
    pricePerKg: Number(m.price_per_kg ?? 0),
    flavors: (m.flavors ?? []) as string[],
    features: (row.tags ?? []) as string[],
    pros: (m.pros ?? []) as string[],
    cons: (m.cons ?? []) as string[],
    officialUrl: row.official_url ?? "",
    imageUrl: row.image_url ?? "",
    editorNote: row.editor_comment ?? "",
    lastVerifiedAt: toDateStr(row.last_verified_at),
    sources: (m.sources ?? []) as Source[],
    faqs: (m.faqs ?? []) as FAQ[],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProteinRanking(row: any, items: any[]): ProteinRanking {
  const m = row.metadata ?? {};
  return {
    slug: row.slug,
    target: (m.target ?? "beginner") as ProteinTarget,
    title: row.title,
    description: row.description,
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
export async function getContentSections(majorCategory?: string): Promise<ContentSection[]> {
  const sb = createServerClient();
  let query = sb.from("content_sections").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (majorCategory) query = query.eq("major_category", majorCategory);
  const { data, error } = await query;
  if (error) {
    return fallbackContentSections
      .filter((section) => !majorCategory || section.majorCategory === majorCategory)
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
    .select("*, ranking_items(*, items(image_url))")
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
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "health").eq("section_slug", "protein");
  return (data ?? []).map((r) => mapProteinRanking(r, r.ranking_items ?? []));
}

export async function getProteinRankingsByTarget(target: ProteinTarget): Promise<ProteinRanking[]> {
  const rankings = await getProteinRankings();
  return rankings.filter((r) => r.target === target);
}

export async function getProteinRanking(slug: string): Promise<ProteinRanking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "health").eq("section_slug", "protein").eq("slug", slug).maybeSingle();
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
    .select("*, ranking_items(*, items(image_url))")
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
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "food").eq("section_slug", "ramen");
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getRamenRankingsByRegion(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "food").eq("section_slug", "ramen").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getRamenRanking(slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "food").eq("section_slug", "ramen").eq("slug", slug).maybeSingle();
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
  let q = sb.from("rankings").select("*, ranking_items(*, items(image_url))").order("last_updated_at", { ascending: false });
  if (typeof limit === "number") q = q.limit(limit);
  const { data } = await q;
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

// ── Search ───────────────────────────────────────────────────────────────────

export async function getSearchResults(): Promise<SearchResult[]> {
  const travelServiceRegions = (await getTravelServiceRegions()).filter((r) => r.status === "live");
  const sections = await getContentSections();
  const sectionLabelByKey = new Map(sections.map((section) => [`${section.majorCategory}:${section.sectionSlug}`, section.label]));
  const categoryLabelBySlug = new Map(categories.map((category) => [category.slug, category.name]));
  const rankingCategoryLabel = (ranking: Ranking) => {
    if (ranking.majorCategory && ranking.sectionSlug) {
      return sectionLabelByKey.get(`${ranking.majorCategory}:${ranking.sectionSlug}`) ?? "ランキング";
    }
    return categoryLabelBySlug.get(ranking.majorCategory ?? "") ?? "ランキング";
  };
  const [articles, rankings, items, leisureSpots, travelServicePairs, travelApps] = await Promise.all([
    getLatestArticles(),
    getPopularRankings(),
    getRamenItems(),
    getLeisureSpots("niigata"),
    Promise.all(
      travelServiceRegions.map(async (region) => ({
        region: region.slug,
        agencies: await getTravelAgencies(region.slug),
      }))
    ),
    getTravelApps(),
  ]);

  const categoryResults: SearchResult[] = sections.map((section) => ({
    id: "section-" + section.majorCategory + "-" + section.sectionSlug,
    type: "category",
    title: section.label,
    description: section.description,
    category: categoryLabelBySlug.get(section.majorCategory) ?? section.majorCategory,
    href: section.href,
    tags: [section.majorCategory, section.sectionSlug, section.contentModel, "公開中"],
  }));

  const articleResults: SearchResult[] = articles.map((article) => ({
    id: "article-" + article.category + "-" + article.slug,
    type: "article",
    title: article.title,
    description: article.description,
    category: categoryLabelBySlug.get(article.category) ?? article.category,
    href: articleHref(article),
    tags: article.tags,
    updatedAt: article.updatedAt,
    imageUrl: article.coverImageUrl,
  }));

  const rankingResults: SearchResult[] = rankings.map((ranking) => ({
    id: "ranking-" + ranking.slug,
    type: "ranking",
    title: ranking.title,
    description: ranking.description,
    category: rankingCategoryLabel(ranking),
    href: rankingHref(ranking),
    tags: ranking.criteria,
    updatedAt: ranking.lastUpdatedAt,
  }));

  const itemResults: SearchResult[] = items.map((item) => ({
    id: "item-" + item.slug,
    type: "item",
    title: item.name,
    description: item.description,
    category: "ラーメン",
    href: routes.sectionItem("food", "ramen", "shops", item.slug),
    tags: [item.area, item.genre, ...item.tags, item.parking ? "駐車場あり" : "駐車場要確認"],
    updatedAt: item.lastVerifiedAt,
    imageUrl: item.imageUrl,
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
    imageUrl: spot.imageUrl,
  }));

  const travelAgencyResults: SearchResult[] = travelServicePairs.flatMap(({ region, agencies }) => agencies.map((agency) => ({
    id: "travel-agency-" + region + "-" + agency.slug,
    type: "item",
    title: agency.name,
    description: agency.description,
    category: "旅行アプリ・旅行会社",
    href: routes.travelAgency(region, agency.slug),
    tags: [agency.area, ...agency.services, ...agency.tags],
    updatedAt: agency.lastVerifiedAt,
    imageUrl: agency.imageUrl,
  })));

  const travelAppResults: SearchResult[] = travelApps.map((app) => ({
    id: "travel-app-" + app.slug,
    type: "item",
    title: app.name,
    description: app.description,
    category: "旅行アプリ・旅行会社",
    href: routes.travelApps,
    tags: [app.useCase, ...app.platforms, ...app.features],
    updatedAt: app.lastVerifiedAt,
    imageUrl: app.imageUrl,
  }));

  // cafe店舗 / 美容サロン / ホテルも検索対象に含める（旧実装では欠落していた）
  const [cafeRegionsLive, beautyRegionsLive] = await Promise.all([getCafeRegions(), getBeautyRegions()]);
  const [cafePairs, beautyPairs, allHotels] = await Promise.all([
    Promise.all(
      cafeRegionsLive
        .filter((r) => r.status === "live")
        .map(async (r) => ({ region: r.slug, items: await getCafeItemsByRegion(r.slug) })),
    ),
    Promise.all(
      beautyRegionsLive
        .filter((r) => r.status === "live")
        .map(async (r) => ({ region: r.slug, salons: await getBeautySalons(r.slug) })),
    ),
    getTravelAllHotels(),
  ]);

  const cafeResults: SearchResult[] = cafePairs.flatMap(({ region, items }) =>
    items.map((cafe) => ({
      id: "cafe-" + region + "-" + cafe.slug,
      type: "item" as const,
      title: cafe.name,
      description: cafe.description,
      category: "カフェ",
      href: routes.cafeItem(region, cafe.slug),
      tags: [cafe.area, cafe.style, ...cafe.tags],
      updatedAt: cafe.lastVerifiedAt,
      imageUrl: cafe.imageUrl,
    })),
  );

  const salonResults: SearchResult[] = beautyPairs.flatMap(({ region, salons }) =>
    salons.map((salon) => ({
      id: "salon-" + region + "-" + salon.slug,
      type: "item" as const,
      title: salon.name,
      description: salon.description,
      category: "美容室",
      href: routes.beautySalon(region, salon.slug),
      tags: [salon.area],
      updatedAt: salon.lastVerifiedAt,
      imageUrl: salon.imageUrl,
    })),
  );

  const hotelResults: SearchResult[] = allHotels.map((hotel) => ({
    id: "hotel-" + hotel.slug,
    type: "item" as const,
    title: hotel.name,
    description: hotel.description,
    category: "旅行",
    href: routes.travelHotel("", hotel.slug),
    tags: [hotel.area, hotel.style, ...hotel.tags],
    updatedAt: hotel.lastVerifiedAt,
    imageUrl: hotel.imageUrl,
  }));

  return [
    ...categoryResults,
    ...articleResults,
    ...rankingResults,
    ...itemResults,
    ...cafeResults,
    ...salonResults,
    ...hotelResults,
    ...leisureSpotResults,
    ...travelAgencyResults,
    ...travelAppResults,
  ];
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
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "leisure").eq("section_slug", "spots").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getLeisureRanking(region: string, slug: string): Promise<LeisureRanking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "leisure").eq("section_slug", "spots").eq("slug", slug).maybeSingle();
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
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getBeautyRanking(region: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "beauty").eq("section_slug", "hair-salon").eq("slug", slug).maybeSingle();
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
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "travel").eq("section_slug", "stays").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getTravelRanking(region: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "travel").eq("section_slug", "stays").eq("slug", slug).maybeSingle();
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
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "services").eq("item_kind", "agency").eq("region", region);
  return (data ?? []).map(mapTravelAgencyItem);
}

export async function getTravelAgency(region: string, slug: string): Promise<TravelAgency | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "services").eq("item_kind", "agency").eq("region", region).eq("slug", slug).maybeSingle();
  return data ? mapTravelAgencyItem(data) : undefined;
}

export async function getTravelServiceRankings(region: string): Promise<Ranking[]> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "travel").eq("section_slug", "services").eq("region", region);
  return (data ?? []).map((r) => mapRanking(r, r.ranking_items ?? []));
}

export async function getTravelServiceRanking(region: string, slug: string): Promise<Ranking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "travel").eq("section_slug", "services").eq("slug", slug).maybeSingle();
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
  const { data } = await sb.from("items").select("*").eq("major_category", "travel").eq("section_slug", "services").eq("item_kind", "app");
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
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "food").eq("section_slug", "cafe").eq("region", region);
  return (data ?? []).map((r) => mapCafeRanking(r, r.ranking_items ?? []));
}

export async function getCafeRanking(region: string, slug: string): Promise<CafeRanking | undefined> {
  const sb = createServerClient();
  const { data } = await sb.from("rankings").select("*, ranking_items(*, items(image_url))").eq("major_category", "food").eq("section_slug", "cafe").eq("slug", slug).maybeSingle();
  return data ? mapCafeRanking(data, data.ranking_items ?? []) : undefined;
}

export async function getCafeRankingEntries(region: string, slug: string) {
  const [ranking, cafes] = await Promise.all([getCafeRanking(region, slug), getCafeItemsByRegion(region)]);
  if (!ranking) return [];
  return ranking.items
    .map((entry) => ({ entry, cafe: cafes.find((c) => c.slug === entry.cafeSlug) }))
    .filter((v): v is { entry: CafeRankingItem; cafe: CafeItem } => Boolean(v.cafe));
}
