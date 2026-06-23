"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin";
import { createServerClient, ES_CONTENT_CACHE_TAG } from "@/lib/supabase-server";
import { routes } from "@/lib/routes";
import { SECTION_ITEM_SCHEMAS, type ItemField, type SectionItemSchema } from "@/lib/admin-item-schema";
import { deriveItemClass, isLocationRelevant } from "@/lib/content-models";
import { getEditorSectionSchema } from "@/lib/content";

/** 住所から都道府県を抽出（列 address_region / JSON-LD addressRegion 用）。 */
function prefectureFromAddress(address: string | null | undefined): string | null {
  if (!address) return null;
  const m = address.match(/^(東京都|北海道|.{2,3}[都道府県])/);
  return m?.[1] ?? null;
}

/** textarea を 1行1レコードでパース（各行を "|" 区切りで keys に対応づけ。先頭キー空の行は除外）。 */
function parseLines(formData: FormData, key: string, keys: string[]): Record<string, string>[] {
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const obj: Record<string, string> = {};
      keys.forEach((k, i) => { if (parts[i]) obj[k] = parts[i]; });
      return obj;
    })
    .filter((o) => o[keys[0]]);
}

const NEW_SECTION_SCHEMA_KEY = "__new_section__";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const regionModes = new Set(["none", "optional", "required"]);
const majorCategories = new Set(SECTION_ITEM_SCHEMAS.map((schema) => schema.majorCategory));

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function list(formData: FormData, key: string) {
  return text(formData, key)
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function schemaFromNewSectionForm(formData: FormData): SectionItemSchema {
  const majorCategory = slugify(text(formData, "new_major_category"));
  const sectionSlug = slugify(text(formData, "new_section_slug"));
  const label = text(formData, "new_section_label");
  const itemKind = slugify(text(formData, "new_item_kind")) || "item";
  const itemPathSegment = slugify(text(formData, "new_item_path_segment")) || "items";
  const regionModeInput = text(formData, "new_region_mode");
  const regionMode = regionModes.has(regionModeInput) ? regionModeInput as SectionItemSchema["regionMode"] : "none";

  if (!majorCategories.has(majorCategory)) throw new Error("不明な大カテゴリです: " + majorCategory);
  if (!sectionSlug || !label) throw new Error("新規 section の slug と表示名は必須です");
  if (!slugPattern.test(sectionSlug)) throw new Error("section slug は英小文字・数字・ハイフンのみです");
  if (!slugPattern.test(itemKind)) throw new Error("item kind は英小文字・数字・ハイフンのみです");
  if (!slugPattern.test(itemPathSegment)) throw new Error("item path segment は英小文字・数字・ハイフンのみです");

  return {
    key: `${majorCategory}:${sectionSlug}:${itemKind}`,
    majorCategory,
    sectionSlug,
    itemKind,
    itemPathSegment,
    label,
    itemClass: deriveItemClass({ majorCategory, itemKind }),
    regionMode,
    fields: [],
  };
}

async function upsertNewContentSection(
  service: ReturnType<typeof createServerClient>,
  schema: SectionItemSchema,
  formData: FormData,
) {
  const description = text(formData, "new_section_description");
  const { error } = await service.from("content_sections").upsert({
    major_category: schema.majorCategory,
    section_slug: schema.sectionSlug,
    label: schema.label,
    description,
    href: `/${schema.majorCategory}/${schema.sectionSlug}`,
    content_model: "directory",
    item_path_segment: schema.itemPathSegment,
    region_mode: schema.regionMode,
    target_mode: "none",
    status: "published",
    sort_order: 100,
    display_config: {},
    seo_config: {},
    metadata: {
      created_from: "admin_item_editor",
      item_kind: schema.itemKind,
    },
  }, { onConflict: "major_category,section_slug" });
  if (error) throw error;
}

/** schema フィールド1件を FormData から読んで metadata 値へ変換（空は undefined） */
function readField(formData: FormData, field: ItemField): unknown {
  switch (field.type) {
    case "boolean":
      return formData.get(field.name) === "true";
    case "number": {
      const raw = text(formData, field.name);
      if (raw === "") return undefined;
      const n = Number(raw);
      return Number.isFinite(n) ? n : undefined;
    }
    case "list":
      return list(formData, field.name);
    default: {
      const v = text(formData, field.name);
      return v === "" ? undefined : v;
    }
  }
}

export async function saveItem(formData: FormData) {
  await requireAdminUser();
  const service = createServerClient();

  const schemaKey = text(formData, "schema_key");
  const isNewSection = schemaKey === NEW_SECTION_SCHEMA_KEY;
  const schema = isNewSection ? schemaFromNewSectionForm(formData) : await getEditorSectionSchema(schemaKey);
  if (!schema) throw new Error("不明な section です: " + schemaKey);

  const id = text(formData, "id") || null;
  const slug = slugify(text(formData, "slug"));
  const name = text(formData, "name");
  const description = text(formData, "description");
  const status = text(formData, "status") === "draft" ? "draft" : "published";
  const region = schema.regionMode === "none" ? null : slugify(text(formData, "region")) || null;

  if (!slug || !name) throw new Error("slug と name は必須です");
  if (!slugPattern.test(slug)) throw new Error("slug は英小文字・数字・ハイフンのみです");
  if (schema.regionMode === "required" && !region) throw new Error("この section では地域(region)が必須です");

  if (isNewSection) {
    await upsertNewContentSection(service, schema, formData);
  }

  // section 固有フィールド → metadata
  const managed: Record<string, unknown> = {};
  for (const field of schema.fields) {
    managed[field.name] = readField(formData, field);
  }

  // 編集時は既存 metadata をマージして未管理キー(official_links/sources/faqs 等)を保全
  let baseMetadata: Record<string, unknown> = {};
  if (id) {
    const { data: existing } = await service.from("items").select("metadata").eq("id", id).maybeSingle();
    baseMetadata = (existing?.metadata as Record<string, unknown>) ?? {};
  }
  const metadata = { ...baseMetadata, ...managed };

  // slug 重複チェック（同一 major+section 内、編集時は自分を除外）
  const dupQuery = service
    .from("items")
    .select("id")
    .eq("major_category", schema.majorCategory)
    .eq("section_slug", schema.sectionSlug)
    .eq("slug", slug);
  const { data: dup } = await dupQuery;
  if ((dup ?? []).some((row) => row.id !== id)) {
    throw new Error("この section に同じ slug の item が既に存在します");
  }

  // item_kind: schema が選択肢(itemKinds)を持つ型（作品の原作タイプ等）は送信値を採用、無ければ固定。
  const itemKind = schema.itemKinds && schema.itemKinds.length > 0
    ? (schema.itemKinds.find((k) => k.value === text(formData, "item_kind"))?.value ?? schema.itemKinds[0].value)
    : schema.itemKind;

  // canonical: item_path_segment があれば4階層、無ければ /{major}/{section}/{slug}（作品カタログ型）。
  const canonical = schema.itemPathSegment
    ? routes.sectionItem(schema.majorCategory, schema.sectionSlug, schema.itemPathSegment, slug)
    : `/${schema.majorCategory}/${schema.sectionSlug}/${slug}`;

  // place 以外の型では所在地系カラムを保存しない（型ごとに不要項目を持たせない）
  const loc = isLocationRelevant(schema.itemClass);
  const address = loc ? text(formData, "address") || null : null;

  // image / address_info は JSONB へ集約（旧 image_url/address/area/map_url/address_region は廃止）
  const imgUrl = text(formData, "image_url");
  const image: Record<string, unknown> = imgUrl ? { url: imgUrl } : {};
  const imageAlt = text(formData, "image_alt"); if (imageAlt) image.alt = imageAlt;
  const creditUrl = text(formData, "image_credit_url");
  if (creditUrl) image.credit = { name: text(formData, "image_credit_name"), url: creditUrl };

  const addressInfo: Record<string, unknown> = {};
  if (loc) {
    if (address) addressInfo.address = address;
    const pref = address ? prefectureFromAddress(address) : null;
    if (pref) addressInfo.prefecture = pref;
    const areaVal = text(formData, "area"); if (areaVal) addressInfo.area = areaVal;
    const mapUrl = text(formData, "map_url"); if (mapUrl) addressInfo.map_url = mapUrl;
  }

  // SEO 上書き（任意・空キーは入れない）
  const seo: Record<string, unknown> = {};
  { const t = text(formData, "seo_title"); if (t) seo.title = t; }
  { const d = text(formData, "seo_description"); if (d) seo.description = d; }
  { const k = list(formData, "seo_keywords"); if (k.length) seo.keywords = k; }

  const payload = {
    slug,
    major_category: schema.majorCategory,
    section_slug: schema.sectionSlug,
    item_kind: itemKind,
    item_class: schema.itemClass,
    canonical_path: canonical,
    region: loc ? region : null,
    name,
    description,
    image,
    address_info: addressInfo,
    seo,
    genres: list(formData, "genres"),
    phone: loc ? text(formData, "phone") || null : null,
    price_range: loc ? text(formData, "price_range") || null : null,
    official_url: text(formData, "official_url") || null,
    tags: list(formData, "tags"),
    status,
    editor_comment: text(formData, "editor_comment"),
    metadata,
    sources: parseLines(formData, "sources", ["url", "title", "sourceType", "collectedAt", "note"]),
    faq: parseLines(formData, "faq", ["question", "answer"]),
    history: parseLines(formData, "history", ["date", "description"]),
    service_model: parseLines(formData, "service_model", ["service", "url", "note"]),
    related_link: parseLines(formData, "related_link", ["label", "url"]),
  };

  if (id) {
    const { error } = await service.from("items").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await service.from("items").insert(payload);
    if (error) throw error;
  }

  // 再生成。コンテンツの Data Cache（es-content タグ・1か月）も即時無効化し、
  // 公開ページ・管理一覧・編集フォームに変更を反映する。
  revalidateTag(ES_CONTENT_CACHE_TAG);
  revalidatePath(canonical);
  revalidatePath("/" + schema.majorCategory + "/" + schema.sectionSlug);
  if (region) revalidatePath(routes.sectionRegion(schema.majorCategory, schema.sectionSlug, region));
  revalidatePath("/sitemap.xml");

  redirect(status === "published" ? canonical : routes.account);
}
