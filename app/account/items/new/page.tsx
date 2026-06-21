import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import { getCurrentAdminUser } from "@/lib/admin";
import { SECTION_ITEM_SCHEMAS } from "@/lib/admin-item-schema";
import { ItemEditor } from "@/components/admin/ItemEditor";
import { routes } from "@/lib/routes";
import { saveItem } from "../actions";
import { buildRegionOptions } from "../region-options";

export const metadata: Metadata = { title: "店舗・商品の作成", robots: { index: false } };

export default async function NewItemPage() {
  const admin = await getCurrentAdminUser();
  if (!admin) redirect(`${routes.authLogin}?next=/account/items/new`);

  const regionOptions = await buildRegionOptions();

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1080px,calc(100%-24px))] py-5 sm:w-[min(1080px,calc(100%-32px))] sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <p className="inline-flex items-center rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">Admin only</p>
            <Link
              href="/account/manage"
              className="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-900 transition hover:border-orange-400 hover:bg-orange-50"
            >
              <Pencil className="h-3.5 w-3.5 text-orange-500" />
              既存を修正
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">店舗・商品の作成</h1>
          <p className="mt-2 text-sm text-slate-500">大カテゴリを選び、既存カテゴリ(section)の選択または新規カテゴリ作成から入力できます。</p>
        </div>
      </header>
      <div className="mx-auto mt-6 w-[min(1080px,calc(100%-24px))] sm:w-[min(1080px,calc(100%-32px))]">
        <ItemEditor action={saveItem} schemas={SECTION_ITEM_SCHEMAS} regionOptions={regionOptions} />
      </div>
    </main>
  );
}
