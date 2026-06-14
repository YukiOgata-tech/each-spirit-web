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
import { absoluteUrl, routes, siteUrl } from "@/lib/routes";
import { site } from "@/content/site";

// ─── Core metadata ───────────────────────────────────────────────────────────

export function pageMetadata({
  title,
  description,
  path,
  image = site.ogImage,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const fullTitle = title === site.name || title === site.title ? title : title + " | " + site.name;
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
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

// ─── Site-wide schemas ────────────────────────────────────────────────────────

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    description: site.description,
    publisher: organizationSchema(),
    potentialAction: {
      "@type": "SearchAction",
      target: siteUrl + "/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Each Spirit 編集部",
    url: siteUrl,
    logo: absoluteUrl(site.icon),
    sameAs: site.sameAs ?? [],
  };
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

/** url: canonical URL for this article (e.g. routes.ramenArticle(slug) or routes.beautyArticle(region,slug)) */
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
