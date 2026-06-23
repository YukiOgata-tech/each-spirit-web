import { SECTION_ITEM_SCHEMAS, type ItemField } from "@/lib/admin-item-schema";
import type { ContentSection, GenericItem } from "@/lib/types";

/** 本文パネルの共通クラス */
export const panelClass = "rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6";
/** サイドバーカードの共通クラス */
export const cardClass = "rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm";

const METADATA_EXCLUDE_KEYS = new Set([
  "sources", "faqs", "official_links", "related_ranking_slugs", "related_slugs", "related_item_slugs",
  "item_role", "content_category", "image_research", "item_kind", "author", "metadata_version",
  "access", "business_hours", "closed_days", "highlight", "tagline", "genre", "genres",
  "pros", "cons", "anime_profile", "viewing_guide",
]);

/** section の入力フィールド定義（DB item_schema 優先・無ければコード fallback） */
export function resolveFields(section: ContentSection): ItemField[] {
  const dbFields = (section.itemSchema as { fields?: unknown } | undefined)?.fields;
  if (Array.isArray(dbFields)) return dbFields as ItemField[];
  const code = SECTION_ITEM_SCHEMAS.find((s) => s.majorCategory === section.majorCategory && s.sectionSlug === section.sectionSlug);
  return code?.fields ?? [];
}

/** item_schema 駆動の属性エントリ（型整形・空は除外） */
export function attributeEntries(item: GenericItem, fields: ItemField[]): { key: string; value: string }[] {
  const m = (item.metadata ?? {}) as Record<string, unknown>;
  if (fields.length > 0) {
    return fields
      .map((f) => {
        const v = m[f.name];
        let value = "";
        if (f.type === "boolean") value = v === true ? "はい" : "";
        else if (f.type === "list") value = Array.isArray(v) ? v.join(", ") : "";
        else if (f.type === "select") value = f.options?.find((o) => o.value === v)?.label ?? (v == null ? "" : String(v));
        else value = v == null || v === "" ? "" : String(v);
        return { key: f.label, value };
      })
      .filter((e) => e.value);
  }
  return Object.entries(m)
    .filter(([k, v]) => !METADATA_EXCLUDE_KEYS.has(k) && v != null && v !== "" && (Array.isArray(v) || typeof v !== "object"))
    .slice(0, 12)
    .map(([k, v]) => ({ key: k.replace(/_/g, " "), value: Array.isArray(v) ? v.join(", ") : String(v) }))
    .filter((e) => e.value);
}

export type OfficialLink = { url: string; label?: string; type?: string };

/** 公式URL ＋ 地図URL（参考リンクは related_link に統合済み）。重複排除。 */
export function officialLinks(item: GenericItem): OfficialLink[] {
  const out: OfficialLink[] = [];
  if (item.officialUrl) out.push({ url: item.officialUrl, label: "公式サイト" });
  if (item.mapUrl) out.push({ url: item.mapUrl, label: "地図", type: "map" });
  const seen = new Set<string>();
  return out.filter((l) => (seen.has(l.url) ? false : (seen.add(l.url), true)));
}

/** metadata の文字列値を安全に取得 */
export function metaStr(item: GenericItem, key: string): string | undefined {
  const v = (item.metadata as Record<string, unknown> | undefined)?.[key];
  return typeof v === "string" && v !== "" ? v : undefined;
}

/** metadata の文字列配列を取得 */
export function metaList(item: GenericItem, key: string): string[] {
  const v = (item.metadata as Record<string, unknown> | undefined)?.[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x !== "") : [];
}
