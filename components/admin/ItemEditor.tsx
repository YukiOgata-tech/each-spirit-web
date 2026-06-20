"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionItemSchema, ItemField } from "@/lib/admin-item-schema";

export type ItemInitial = {
  id: string;
  schemaKey: string;
  slug: string;
  status: string;
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

function asString(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export function ItemEditor({ action, schemas, regionOptions, initial }: ItemEditorProps) {
  const isEdit = !!initial;
  const [schemaKey, setSchemaKey] = useState(initial?.schemaKey ?? schemas[0]?.key ?? "");
  const schema = useMemo(() => schemas.find((s) => s.key === schemaKey), [schemas, schemaKey]);

  const regionKey = schema ? `${schema.majorCategory}:${schema.sectionSlug}` : "";
  const regions = regionOptions.find((r) => r.key === regionKey)?.regions ?? [];

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
            <label className={labelClass}>カテゴリ(section) *</label>
            {isEdit ? (
              <input className={inputClass} value={schema?.label ?? schemaKey} disabled />
            ) : (
              <select className={inputClass} value={schemaKey} onChange={(e) => setSchemaKey(e.target.value)}>
                {schemas.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className={labelClass}>slug *</label>
            <input name="slug" defaultValue={initial?.slug ?? ""} className={inputClass} placeholder="niigata-ramen-ishiguro" required />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>名称 *</label>
            <input name="name" defaultValue={common.name ?? ""} className={inputClass} required />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>説明</label>
            <textarea name="description" defaultValue={common.description ?? ""} rows={3} className={inputClass} />
          </div>
          {schema && schema.regionMode !== "none" && (
            <div>
              <label className={labelClass}>地域(region){schema.regionMode === "required" && " *"}</label>
              {regions.length > 0 ? (
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
          {([
            ["area", "エリア"], ["address", "住所"], ["phone", "電話"], ["price_range", "価格帯"],
            ["image_url", "画像URL"], ["official_url", "公式URL"], ["map_url", "地図URL"],
          ] as const).map(([name, label]) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <input name={name} defaultValue={common[name] ?? ""} className={inputClass} />
            </div>
          ))}
          <div>
            <label className={labelClass}>最終確認日</label>
            <input type="date" name="last_verified_at" defaultValue={common.last_verified_at ?? ""} className={inputClass} />
          </div>
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

      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:flex sm:justify-end sm:px-4 sm:py-4">
        <Button type="submit" className="w-full gap-1.5 sm:w-auto">
          <Send className="h-4 w-4" /> {isEdit ? "更新する" : "作成する"}
        </Button>
      </div>
    </form>
  );
}
