export const siteUrl = "https://each-spirit.com";

export const routes = {
  home: "/",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  disclaimer: "/disclaimer",
  ramen: "/ramen",
  ramenArticle: (slug: string) => "/ramen/articles/" + slug,
  ramenRanking: (slug: string) => "/ramen/rankings/" + slug,
  ramenItem: (slug: string) => "/ramen/items/" + slug,
  beauty: "/beauty",
  beautyRegion: (region: string) => "/beauty/" + region,
  beautyRanking: (region: string, slug: string) => "/beauty/" + region + "/rankings/" + slug,
  beautySalon: (region: string, slug: string) => "/beauty/" + region + "/salons/" + slug,
  beautyArticle: (region: string, slug: string) => "/beauty/" + region + "/articles/" + slug,
};

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
