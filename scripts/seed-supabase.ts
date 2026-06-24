/**
 * Legacy Supabase seed script.
 * Supabase es.* を正とするため、通常実行では DB を更新しません。
 * 既存のローカル TypeScript コンテンツを初期投入・復旧に使う場合だけ、
 * ALLOW_LEGACY_CONTENT_SEED=1 を明示して実行してください。
 *
 * 実行前の準備:
 *   1. Supabase Dashboard → Settings → API → Extra schemas に "es" を追加
 *   2. .env.local に以下を追加:
 *        SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
 *      （ダッシュボード → Settings → API → service_role の値）
 *
 * 実行方法:
 *   PowerShell: $env:ALLOW_LEGACY_CONTENT_SEED='1'; npm run db:seed
 *
 * 注意:
 *   この script は es.items / es.rankings / es.ranking_items をローカル定義で
 *   upsert・洗い替えします。通常のコンテンツ更新には使わないでください。
 */

import { config } from "dotenv"
config({ path: ".env.local" })

if (process.env.ALLOW_LEGACY_CONTENT_SEED !== "1") {
  console.error("❌ npm run db:seed は通常実行できません。")
  console.error("   現在は Supabase es.* をコンテンツの正としています。")
  console.error("   ローカル content/** から DB を上書きする必要がある初期投入・復旧時のみ、")
  console.error("   ALLOW_LEGACY_CONTENT_SEED=1 を明示して実行してください。")
  process.exit(1)
}

import { createClient } from "@supabase/supabase-js"
import ws from "ws"
import {
  ITEM_CONTENT_TYPE_TO_SECTION,
  ARTICLE_CATEGORY_TO_SECTION,
  RANKING_CONTENT_TYPE_TO_SECTION,
  itemCanonicalPath,
  articleCanonicalPath,
  rankingCanonicalPath,
} from "@/lib/section-map"

// ── コンテンツ import ──────────────────────────────────────
import { ramenArticles }         from "@/content/ramen/articles"
import { ramenItems }            from "@/content/ramen/items"
import { ramenRankings }         from "@/content/ramen/rankings"
import { yamagataRamenItems }    from "@/content/ramen/yamagata/items"
import { yamagataRamenRankings } from "@/content/ramen/yamagata/rankings"
import { chibaRamenItems }       from "@/content/ramen/chiba/items"
import { chibaRamenRankings }    from "@/content/ramen/chiba/rankings"
import { fukushimaRamenItems }    from "@/content/ramen/fukushima/items"
import { fukushimaRamenRankings } from "@/content/ramen/fukushima/rankings"
import { niigataCafeItems }      from "@/content/cafe/niigata/items"
import { niigataCafeRankings }   from "@/content/cafe/niigata/rankings"
import { yamagataCafeItems }     from "@/content/cafe/yamagata/items"
import { yamagataCafeRankings }  from "@/content/cafe/yamagata/rankings"
import { toyamaCafeItems }       from "@/content/cafe/toyama/items"
import { toyamaCafeRankings }    from "@/content/cafe/toyama/rankings"
import { niigataHotels }         from "@/content/travel/niigata/hotels"
import { niigataHotelRankings }  from "@/content/travel/niigata/rankings"
import { niigataTravelAgencies } from "@/content/travel-services/niigata/agencies"
import { niigataTravelAgencyRankings } from "@/content/travel-services/niigata/rankings"
import { shizuokaTravelAgencies } from "@/content/travel-services/shizuoka/agencies"
import { shizuokaTravelAgencyRankings } from "@/content/travel-services/shizuoka/rankings"
import { yamagataTravelAgencies } from "@/content/travel-services/yamagata/agencies"
import { yamagataTravelAgencyRankings } from "@/content/travel-services/yamagata/rankings"
import { travelApps }            from "@/content/travel-services/apps"
import { niigataLeisureSpots }   from "@/content/leisure/niigata/spots"
import { niigataLeisureRankings } from "@/content/leisure/niigata/rankings"
import { beautySalons as niigataBeautySalons }   from "@/content/beauty/niigata/salons"
import { beautyRankings as niigataBeautyRankings } from "@/content/beauty/niigata/rankings"
import { beautyArticles as niigataBeautyArticles } from "@/content/beauty/niigata/articles"
import { beautySalons as yamagataBeautySalons }  from "@/content/beauty/yamagata/salons"
import { beautyRankings as yamagataBeautyRankings } from "@/content/beauty/yamagata/rankings"
import { beautyArticles as yamagataBeautyArticles } from "@/content/beauty/yamagata/articles"
import { proteinProducts }       from "@/content/protein/products"
import { proteinRankings }       from "@/content/protein/rankings"

