import type { Metadata } from "next";
import type {
  Article,
  CafeItem,
  CafeRanking,
  CafeRankingItem,
  FAQ,
  Hotel,
  Item,
  LeisureRanking,
  LeisureSpot,
  ProteinProduct,
  ProteinRanking,
  ProteinRankingEntry,
  Ranking,
  RankingItem,
  Salon,
  TravelAgency,
  TravelApp,
} from "@/lib/types";
import { absoluteUrl, ogRankingImage, routes, siteUrl } from "@/lib/routes";
import { majorMetaImage } from "@/lib/category-media";
import { itemClassDef } from "@/lib/content-models";
import type { GenericItem } from "@/lib/types";
import { site } from "@/content/site";

// ─── Core metadata ───────────────────────────────────────────────────────────

/** path の先頭セグメント（major category）から meta 画像を引く。/food/... → food */
function majorImageForPath(path: string): string | undefined {
  return majorMetaImage(path.split("/").filter(Boolean)[0]);
}

/** items ページの meta keywords。構造化フィールドから自動生成し、任意の手動追記(extra)を末尾にマージ。
 *  name ＋ section ラベル ＋ genres ＋ tags ＋ 都道府県 ＋ エリア ＋ extra（seo.keywords）。重複除去。 */
export function itemKeywords(
  item: { name: string; genres: string[]; tags: string[]; addressRegion?: string; area: string },
  sectionLabel?: string,
  extra: string[] = [],
): string[] {
  return Array.from(new Set(
    [item.name, sectionLabel, ...item.genres, ...item.tags, item.addressRegion, item.area, ...extra]
      .filter((s): s is string => typeof s === "string" && s.trim() !== ""),
  ));
}

/** items の OG 画像URL（item_class 別背景＋name を動的生成する /api/og/item）。絶対URL。 */
export function ogItemImageUrl(major: string, section: string, slug: string): string {
  return absoluteUrl(`/api/og/item?major=${encodeURIComponent(major)}&section=${encodeURIComponent(section)}&slug=${encodeURIComponent(slug)}`);
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  // 明示画像 >（ランキングページは ranking-fallback / それ以外はメジャー配下の共通 meta 画像）> サイト既定 OG
  // 個別ページ・ランキングは generateMetadata 側で DB の image_url を image に渡すため、
  // image_url があればそれが最優先。無い場合のみこのフォールバックが効く。
  const isRankingPath = /\/rankings(?:\/|$)/.test(path);
  // ランキングは画像未設定なら、タイトルから自動生成する OG 画像へフォールバック（記事と同方針）
  const fallbackImage = isRankingPath ? ogRankingImage(title) : majorImageForPath(path);
  // image は空文字も「未設定」とみなす（DB の image_url が空のケース）
  const explicitImage = typeof image === "string" && image.trim() !== "" ? image : undefined;
  const resolvedImage = explicitImage ?? fallbackImage ?? site.ogImage;
  const fullTitle =
    title === site.name || title === site.title ? title : title + " | " + site.titleSuffix;
  return {
    title: { absolute: fullTitle },
    description,
    keywords: keywords ? [...site.keywords, ...keywords] : site.keywords,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: site.name,
      locale: "ja_JP",
      type: "website",
      images: [{ url: absoluteUrl(resolvedImage), width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(resolvedImage)],
    },
  };
}

// ─── Site-wide schemas ────────────────────────────────────────────────────────

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.alternateNames,
    url: siteUrl,
    description: site.description,
    publisher: organizationSchema(),
    potentialAction: {
      "@type": "SearchAction",
      target: siteUrl + routes.search + "?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Each Spirit 編集部",
    alternateName: ["イーチスピリット編集部", site.displayName],
    url: siteUrl,
    logo: absoluteUrl(site.icon),
    sameAs: site.sameAs ?? [],
  };
}

// ─── Item (型別 schema.org) ────────────────────────────────────────────────────

