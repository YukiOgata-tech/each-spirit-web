"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionItemSchema, ItemField } from "@/lib/admin-item-schema";
import { isLocationRelevant } from "@/lib/content-models";

export type ItemInitial = {
  id: string;
  schemaKey: string;
  slug: string;
  status: string;
  itemKind?: string;
  common: Record<string, string>;
  tags: string[];
  metadata: Record<string, unknown>;
};

type RegionOption = { key: string; regions: { slug: string; name: string }[] };

type ItemEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
  schemas: SectionItemSchema[];
  regionOptions: RegionOption[];
  initial?: ItemInitial | null;
};

const inputClass =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";
const labelClass = "mb-1 block text-xs font-bold text-slate-600";
const sectionClass = "rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 max-sm:shadow-none";
const majorCategoryLabels: Record<string, string> = {
  food: "グルメ",
  health: "健康",
  beauty: "美容",
  travel: "旅行",
  entertainment: "エンターテインメント",
  leisure: "レジャー",
};
const NEW_SECTION_SCHEMA_KEY = "__new_section__";

const itemKindOptions = [
  { value: "shop", label: "店舗(shop)" },
  { value: "product", label: "商品(product)" },
  { value: "spot", label: "スポット(spot)" },
  { value: "service", label: "サービス(service)" },
  { value: "agency", label: "旅行会社(agency)" },
  { value: "app", label: "アプリ(app)" },
  { value: "event", label: "イベント(event)" },
  { value: "person", label: "人物(person)" },
  { value: "concept", label: "概念(concept)" },
  { value: "work", label: "作品(work)" },
  { value: "item", label: "汎用(item)" },
];

const itemPathSegmentOptions = [
  { value: "shops", label: "shops" },
  { value: "products", label: "products" },
  { value: "spots", label: "spots" },
  { value: "services", label: "services" },
  { value: "agencies", label: "agencies" },
  { value: "apps", label: "apps" },
  { value: "items", label: "items" },
];