// ── Supabase クライアント（service_role: RLS バイパス）────
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
const key  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error("❌ 環境変数が不足しています。")
  console.error("   NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。")
  process.exit(1)
}

const db = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws as unknown as typeof WebSocket },
})
const es = db.schema("es")

// ── ユーティリティ ────────────────────────────────────────

function ok(label: string, count: number) {
  console.log(`  ✅ ${label}: ${count} 件`)
}

/** items 行に新構造の列（major/section/item_kind/canonical）を付与 */
// 旧 location/image フィールド → 新 JSONB へ変換するヘルパー（items の image_url/address/area/map_url 列は廃止済み）
function seedPrefecture(address?: unknown): string | undefined {
  if (typeof address !== "string" || !address) return undefined
  return address.match(/^(東京都|北海道|.{2,3}[都道府県])/)?.[1]
}
function seedImage(url?: unknown): Record<string, unknown> {
  return typeof url === "string" && url ? { url } : {}
}
function seedAddressInfo(o: { address?: unknown; area?: unknown; mapUrl?: unknown }): Record<string, unknown> {
  const ai: Record<string, unknown> = {}
  if (typeof o.address === "string" && o.address) {
    ai.address = o.address
    const p = seedPrefecture(o.address); if (p) ai.prefecture = p
  }
  if (typeof o.area === "string" && o.area) ai.area = o.area
  if (typeof o.mapUrl === "string" && o.mapUrl) ai.map_url = o.mapUrl
  return ai
}
function seedGenres(meta: Record<string, unknown>): string[] {
  const g = new Set<string>()
  if (Array.isArray(meta.genres)) for (const x of meta.genres) if (typeof x === "string" && x) g.add(x)
  if (typeof meta.genre === "string" && meta.genre) g.add(meta.genre)
  return [...g]
}

function withItemSection<T extends { content_type: string; slug: string }>(rows: T[]) {
  return rows.map((r) => {
    const m = ITEM_CONTENT_TYPE_TO_SECTION[r.content_type]
    if (!m) throw new Error(`Unknown legacy item mapping for ${r.content_type}`)
    const {
      content_type: _contentType, image_url, address, area, map_url, last_verified_at: _lv, ...row
    } = r as Record<string, unknown> & { content_type: string }
    void _contentType; void _lv
    const meta = (row.metadata ?? {}) as Record<string, unknown>
    return {
      ...row,
      major_category: m.majorCategory, section_slug: m.sectionSlug, item_kind: m.itemKind,
      canonical_path: itemCanonicalPath(r.content_type, r.slug),
      image: seedImage(image_url),
      address_info: seedAddressInfo({ address, area, mapUrl: map_url }),
      genres: seedGenres(meta),
      sources: Array.isArray(meta.sources) ? meta.sources : [],
      faq: Array.isArray(meta.faqs) ? meta.faqs : [],
    }
  })
}

/** articles 行に新構造の列（major/section/canonical）を付与 */
function withArticleSection<T extends { category: string; slug: string }>(rows: T[]) {
  return rows.map((r) => ({
    ...r,
    major_category: ARTICLE_CATEGORY_TO_SECTION[r.category]?.majorCategory ?? null,
    section_slug: ARTICLE_CATEGORY_TO_SECTION[r.category]?.sectionSlug ?? null,
    canonical_path: articleCanonicalPath(r.category, r.slug),
  }))
}

function err(label: string, error: unknown) {
  console.error(`  ❌ ${label}:`, error)
}

/** region を slug プレフィックスから推定 */
function inferRegion(slug: string): string | null {
  if (slug.startsWith("niigata"))  return "niigata"
  if (slug.startsWith("yamagata")) return "yamagata"
  if (slug.startsWith("chiba"))    return "chiba"
  if (slug.startsWith("fukushima")) return "fukushima"
  if (slug.startsWith("toyama"))   return "toyama"
  return null
}