/** content_model → 精密な schema.org 型。無ければ item_class の既定型にフォールバック。 */
const CONTENT_MODEL_SCHEMA_TYPE: Record<string, string> = {
  restaurant: "Restaurant",
  salon: "HairSalon",
  hotel: "Hotel",
  spot: "TouristAttraction",
  "travel-service": "TravelAgency",
  product: "Product",
  title: "CreativeWork",
};

/** major:section 単位の型上書き（content_model が同じでも型を分けたい場合。例: cafe は CafeOrCoffeeShop）。 */
const SECTION_SCHEMA_TYPE: Record<string, string> = {
  "food:cafe": "CafeOrCoffeeShop",
};

/** history の日付文字列を ISO 8601（YYYY / YYYY-MM / YYYY-MM-DD、桁が揃う範囲）に正規化。
 *  「2020」「2020-04」「2020/4/1」「2020年4月1日」等から数字を抽出。先頭は4桁年のみ採用。 */
function normalizeHistoryDate(raw: string): { key: number; iso: string } | undefined {
  const nums = raw.match(/\d+/g);
  if (!nums || nums[0]?.length !== 4) return undefined;
  const year = Number(nums[0]);
  let iso = nums[0];
  let key = year * 10000;
  if (nums[1]) {
    const mo = Math.min(12, Math.max(1, Number(nums[1])));
    iso += "-" + String(mo).padStart(2, "0");
    key += mo * 100;
    if (nums[2]) {
      const da = Math.min(31, Math.max(1, Number(nums[2])));
      iso += "-" + String(da).padStart(2, "0");
      key += da;
    }
  }
  return { key, iso };
}

/** history のうち最古の日付を ISO で返す（schema.org の foundingDate/datePublished/releaseDate 用）。 */
function earliestHistoryDateISO(history: ReadonlyArray<{ date: string }>): string | undefined {
  let best: { key: number; iso: string } | undefined;
  for (const h of history) {
    const n = normalizeHistoryDate(h.date);
    if (n && (!best || n.key < best.key)) best = n;
  }
  return best?.iso;
}

/** 真偽 metadata → schema.org amenityFeature の表示名 */
const AMENITY_LABELS: Record<string, string> = {
  parking: "駐車場", wifi: "WiFi", power: "電源", onsen: "温泉",
  pet_friendly: "ペット可", children_welcome: "子連れ可", men_welcome: "メンズ可",
};

/**
 * item の精密 schema.org を生成（汎用詳細エンジン用）。content_model で型を精密化し、
 * 構造化列（addressRegion/geo）・metadata・公式リンク・編集スコアから組み立てる。
 * item ごとに値が異なる前提で「在る項目だけ」出力する（疎データでも妥当）。
 */
