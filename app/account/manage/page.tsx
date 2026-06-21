import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, PenLine, ShieldCheck } from "lucide-react";
import { getCurrentAdminUser } from "@/lib/admin";
import { createServerClient } from "@/lib/supabase-server";
import { routes } from "@/lib/routes";
import { ContentManager, type ManagedRow } from "@/components/admin/ContentManager";

export const metadata: Metadata = { title: "コンテンツ管理", robots: { index: false } };

type ArticleRow = {
  id: string; title: string | null; slug: string; category: string | null;
  major_category: string | null; section_slug: string | null;
  status: string | null; canonical_path: string | null; updated_at: string | null;
};
type ItemRow = {
  id: string; name: string | null; slug: string;
  major_category: string | null; section_slug: string | null;
  status: string | null; canonical_path: string | null; updated_at: string | null;
};
type RankingRow = {
  id: string; title: string | null; slug: string;
  major_category: string | null; section_slug: string | null;
  status: string | null; canonical_path: string | null; updated_at: string | null;
};

function sectionLabel(major: string | null, section: string | null) {
  return [major, section].filter(Boolean).join(" / ");
}

export default async function ManageContentPage() {
  const admin = await getCurrentAdminUser();
  if (!admin) redirect(`${routes.authLogin}?next=/account/manage`);

  const service = createServerClient();
  const [articlesRes, itemsRes, rankingsRes] = await Promise.all([
    service.from("articles")
      .select("id, title, slug, category, major_category, section_slug, status, canonical_path, updated_at")
      .order("updated_at", { ascending: false }),
    service.from("items")
      .select("id, name, slug, major_category, section_slug, status, canonical_path, updated_at")
      .order("updated_at", { ascending: false }),
    service.from("rankings")
      .select("id, title, slug, major_category, section_slug, status, canonical_path, updated_at")
      .order("updated_at", { ascending: false }),
  ]);

  const rows: ManagedRow[] = [
    ...((articlesRes.data as ArticleRow[] | null) ?? []).map((r): ManagedRow => ({
      id: r.id,
      kind: "article",
      title: r.title ?? r.slug,
      slug: r.slug,
      category: r.category ?? sectionLabel(r.major_category, r.section_slug),
      status: r.status ?? "published",
      editHref: `/account/articles/${r.id}/edit`,
      viewHref: r.canonical_path,
      updatedAt: r.updated_at,
    })),
    ...((itemsRes.data as ItemRow[] | null) ?? []).map((r): ManagedRow => ({
      id: r.id,
      kind: "item",
      title: r.name ?? r.slug,
      slug: r.slug,
      category: sectionLabel(r.major_category, r.section_slug),
      status: r.status ?? "published",
      editHref: `/account/items/${r.id}/edit`,
      viewHref: r.canonical_path,
      updatedAt: r.updated_at,
    })),
    ...((rankingsRes.data as RankingRow[] | null) ?? []).map((r): ManagedRow => ({
      id: r.id,
      kind: "ranking",
      title: r.title ?? r.slug,
      slug: r.slug,
      category: sectionLabel(r.major_category, r.section_slug),
      status: r.status ?? "published",
      editHref: `/account/rankings/${r.id}/edit`,
      viewHref: r.canonical_path,
      updatedAt: r.updated_at,
    })),
  ];

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1080px,calc(100%-24px))] py-5 sm:w-[min(1080px,calc(100%-32px))] sm:py-6">
          <Link href={routes.account} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-800">
            <ArrowLeft className="h-3.5 w-3.5" />
            マイページ
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin only
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">コンテンツ管理</h1>
              <p className="mt-2 text-sm text-slate-500">公開済み・下書きの記事／店舗・商品／ランキングを検索して編集します。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/account/articles/new" className="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-900 transition hover:border-orange-400 hover:bg-orange-50">
                <PenLine className="h-3.5 w-3.5 text-orange-500" /> 記事を作成
              </Link>
              <Link href="/account/items/new" className="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-900 transition hover:border-orange-400 hover:bg-orange-50">
                <PenLine className="h-3.5 w-3.5 text-orange-500" /> 店舗・商品を作成
              </Link>
              <Link href="/account/rankings/new" className="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-900 transition hover:border-orange-400 hover:bg-orange-50">
                <PenLine className="h-3.5 w-3.5 text-orange-500" /> ランキングを作成
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 w-[min(1080px,calc(100%-24px))] sm:w-[min(1080px,calc(100%-32px))]">
        <ContentManager rows={rows} />
      </div>
    </main>
  );
}
