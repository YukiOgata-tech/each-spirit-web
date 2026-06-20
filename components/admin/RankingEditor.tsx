"use client";

import { useMemo, useState } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RankingSection, RankingItemRow } from "@/lib/admin-ranking-schema";

type RegionOption = { key: string; regions: { slug: string; name: string }[] };
type ItemsBySection = { key: string; items: { slug: string; name: string }[] };

export type RankingInitial = {
  id: string;
  schemaKey: string;
  slug: string;
  status: string;
  region: string;
  target: string;
  fields: Record<string, string>;
  rows: RankingItemRow[];
};

type RankingEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
  sections: RankingSection[];
  regionOptions: RegionOption[];
  itemsBySection: ItemsBySection[];
  targetOptions: { slug: string; name: string }[];
  initial?: RankingInitial | null;
};

const inputClass =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";
const labelClass = "mb-1 block text-xs font-bold text-slate-600";
const sectionClass = "rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 max-sm:shadow-none";

function emptyRow(rank: number): RankingItemRow {
  return { rank, itemSlug: "", score: null, reason: "", isPr: false };
}

export function RankingEditor({ action, sections, regionOptions, itemsBySection, targetOptions, initial }: RankingEditorProps) {
  const isEdit = !!initial;
  const [schemaKey, setSchemaKey] = useState(initial?.schemaKey ?? sections[0]?.key ?? "");
  const [rows, setRows] = useState<RankingItemRow[]>(initial?.rows?.length ? initial.rows : [emptyRow(1)]);

  const section = useMemo(() => sections.find((s) => s.key === schemaKey), [sections, schemaKey]);
  const regions = regionOptions.find((r) => r.key === schemaKey)?.regions ?? [];
  const items = itemsBySection.find((r) => r.key === schemaKey)?.items ?? [];
  const f = initial?.fields ?? {};

  function updateRow(index: number, patch: Partial<RankingItemRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }
  function addRow() {
    setRows((prev) => [...prev, emptyRow(prev.length + 1)]);
  }
  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index).map((row, i) => ({ ...row, rank: i + 1 })));
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="schema_key" value={schemaKey} />
      {isEdit && <input type="hidden" name="id" value={initial!.id} />}
      <input type="hidden" name="ranking_items_json" value={JSON.stringify(rows)} />

      <div className={sectionClass}>
        <h2 className="mb-3 text-sm font-black text-slate-800">基本</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>カテゴリ(section) *</label>
            {isEdit ? (
              <input className={inputClass} value={section?.label ?? schemaKey} disabled />
            ) : (
              <select className={inputClass} value={schemaKey} onChange={(e) => setSchemaKey(e.target.value)}>
                {sections.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className={labelClass}>slug *</label>
            <input name="slug" defaultValue={initial?.slug ?? ""} className={inputClass} placeholder="niigata-ramen-essential" required />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>タイトル *</label>
            <input name="title" defaultValue={f.title ?? ""} className={inputClass} required />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>説明</label>
            <textarea name="description" defaultValue={f.description ?? ""} rows={2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>カード/メタ画像URL</label>
            <input name="image_url" defaultValue={f.image_url ?? ""} className={inputClass} placeholder="https://… 空欄の場合は1位アイテムの画像を自動使用" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>結論</label>
            <textarea name="conclusion" defaultValue={f.conclusion ?? ""} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>クイック表ラベル</label>
            <input name="quick_table_label" defaultValue={f.quick_table_label ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>評価軸（カンマ/改行区切り）</label>
            <input name="criteria" defaultValue={f.criteria ?? ""} className={inputClass} />
          </div>
          {section && section.regionMode !== "none" && (
            <div>
              <label className={labelClass}>地域(region){section.regionMode === "required" && " *"}</label>
              {regions.length > 0 ? (
                <select name="region" defaultValue={initial?.region ?? ""} className={inputClass}>
                  <option value="">（未選択）</option>
                  {regions.map((r) => <option key={r.slug} value={r.slug}>{r.name}（{r.slug}）</option>)}
                </select>
              ) : (
                <input name="region" defaultValue={initial?.region ?? ""} className={inputClass} />
              )}
            </div>
          )}
          {section?.hasTarget && (
            <div>
              <label className={labelClass}>対象(target)</label>
              <select name="target" defaultValue={initial?.target ?? ""} className={inputClass}>
                <option value="">（未選択）</option>
                {targetOptions.map((t) => <option key={t.slug} value={t.slug}>{t.name}（{t.slug}）</option>)}
              </select>
            </div>
          )}
          <div>
            <label className={labelClass}>タグ（カンマ/改行区切り）</label>
            <input name="tags" defaultValue={f.tags ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>最終更新日</label>
            <input type="date" name="last_updated_at" defaultValue={f.last_updated_at ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>ステータス</label>
            <select name="status" defaultValue={initial?.status ?? "published"} className={inputClass}>
              <option value="published">公開</option>
              <option value="draft">下書き</option>
            </select>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800">ランキング項目</h2>
          <button type="button" onClick={addRow} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
            <Plus className="h-3.5 w-3.5" /> 行を追加
          </button>
        </div>
        {items.length === 0 && (
          <p className="mb-3 text-xs text-amber-600">この section には登録済みの item がありません。先に店舗・商品を作成してください。</p>
        )}
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-[64px_1fr_80px_auto]">
              <div>
                <label className={labelClass}>順位</label>
                <input type="number" min={1} value={row.rank} onChange={(e) => updateRow(index, { rank: Number(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>item</label>
                <select value={row.itemSlug} onChange={(e) => updateRow(index, { itemSlug: e.target.value })} className={inputClass}>
                  <option value="">（選択）</option>
                  {items.map((it) => <option key={it.slug} value={it.slug}>{it.name}（{it.slug}）</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>スコア</label>
                <input type="number" step="any" value={row.score ?? ""} onChange={(e) => updateRow(index, { score: e.target.value === "" ? null : Number(e.target.value) })} className={inputClass} />
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-1.5 pb-2.5 text-xs text-slate-600">
                  <input type="checkbox" checked={row.isPr} onChange={(e) => updateRow(index, { isPr: e.target.checked })} className="h-4 w-4" /> PR
                </label>
                <button type="button" onClick={() => removeRow(index)} className="mb-1 rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label="削除">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="sm:col-span-4">
                <label className={labelClass}>理由</label>
                <textarea value={row.reason} onChange={(e) => updateRow(index, { reason: e.target.value })} rows={2} className={inputClass} />
              </div>
            </div>
          ))}
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
