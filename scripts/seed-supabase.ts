/**
 * Supabase データ移行スクリプト
 * ローカル TypeScript コンテンツファイルを es.* テーブルに upsert します。
 *
 * 実行前の準備:
 *   1. Supabase Dashboard → Settings → API → Extra schemas に "es" を追加
 *   2. .env.local に以下を追加:
 *        SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
 *      （ダッシュボード → Settings → API → service_role の値）
 *
 * 実行方法:
 *   npm run db:seed
 *
 * 冪等: 何度実行しても安全（upsert）
 */

import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import ws from "ws"
import { readFileSync } from "fs"
import { join } from "path"

// ── コンテンツ import ──────────────────────────────────────
import { ramenArticles }         from "@/content/ramen/articles"
import { ramenItems }            from "@/content/ramen/items"
import { ramenRankings }         from "@/content/ramen/rankings"
import { yamagataRamenItems }    from "@/content/ramen/yamagata/items"
import { yamagataRamenRankings } from "@/content/ramen/yamagata/rankings"
import { niigataCafeItems }      from "@/content/cafe/niigata/items"
import { niigataCafeRankings }   from "@/content/cafe/niigata/rankings"
import { yamagataCafeItems }     from "@/content/cafe/yamagata/items"
import { yamagataCafeRankings }  from "@/content/cafe/yamagata/rankings"
import { toyamaCafeItems }       from "@/content/cafe/toyama/items"
import { toyamaCafeRankings }    from "@/content/cafe/toyama/rankings"
import { niigataHotels }         from "@/content/travel/niigata/hotels"
import { niigataHotelRankings }  from "@/content/travel/niigata/rankings"
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

function err(label: string, error: unknown) {
  console.error(`  ❌ ${label}:`, error)
}

function readMd(dir: string, file: string): string {
  try {
    return readFileSync(join(process.cwd(), "content", dir, file), "utf8")
  } catch {
    return ""
  }
}

/** region を slug プレフィックスから推定 */
function inferRegion(slug: string): string | null {
  if (slug.startsWith("niigata"))  return "niigata"
  if (slug.startsWith("yamagata")) return "yamagata"
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
      body_md:         readMd("ramen/articles", a.markdownFile),
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
      body_md:         readMd("beauty/niigata/articles", a.markdownFile),
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
      body_md:         readMd("beauty/yamagata/articles", a.markdownFile),
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
    .upsert(rows, { onConflict: "slug", count: "exact" })
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
    .upsert(cafeRows, { onConflict: "content_type,slug", count: "exact" })
  if (e1) err("cafe items", e1); else ok("cafe items", c1 ?? cafeRows.length)

  // ラーメン
  const ramenRows = [
    ...ramenItems.map(r         => ramenToRow(r, "niigata")),
    ...yamagataRamenItems.map(r => ramenToRow(r, "yamagata")),
  ]
  const { error: e2, count: c2 } = await es.from("items")
    .upsert(ramenRows, { onConflict: "content_type,slug", count: "exact" })
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
    .upsert(hotelRows, { onConflict: "content_type,slug", count: "exact" })
  if (e3) err("hotel items", e3); else ok("hotel items", c3 ?? hotelRows.length)

  // 美容サロン
  const salonRows = [
    ...niigataBeautySalons.map(s  => salonToRow(s, "niigata")),
    ...yamagataBeautySalons.map(s => salonToRow(s, "yamagata")),
  ]
  const { error: e4, count: c4 } = await es.from("items")
    .upsert(salonRows, { onConflict: "content_type,slug", count: "exact" })
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
    .upsert(leisureRows, { onConflict: "content_type,slug", count: "exact" })
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
      serving_size: p.servingSize, protein: p.protein, calories: p.calories,
      carbs: p.carbs, fat: p.fat, package_weight: p.packageWeight,
      price_per_kg: p.pricePerKg, flavors: p.flavors,
      pros: p.pros, cons: p.cons, sources: p.sources, faqs: p.faqs,
    },
  }))
  const { error: e6, count: c6 } = await es.from("items")
    .upsert(proteinRows, { onConflict: "content_type,slug", count: "exact" })
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
    item_content_type: string
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
    ...ramenRankings.map(r         => normalizeRanking(r,                "ramen",        "ramen_item",    "niigata")),
    ...yamagataRamenRankings.map(r => normalizeRanking(r,                "ramen",        "ramen_item",    "yamagata")),
    ...niigataCafeRankings.map(r   => normalizeCafeRanking(r,           "cafe",          "cafe",          "niigata")),
    ...yamagataCafeRankings.map(r  => normalizeCafeRanking(r,           "cafe",          "cafe",          "yamagata")),
    ...toyamaCafeRankings.map(r    => normalizeCafeRanking(r,           "cafe",          "cafe",          "toyama")),
    ...niigataHotelRankings.map(r  => normalizeRanking(r,               "hotel",         "hotel",         "niigata")),
    ...niigataLeisureRankings.map(r => normalizeRanking(r,              "leisure",       "leisure_spot",  "niigata")),
    ...niigataBeautyRankings.map(r => normalizeRanking(r,               "beauty",        "beauty_salon",  "niigata")),
    ...yamagataBeautyRankings.map(r => normalizeRanking(r,              "beauty",        "beauty_salon",  "yamagata")),
    ...proteinRankings.map(r       => normalizeProteinRanking(r)),
  ]

  for (const r of allRankings) {
    // 1. ranking 行を upsert
    const { data: rankingRow, error: re } = await es.from("rankings")
      .upsert({
        slug:              r.slug,
        content_type:      r.content_type,
        region:            r.region,
        title:             r.title,
        description:       r.description,
        conclusion:        r.conclusion,
        quick_table_label: r.quick_table_label,
        criteria:          r.criteria,
        last_updated_at:   r.last_updated_at,
        status:            "published",
        metadata:          { sources: r.sources, faqs: r.faqs, target: r.target },
      }, { onConflict: "content_type,slug" })
      .select("id")
      .single()

    if (re || !rankingRow) { err(`ranking ${r.slug}`, re); continue }

    // 2. ranking_items を洗い替え（delete → insert）
    await es.from("ranking_items").delete().eq("ranking_id", rankingRow.id)

    const itemRows = r.items.map(item => ({
      ranking_id:        rankingRow.id,
      rank:              item.rank,
      item_content_type: r.item_content_type,
      item_slug:         item.itemSlug,
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

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeRanking(r: any, content_type: string, item_content_type: string, region: string | null) {
  return {
    slug: r.slug, content_type, region, target: null as string | null, item_content_type,
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

function normalizeCafeRanking(r: any, content_type: string, item_content_type: string, region: string) {
  return {
    ...normalizeRanking(r, content_type, item_content_type, region),
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
    item_content_type: "protein",
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
