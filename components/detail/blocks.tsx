import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, ExternalLink, MapPin, ShoppingCart, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MajorTheme } from "@/lib/major-theme";
import type { ItemField } from "@/lib/admin-item-schema";
import type { GenericItem } from "@/lib/types";
import { attributeEntries, cardClass, metaList, metaStr, officialLinks, panelClass } from "./shared";

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className ?? panelClass}>
      <h2 className="text-lg font-bold tracking-normal text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

/** 来店型の基本情報カード（サイドバー向け） */
export function KeyInfoCard({ item, theme }: { item: GenericItem; theme: MajorTheme }) {
  const rows = ([
    ["エリア", item.area],
    ["住所", item.address],
    ["電話", item.phone],
    ["価格帯", item.priceRange],
    ["営業時間", metaStr(item, "business_hours")],
    ["定休日", metaStr(item, "closed_days")],
  ] as [string, string | undefined][]).filter(([, v]) => v);
  if (rows.length === 0 && !item.mapUrl) return null;
  return (
    <section className={cardClass}>
      <h2 className="text-base font-bold text-slate-950">基本情報</h2>
      <dl className="mt-3 space-y-2.5 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className={`rounded-lg p-2.5 ${theme.soft}`}>
            <dt className="text-[11px] font-bold text-slate-500">{label}</dt>
            <dd className="mt-0.5 break-words text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
      {item.mapUrl && (
        <Button asChild variant="outline" size="sm" className="mt-3 w-full">
          <a href={item.mapUrl} target="_blank" rel="noreferrer"><MapPin className="h-4 w-4" /> 地図で見る</a>
        </Button>
      )}
    </section>
  );
}

