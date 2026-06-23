/**
 * ユニバーサル item 基盤の「型（item_class）レジストリ」。
 * 表示・SEO・入力UI・検索の出し分けの単一ソース。"server-only" は付けない純粋モジュール
 * （seed / admin / page / client から共用）。
 *
 * 設計: すべては es.items の1行。型固有の項目は metadata(jsonb) に、その型のスキーマ分だけ保存。
 * 所在地系カラム（address/phone/area/price_range/map_url/region）は locationRelevant な型のみ使う。
 */

export type ItemClass =
  | "physical_service" | "intangible_service" | "media" | "person" | "product" | "other";

export type ItemClassDef = {
  label: string;
  /** 住所/地図/エリア/価格帯/電話/region を使う型か（UI・詳細・SEO の出し分け） */
  locationRelevant: boolean;
  /** schema.org のおおまかな型（SEO JSON-LD のベース） */
  schemaType: string;
  /** history（日付つき時系列）を表示するときの既定見出し。history は全 item_class 共通で使える。 */
  historyLabel: string;
  /** history 最古日付を流し込む schema.org の日付プロパティ。無い型は注入しない。 */
  dateSchemaProp?: string;
};

export const ITEM_CLASSES: Record<ItemClass, ItemClassDef> = {
  physical_service:   { label: "店舗・施設（来店型）", locationRelevant: true,  schemaType: "LocalBusiness", historyLabel: "沿革",            dateSchemaProp: "foundingDate" },
  intangible_service: { label: "サービス（非来店）",   locationRelevant: true,  schemaType: "Service",       historyLabel: "提供・アップデート", dateSchemaProp: "datePublished" },
  media:              { label: "作品・メディア",       locationRelevant: false, schemaType: "CreativeWork",  historyLabel: "放送・展開",        dateSchemaProp: "datePublished" },
  person:             { label: "人物",                 locationRelevant: false, schemaType: "Person",        historyLabel: "経歴" },
  product:            { label: "商品",                 locationRelevant: false, schemaType: "Product",       historyLabel: "発売・改訂",        dateSchemaProp: "releaseDate" },
  other:              { label: "その他",               locationRelevant: false, schemaType: "Thing",         historyLabel: "あゆみ" },
};

const ALL_CLASSES = Object.keys(ITEM_CLASSES) as ItemClass[];

export function isItemClass(value: string | null | undefined): value is ItemClass {
  return !!value && (ALL_CLASSES as string[]).includes(value);
}

export function itemClassDef(value: string | null | undefined): ItemClassDef {
  return isItemClass(value) ? ITEM_CLASSES[value] : ITEM_CLASSES.other;
}

/** 住所/地図などの所在地ブロックを出すべきか */
export function isLocationRelevant(value: string | null | undefined): boolean {
  return itemClassDef(value).locationRelevant;
}

/** content_sections.content_model → item_class のフォールバック導出（item_class 列が未設定のとき用） */
const CONTENT_MODEL_TO_CLASS: Record<string, ItemClass> = {
  restaurant: "physical_service",
  salon: "physical_service",
  hotel: "physical_service",
  spot: "physical_service",
  "travel-service": "intangible_service",
  product: "product",
  title: "media",
};

/** item_kind → item_class（新規 section 作成時など、content_model がまだ無いケースの導出） */
const ITEM_KIND_TO_CLASS: Record<string, ItemClass> = {
  product: "product",
  app: "product",
  service: "intangible_service",
  person: "person",
  work: "media",
  title: "media",
};

/** item_kind / content_model から item_class を導出（item_class 列が無いデータの保険） */
export function deriveItemClass(opts: { itemClass?: string | null; majorCategory?: string | null; itemKind?: string | null; contentModel?: string | null }): ItemClass {
  if (isItemClass(opts.itemClass)) return opts.itemClass;
  if (opts.majorCategory === "entertainment") return "media";
  if (opts.itemKind && ITEM_KIND_TO_CLASS[opts.itemKind]) return ITEM_KIND_TO_CLASS[opts.itemKind];
  // anime_manga_series のような media 派生 kind
  if (opts.itemKind && /_series$/.test(opts.itemKind)) return "media";
  if (opts.contentModel && CONTENT_MODEL_TO_CLASS[opts.contentModel]) return CONTENT_MODEL_TO_CLASS[opts.contentModel];
  return "other";
}
