export const siteUrl = "https://each-spirit.com";

export const routes = {
  home: "/",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  disclaimer: "/disclaimer",
  search: "/search",
  articles: "/articles",
  articleCategory: (category: string) => "/articles/" + category,
  articleByCategory: (category: string, slug: string) => "/articles/" + category + "/" + slug,
  majorCategory: (category: string) => "/" + category,
  sectionRegion: (majorCategory: string, section: string, region: string) => "/" + majorCategory + "/" + section + "/" + region,
  sectionRankings: (majorCategory: string, section: string) => "/" + majorCategory + "/" + section + "/rankings",
  sectionRanking: (majorCategory: string, section: string, slug: string) => "/" + majorCategory + "/" + section + "/rankings/" + slug,
  sectionItems: (majorCategory: string, section: string, itemPathSegment: string) => "/" + majorCategory + "/" + section + "/" + itemPathSegment,
  sectionItem: (majorCategory: string, section: string, itemPathSegment: string, slug: string) => "/" + majorCategory + "/" + section + "/" + itemPathSegment + "/" + slug,
  genericCategory: (category: string) => "/" + category,
  food: "/food",
  foodRamen: "/food/ramen",
  foodRamenRegion: (region: string) => "/food/ramen/" + region,
  foodRamenRanking: (slug: string) => "/food/ramen/rankings/" + slug,
  foodRamenShop: (slug: string) => "/food/ramen/shops/" + slug,
  foodCafe: "/food/cafe",
  foodCafeRegion: (region: string) => "/food/cafe/" + region,
  foodCafeRanking: (_region: string, slug: string) => "/food/cafe/rankings/" + slug,
  foodCafeShop: (_region: string, slug: string) => "/food/cafe/shops/" + slug,
  health: "/health",
  healthProtein: "/health/protein",
  healthProteinTarget: (target: string) => "/health/protein/" + target,
  healthProteinProduct: (slug: string) => "/health/protein/products/" + slug,
  healthProteinRanking: (target: string, slug: string) => "/health/protein/" + target + "/rankings/" + slug,
  ramen: "/food/ramen",
  ramenRegion: (region: string) => "/food/ramen/" + region,
  ramenRanking: (slug: string) => "/food/ramen/rankings/" + slug,
  ramenItem: (slug: string) => "/food/ramen/shops/" + slug,
  leisure: "/leisure",
  leisureSpots: "/leisure/spots",
  leisureRegion: (region: string) => "/leisure/spots/" + region,
  leisureSpot: (_region: string, slug: string) => "/leisure/spots/spots/" + slug,
  leisureRanking: (_region: string, slug: string) => "/leisure/spots/rankings/" + slug,
  beauty: "/beauty",
  beautyHairSalon: "/beauty/hair-salon",
  beautyRegion: (region: string) => "/beauty/hair-salon/" + region,
  beautyRanking: (_region: string, slug: string) => "/beauty/hair-salon/rankings/" + slug,
  beautySalon: (_region: string, slug: string) => "/beauty/hair-salon/salons/" + slug,
  travel: "/travel",
  travelStays: "/travel/stays",
  travelRegion: (region: string) => "/travel/stays/" + region,
  travelHotel: (_region: string, slug: string) => "/travel/stays/hotels/" + slug,
  travelRanking: (_region: string, slug: string) => "/travel/stays/rankings/" + slug,
  travelServices: "/travel/services",
  travelServicesRegion: (region: string) => "/travel/services/" + region,
  travelAgency: (_region: string, slug: string) => "/travel/services/agencies/" + slug,
  travelServicesRanking: (_region: string, slug: string) => "/travel/services/rankings/" + slug,
  travelApps: "/travel/services/apps",
  cafe: "/food/cafe",
  cafeRegion: (region: string) => "/food/cafe/" + region,
  cafeItem: (_region: string, slug: string) => "/food/cafe/shops/" + slug,
  cafeRanking: (_region: string, slug: string) => "/food/cafe/rankings/" + slug,
  protein: "/health/protein",
  proteinTarget: (target: string) => "/health/protein/" + target,
  proteinProduct: (slug: string) => "/health/protein/products/" + slug,
  proteinRanking: (target: string, slug: string) => "/health/protein/" + target + "/rankings/" + slug,
  entertainment: "/entertainment",
  entertainmentSection: (section: string) => "/entertainment/" + section,
  entertainmentTitle: (section: string, slug: string) => "/entertainment/" + section + "/" + slug,
  entertainmentRankings: (section: string) => "/entertainment/" + section + "/rankings",
  entertainmentRanking: (section: string, slug: string) => "/entertainment/" + section + "/rankings/" + slug,
  fortune: "/fortune",
  authLogin: "/auth/login",
  authSignup: "/auth/signup",
  authCallback: "/auth/callback",
  account: "/account",
};

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

/**
 * 記事の自動サムネ/OG画像URL（thumbnail.webp 背景＋タイトルを /api/og/article で動的生成）。
 * 相対パスを返すので、pageMetadata（absoluteUrl で絶対化）と next/image（ローカルパス扱い）の
 * 双方でそのまま使える。カバー画像未設定時のフォールバックに用いる。
 */
export function ogArticleImage(title: string) {
  return `/api/og/article?title=${encodeURIComponent(title)}`;
}
