/**
 * 詳細エンジンのレイアウト解決。item_class 別の既定ブロック構成＋hero バリアントを定義し、
 * content_sections.display_config の override を尊重する。pure モジュール。
 */
import type { ItemClass } from "@/lib/content-models";

/** 詳細ページの本文ブロック（hero は別途先頭に描画） */
export type DetailBlock =
  | "keyInfo"        // 住所/電話/価格帯/最終確認日（place 系の基本情報）
  | "attributes"     // item_schema の型固有フィールド
  | "officialLinks"  // 公式リンク
  | "rankingLinks"   // 関連ランキング
  | "editorComment"  // 編集メモ
  | "relations"      // 関連アイテム（Phase 3）
  | "gallery"        // メディア（Phase 3）
  | "faq"
  | "sources";

export type HeroVariant = "split" | "poster" | "plain";

const DEFAULT_LAYOUTS: Record<ItemClass, DetailBlock[]> = {
  physical_service:   ["keyInfo", "attributes", "officialLinks", "editorComment", "rankingLinks", "faq", "sources"],
  intangible_service: ["keyInfo", "attributes", "officialLinks", "editorComment", "rankingLinks", "faq", "sources"],
  media:              ["attributes", "officialLinks", "editorComment", "relations", "rankingLinks", "faq", "sources"],
  product:            ["attributes", "officialLinks", "editorComment", "rankingLinks", "faq", "sources"],
  person:             ["attributes", "relations", "editorComment", "sources"],
  other:              ["attributes", "officialLinks", "editorComment", "faq", "sources"],
};

const VALID_BLOCKS = new Set<DetailBlock>([
  "keyInfo", "attributes", "officialLinks", "rankingLinks", "editorComment", "relations", "gallery", "faq", "sources",
]);

/** 本文ブロックの並び。display_config.detail_layout があれば優先（不正値は除外）。 */
export function detailLayout(itemClass: string, displayConfig?: Record<string, unknown>): DetailBlock[] {
  const override = displayConfig?.detail_layout;
  if (Array.isArray(override)) {
    const cleaned = override.filter((b): b is DetailBlock => typeof b === "string" && VALID_BLOCKS.has(b as DetailBlock));
    if (cleaned.length > 0) return cleaned;
  }
  return DEFAULT_LAYOUTS[(itemClass as ItemClass)] ?? DEFAULT_LAYOUTS.physical_service;
}

/** hero の見せ方。display_config.hero_variant 優先、無ければ型と画像有無から決定。 */
export function heroVariant(itemClass: string, displayConfig: Record<string, unknown> | undefined, hasImage: boolean): HeroVariant {
  const override = displayConfig?.hero_variant;
  if (override === "split" || override === "poster" || override === "plain") return override;
  if (itemClass === "media") return "poster";
  if (!hasImage && (itemClass === "person" || itemClass === "other")) return "plain";
  return "split";
}