// ─────────────────────────────────────────────────────────
// 1. 記事 (es.articles)
// ─────────────────────────────────────────────────────────

async function migrateArticles() {
  console.log("\n📄 記事 (es.articles)")

  const rows = [
    // ラーメン記事
    ...ramenArticles.map(a => ({
      slug:            a.slug,
      category:        "ramen",
      region:          inferRegion(a.slug),
      title:           a.title,
      description:     a.description,
      tags:            a.tags,
      author_name:     a.author.name,
      status:          "published" as const,
      published_at:    a.publishedAt,
      metadata: {
        summary:       a.summary,
        what_you_learn: a.whatYouLearn,
        sources:       a.sources,
        faqs:          a.faqs,
        related_slugs: a.relatedSlugs,
      },
    })),
    // 美容記事（新潟）
    ...niigataBeautyArticles.map(a => ({
      slug:            a.slug,
      category:        "beauty",
      region:          "niigata",
      title:           a.title,
      description:     a.description,
      tags:            a.tags,
      author_name:     a.author.name,
      status:          "published" as const,
      published_at:    a.publishedAt,
      metadata: {
        summary:       a.summary,
        what_you_learn: a.whatYouLearn,
        sources:       a.sources,
        faqs:          a.faqs,
        related_slugs: a.relatedSlugs,
      },
    })),
    // 美容記事（山形）
    ...yamagataBeautyArticles.map(a => ({
      slug:            a.slug,
      category:        "beauty",
      region:          "yamagata",
      title:           a.title,
      description:     a.description,
      tags:            a.tags,
      author_name:     a.author.name,
      status:          "published" as const,
      published_at:    a.publishedAt,
      metadata: {
        summary:       a.summary,
        what_you_learn: a.whatYouLearn,
        sources:       a.sources,
        faqs:          a.faqs,
        related_slugs: a.relatedSlugs,
      },
    })),
  ]

  const { error, count } = await es.from("articles")
    .upsert(withArticleSection(rows), { onConflict: "slug", count: "exact" })
  if (error) err("articles", error)
  else ok("articles", count ?? rows.length)
}

// ─────────────────────────────────────────────────────────
// 2. アイテム (es.items)
// ─────────────────────────────────────────────────────────

