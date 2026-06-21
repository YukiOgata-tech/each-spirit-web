import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentAdminUser } from "@/lib/admin";
import { createServerClient } from "@/lib/supabase-server";
import { itemSchemaKey, SECTION_ITEM_SCHEMAS } from "@/lib/admin-item-schema";
import { ItemEditor, type ItemInitial } from "@/components/admin/ItemEditor";
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

  const schemaKey = itemSchemaKey(row.major_category, row.section_slug, row.item_kind);
  const str = (v: unknown) => (v == null ? "" : String(v));
  const initial: ItemInitial = {
    id: row.id,
    schemaKey,
    slug: row.slug,
    status: row.status ?? "published",
    common: {
      name: str(row.name),
      description: str(row.description),
      region: str(row.region),
      area: str(row.area),
      address: str(row.address),
      phone: str(row.phone),
      price_range: str(row.price_range),
      image_url: str(row.image_url),
      official_url: str(row.official_url),
      map_url: str(row.map_url),
      editor_comment: str(row.editor_comment),
      last_verified_at: row.last_verified_at ? String(row.last_verified_at).slice(0, 10) : "",
    },
    tags: (row.tags as string[]) ?? [],
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  };

  const regionOptions = await buildRegionOptions();

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1080px,calc(100%-24px))] py-5 sm:w-[min(1080px,calc(100%-32px))] sm:py-6">
          <p className="inline-flex items-center rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">Admin only</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{row.name} を編集</h1>
        </div>
      </header>
      <div className="mx-auto mt-6 w-[min(1080px,calc(100%-24px))] sm:w-[min(1080px,calc(100%-32px))]">
        <ItemEditor action={saveItem} schemas={SECTION_ITEM_SCHEMAS} regionOptions={regionOptions} initial={initial} />
      </div>
    </main>
  );
}