export function itemSchema(
  item: GenericItem,
  path: string,
  opts?: { contentModel?: string; aggregateRating?: number },
) {
  const m = (item.metadata ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : undefined);
  const schemaType =
    SECTION_SCHEMA_TYPE[`${item.majorCategory}:${item.sectionSlug}`] ||
    (opts?.contentModel && CONTENT_MODEL_SCHEMA_TYPE[opts.contentModel]) ||
    itemClassDef(item.itemClass).schemaType;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: item.name,
    description: item.description,
    url: absoluteUrl(path),
  };
  if (item.imageUrl) data.image = item.imageUrl;

  // sameAs: 公式URL ＋ 関連リンクの外部URL（official_links は related_link に統合済み）
  const links: string[] = [];
  if (item.officialUrl) links.push(item.officialUrl);
  for (const l of item.relatedLink) if (/^https?:\/\//.test(l.url)) links.push(l.url);
  if (links.length) data.sameAs = Array.from(new Set(links));

  if (item.itemClass === "physical_service" || item.itemClass === "intangible_service") {
    if (item.address) {
      data.address = {
        "@type": "PostalAddress",
        streetAddress: item.address,
        ...(item.addressRegion ? { addressRegion: item.addressRegion } : {}),
        addressCountry: "JP",
      };
    }
    if (item.phone) data.telephone = item.phone;
    if (item.priceRange) data.priceRange = item.priceRange;
    const hours = str(m.business_hours);
    if (hours) data.openingHours = hours;
    if (item.mapUrl) data.hasMap = item.mapUrl;
    if (item.latitude != null && item.longitude != null) {
      data.geo = { "@type": "GeoCoordinates", latitude: item.latitude, longitude: item.longitude };
    }
    if ((schemaType === "Restaurant" || schemaType === "CafeOrCoffeeShop") && item.genres.length) {
      data.servesCuisine = item.genres;
    }
    const amenities = Object.entries(AMENITY_LABELS)
      .filter(([k]) => m[k] === true)
      .map(([, label]) => ({ "@type": "LocationFeatureSpecification", name: label, value: true }));
    if (amenities.length > 0) data.amenityFeature = amenities;
  } else if (item.itemClass === "product") {
    const brand = str(m.brand);
    if (brand) data.brand = { "@type": "Brand", name: brand };
  } else if (item.itemClass === "media") {
    if (item.genres.length) data.genre = item.genres;
  }

  // history 最古日付 → item_class 別の日付プロパティ（foundingDate / datePublished / releaseDate）
  const dateProp = itemClassDef(item.itemClass).dateSchemaProp;
  if (dateProp && data[dateProp] === undefined) {
    const earliest = earliestHistoryDateISO(item.history);
    if (earliest) data[dateProp] = earliest;
  }

  if (opts?.aggregateRating !== undefined && Number.isFinite(opts.aggregateRating)) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (opts.aggregateRating / 20).toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: 1,
    };
  }
  return data;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export function faqSchema(faqs: FAQ[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// ─── Speakable (AI Overview / Voice search) ───────────────────────────────────

/** Add to ranking and shop pages (non-Article types) */
export function speakableWebPageSchema(url: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: absoluteUrl(url),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable='title']", "[data-speakable='description']"],
    },
  };
}

// ─── HowTo ────────────────────────────────────────────────────────────────────

export function howToSchema({
  title,
  description,
  steps,
}: {
  title: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

// ─── Articles ─────────────────────────────────────────────────────────────────

/** url: canonical URL for this article (e.g. routes.articleByCategory(category, slug) or articleHref(article)) */
export function articleSchema(article: Article, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.author.name, url: absoluteUrl(routes.about) },
    publisher: organizationSchema(),
    mainEntityOfPage: absoluteUrl(url),
    image: absoluteUrl(article.coverImageUrl ?? site.icon),
    about: article.tags,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable='title']", "[data-speakable='description']"],
    },
  };
}

// ─── Ramen ────────────────────────────────────────────────────────────────────

export function itemListSchema(ranking: Ranking, entries: { entry: { rank: number; score: number }; item: Item }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ranking.title,
    description: ranking.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map(({ entry, item }) => ({
      "@type": "ListItem",
      position: entry.rank,
      item: {
        "@type": "Restaurant",
        name: item.name,
        url: absoluteUrl(routes.ramenItem(item.slug)),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (entry.score / 20).toFixed(1),
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1",
        },
      },
    })),
  };
}

export function restaurantSchema(item: Item, editorialScore?: number) {
  const prefectureMatch = item.address.match(/^(東京都|北海道|.{2,3}[都道府県])/);
  const addressRegion = prefectureMatch?.[1] ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: item.name,
    description: item.description,
    servesCuisine: "Ramen",
    url: absoluteUrl(routes.ramenItem(item.slug)),
    sameAs: item.officialLinks.map((link) => link.url),
    telephone: item.phone,
    ...(item.imageUrl && { image: absoluteUrl(item.imageUrl) }),
    address: {
      "@type": "PostalAddress",
      streetAddress: item.address,
      addressRegion,
      addressCountry: "JP",
    },
    priceRange: item.priceRange,
    openingHours: item.businessHours,
    hasMap: item.mapUrl,
    ...(editorialScore !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (editorialScore / 20).toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount: "1",
      },
    }),
  };
}