/** item_schema 駆動の属性表 */
export function AttributesBlock({ item, fields, theme, title = "詳細" }: { item: GenericItem; fields: ItemField[]; theme: MajorTheme; title?: string }) {
  const entries = attributeEntries(item, fields);
  if (entries.length === 0) return null;
  return (
    <Panel title={title}>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {entries.map((e) => (
          <div key={e.key} className={`rounded-lg p-3 ${theme.soft}`}>
            <dt className="text-xs font-bold text-slate-500">{e.key}</dt>
            <dd className="mt-1 break-words text-slate-900">{e.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/** ジャンルチップ */
export function GenresBlock({ item, title = "ジャンル" }: { item: GenericItem; title?: string }) {
  if (item.genres.length === 0) return null;
  return (
    <Panel title={title}>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.genres.map((g) => (
          <span key={g} className="rounded-full border border-[var(--border)] bg-[var(--primary)]/5 px-3 py-1 text-xs font-semibold text-[var(--primary)]">{g}</span>
        ))}
      </div>
    </Panel>
  );
}

/** 沿革・経歴（縦タイムライン） */
export function HistoryBlock({ item, title = "沿革・経歴" }: { item: GenericItem; title?: string }) {
  if (item.history.length === 0) return null;
  return (
    <Panel title={title}>
      <ol className="mt-4 space-y-4 border-l-2 border-[var(--border)] pl-5">
        {item.history.map((h, i) => (
          <li key={`${h.date}-${i}`} className="relative">
            <span className="absolute -left-[1.45rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-[var(--primary)]" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)]"><CalendarDays className="h-3.5 w-3.5" />{h.date}</div>
            <p className="mt-1 text-sm leading-7 text-slate-700">{h.description}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/** 視聴/購入/利用の導線 */
export function ServiceModelBlock({ item, title }: { item: GenericItem; title: string }) {
  if (item.serviceModel.length === 0) return null;
  return (
    <Panel title={title}>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {item.serviceModel.map((s, i) => {
          const inner = (
            <>
              <span className="flex items-center gap-2 font-semibold text-slate-900">
                {s.url ? <ShoppingCart className="h-4 w-4 text-[var(--primary)]" /> : null}{s.service}
              </span>
              {s.note ? <span className="text-xs text-slate-500">{s.note}</span> : null}
              {s.url ? <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" /> : null}
            </>
          );
          const cls = "flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-white p-3.5 text-sm transition-colors hover:border-[var(--primary)]/40";
          return s.url
            ? <a key={`${s.service}-${i}`} href={s.url} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
            : <div key={`${s.service}-${i}`} className={cls}>{inner}</div>;
        })}
      </div>
    </Panel>
  );
}

/** メリット・デメリット（product） */
export function ProsConsBlock({ item }: { item: GenericItem }) {
  const pros = metaList(item, "pros");
  const cons = metaList(item, "cons");
  if (pros.length === 0 && cons.length === 0) return null;
  return (
    <Panel title="メリット・デメリット">
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {pros.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">メリット</p>
            <ul className="space-y-2">{pros.map((p) => <li key={p} className="flex items-start gap-1.5 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{p}</li>)}</ul>
          </div>
        )}
        {cons.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-500">デメリット</p>
            <ul className="space-y-2">{cons.map((c) => <li key={c} className="flex items-start gap-1.5 text-sm text-slate-600"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />{c}</li>)}</ul>
          </div>
        )}
      </div>
    </Panel>
  );
}

/** 公式・参考リンク */
export function OfficialLinksBlock({ item }: { item: GenericItem }) {
  const links = officialLinks(item);
  if (links.length === 0) return null;
  return (
    <Panel title="公式・参考リンク">
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <Button key={l.url} asChild variant={l.type === "map" ? "outline" : "default"} size="sm">
            <a href={l.url} target="_blank" rel="noreferrer">
              {l.type === "map" ? <MapPin className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}{l.label || "公式サイト"}
            </a>
          </Button>
        ))}
      </div>
    </Panel>
  );
}

/** 関連ページ（内部/外部） */
export function RelatedLinksBlock({ item, title = "関連ページ" }: { item: GenericItem; title?: string }) {
  if (item.relatedLink.length === 0) return null;
  return (
    <Panel title={title}>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {item.relatedLink.map((l, i) => {
          const internal = l.url.startsWith("/");
          const cls = "flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-white p-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-[var(--primary)]/40";
          const inner = <>{l.label}{internal ? <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" /> : <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />}</>;
          return internal
            ? <Link key={`${l.url}-${i}`} href={l.url} className={cls}>{inner}</Link>
            : <a key={`${l.url}-${i}`} href={l.url} target="_blank" rel="noreferrer" className={cls}>{inner}</a>;
        })}
      </div>
    </Panel>
  );
}

/** 栄養成分（食品商品・汎用）。GenericItem.nutrition を表・PFCバーで表示。 */
export function NutritionBlock({ item }: { item: GenericItem }) {
  const n = item.nutrition;
  if (!n) return null;
  const basisLabel = n.basis === "per_100g" ? "100gあたり" : n.serving_size ? `1食 ${n.serving_size}g あたり` : "1食あたり";
  const cells = ([
    ["タンパク質", n.protein, "g"], ["カロリー", n.calories, "kcal"],
    ["炭水化物", n.carbs, "g"], ["脂質", n.fat, "g"],
    ["糖質", n.sugar, "g"], ["食物繊維", n.fiber, "g"], ["食塩相当量", n.salt, "g"],
  ] as [string, number | undefined, string][]).filter(([, v]) => v != null);
  if (cells.length === 0) return null;
  const p = n.protein ?? 0, f = n.fat ?? 0, c = n.carbs ?? 0;
  const tot = p + f + c;
  const seg = (v: number) => (tot > 0 ? (v / tot) * 100 : 0);
  return (
    <Panel title={`栄養成分（${basisLabel}）`}>
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {cells.map(([label, value, unit]) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-white p-3 text-center">
            <div className="text-[11px] font-bold text-slate-500">{label}</div>
            <div className="mt-1 text-lg font-black text-slate-900">{value}<span className="ml-0.5 text-xs font-normal text-slate-400">{unit}</span></div>
          </div>
        ))}
      </div>
      {tot > 0 && (
        <div className="mt-4">
          <div className="flex h-3 w-full overflow-hidden rounded-full border border-[var(--border)]">
            <div style={{ width: `${seg(p)}%` }} className="bg-[var(--primary)]" />
            <div style={{ width: `${seg(f)}%` }} className="bg-amber-400" />
            <div style={{ width: `${seg(c)}%` }} className="bg-slate-300" />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[var(--primary)]" />タンパク質 {p}g</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-400" />脂質 {f}g</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-slate-300" />炭水化物 {c}g</span>
          </div>
        </div>
      )}
    </Panel>
  );
}

/** 編集部コメント */
export function EditorCommentBlock({ item, theme }: { item: GenericItem; theme: MajorTheme }) {
  if (!item.editorComment) return null;
  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${theme.accentPanel}`}>
      <h2 className="text-base font-bold text-slate-950">編集部コメント</h2>
      <p className="mt-2 text-sm leading-7 text-slate-700">{item.editorComment}</p>
    </section>
  );
}