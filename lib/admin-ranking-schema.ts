/**
 * 投稿・編集UI（rankings）の section 定義。
 * ranking 本体は section（major+section）に属し、ranking_items が item を rank 付きで参照する。
 */

export type RankingSection = {
  key: string; // `${majorCategory}:${sectionSlug}`
  majorCategory: string;
  sectionSlug: string;
  rankingContentType: string; // es.rankings.content_type（旧互換）
  itemContentType: string;    // es.ranking_items.item_content_type（旧互換・items 種別）
  label: string;
  regionMode: "none" | "optional" | "required";
  hasTarget: boolean;         // protein のみ target を持つ
};

export const RANKING_SECTIONS: RankingSection[] = [
  { key: "food:ramen", majorCategory: "food", sectionSlug: "ramen", rankingContentType: "ramen", itemContentType: "ramen_item", label: "ラーメンランキング", regionMode: "optional", hasTarget: false },
  { key: "food:cafe", majorCategory: "food", sectionSlug: "cafe", rankingContentType: "cafe", itemContentType: "cafe", label: "カフェランキング", regionMode: "required", hasTarget: false },
  { key: "health:protein", majorCategory: "health", sectionSlug: "protein", rankingContentType: "protein", itemContentType: "protein", label: "プロテインランキング", regionMode: "none", hasTarget: true },
  { key: "beauty:hair-salon", majorCategory: "beauty", sectionSlug: "hair-salon", rankingContentType: "beauty", itemContentType: "beauty_salon", label: "美容室ランキング", regionMode: "required", hasTarget: false },
  { key: "travel:stays", majorCategory: "travel", sectionSlug: "stays", rankingContentType: "hotel", itemContentType: "hotel", label: "宿・ホテルランキング", regionMode: "required", hasTarget: false },
  { key: "travel:services", majorCategory: "travel", sectionSlug: "services", rankingContentType: "travel_agency", itemContentType: "travel_agency", label: "旅行会社ランキング", regionMode: "required", hasTarget: false },
  { key: "leisure:spots", majorCategory: "leisure", sectionSlug: "spots", rankingContentType: "leisure", itemContentType: "leisure_spot", label: "レジャーランキング", regionMode: "required", hasTarget: false },
];

export function getRankingSection(key: string): RankingSection | undefined {
  return RANKING_SECTIONS.find((s) => s.key === key);
}

export type RankingItemRow = {
  rank: number;
  itemSlug: string;
  score: number | null;
  reason: string;
  isPr: boolean;
};
