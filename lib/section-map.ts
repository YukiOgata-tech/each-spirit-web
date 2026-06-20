/**
 * 旧 content_type / article category から 新構造（major/section/item_kind/canonical）への
 * 変換マッピング。seed / import スクリプトと（必要なら）アプリの両方から使える純粋モジュール
 * （"server-only" を付けない）。
 */

export type ItemSectionMeta = {
  majorCategory: string;
  sectionSlug: string;
  itemKind: string;
  itemPathSegment: string;
};

export const ITEM_CONTENT_TYPE_TO_SECTION: Record<string, ItemSectionMeta> = {
  ramen_item:    { majorCategory: "food", sectionSlug: "ramen", itemKind: "shop", itemPathSegment: "shops" },
  cafe:          { majorCategory: "food", sectionSlug: "cafe", itemKind: "shop", itemPathSegment: "shops" },
  protein:       { majorCategory: "health", sectionSlug: "protein", itemKind: "product", itemPathSegment: "products" },
  beauty_salon:  { majorCategory: "beauty", sectionSlug: "hair-salon", itemKind: "salon", itemPathSegment: "salons" },
  hotel:         { majorCategory: "travel", sectionSlug: "stays", itemKind: "hotel", itemPathSegment: "hotels" },
  travel_agency: { majorCategory: "travel", sectionSlug: "services", itemKind: "agency", itemPathSegment: "agencies" },
  travel_app:    { majorCategory: "travel", sectionSlug: "services", itemKind: "app", itemPathSegment: "apps" },
  leisure_spot:  { majorCategory: "leisure", sectionSlug: "spots", itemKind: "spot", itemPathSegment: "spots" },
};

export const RANKING_CONTENT_TYPE_TO_SECTION: Record<string, { majorCategory: string; sectionSlug: string }> = {
  ramen:         { majorCategory: "food", sectionSlug: "ramen" },
  cafe:          { majorCategory: "food", sectionSlug: "cafe" },
  protein:       { majorCategory: "health", sectionSlug: "protein" },
  beauty:        { majorCategory: "beauty", sectionSlug: "hair-salon" },
  hotel:         { majorCategory: "travel", sectionSlug: "stays" },
  travel_agency: { majorCategory: "travel", sectionSlug: "services" },
  leisure:       { majorCategory: "leisure", sectionSlug: "spots" },
};

export const ARTICLE_CATEGORY_TO_SECTION: Record<string, { majorCategory: string; sectionSlug: string }> = {
  ramen:             { majorCategory: "food", sectionSlug: "ramen" },
  cafe:              { majorCategory: "food", sectionSlug: "cafe" },
  protein:           { majorCategory: "health", sectionSlug: "protein" },
  beauty:            { majorCategory: "beauty", sectionSlug: "hair-salon" },
  travel:            { majorCategory: "travel", sectionSlug: "stays" },
  "travel-services": { majorCategory: "travel", sectionSlug: "services" },
  leisure:           { majorCategory: "leisure", sectionSlug: "spots" },
};

/** item の canonical_path（travel_app は一覧ページ固定） */
export function itemCanonicalPath(contentType: string, slug: string): string | null {
  const m = ITEM_CONTENT_TYPE_TO_SECTION[contentType];
  if (!m) return null;
  if (contentType === "travel_app") return "/travel/services/apps";
  return `/${m.majorCategory}/${m.sectionSlug}/${m.itemPathSegment}/${slug}`;
}

export function rankingCanonicalPath(contentType: string, slug: string): string | null {
  const m = RANKING_CONTENT_TYPE_TO_SECTION[contentType];
  if (!m) return null;
  return `/${m.majorCategory}/${m.sectionSlug}/rankings/${slug}`;
}

/** article の canonical_path（major/section 不明なら独立記事 /articles/{slug}） */
export function articleCanonicalPath(category: string, slug: string): string {
  const m = ARTICLE_CATEGORY_TO_SECTION[category];
  return m ? `/${m.majorCategory}/${m.sectionSlug}/articles/${slug}` : `/articles/${slug}`;
}
