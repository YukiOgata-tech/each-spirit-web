/**
 * 投稿・編集UI（rankings）の section 定義。
 * ranking 本体は section（major+section）に属し、ranking_items が item を rank 付きで参照する。
 */

export type RankingSection = {
  key: string; // `${majorCategory}:${sectionSlug}`
  majorCategory: string;
  sectionSlug: string;
  label: string;
  regionMode: "none" | "optional" | "required";
  hasTarget: boolean;         // protein のみ target を持つ
};

export const RANKING_SECTIONS: RankingSection[] = [
  { key: "food:ramen", majorCategory: "food", sectionSlug: "ramen", label: "ラーメンランキング", regionMode: "optional", hasTarget: false },
  { key: "food:cafe", majorCategory: "food", sectionSlug: "cafe", label: "カフェランキング", regionMode: "required", hasTarget: false },
  { key: "health:protein", majorCategory: "health", sectionSlug: "protein", label: "プロテインランキング", regionMode: "none", hasTarget: true },
  { key: "beauty:hair-salon", majorCategory: "beauty", sectionSlug: "hair-salon", label: "美容室ランキング", regionMode: "required", hasTarget: false },
  { key: "travel:stays", majorCategory: "travel", sectionSlug: "stays", label: "宿・ホテルランキング", regionMode: "required", hasTarget: false },
  { key: "travel:services", majorCategory: "travel", sectionSlug: "services", label: "旅行会社ランキング", regionMode: "required", hasTarget: false },
  { key: "leisure:spots", majorCategory: "leisure", sectionSlug: "spots", label: "レジャーランキング", regionMode: "required", hasTarget: false },
  { key: "entertainment:books", majorCategory: "entertainment", sectionSlug: "books", label: "書籍ランキング", regionMode: "none", hasTarget: false },
];

export function getRankingSection(key: string): RankingSection | undefined {
  return RANKING_SECTIONS.find((s) => s.key === key);
}

export type RankingItemRow = {
  rank: number;
  entryKind: "item" | "manual";
  itemSlug: string;
  displayName: string;
  description: string;
  externalUrl: string;
  imageUrl: string;
  imageAlt: string;
  priceRange: string;
  area: string;
  tags: string;
  affiliateQuery: string;
  score: number | null;
  reason: string;
  isPr: boolean;
};