async function migrateItems() {
  console.log("\n🏪 アイテム (es.items)")

  // カフェ
  const cafeRows = [
    ...niigataCafeItems.map(c  => cafeToRow(c,  "niigata")),
    ...yamagataCafeItems.map(c => cafeToRow(c,  "yamagata")),
    ...toyamaCafeItems.map(c   => cafeToRow(c,  "toyama")),
  ]
  const { error: e1, count: c1 } = await es.from("items")
    .upsert(withItemSection(cafeRows), { onConflict: "major_category,section_slug,slug", count: "exact" })
  if (e1) err("cafe items", e1); else ok("cafe items", c1 ?? cafeRows.length)

  // ラーメン
  const ramenRows = [
    ...ramenItems.map(r         => ramenToRow(r, "niigata")),
    ...yamagataRamenItems.map(r => ramenToRow(r, "yamagata")),
    ...chibaRamenItems.map(r    => ramenToRow(r, "chiba")),
    ...fukushimaRamenItems.map(r => ramenToRow(r, "fukushima")),
  ]
  const { error: e2, count: c2 } = await es.from("items")
    .upsert(withItemSection(ramenRows), { onConflict: "major_category,section_slug,slug", count: "exact" })
  if (e2) err("ramen items", e2); else ok("ramen items", c2 ?? ramenRows.length)

  // ホテル
  const hotelRows = niigataHotels.map(h => ({
    slug:             h.slug,
    content_type:     "hotel",
    region:           "niigata",
    name:             h.name,
    description:      h.description,
    image_url:        h.imageUrl,
    address:          h.address,
    area:             h.area,
    phone:            h.phone ?? null,
    price_range:      h.pricePerPerson,
    official_url:     h.officialUrl,
    map_url:          h.mapUrl,
    tags:             h.tags,
    last_verified_at: h.lastVerifiedAt,
    editor_comment:   h.editorComment,
    metadata: {
      style: h.style, meals: h.meals, onsen: h.onsen, onsen_note: h.onsenNote,
      check_in: h.checkIn, check_out: h.checkOut,
      parking: h.parking, parking_note: h.parkingNote,
      highlight: h.highlight, official_links: h.officialLinks,
      sources: h.sources, faqs: h.faqs,
      related_ranking_slugs: h.relatedRankingSlugs,
    },
  }))
  const { error: e3, count: c3 } = await es.from("items")
    .upsert(withItemSection(hotelRows), { onConflict: "major_category,section_slug,slug", count: "exact" })
  if (e3) err("hotel items", e3); else ok("hotel items", c3 ?? hotelRows.length)

  // 旅行会社
  const travelAgencyRows = [
    ...niigataTravelAgencies.map(a => travelAgencyToRow(a, "niigata")),
    ...shizuokaTravelAgencies.map(a => travelAgencyToRow(a, "shizuoka")),
    ...yamagataTravelAgencies.map(a => travelAgencyToRow(a, "yamagata")),
  ]
  const { error: eTravelAgency, count: cTravelAgency } = await es.from("items")
    .upsert(withItemSection(travelAgencyRows), { onConflict: "major_category,section_slug,slug", count: "exact" })
  if (eTravelAgency) err("travel agency items", eTravelAgency); else ok("travel agency items", cTravelAgency ?? travelAgencyRows.length)

  // 旅行アプリ（地域なし）
  const travelAppRows = travelApps.map(a => ({
    slug:             a.slug,
    content_type:     "travel_app",
    region:           null,
    name:             a.name,
    description:      a.description,
    image_url:        a.imageUrl,
    area:             a.useCase,
    price_range:      a.priceRange,
    official_url:     a.officialUrl,
    tags:             a.features,
    last_verified_at: a.lastVerifiedAt,
    editor_comment:   a.editorComment,
    metadata: {
      brand: a.brand,
      platforms: a.platforms,
      best_for: a.bestFor,
      sources: a.sources,
      faqs: a.faqs,
    },
  }))
  const { error: eTravelApp, count: cTravelApp } = await es.from("items")
    .upsert(withItemSection(travelAppRows), { onConflict: "major_category,section_slug,slug", count: "exact" })
  if (eTravelApp) err("travel app items", eTravelApp); else ok("travel app items", cTravelApp ?? travelAppRows.length)

  // 美容サロン
  const salonRows = [
    ...niigataBeautySalons.map(s  => salonToRow(s, "niigata")),
    ...yamagataBeautySalons.map(s => salonToRow(s, "yamagata")),
  ]
  const { error: e4, count: c4 } = await es.from("items")
    .upsert(withItemSection(salonRows), { onConflict: "major_category,section_slug,slug", count: "exact" })
  if (e4) err("beauty salon items", e4); else ok("beauty salon items", c4 ?? salonRows.length)

  // レジャースポット
  const leisureRows = niigataLeisureSpots.map(s => ({
    slug:             s.slug,
    content_type:     "leisure_spot",
    region:           "niigata",
    name:             s.name,
    description:      s.description,
    address:          s.address,
    area:             s.area,
    phone:            s.phone ?? null,
    price_range:      s.priceRange,
    official_url:     s.officialUrl,
    map_url:          s.mapUrl,
    tags:             s.tags,
    last_verified_at: s.lastVerifiedAt,
    editor_comment:   s.editorComment,
    metadata: {
      kind: s.kind, genre: s.genre, best_for: s.bestFor, highlight: s.highlight,
      parking: s.parking, parking_note: s.parkingNote,
      business_hours: s.businessHours, closed_days: s.closedDays,
      official_links: s.officialLinks, sources: s.sources, faqs: s.faqs,
      related_ranking_slugs: s.relatedRankingSlugs,
    },
  }))
  const { error: e5, count: c5 } = await es.from("items")
    .upsert(withItemSection(leisureRows), { onConflict: "major_category,section_slug,slug", count: "exact" })
  if (e5) err("leisure items", e5); else ok("leisure items", c5 ?? leisureRows.length)

  // プロテイン製品（地域なし）
  const proteinRows = proteinProducts.map(p => ({
    slug:             p.slug,
    content_type:     "protein",
    region:           null,
    name:             p.name,
    description:      p.description,
    image_url:        p.imageUrl,
    price_range:      `¥${p.packagePrice.toLocaleString("ja-JP")}`,
    official_url:     p.officialUrl,
    tags:             p.features,
    last_verified_at: p.lastVerifiedAt,
    editor_comment:   p.editorNote,
    metadata: {
      brand: p.brand, package_price: p.packagePrice,
      protein_type: p.proteinType, targets: p.targets,
      package_weight: p.packageWeight,
      price_per_kg: p.pricePerKg, flavors: p.flavors,
      pros: p.pros, cons: p.cons, sources: p.sources, faqs: p.faqs,
    },
    // 栄養成分は専用 nutrition カラムへ（docs/items-data-model.md が正）
    nutrition: {
      basis: "per_serving" as const,
      serving_size: p.servingSize, protein: p.protein, calories: p.calories,
      carbs: p.carbs, fat: p.fat,
    },
  }))
  const { error: e6, count: c6 } = await es.from("items")
    .upsert(withItemSection(proteinRows), { onConflict: "major_category,section_slug,slug", count: "exact" })
  if (e6) err("protein items", e6); else ok("protein items", c6 ?? proteinRows.length)
}