export function ramenRegionItemListSchema(regionName: string, items: Item[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: regionName + "ラーメン 掲載店舗",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Restaurant",
        name: item.name,
        url: absoluteUrl(routes.ramenItem(item.slug)),
        servesCuisine: "Ramen",
        address: {
          "@type": "PostalAddress",
          streetAddress: item.address,
          addressCountry: "JP",
        },
      },
    })),
  };
}

// ─── Leisure ─────────────────────────────────────────────────────────────────

export function leisureItemListSchema(ranking: LeisureRanking, region: string, entries: { entry: { rank: number; score: number }; spot: LeisureSpot }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ranking.title,
    description: ranking.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map(({ entry, spot }) => ({
      "@type": "ListItem",
      position: entry.rank,
      item: {
        "@type": "TouristAttraction",
        name: spot.name,
        url: absoluteUrl(routes.leisureSpot(region, spot.slug)),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (entry.score / 20).toFixed(1),
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1",
        },
      },
    })),
  };
}

export function touristAttractionSchema(region: string, spot: LeisureSpot, editorialScore?: number) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: spot.name,
    description: spot.description,
    url: absoluteUrl(routes.leisureSpot(region, spot.slug)),
    sameAs: spot.officialLinks.map((link) => link.url),
    telephone: spot.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: spot.address,
      addressRegion: "新潟県",
      addressCountry: "JP",
    },
    openingHours: spot.businessHours,
    hasMap: spot.mapUrl,
    ...(editorialScore !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (editorialScore / 20).toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount: "1",
      },
    }),
  };
}

// ─── Travel / Hotel ───────────────────────────────────────────────────────────

export function lodgingBusinessSchema(region: string, hotel: Hotel, editorialScore?: number) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: hotel.name,
    description: hotel.description,
    url: absoluteUrl(routes.travelHotel(region, hotel.slug)),
    image: absoluteUrl(hotel.imageUrl),
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressCountry: "JP",
    },
    priceRange: hotel.pricePerPerson,
    telephone: hotel.phone,
    hasMap: hotel.mapUrl,
    amenityFeature: hotel.onsen
      ? [{ "@type": "LocationFeatureSpecification", name: "温泉", value: true }]
      : [],
    ...(editorialScore !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (editorialScore / 20).toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount: "1",
      },
    }),
  };
}

export function travelRankingItemListSchema(
  region: string,
  ranking: Ranking,
  entries: { entry: RankingItem; hotel: Hotel }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ranking.title,
    description: ranking.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map(({ entry, hotel }) => ({
      "@type": "ListItem",
      position: entry.rank,
      item: {
        "@type": "LodgingBusiness",
        name: hotel.name,
        url: absoluteUrl(routes.travelHotel(region, hotel.slug)),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (entry.score / 20).toFixed(1),
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1",
        },
      },
    })),
  };
}

export function travelRegionItemListSchema(region: string, regionName: string, hotels: Hotel[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: regionName + " おすすめ旅館・温泉宿",
    numberOfItems: hotels.length,
    itemListElement: hotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LodgingBusiness",
        name: hotel.name,
        url: absoluteUrl(routes.travelHotel(region, hotel.slug)),
        address: {
          "@type": "PostalAddress",
          streetAddress: hotel.address,
          addressCountry: "JP",
        },
      },
    })),
  };
}

// ─── Travel Services / Agencies ──────────────────────────────────────────────