function asString(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export function ItemEditor({ action, schemas, regionOptions, initial }: ItemEditorProps) {
  const isEdit = !!initial;
  const [schemaKey, setSchemaKey] = useState(initial?.schemaKey ?? schemas[0]?.key ?? "");
  const isNewSection = !isEdit && schemaKey === NEW_SECTION_SCHEMA_KEY;
  const schema = useMemo(() => schemas.find((s) => s.key === schemaKey), [schemas, schemaKey]);
  const majorCategories = useMemo(
    () => Array.from(new Set(schemas.map((s) => s.majorCategory))),
    [schemas],
  );
  const [majorCategory, setMajorCategory] = useState(schema?.majorCategory ?? majorCategories[0] ?? "");
  const [newRegionMode, setNewRegionMode] = useState<"none" | "optional" | "required">("optional");
  const sectionSchemas = useMemo(
    () => schemas.filter((s) => s.majorCategory === majorCategory),
    [schemas, majorCategory],
  );

  const regionKey = schema ? `${schema.majorCategory}:${schema.sectionSlug}` : "";
  const regions = regionOptions.find((r) => r.key === regionKey)?.regions ?? [];
  const effectiveRegionMode = schema?.regionMode ?? (isNewSection ? newRegionMode : "none");
  // place 以外（作品・商品・アプリ等）は所在地系の共通欄を出さない＝型ごとに不要項目を保存しない。
  // 新規 section は既定で place 扱い（所在地あり）。
  const locationRelevant = isNewSection ? true : isLocationRelevant(schema?.itemClass);

  const md = initial?.metadata ?? {};
  const common = initial?.common ?? {};

  function FieldInput({ field }: { field: ItemField }) {
    const def = md[field.name];
    if (field.type === "boolean") {
      return (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name={field.name} value="true" defaultChecked={def === true} className="h-4 w-4" />
          {field.label}
        </label>
      );
    }
    if (field.type === "textarea") {
      return (
        <div>
          <label className={labelClass}>{field.label}{field.required && " *"}</label>
          <textarea name={field.name} defaultValue={asString(def)} rows={3} className={inputClass} placeholder={field.placeholder} />
          {field.help && <p className="mt-1 text-[11px] text-slate-400">{field.help}</p>}
        </div>
      );
    }
    if (field.type === "select") {
      return (
        <div>
          <label className={labelClass}>{field.label}{field.required && " *"}</label>
          <select name={field.name} defaultValue={asString(def)} className={inputClass}>
            <option value="">（未選択）</option>
            {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      );
    }
    return (
      <div>
        <label className={labelClass}>{field.label}{field.required && " *"}</label>
        <input
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          name={field.name}
          defaultValue={asString(def)}
          step={field.type === "number" ? "any" : undefined}
          className={inputClass}
          placeholder={field.placeholder}
        />
        {field.help && <p className="mt-1 text-[11px] text-slate-400">{field.help}</p>}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="schema_key" value={schemaKey} />
      {isEdit && <input type="hidden" name="id" value={initial!.id} />}

      <div className={sectionClass}>
        <h2 className="mb-3 text-sm font-black text-slate-800">基本</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>大カテゴリ *</label>
            {isEdit ? (
              <input className={inputClass} value={schema ? majorCategoryLabels[schema.majorCategory] ?? schema.majorCategory : majorCategory} disabled />
            ) : (
              <select
                className={inputClass}
                value={majorCategory}
                onChange={(e) => {
                  const nextMajor = e.target.value;
                  const nextSchema = schemas.find((s) => s.majorCategory === nextMajor);
                  setMajorCategory(nextMajor);
                  if (nextSchema) setSchemaKey(nextSchema.key);
                }}
              >
                {majorCategories.map((major) => (
                  <option key={major} value={major}>{majorCategoryLabels[major] ?? major}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className={labelClass}>カテゴリ(section) *</label>
            {isEdit ? (
              <input className={inputClass} value={schema?.label ?? schemaKey} disabled />
            ) : (
              <select className={inputClass} value={schemaKey} onChange={(e) => setSchemaKey(e.target.value)}>
                {sectionSchemas.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                <option value={NEW_SECTION_SCHEMA_KEY}>新しいカテゴリ(section)を追加</option>
              </select>
            )}
          </div>
          {isNewSection && (
            <>
              <input type="hidden" name="new_major_category" value={majorCategory} />
              <div>
                <label className={labelClass}>新規 section slug *</label>
                <input name="new_section_slug" className={inputClass} placeholder="sushi" required />
              </div>
              <div>
                <label className={labelClass}>新規 section 表示名 *</label>
                <input name="new_section_label" className={inputClass} placeholder="寿司" required />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>新規 section 説明</label>
                <textarea name="new_section_description" rows={2} className={inputClass} placeholder="カテゴリ一覧やSEOで使う短い説明" />
              </div>
              <div>
                <label className={labelClass}>item kind *</label>
                <select name="new_item_kind" defaultValue="shop" className={inputClass} required>
                  {itemKindOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>item URL segment *</label>
                <select name="new_item_path_segment" defaultValue="shops" className={inputClass} required>
                  {itemPathSegmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>地域(region)の扱い</label>
                <select
                  name="new_region_mode"
                  value={newRegionMode}
                  onChange={(event) => setNewRegionMode(event.target.value as "none" | "optional" | "required")}
                  className={inputClass}
                >
                  <option value="none">使わない</option>
                  <option value="optional">任意</option>
                  <option value="required">必須</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className={labelClass}>slug *</label>
            <input name="slug" defaultValue={initial?.slug ?? ""} className={inputClass} placeholder="niigata-ramen-ishiguro" required />
          </div>
          {schema?.itemKinds && schema.itemKinds.length > 0 && (
            <div>
              <label className={labelClass}>原作タイプ(item kind) *</label>
              <select name="item_kind" defaultValue={initial?.itemKind ?? schema.itemKinds[0].value} className={inputClass}>
                {schema.itemKinds.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </div>
          )}
          <div className="sm:col-span-2">
            <label className={labelClass}>名称 *</label>
            <input name="name" defaultValue={common.name ?? ""} className={inputClass} required />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>説明</label>
            <textarea name="description" defaultValue={common.description ?? ""} rows={3} className={inputClass} />
          </div>
          {effectiveRegionMode !== "none" && (
            <div>
              <label className={labelClass}>地域(region){effectiveRegionMode === "required" && " *"}</label>
              {!isNewSection && regions.length > 0 ? (
                <select name="region" defaultValue={common.region ?? ""} className={inputClass}>
                  <option value="">（未選択）</option>
                  {regions.map((r) => <option key={r.slug} value={r.slug}>{r.name}（{r.slug}）</option>)}
                </select>
              ) : (
                <input name="region" defaultValue={common.region ?? ""} className={inputClass} placeholder="niigata" />
              )}
            </div>
          )}
          <div>
            <label className={labelClass}>ステータス</label>
            <select name="status" defaultValue={initial?.status ?? "published"} className={inputClass}>
              <option value="published">公開</option>
              <option value="draft">下書き</option>
            </select>
          </div>
        </div>
      </div>

      {schema && schema.fields.length > 0 && (
        <div className={sectionClass}>
          <h2 className="mb-3 text-sm font-black text-slate-800">{schema.label}の詳細</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {schema.fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <FieldInput field={field} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={sectionClass}>
        <h2 className="mb-3 text-sm font-black text-slate-800">共通情報</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(([
            ["image_url", "画像URL"], ["official_url", "公式URL"],
            // 所在地系（place 型のみ表示）
            ...(locationRelevant ? [
              ["area", "エリア"], ["address", "住所"], ["phone", "電話"],
              ["price_range", "価格帯"], ["map_url", "地図URL"],
            ] : []),
          ]) as [string, string][]).map(([name, label]) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <input name={name} defaultValue={common[name] ?? ""} className={inputClass} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={labelClass}>タグ（カンマ/改行区切り）</label>
            <input name="tags" defaultValue={(initial?.tags ?? []).join(", ")} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>編集部コメント</label>
            <textarea name="editor_comment" defaultValue={common.editor_comment ?? ""} rows={2} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="mb-1 text-sm font-black text-slate-800">拡張情報（任意）</h2>
        <p className="mb-3 text-[11px] text-slate-400">複数行の項目は「1行1件・各値を | で区切る」。空欄は保存されません。</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>ジャンル（カンマ/改行区切り）</label>
            <input name="genres" defaultValue={common.genres ?? ""} className={inputClass} placeholder="豚骨, 味噌 / 異世界, アクション" />
          </div>
          <div>
            <label className={labelClass}>画像 alt（代替テキスト）</label>
            <input name="image_alt" defaultValue={common.image_alt ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>画像出典 名称</label>
            <input name="image_credit_name" defaultValue={common.image_credit_name ?? ""} className={inputClass} placeholder="○○公式" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>画像出典 URL</label>
            <input name="image_credit_url" defaultValue={common.image_credit_url ?? ""} className={inputClass} />
          </div>
          <div className="sm:col-span-2 rounded-md bg-slate-50 p-3">
            <p className="mb-2 text-[11px] font-bold text-slate-500">SEO上書き（すべて任意・空欄なら自動）</p>
            <div className="grid gap-3">
              <div>
                <label className={labelClass}>SEOタイトル上書き</label>
                <input name="seo_title" defaultValue={common.seo_title ?? ""} className={inputClass} placeholder="空欄なら「名称」を使用" />
              </div>
              <div>
                <label className={labelClass}>SEO説明上書き</label>
                <textarea name="seo_description" defaultValue={common.seo_description ?? ""} rows={2} className={inputClass} placeholder="空欄なら「説明」を使用" />
              </div>
              <div>
                <label className={labelClass}>追加キーワード（カンマ区切り・任意）</label>
                <input name="seo_keywords" defaultValue={common.seo_keywords ?? ""} className={inputClass} placeholder="補足したい語のみ" />
                <p className="mt-1 text-[11px] text-slate-400">名称 / カテゴリ / genres / tags / エリアは自動で含まれます。ここは追記分のみ。</p>
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>出典 sources</label>
            <textarea name="sources" defaultValue={common.sources ?? ""} rows={3} className={inputClass} placeholder="URL | タイトル | 種別 | 確認日 | 備考" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>FAQ</label>
            <textarea name="faq" defaultValue={common.faq ?? ""} rows={3} className={inputClass} placeholder="質問 | 回答" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>沿革・経歴 history</label>
            <textarea name="history" defaultValue={common.history ?? ""} rows={2} className={inputClass} placeholder="日付 | 内容" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>視聴/購入/利用 service_model</label>
            <textarea name="service_model" defaultValue={common.service_model ?? ""} rows={2} className={inputClass} placeholder="サービス名 | URL | 備考" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>関連リンク related_link</label>
            <textarea name="related_link" defaultValue={common.related_link ?? ""} rows={2} className={inputClass} placeholder="ラベル | URL" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:flex sm:justify-end sm:px-4 sm:py-4">
        <Button type="submit" className="w-full gap-1.5 sm:w-auto">
          <Send className="h-4 w-4" /> {isEdit ? "更新する" : "作成する"}
        </Button>
      </div>
    </form>
  );
}
