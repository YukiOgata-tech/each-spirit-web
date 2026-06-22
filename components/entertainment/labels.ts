// エンタメ作品カタログ共通のラベル・型・マッパー。pure モジュール（"use client"/"server-only" 不要）。
// anime 以外（tv / drama 等）の item_kind が増えても、未知キーはフォールバックで整形して表示する。

import type { GenericItem } from "@/lib/types";

/** 一覧／詳細でクライアントに渡す作品の最小シリアライズ形 */
export type CatalogTitle = {
  slug: string;
  name: string;
  href: string;
  description: string;
  imageUrl?: string;
  /** 原作タイプ（item_kind） */
  itemKind: string;
  genres: string[];
  mediaTypes: string[];
  tags: string[];
};

/** 原作タイプ（item_kind）→ 表示名 */
const ORIGIN_LABELS: Record<string, string> = {
  anime_manga_series: "漫画原作",
  anime_light_novel_series: "ライトノベル原作",
  anime_original_series: "アニメオリジナル",
  anime_game_series: "ゲーム原作",
  anime_webtoon_series: "Webtoon原作",
  drama_novel_series: "小説原作",
  drama_manga_series: "漫画原作",
  drama_light_novel_series: "ライトノベル原作",
  drama_original_series: "オリジナル脚本",
  drama_game_series: "ゲーム原作",
};

export function originLabel(itemKind: string): string {
  if (ORIGIN_LABELS[itemKind]) return ORIGIN_LABELS[itemKind];
  // 未知キーのフォールバック: 先頭の `{section}_` と末尾の `_series` を外して整形
  const cleaned = itemKind.replace(/^[a-z0-9]+_/, "").replace(/_series$/, "").replace(/_/g, " ").trim();
  return cleaned || itemKind;
}

/** メディア展開（media_types）→ 表示名 */
const MEDIA_LABELS: Record<string, string> = {
  anime: "アニメ",
  manga: "漫画",
  light_novel: "ライトノベル",
  novel: "小説",
  game: "ゲーム",
  movie: "劇場版",
  live_action: "実写",
  drama: "ドラマ",
  tv: "TV",
  webtoon: "Webtoon",
  ova: "OVA",
  music: "音楽",
};

export function mediaLabel(media: string): string {
  return MEDIA_LABELS[media] ?? media;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/** GenericItem を一覧/カード用の CatalogTitle に変換 */
export function toCatalogTitle(item: GenericItem, href: string): CatalogTitle {
  const m = item.metadata ?? {};
  return {
    slug: item.slug,
    name: item.name,
    href,
    description: item.description,
    imageUrl: item.imageUrl,
    itemKind: item.itemKind,
    genres: stringArray((m as Record<string, unknown>).genres),
    mediaTypes: stringArray((m as Record<string, unknown>).media_types),
    tags: item.tags ?? [],
  };
}
