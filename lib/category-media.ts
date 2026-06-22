/**
 * 各メジャーカテゴリ共通の画像コントラクト（meta 1枚 + hero 3枚）。
 *
 * 画像ファイルは `public/images/categories/<major>/` に配置する。ファイル名は固定:
 *   - meta.jpg    … OG / SNS シェア用（1200×630 推奨）。配下ページに個別画像が無い場合のフォールバック。
 *   - hero-1.jpg  … 各メジャートップ hero のメイン画像（横長 1600×1200 程度）
 *   - hero-2.jpg  … hero サブ画像
 *   - hero-3.jpg  … hero サブ画像
 *
 * 形式（拡張子）を変えたい場合はこのファイルの EXT を変更すれば全体に反映される。
 * "server-only" は付けない純粋モジュール（page / component / seo から利用）。
 */

const BASE = "/images/categories";
const EXT = "jpg";

/** ランキングに画像が無い（1位アイテム画像のフォールバックも無い）場合に使う共通画像。
 *  `public/images/categories/ranking-fallback.jpg` に配置する。 */
export const RANKING_FALLBACK_IMAGE = `${BASE}/ranking-fallback.${EXT}`;

export type MajorCategoryMedia = {
  major: string;
  label: string;
  /** globals.css のテーマクラス（--primary/--accent/--muted/--border を供給） */
  themeClass: string;
  meta: string;
  heroes: [string, string, string];
};

function media(major: string, label: string, themeClass: string): MajorCategoryMedia {
  const dir = `${BASE}/${major}`;
  return {
    major,
    label,
    themeClass,
    meta: `${dir}/meta.${EXT}`,
    heroes: [`${dir}/hero-1.${EXT}`, `${dir}/hero-2.${EXT}`, `${dir}/hero-3.${EXT}`],
  };
}

export const majorCategoryMedia: Record<string, MajorCategoryMedia> = {
  food: media("food", "グルメ", "ramen-theme"),
  health: media("health", "健康", "protein-theme"),
  beauty: media("beauty", "美容", "beauty-theme"),
  travel: media("travel", "旅行", "travel-theme"),
  leisure: media("leisure", "レジャー", "leisure-theme"),
  entertainment: media("entertainment", "エンターテインメント", "entertainment-theme"),
};

/** メジャー配下ページの meta 画像フォールバック。未定義なら undefined（呼び出し側で site.ogImage に既定） */
export function majorMetaImage(major: string | undefined | null): string | undefined {
  return major ? majorCategoryMedia[major]?.meta : undefined;
}