// ─────────────────────────────────────────────────────────
// 3. ランキング (es.rankings + es.ranking_items)
// ─────────────────────────────────────────────────────────

async function migrateRankings() {
  console.log("\n🏆 ランキング (es.rankings + es.ranking_items)")

  type RankingInput = {
    content_type: string
    region: string | null
    target: string | null
    slug: string
    title: string
    description: string
    conclusion: string
    quick_table_label: string
    criteria: string[]
    last_updated_at: string
    items: Array<{ rank: number; itemSlug: string; score: number; reason: string; isPr: boolean }>
    sources: unknown[]
    faqs: unknown[]
  }

  const allRankings: RankingInput[] = [
    ...ramenRankings.map(r         => normalizeRanking(r,                "ramen",         "niigata")),
    ...yamagataRamenRankings.map(r => normalizeRanking(r,                "ramen",         "yamagata")),
    ...chibaRamenRankings.map(r    => normalizeRanking(r,                "ramen",         "chiba")),
    ...fukushimaRamenRankings.map(r => normalizeRanking(r,               "ramen",         "fukushima")),
    ...niigataCafeRankings.map(r   => normalizeCafeRanking(r,            "cafe",          "niigata")),
    ...yamagataCafeRankings.map(r  => normalizeCafeRanking(r,            "cafe",          "yamagata")),
    ...toyamaCafeRankings.map(r    => normalizeCafeRanking(r,            "cafe",          "toyama")),
    ...niigataHotelRankings.map(r  => normalizeRanking(r,                "hotel",         "niigata")),
    ...niigataTravelAgencyRankings.map(r => normalizeRanking(r,          "travel_agency", "niigata")),
    ...shizuokaTravelAgencyRankings.map(r => normalizeRanking(r,         "travel_agency", "shizuoka")),
    ...yamagataTravelAgencyRankings.map(r => normalizeRanking(r,         "travel_agency", "yamagata")),
    ...niigataLeisureRankings.map(r => normalizeRanking(r,               "leisure",       "niigata")),
    ...niigataBeautyRankings.map(r => normalizeRanking(r,                "beauty",        "niigata")),
    ...yamagataBeautyRankings.map(r => normalizeRanking(r,               "beauty",        "yamagata")),
    ...proteinRankings.map(r       => normalizeProteinRanking(r)),
  ]

  // ranking_items の item_id 解決用に slug→id を取得
  const { data: allItemIdRows } = await es.from("items").select("id, slug")
  const itemIdBySlug = new Map((allItemIdRows ?? []).map((r: { id: string; slug: string }) => [r.slug, r.id]))

  for (const r of allRankings) {
    const rankingMeta = RANKING_CONTENT_TYPE_TO_SECTION[r.content_type]
    if (!rankingMeta) {
      err(`ranking ${r.slug}`, new Error(`Unknown legacy ranking mapping for ${r.content_type}`))
      continue
    }

    // 1. ranking 行を upsert
    const { data: rankingRow, error: re } = await es.from("rankings")
      .upsert({
        slug:              r.slug,
        major_category:    rankingMeta.majorCategory,
        section_slug:      rankingMeta.sectionSlug,
        canonical_path:    rankingCanonicalPath(r.content_type, r.slug),
        region:            r.region,
        title:             r.title,
        description:       r.description,
        conclusion:        r.conclusion,
        quick_table_label: r.quick_table_label,
        criteria:          r.criteria,
        last_updated_at:   r.last_updated_at,
        status:            "published",
        metadata:          { sources: r.sources, faqs: r.faqs, target: r.target },
      }, { onConflict: "major_category,section_slug,slug" })
      .select("id")
      .single()

    if (re || !rankingRow) { err(`ranking ${r.slug}`, re); continue }

    // 2. ranking_items を洗い替え（delete → insert）
    await es.from("ranking_items").delete().eq("ranking_id", rankingRow.id)

    const itemRows = r.items.map(item => ({
      ranking_id:        rankingRow.id,
      rank:              item.rank,
      item_slug:         item.itemSlug,
      item_id:           itemIdBySlug.get(item.itemSlug) ?? null,
      score:             item.score,
      reason:            item.reason,
      is_pr:             item.isPr,
    }))

    const { error: ie } = await es.from("ranking_items").insert(itemRows)
    if (ie) err(`ranking_items ${r.slug}`, ie)
    else ok(`ranking ${r.slug}`, itemRows.length)
  }
}

