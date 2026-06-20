/**
 * 投稿・編集UI（items）の section 別フィールド定義。
 *
 * ItemEditor（フォーム描画）と saveItem（FormData→DB収集）の両方が参照する単一スキーマ。
 * 共通列は es.items の列、section 固有フィールドは metadata(jsonb) に格納する。
 * フィールドの `name` は metadata のキー、または column=true のとき es.items の列名。
 *
 * 各 section の metadata キーは lib/content.ts の map*Item と一致させること。
 */

export type ItemFieldType = "text" | "textarea" | "number" | "boolean" | "list" | "select" | "date";

export type ItemField = {
  name: string;
  label: string;
  type: ItemFieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
};

export type SectionItemSchema = {
  key: string; // `${majorCategory}:${sectionSlug}` あるいは agency/app のように item_kind 区別が要る場合は `${major}:${section}:${kind}`
  majorCategory: string;
  sectionSlug: string;
  itemKind: string;
  contentType: string; // 旧互換（like トリガ用に保存）
  itemPathSegment: string;
  label: string;
  regionMode: "none" | "optional" | "required";
  /** section 固有フィールド（metadata に格納） */
  fields: ItemField[];
};

const BOOL = (name: string, label: string): ItemField => ({ name, label, type: "boolean" });

export const SECTION_ITEM_SCHEMAS: SectionItemSchema[] = [
  {
    key: "food:ramen",
    majorCategory: "food", sectionSlug: "ramen", itemKind: "shop", contentType: "ramen_item",
    itemPathSegment: "shops", label: "ラーメン店", regionMode: "optional",
    fields: [
      { name: "genre", label: "ジャンル", type: "text", placeholder: "あっさり醤油 / 濃厚味噌 など" },
      { name: "recommended_menu", label: "おすすめメニュー", type: "text" },
      { name: "business_hours", label: "営業時間", type: "text" },
      { name: "closed_days", label: "定休日", type: "text" },
      BOOL("parking", "駐車場あり"),
      { name: "parking_note", label: "駐車場メモ", type: "text" },
    ],
  },
  {
    key: "food:cafe",
    majorCategory: "food", sectionSlug: "cafe", itemKind: "shop", contentType: "cafe",
    itemPathSegment: "shops", label: "カフェ", regionMode: "required",
    fields: [
      { name: "style", label: "スタイル", type: "text", placeholder: "スペシャルティコーヒー / 古民家 など" },
      { name: "signature_menu", label: "看板メニュー", type: "text" },
      { name: "highlight", label: "ハイライト", type: "textarea" },
      { name: "business_hours", label: "営業時間", type: "text" },
      { name: "closed_days", label: "定休日", type: "text" },
      { name: "reservation", label: "予約", type: "select", options: [
        { value: "not-needed", label: "不要" }, { value: "recommended", label: "推奨" }, { value: "required", label: "必須" },
      ] },
      BOOL("wifi", "WiFiあり"), BOOL("power", "電源あり"), BOOL("parking", "駐車場あり"),
      { name: "parking_note", label: "駐車場メモ", type: "text" },
      BOOL("pet_friendly", "ペット可"),
      { name: "instagram_url", label: "Instagram URL", type: "text" },
    ],
  },
  {
    key: "health:protein",
    majorCategory: "health", sectionSlug: "protein", itemKind: "product", contentType: "protein",
    itemPathSegment: "products", label: "プロテイン商品", regionMode: "none",
    fields: [
      { name: "brand", label: "ブランド", type: "text", required: true },
      { name: "protein_type", label: "種類", type: "select", options: [
        { value: "whey-wpc", label: "ホエイ WPC" }, { value: "whey-wpi", label: "ホエイ WPI" },
        { value: "casein", label: "カゼイン" }, { value: "soy", label: "ソイ" }, { value: "blend", label: "ブレンド" },
      ] },
      { name: "targets", label: "対象(target slug)", type: "list", help: "women, men, diet など（カンマ/改行区切り）" },
      { name: "serving_size", label: "1食量(g)", type: "number" },
      { name: "protein", label: "タンパク質(g)", type: "number" },
      { name: "calories", label: "カロリー(kcal)", type: "number" },
      { name: "carbs", label: "炭水化物(g)", type: "number" },
      { name: "fat", label: "脂質(g)", type: "number" },
      { name: "package_weight", label: "内容量(g)", type: "number" },
      { name: "package_price", label: "価格(円)", type: "number" },
      { name: "price_per_kg", label: "1kg単価(円)", type: "number" },
      { name: "flavors", label: "フレーバー", type: "list" },
      { name: "pros", label: "メリット", type: "list" },
      { name: "cons", label: "デメリット", type: "list" },
    ],
  },
  {
    key: "beauty:hair-salon",
    majorCategory: "beauty", sectionSlug: "hair-salon", itemKind: "salon", contentType: "beauty_salon",
    itemPathSegment: "salons", label: "美容室", regionMode: "required",
    fields: [
      { name: "tagline", label: "キャッチコピー", type: "text" },
      { name: "access", label: "アクセス", type: "text" },
      { name: "treatments", label: "施術(treatment code)", type: "list", help: "cut, color, perm, treatment, headSpa など" },
      { name: "age_groups", label: "対象年代", type: "list" },
      { name: "cut_price", label: "カット料金", type: "text" },
      { name: "color_price", label: "カラー料金", type: "text" },
      { name: "business_hours", label: "営業時間", type: "text" },
      { name: "closed_days", label: "定休日", type: "text" },
      BOOL("parking", "駐車場あり"),
      { name: "parking_note", label: "駐車場メモ", type: "text" },
      BOOL("children_welcome", "子連れ可"), BOOL("men_welcome", "メンズ可"),
      { name: "instagram", label: "Instagram URL", type: "text" },
    ],
  },
  {
    key: "travel:stays",
    majorCategory: "travel", sectionSlug: "stays", itemKind: "hotel", contentType: "hotel",
    itemPathSegment: "hotels", label: "宿・ホテル", regionMode: "required",
    fields: [
      { name: "style", label: "スタイル", type: "text", placeholder: "温泉旅館 / 古民家宿 など" },
      { name: "highlight", label: "ハイライト", type: "textarea" },
      { name: "check_in", label: "チェックイン", type: "text" },
      { name: "check_out", label: "チェックアウト", type: "text" },
      { name: "meals", label: "食事", type: "text", placeholder: "2食付き / 素泊まり など" },
      BOOL("onsen", "温泉あり"),
      { name: "onsen_note", label: "温泉メモ", type: "text" },
      BOOL("parking", "駐車場あり"),
      { name: "parking_note", label: "駐車場メモ", type: "text" },
    ],
  },
  {
    key: "travel:services:agency",
    majorCategory: "travel", sectionSlug: "services", itemKind: "agency", contentType: "travel_agency",
    itemPathSegment: "agencies", label: "旅行会社", regionMode: "required",
    fields: [
      { name: "tagline", label: "キャッチコピー", type: "text" },
      { name: "highlight", label: "ハイライト", type: "textarea" },
      { name: "services", label: "サービス", type: "list" },
      { name: "best_for", label: "向いている人", type: "list" },
      { name: "consultation_style", label: "相談スタイル", type: "text" },
      { name: "business_hours", label: "営業時間", type: "text" },
      { name: "closed_days", label: "定休日", type: "text" },
      { name: "registered_travel_agency", label: "登録番号", type: "text" },
    ],
  },
  {
    key: "travel:services:app",
    majorCategory: "travel", sectionSlug: "services", itemKind: "app", contentType: "travel_app",
    itemPathSegment: "agencies", label: "旅行アプリ", regionMode: "none",
    fields: [
      { name: "brand", label: "提供元", type: "text" },
      { name: "platforms", label: "対応プラットフォーム", type: "list", help: "iOS, Android, Web など" },
      { name: "best_for", label: "向いている人", type: "list" },
    ],
  },
  {
    key: "leisure:spots",
    majorCategory: "leisure", sectionSlug: "spots", itemKind: "spot", contentType: "leisure_spot",
    itemPathSegment: "spots", label: "レジャースポット", regionMode: "required",
    fields: [
      { name: "kind", label: "種別", type: "select", options: [
        { value: "outdoor", label: "アウトドア" }, { value: "indoor", label: "インドア" },
      ] },
      { name: "genre", label: "ジャンル", type: "text" },
      { name: "highlight", label: "ハイライト", type: "textarea" },
      { name: "best_for", label: "向いている人", type: "list" },
      { name: "business_hours", label: "営業時間", type: "text" },
      { name: "closed_days", label: "定休日", type: "text" },
      BOOL("parking", "駐車場あり"),
      { name: "parking_note", label: "駐車場メモ", type: "text" },
    ],
  },
];

export function getSectionItemSchema(key: string): SectionItemSchema | undefined {
  return SECTION_ITEM_SCHEMAS.find((s) => s.key === key);
}

/** travel/services は agency/app で別スキーマ。それ以外は major:section で一意。 */
export function itemSchemaKey(majorCategory: string, sectionSlug: string, itemKind?: string): string {
  if (majorCategory === "travel" && sectionSlug === "services") {
    return `travel:services:${itemKind === "app" ? "app" : "agency"}`;
  }
  return `${majorCategory}:${sectionSlug}`;
}

/** 共通列（全 section）。region は regionMode により出し分け。 */
export const COMMON_ITEM_COLUMNS = [
  "name", "description", "region", "area", "address", "phone",
  "price_range", "image_url", "official_url", "map_url", "tags",
  "editor_comment", "last_verified_at",
] as const;
