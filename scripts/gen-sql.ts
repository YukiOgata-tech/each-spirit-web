/**
 * Generate INSERT SQL for all es.* tables.
 * Run: tsx --tsconfig scripts/tsconfig.json scripts/gen-sql.ts > scripts/out.sql
 */
import { ramenArticles }            from "@/content/ramen/articles";
import { ramenItems }               from "@/content/ramen/items";
import { ramenRankings }            from "@/content/ramen/rankings";
import { yamagataRamenItems }       from "@/content/ramen/yamagata/items";
import { yamagataRamenRankings }    from "@/content/ramen/yamagata/rankings";
import { niigataCafeItems }         from "@/content/cafe/niigata/items";
import { niigataCafeRankings }      from "@/content/cafe/niigata/rankings";
import { yamagataCafeItems }        from "@/content/cafe/yamagata/items";
import { yamagataCafeRankings }     from "@/content/cafe/yamagata/rankings";
import { toyamaCafeItems }          from "@/content/cafe/toyama/items";
import { toyamaCafeRankings }       from "@/content/cafe/toyama/rankings";
import { niigataHotels }            from "@/content/travel/niigata/hotels";
import { niigataHotelRankings }     from "@/content/travel/niigata/rankings";
import { niigataLeisureSpots }      from "@/content/leisure/niigata/spots";
import { niigataLeisureRankings }   from "@/content/leisure/niigata/rankings";
import { beautySalons as niigataBeautySalons }    from "@/content/beauty/niigata/salons";
import { beautyRankings as niigataBeautyRankings } from "@/content/beauty/niigata/rankings";
import { beautyArticles as niigataBeautyArticles } from "@/content/beauty/niigata/articles";
import { beautySalons as yamagataBeautySalons }   from "@/content/beauty/yamagata/salons";
import { beautyRankings as yamagataBeautyRankings } from "@/content/beauty/yamagata/rankings";
import { beautyArticles as yamagataBeautyArticles } from "@/content/beauty/yamagata/articles";
import { proteinProducts }          from "@/content/protein/products";
import { proteinRankings }          from "@/content/protein/rankings";
import type { CafeRanking, ProteinRanking, Ranking } from "@/lib/types";

// ── helpers ─────────────────────────────────────────────────────────────────

