import type { Metadata } from "next";
import type { Article, FAQ, Item, LeisureRanking, LeisureSpot, Ranking } from "@/lib/types";
import { absoluteUrl, routes, siteUrl } from "@/lib/routes";
import { site } from "@/content/site";

export function pageMetadata({
  title,
  description,
  path,
  image = site.ogImage,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const fullTitle = title === site.name || title === site.title ? title : title + " | " + site.name;
  return {
    title: { absolute: fullTitle },
    description,
    keywords: site.keywords,
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
    sameAs: [],
  };
}

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

export function faqSchema(faqs: FAQ[]) {
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

export function articleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.author.name, url: absoluteUrl(routes.about) },
    publisher: organizationSchema(),
    mainEntityOfPage: absoluteUrl(routes.ramenArticle(article.slug)),
    about: article.tags,
  };
}

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
          ratingValue: entry.score / 20,
          bestRating: 5,
          worstRating: 1,
          ratingCount: 1,
        },
      },
    })),
  };
}

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
          ratingValue: entry.score / 20,
          bestRating: 5,
          worstRating: 1,
          ratingCount: 1,
        },
      },
    })),
  };
}

export function touristAttractionSchema(region: string, spot: LeisureSpot) {
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
  };
}

export function restaurantSchema(item: Item) {
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
      addressRegion: "新潟県",
      addressCountry: "JP",
    },
    priceRange: item.priceRange,
    openingHours: item.businessHours,
    hasMap: item.mapUrl,
  };
}