// ─────────────────────────────────────────────────────────
// 変換ヘルパー
// ─────────────────────────────────────────────────────────

function cafeToRow(c: (typeof niigataCafeItems)[number], region: string) {
  return {
    slug: c.slug, content_type: "cafe", region,
    name: c.name, description: c.description,
    image_url: c.imageUrl ?? null, address: c.address, area: c.area,
    phone: c.phone ?? null, price_range: c.priceRange,
    official_url: c.officialUrl, map_url: c.mapUrl, tags: c.tags,
    last_verified_at: c.lastVerifiedAt, editor_comment: c.editorComment,
    metadata: {
      style: c.style, wifi: c.wifi, power: c.power, parking: c.parking,
      parking_note: c.parkingNote, pet_friendly: c.petFriendly,
      reservation: c.reservation, signature_menu: c.signatureMenu,
      highlight: c.highlight, business_hours: c.businessHours,
      closed_days: c.closedDays, official_links: c.officialLinks,
      instagram_url: c.instagramUrl, sources: c.sources, faqs: c.faqs,
      related_ranking_slugs: c.relatedRankingSlugs,
    },
  }
}

function ramenToRow(r: (typeof ramenItems)[number], region: string) {
  if (r.imageUrl?.includes("images.unsplash.com")) {
    throw new Error(`ramen item ${r.slug} uses a placeholder image. Use official/SNS image URLs only, or omit imageUrl.`)
  }

  return {
    slug: r.slug, content_type: "ramen_item", region,
    name: r.name, description: r.description,
    image_url: r.imageUrl ?? null, address: r.address, area: r.area,
    phone: r.phone ?? null, price_range: r.priceRange,
    official_url: r.officialUrl, map_url: r.mapUrl, tags: r.tags,
    last_verified_at: r.lastVerifiedAt, editor_comment: r.editorComment,
    metadata: {
      genre: r.genre, parking: r.parking, parking_note: r.parkingNote,
      recommended_menu: r.recommendedMenu,
      business_hours: r.businessHours, closed_days: r.closedDays,
      official_links: r.officialLinks, sources: r.sources, faqs: r.faqs,
      related_ranking_slugs: r.relatedRankingSlugs,
    },
  }
}

function salonToRow(s: (typeof niigataBeautySalons)[number], region: string) {
  return {
    slug: s.slug, content_type: "beauty_salon", region,
    name: s.name, description: s.description,
    image_url: s.imageUrl, address: s.address, area: s.area,
    phone: s.phone ?? null, price_range: s.priceRange,
    official_url: s.officialUrl, map_url: s.mapUrl, tags: [],
    last_verified_at: s.lastVerifiedAt, editor_comment: s.editorComment,
    metadata: {
      tagline: s.tagline, access: s.access, treatments: s.treatments,
      age_groups: s.ageGroups, cut_price: s.cutPrice, color_price: s.colorPrice,
      parking: s.parking, parking_note: s.parkingNote,
      children_welcome: s.childrenWelcome, men_welcome: s.menWelcome,
      business_hours: s.businessHours, closed_days: s.closedDays,
      instagram: s.instagram, official_links: s.officialLinks,
      sources: s.sources, faqs: s.faqs,
      related_ranking_slugs: s.relatedRankingSlugs,
    },
  }
}