function s(v: string | null | undefined): string {
  if (v == null) return "NULL";
  return "'" + v.replace(/'/g, "''") + "'";
}

function j(v: unknown): string {
  if (v == null) return "NULL";
  return "'" + JSON.stringify(v).replace(/'/g, "''") + "'::jsonb";
}

function arr(items: string[]): string {
  return "ARRAY[" + items.map(s).join(", ") + "]::text[]";
}

function inferRegion(slug: string): string | null {
  if (slug.startsWith("niigata"))  return "niigata";
  if (slug.startsWith("yamagata")) return "yamagata";
  if (slug.startsWith("toyama"))   return "toyama";
  return null;
}

// ── articles ────────────────────────────────────────────────────────────────

function genArticles() {
  const rows = [
    ...ramenArticles.map(a => ({
      slug:         a.slug,
      category:     "ramen",
      region:       inferRegion(a.slug),
      title:        a.title,
      description:  a.description,
      tags:         a.tags,
      author_name:  a.author.name,
      published_at: a.publishedAt,
      metadata: {
        summary: a.summary, what_you_learn: a.whatYouLearn,
        sources: a.sources, faqs: a.faqs, related_slugs: a.relatedSlugs,
      },
    })),
    ...niigataBeautyArticles.map(a => ({
      slug:         a.slug,
      category:     "beauty",
      region:       "niigata",
      title:        a.title,
      description:  a.description,
      tags:         a.tags,
      author_name:  a.author.name,
      published_at: a.publishedAt,
      metadata: {
        summary: a.summary, what_you_learn: a.whatYouLearn,
        sources: a.sources, faqs: a.faqs, related_slugs: a.relatedSlugs,
      },
    })),
    ...yamagataBeautyArticles.map(a => ({
      slug:         a.slug,
      category:     "beauty",
      region:       "yamagata",
      title:        a.title,
      description:  a.description,
      tags:         a.tags,
      author_name:  a.author.name,
      published_at: a.publishedAt,
      metadata: {
        summary: a.summary, what_you_learn: a.whatYouLearn,
        sources: a.sources, faqs: a.faqs, related_slugs: a.relatedSlugs,
      },
    })),
  ];

  console.log("-- ========== ARTICLES ==========");
  for (const r of rows) {
    console.log(`INSERT INTO es.articles (slug, category, region, title, description, tags, author_name, status, published_at, metadata) VALUES (
  ${s(r.slug)}, ${s(r.category)}, ${s(r.region)},
  ${s(r.title)}, ${s(r.description)},
  ${arr(r.tags)}, ${s(r.author_name)}, 'published', ${s(r.published_at)},
  ${j(r.metadata)}
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();`);
  }
}

// ── items ────────────────────────────────────────────────────────────────────

type SqlItemInput = {
  name: string;
  description: string;
  imageUrl?: string | null;
  address?: string | null;
  area?: string | null;
  phone?: string | null;
  priceRange?: string | null;
  price_range?: string | null;
  officialUrl?: string | null;
  mapUrl?: string | null;
  tags?: string[];
  lastVerifiedAt?: string | null;
  editorComment?: string | null;
};

function itemRow(slug: string, content_type: string, region: string | null, x: SqlItemInput, metadata: unknown) {
  return `INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  ${s(slug)}, ${s(content_type)}, ${s(region)},
  ${s(x.name)}, ${s(x.description)}, ${s(x.imageUrl ?? null)},
  ${s(x.address ?? null)}, ${s(x.area ?? null)}, ${s(x.phone ?? null)},
  ${s(x.priceRange ?? x.price_range ?? null)}, ${s(x.officialUrl ?? null)}, ${s(x.mapUrl ?? null)},
  ${arr(x.tags ?? [])}, ${s(x.lastVerifiedAt ?? null)}, ${s(x.editorComment ?? null)},
  ${j(metadata)}
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();`;
}

function genItems() {
  console.log("\n-- ========== ITEMS ==========");

  // Ramen
  for (const r of [...ramenItems, ...yamagataRamenItems]) {
    const region = ramenItems.includes(r as typeof ramenItems[0]) ? "niigata" : "yamagata";
    console.log(itemRow(r.slug, "ramen_item", region, r, {
      genre: r.genre, parking: r.parking, parking_note: r.parkingNote,
      recommended_menu: r.recommendedMenu, business_hours: r.businessHours,
      closed_days: r.closedDays, official_links: r.officialLinks,
      sources: r.sources, faqs: r.faqs, related_ranking_slugs: r.relatedRankingSlugs,
    }));
  }

  // Cafe
  for (const c of niigataCafeItems) {
    console.log(itemRow(c.slug, "cafe", "niigata", c, {
      style: c.style, wifi: c.wifi, power: c.power, parking: c.parking,
      parking_note: c.parkingNote, pet_friendly: c.petFriendly,
      reservation: c.reservation, signature_menu: c.signatureMenu,
      highlight: c.highlight, business_hours: c.businessHours,
      closed_days: c.closedDays, official_links: c.officialLinks,
      instagram_url: c.instagramUrl, sources: c.sources, faqs: c.faqs,
      related_ranking_slugs: c.relatedRankingSlugs,
    }));
  }
  for (const c of yamagataCafeItems) {
    console.log(itemRow(c.slug, "cafe", "yamagata", c, {
      style: c.style, wifi: c.wifi, power: c.power, parking: c.parking,
      parking_note: c.parkingNote, pet_friendly: c.petFriendly,
      reservation: c.reservation, signature_menu: c.signatureMenu,
      highlight: c.highlight, business_hours: c.businessHours,
      closed_days: c.closedDays, official_links: c.officialLinks,
      instagram_url: c.instagramUrl, sources: c.sources, faqs: c.faqs,
      related_ranking_slugs: c.relatedRankingSlugs,
    }));
  }
  for (const c of toyamaCafeItems) {
    console.log(itemRow(c.slug, "cafe", "toyama", c, {
      style: c.style, wifi: c.wifi, power: c.power, parking: c.parking,
      parking_note: c.parkingNote, pet_friendly: c.petFriendly,
      reservation: c.reservation, signature_menu: c.signatureMenu,
      highlight: c.highlight, business_hours: c.businessHours,
      closed_days: c.closedDays, official_links: c.officialLinks,
      instagram_url: c.instagramUrl, sources: c.sources, faqs: c.faqs,
      related_ranking_slugs: c.relatedRankingSlugs,
    }));
  }

  // Hotels
  for (const h of niigataHotels) {
    console.log(itemRow(h.slug, "hotel", "niigata", {
      ...h, priceRange: h.pricePerPerson, tags: h.tags
    }, {
      style: h.style, meals: h.meals, onsen: h.onsen, onsen_note: h.onsenNote,
      check_in: h.checkIn, check_out: h.checkOut,
      parking: h.parking, parking_note: h.parkingNote,
      highlight: h.highlight, official_links: h.officialLinks,
      sources: h.sources, faqs: h.faqs,
      related_ranking_slugs: h.relatedRankingSlugs,
    }));
  }

  // Leisure spots
  for (const sp of niigataLeisureSpots) {
    console.log(itemRow(sp.slug, "leisure_spot", "niigata", {
      ...sp, priceRange: sp.priceRange
    }, {
      kind: sp.kind, genre: sp.genre, best_for: sp.bestFor, highlight: sp.highlight,
      parking: sp.parking, parking_note: sp.parkingNote,
      business_hours: sp.businessHours, closed_days: sp.closedDays,
      official_links: sp.officialLinks, sources: sp.sources, faqs: sp.faqs,
      related_ranking_slugs: sp.relatedRankingSlugs,
    }));
  }

  // Beauty salons
  for (const sal of niigataBeautySalons) {
    console.log(itemRow(sal.slug, "beauty_salon", "niigata", {
      ...sal, tags: []
    }, {
      tagline: sal.tagline, access: sal.access, treatments: sal.treatments,
      age_groups: sal.ageGroups, cut_price: sal.cutPrice, color_price: sal.colorPrice,
      parking: sal.parking, parking_note: sal.parkingNote,
      children_welcome: sal.childrenWelcome, men_welcome: sal.menWelcome,
      business_hours: sal.businessHours, closed_days: sal.closedDays,
      instagram: sal.instagram, official_links: sal.officialLinks,
      sources: sal.sources, faqs: sal.faqs,
      related_ranking_slugs: sal.relatedRankingSlugs,
    }));
  }
  for (const sal of yamagataBeautySalons) {
    console.log(itemRow(sal.slug, "beauty_salon", "yamagata", {
      ...sal, tags: []
    }, {
      tagline: sal.tagline, access: sal.access, treatments: sal.treatments,
      age_groups: sal.ageGroups, cut_price: sal.cutPrice, color_price: sal.colorPrice,
      parking: sal.parking, parking_note: sal.parkingNote,
      children_welcome: sal.childrenWelcome, men_welcome: sal.menWelcome,
      business_hours: sal.businessHours, closed_days: sal.closedDays,
      instagram: sal.instagram, official_links: sal.officialLinks,
      sources: sal.sources, faqs: sal.faqs,
      related_ranking_slugs: sal.relatedRankingSlugs,
    }));
  }

  // Protein
  for (const p of proteinProducts) {
    console.log(itemRow(p.slug, "protein", null, {
      name: `${p.brand} ${p.name}`, description: p.description,
      imageUrl: p.imageUrl, address: null, area: null,
      phone: null, priceRange: `¥${p.packagePrice.toLocaleString("ja-JP")}`,
      officialUrl: p.officialUrl, mapUrl: null,
      tags: p.features, lastVerifiedAt: p.lastVerifiedAt, editorComment: p.editorNote
    }, {
      brand: p.brand, protein_type: p.proteinType, targets: p.targets,
      serving_size: p.servingSize, protein: p.protein, calories: p.calories,
      carbs: p.carbs, fat: p.fat, package_weight: p.packageWeight,
      price_per_kg: p.pricePerKg, flavors: p.flavors,
      pros: p.pros, cons: p.cons, sources: p.sources, faqs: p.faqs,
    }));
  }
}

// ── rankings ─────────────────────────────────────────────────────────────────

type RankingRow = {
  slug: string;
  content_type: string;
  region: string | null;
  item_content_type: string;
  title: string;
  description: string;
  conclusion: string;
  quick_table_label: string;
  criteria: string[];
  last_updated_at: string;
  sources: unknown;
  faqs: unknown;
  items: Array<{ rank: number; itemSlug: string; score: number; reason: string; isPr: boolean }>;
};

type SourceRanking = Ranking | CafeRanking | ProteinRanking;
type SourceRankingItem = SourceRanking["items"][number];

function getRankingItemSlug(item: SourceRankingItem, itemKey: "itemSlug" | "cafeSlug" | "productSlug") {
  if (itemKey === "cafeSlug" && "cafeSlug" in item) return item.cafeSlug;
  if (itemKey === "productSlug" && "productSlug" in item) return item.productSlug;
  if ("itemSlug" in item) return item.itemSlug;
  return "";
}

function normalize(
  r: SourceRanking,
  ct: string,
  ict: string,
  region: string | null,
  itemKey: "itemSlug" | "cafeSlug" | "productSlug" = "itemSlug",
): RankingRow {
  return {
    slug: r.slug, content_type: ct, region, item_content_type: ict,
    title: r.title, description: r.description,
    conclusion: r.conclusion ?? "", quick_table_label: r.quickTableLabel ?? "",
    criteria: r.criteria ?? [], last_updated_at: r.lastUpdatedAt,
    sources: r.sources ?? [], faqs: r.faqs ?? [],
    items: r.items.map((i) => ({
      rank: i.rank, itemSlug: getRankingItemSlug(i, itemKey),
      score: i.score ?? 0, reason: i.reason ?? "", isPr: "isPr" in i ? i.isPr : false,
    })),
  };
}

function genRankings() {
  console.log("\n-- ========== RANKINGS + RANKING_ITEMS ==========");

  const all: RankingRow[] = [
    ...ramenRankings.map(r         => normalize(r, "ramen",   "ramen_item",   "niigata")),
    ...yamagataRamenRankings.map(r => normalize(r, "ramen",   "ramen_item",   "yamagata")),
    ...niigataCafeRankings.map(r   => normalize(r, "cafe",    "cafe",         "niigata",  "cafeSlug")),
    ...yamagataCafeRankings.map(r  => normalize(r, "cafe",    "cafe",         "yamagata", "cafeSlug")),
    ...toyamaCafeRankings.map(r    => normalize(r, "cafe",    "cafe",         "toyama",   "cafeSlug")),
    ...niigataHotelRankings.map(r  => normalize(r, "hotel",   "hotel",        "niigata")),
    ...niigataLeisureRankings.map(r=> normalize(r, "leisure", "leisure_spot", "niigata")),
    ...niigataBeautyRankings.map(r => normalize(r, "beauty",  "beauty_salon", "niigata")),
    ...yamagataBeautyRankings.map(r=> normalize(r, "beauty",  "beauty_salon", "yamagata")),
    ...proteinRankings.map(r       => normalize(r, "protein", "protein",      null, "productSlug")),
  ];

  for (const r of all) {
    // Use a DO block so we can reference the inserted/updated row's ID
    console.log(`DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    ${s(r.slug)}, ${s(r.content_type)}, ${s(r.region)},
    ${s(r.title)}, ${s(r.description)}, ${s(r.conclusion)},
    ${s(r.quick_table_label)}, ${arr(r.criteria)},
    ${s(r.last_updated_at)}, 'published',
    ${j({ sources: r.sources, faqs: r.faqs })}
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type=${s(r.content_type)} AND slug=${s(r.slug)};
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  ${r.items.map(i => `INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, ${i.rank}, ${s(r.item_content_type)}, ${s(i.itemSlug)}, ${i.score}, ${s(i.reason)}, ${i.isPr});`).join("\n  ")}
END $$;`);
  }
}

// ── main ──────────────────────────────────────────────────────────────────────

genArticles();
genItems();
genRankings();

console.log("\n-- Done");