export function travelAgencySchema(region: string, agency: TravelAgency, editorialScore?: number) {
  const prefectureMatch = agency.address.match(/^(東京都|北海道|.{2,3}[都道府県])/);
  const addressRegion = prefectureMatch?.[1] ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: agency.name,
    description: agency.description,
    url: absoluteUrl(routes.travelAgency(region, agency.slug)),
    image: absoluteUrl(agency.imageUrl),
    sameAs: agency.officialLinks.map((link) => link.url),
    telephone: agency.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: agency.address,
      addressRegion,
      addressCountry: "JP",
    },
    priceRange: agency.priceRange,
    openingHours: agency.businessHours,
    hasMap: agency.mapUrl,
    makesOffer: agency.services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service },
    })),
    ...(editorialScore !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (editorialScore / 20).toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount: "1",
      },
    }),
  };
}

export function travelAgencyRegionItemListSchema(region: string, regionName: string, agencies: TravelAgency[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: regionName + " 掲載旅行会社",
    numberOfItems: agencies.length,
    itemListElement: agencies.map((agency, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TravelAgency",
        name: agency.name,
        url: absoluteUrl(routes.travelAgency(region, agency.slug)),
        address: {
          "@type": "PostalAddress",
          streetAddress: agency.address,
          addressCountry: "JP",
        },
      },
    })),
  };
}

export function travelAgencyRankingItemListSchema(
  region: string,
  ranking: Ranking,
  entries: { entry: RankingItem; agency: TravelAgency }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ranking.title,
    description: ranking.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map(({ entry, agency }) => ({
      "@type": "ListItem",
      position: entry.rank,
      item: {
        "@type": "TravelAgency",
        name: agency.name,
        url: absoluteUrl(routes.travelAgency(region, agency.slug)),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (entry.score / 20).toFixed(1),
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1",
        },
      },
    })),
  };
}

export function travelAppItemListSchema(apps: TravelApp[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "おすすめ旅行アプリ",
    numberOfItems: apps.length,
    itemListElement: apps.map((app, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: app.name,
        applicationCategory: "TravelApplication",
        operatingSystem: app.platforms.join(", "),
        description: app.description,
        url: app.officialUrl,
        offers: {
          "@type": "Offer",
          priceCurrency: "JPY",
          price: app.priceRange,
        },
        publisher: { "@type": "Organization", name: app.brand },
      },
    })),
  };
}

// ─── Cafe ─────────────────────────────────────────────────────────────────────

export function cafeSchema(region: string, cafe: CafeItem, editorialScore?: number) {
  const prefectureMatch = cafe.address.match(/^(東京都|北海道|.{2,3}[都道府県])/);
  const addressRegion = prefectureMatch?.[1] ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafe.name,
    description: cafe.description,
    url: absoluteUrl(routes.cafeItem(region, cafe.slug)),
    ...(cafe.imageUrl && { image: absoluteUrl(cafe.imageUrl) }),
    sameAs: cafe.officialLinks.map((link) => link.url),
    telephone: cafe.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: cafe.address,
      addressRegion,
      addressCountry: "JP",
    },
    priceRange: cafe.priceRange,
    openingHours: cafe.businessHours,
    hasMap: cafe.mapUrl,
    amenityFeature: [
      ...(cafe.wifi ? [{ "@type": "LocationFeatureSpecification", name: "WiFi", value: true }] : []),
      ...(cafe.parking ? [{ "@type": "LocationFeatureSpecification", name: "駐車場", value: true }] : []),
    ],
    ...(editorialScore !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (editorialScore / 20).toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount: "1",
      },
    }),
  };
}

export function cafeRegionItemListSchema(region: string, regionName: string, cafes: CafeItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: regionName + " カフェ 掲載店舗",
    numberOfItems: cafes.length,
    itemListElement: cafes.map((cafe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CafeOrCoffeeShop",
        name: cafe.name,
        url: absoluteUrl(routes.cafeItem(region, cafe.slug)),
        address: {
          "@type": "PostalAddress",
          streetAddress: cafe.address,
          addressCountry: "JP",
        },
      },
    })),
  };
}