function travelAgencyToRow(a: (typeof niigataTravelAgencies)[number], region: string) {
  return {
    slug:             a.slug,
    content_type:     "travel_agency",
    region,
    name:             a.name,
    description:      a.description,
    image_url:        a.imageUrl,
    address:          a.address,
    area:             a.area,
    phone:            a.phone ?? null,
    price_range:      a.priceRange,
    official_url:     a.officialUrl,
    map_url:          a.mapUrl,
    tags:             a.tags,
    last_verified_at: a.lastVerifiedAt,
    editor_comment:   a.editorComment,
    metadata: {
      tagline: a.tagline,
      services: a.services,
      best_for: a.bestFor,
      consultation_style: a.consultationStyle,
      business_hours: a.businessHours,
      closed_days: a.closedDays,
      registered_travel_agency: a.registeredTravelAgency,
      official_links: a.officialLinks,
      highlight: a.highlight,
      sources: a.sources,
      faqs: a.faqs,
      related_ranking_slugs: a.relatedRankingSlugs,
    },
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeRanking(r: any, content_type: string, region: string | null) {
  return {
    slug: r.slug, content_type, region, target: null as string | null,
    title: r.title, description: r.description,
    conclusion: r.conclusion ?? "", quick_table_label: r.quickTableLabel ?? "",
    criteria: r.criteria ?? [], last_updated_at: r.lastUpdatedAt,
    sources: r.sources ?? [], faqs: r.faqs ?? [],
    items: (r.items ?? []).map((i: any) => ({
      rank: i.rank, itemSlug: i.itemSlug, score: i.score ?? 0,
      reason: i.reason ?? "", isPr: i.isPr ?? false,
    })),
  }
}

function normalizeCafeRanking(r: any, content_type: string, region: string) {
  return {
    ...normalizeRanking(r, content_type, region),
    // CafeRankingItem は cafeSlug を使う
    items: (r.items ?? []).map((i: any) => ({
      rank: i.rank, itemSlug: i.cafeSlug, score: i.score ?? 0,
      reason: i.reason ?? "", isPr: i.isPr ?? false,
    })),
  }
}

function normalizeProteinRanking(r: any) {
  return {
    slug: r.slug, content_type: "protein", region: null, target: r.target,
    title: r.title, description: r.description,
    conclusion: r.conclusion ?? "", quick_table_label: r.quickTableLabel ?? "",
    criteria: r.criteria ?? [], last_updated_at: r.lastUpdatedAt,
    sources: r.sources ?? [], faqs: r.faqs ?? [],
    items: (r.items ?? []).map((i: any) => ({
      rank: i.rank, itemSlug: i.productSlug, score: i.score ?? 0,
      reason: i.reason ?? "", isPr: false,
    })),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─────────────────────────────────────────────────────────
// エントリーポイント
// ─────────────────────────────────────────────────────────

/**
 * On-demand ISR 再検証を叩く（任意）。
 * SITE_REVALIDATE_URL（例: https://each-spirit.com/api/revalidate）と
 * REVALIDATE_SECRET が両方設定されている場合のみ実行。ローカル dev では不要。
 */
async function triggerRevalidation() {
  const revalUrl = process.env.SITE_REVALIDATE_URL
  const secret   = process.env.REVALIDATE_SECRET
  if (!revalUrl || !secret) {
    console.log("\nℹ️  SITE_REVALIDATE_URL / REVALIDATE_SECRET 未設定のため再検証はスキップ")
    return
  }
  try {
    const res = await fetch(revalUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: "{}",
    })
    console.log(`\n♻️  再検証リクエスト送信: ${res.status} ${res.ok ? "OK" : "NG"}`)
  } catch (e) {
    console.error("\n⚠️  再検証リクエスト失敗:", e)
  }
}

async function main() {
  console.log("🚀 Supabase データ移行を開始します...")
  console.log(`   URL: ${url}`)

  await migrateArticles()
  await migrateItems()
  await migrateRankings()

  console.log("\n✅ 移行完了")

  await triggerRevalidation()
}

main().catch(e => {
  console.error("❌ 移行エラー:", e)
  process.exit(1)
})
