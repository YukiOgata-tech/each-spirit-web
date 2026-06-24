import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentAdminUser } from "@/lib/admin";
import { createServerClient } from "@/lib/supabase-server";
import { itemSchemaKey } from "@/lib/admin-item-schema";
import { ItemEditor, type ItemInitial } from "@/components/admin/ItemEditor";
import { getEditorSectionSchemas } from "@/lib/content";
import { routes } from "@/lib/routes";
import { saveItem } from "../../actions";
import { buildRegionOptions } from "../../region-options";

export const metadata: Metadata = { title: "店舗・商品の編集", robots: { index: false } };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditItemPage({ params }: PageProps) {
  const { id } = await params;
  const admin = await getCurrentAdminUser();
  if (!admin) redirect(`${routes.authLogin}?next=/account/items/${id}/edit`);

  const service = createServerClient();
  const { data: row } = await service.from("items").select("*").eq("id", id).maybeSingle();
  if (!row) notFound();

  const schemaKey = itemSchemaKey(row.major_category, row.section_slug, row.item_class);
  const str = (v: unknown) => (v == null ? "" : String(v));
  const obj = (v: unknown) => (v as Record<string, unknown> | null) ?? null;
  // jsonb 配列 → "a | b | c" の1行1件テキスト（フォーム textarea 用）
  const lines = (v: unknown, keys: string[]) =>
    Array.isArray(v) ? v.map((o) => keys.map((k) => str((o as Record<string, unknown>)?.[k])).join(" | ")).join("\n") : "";
  const initial: ItemInitial = {
    id: row.id,
    schemaKey,
    slug: row.slug,
    status: row.status ?? "published",
    itemKind: str(row.item_kind),
    common: {
      name: str(row.name),
      description: str(row.description),
      body_md: str(row.body_md),
      region: str(row.region),
      area: str((row.address_info as Record<string, unknown> | null)?.area),
      address: str((row.address_info as Record<string, unknown> | null)?.address),
      phone: str(row.phone),
      price_range: str(row.price_range),
      image_url: str((row.image as Record<string, unknown> | null)?.url),
      official_url: str(row.official_url),
      map_url: str(obj(row.address_info)?.map_url),
      editor_comment: str(row.editor_comment),
      genres: ((row.genres as string[]) ?? []).join(", "),
      image_alt: str(obj(row.image)?.alt),
      image_credit_name: str(obj(obj(row.image)?.credit)?.name),
      image_credit_url: str(obj(obj(row.image)?.credit)?.url),
      seo_title: str(obj(row.seo)?.title),
      seo_description: str(obj(row.seo)?.description),
      seo_keywords: ((obj(row.seo)?.keywords as string[] | undefined) ?? []).join(", "),
      sources: lines(row.sources, ["url", "title", "sourceType", "collectedAt", "note"]),
      faq: lines(row.faq, ["question", "answer"]),
      history: lines(row.history, ["date", "description"]),
      service_model: lines(row.service_model, ["service", "url", "note"]),
      related_link: lines(row.related_link, ["label", "url"]),
    },
    tags: (row.tags as string[]) ?? [],
    // nutrition(構造化) はフォームの数値フィールド用にフラット展開して初期表示
    metadata: (() => {
      const md = (row.metadata as Record<string, unknown>) ?? {};
      const nut = (md.nutrition as Record<string, unknown> | undefined) ?? {};
      return { ...md, ...nut, nutrition_basis: nut.basis };
    })(),
  };

  const [regionOptions, schemas] = await Promise.all([buildRegionOptions(), getEditorSectionSchemas()]);

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1080px,calc(100%-24px))] py-5 sm:w-[min(1080px,calc(100%-32px))] sm:py-6">
          <p className="inline-flex items-center rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">Admin only</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{row.name} を編集</h1>
        </div>
      </header>
      <div className="mx-auto mt-6 w-[min(1080px,calc(100%-24px))] sm:w-[min(1080px,calc(100%-32px))]">
        <ItemEditor action={saveItem} schemas={schemas} regionOptions={regionOptions} initial={initial} />
      </div>
    </main>
  );
}