export function cafeRankingItemListSchema(
  region: string,
  ranking: CafeRanking,
  entries: { entry: CafeRankingItem; cafe: CafeItem }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ranking.title,
    description: ranking.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map(({ entry, cafe }) => ({
      "@type": "ListItem",
      position: entry.rank,
      item: {
        "@type": "CafeOrCoffeeShop",
        name: cafe.name,
        url: absoluteUrl(routes.cafeItem(region, cafe.slug)),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (entry.score / 20).toFixed(1),
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1",
        },
      },
    })),
  };
}

// ─── Beauty ───────────────────────────────────────────────────────────────────

export function beautySalonSchema(region: string, salon: Salon, editorialScore?: number) {
  const prefectureMatch = salon.address.match(/^(東京都|北海道|.{2,3}[都道府県])/);
  const addressRegion = prefectureMatch?.[1] ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: salon.name,
    description: salon.description,
    url: absoluteUrl(routes.beautySalon(region, salon.slug)),
    image: absoluteUrl(salon.imageUrl),
    sameAs: [
      ...(salon.officialUrl && salon.officialUrl !== "#" ? [salon.officialUrl] : []),
      ...(salon.instagram && salon.instagram !== "#" ? [salon.instagram] : []),
    ],
    telephone: salon.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: salon.address,
      addressRegion,
      addressCountry: "JP",
    },
    openingHours: salon.businessHours,
    hasMap: salon.mapUrl,
    makesOffer: salon.treatments.map((t) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: treatmentLabel(t) },
    })),
    ...(editorialScore !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (editorialScore / 20).toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount: "1",
      },
    }),
  };
}

export function beautyRankingItemListSchema(
  region: string,
  ranking: Ranking,
  entries: { entry: RankingItem; salon: Salon }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ranking.title,
    description: ranking.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map(({ entry, salon }) => ({
      "@type": "ListItem",
      position: entry.rank,
      item: {
        "@type": "HealthAndBeautyBusiness",
        name: salon.name,
        url: absoluteUrl(routes.beautySalon(region, salon.slug)),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (entry.score / 20).toFixed(1),
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1",
        },
      },
    })),
  };
}

function treatmentLabel(t: string): string {
  const labels: Record<string, string> = {
    cut: "カット", color: "カラー", highlight: "ハイライト", perm: "パーマ",
    straightening: "縮毛矯正", treatment: "トリートメント", headSpa: "ヘッドスパ", hairQuality: "髪質改善",
  };
  return labels[t] ?? t;
}

// ─── Protein / Product ────────────────────────────────────────────────────────

export function productSchema(product: ProteinProduct, editorialScore?: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    image: product.imageUrl,
    url: absoluteUrl(routes.proteinProduct(product.slug)),
    offers: {
      "@type": "Offer",
      price: product.packagePrice.toString(),
      priceCurrency: "JPY",
      url: product.officialUrl,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: product.brand },
    },
    nutrition: {
      "@type": "NutritionInformation",
      servingSize: `${product.servingSize}g`,
      calories: `${product.calories} kcal`,
      proteinContent: `${product.protein} g`,
      carbohydrateContent: `${product.carbs} g`,
      fatContent: `${product.fat} g`,
    },
    ...(editorialScore !== undefined && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (editorialScore / 20).toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount: "1",
      },
    }),
  };
}

export function proteinRankingItemListSchema(
  ranking: ProteinRanking,
  entries: { entry: ProteinRankingEntry; product: ProteinProduct }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ranking.title,
    description: ranking.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: entries.length,
    itemListElement: entries.map(({ entry, product }) => ({
      "@type": "ListItem",
      position: entry.rank,
      item: {
        "@type": "Product",
        name: product.name,
        brand: { "@type": "Brand", name: product.brand },
        url: absoluteUrl(routes.proteinProduct(product.slug)),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (entry.score / 20).toFixed(1),
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1",
        },
      },
    })),
  };
}
