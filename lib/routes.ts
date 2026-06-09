export const siteUrl = "https://each-spirit.com";

export const routes = {
  home: "/",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  disclaimer: "/disclaimer",
  ramen: "/ramen",
  ramenRegion: (region: string) => "/ramen/" + region,
  ramenArticle: (slug: string) => "/ramen/articles/" + slug,
  ramenRanking: (slug: string) => "/ramen/rankings/" + slug,
  ramenItem: (slug: string) => "/ramen/items/" + slug,
  leisure: "/leisure",
  leisureRegion: (region: string) => "/leisure/" + region,
  leisureSpot: (region: string, slug: string) => "/leisure/" + region + "/spots/" + slug,
  leisureRanking: (region: string, slug: string) => "/leisure/" + region + "/rankings/" + slug,
  beauty: "/beauty",
  beautyRegion: (region: string) => "/beauty/" + region,
  beautyRanking: (region: string, slug: string) => "/beauty/" + region + "/rankings/" + slug,
  beautySalon: (region: string, slug: string) => "/beauty/" + region + "/salons/" + slug,
  beautyArticle: (region: string, slug: string) => "/beauty/" + region + "/articles/" + slug,
  travel: "/travel",
  travelRegion: (region: string) => "/travel/" + region,
  travelHotel: (region: string, slug: string) => "/travel/" + region + "/hotels/" + slug,
  travelRanking: (region: string, slug: string) => "/travel/" + region + "/rankings/" + slug,
  cafe: "/cafe",
  cafeRegion: (region: string) => "/cafe/" + region,
  cafeItem: (region: string, slug: string) => "/cafe/" + region + "/items/" + slug,
  cafeRanking: (region: string, slug: string) => "/cafe/" + region + "/rankings/" + slug,
  protein: "/protein",
  proteinTarget: (target: string) => "/protein/" + target,
  proteinProduct: (slug: string) => "/protein/products/" + slug,
  proteinRanking: (target: string, slug: string) => "/protein/" + target + "/rankings/" + slug,
};

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
