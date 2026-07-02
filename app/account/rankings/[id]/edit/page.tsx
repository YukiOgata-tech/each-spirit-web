import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentAdminUser } from "@/lib/admin";
import { createServerClient } from "@/lib/supabase-server";
import { getProteinTargets } from "@/lib/content";
import { RANKING_SECTIONS, type RankingItemRow } from "@/lib/admin-ranking-schema";
import { RankingEditor, type RankingInitial } from "@/components/admin/RankingEditor";
import { routes } from "@/lib/routes";
import { saveRanking } from "../../actions";
import { buildRegionOptions } from "../../../items/region-options";
import { buildItemsBySection } from "../../options";

export const metadata: Metadata = { title: "ランキングの編集", robots: { index: false } };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditRankingPage({ params }: PageProps) {
  const { id } = await params;
  const admin = await getCurrentAdminUser();
  if (!admin) redirect(`${routes.authLogin}?next=/account/rankings/${id}/edit`);

  const service = createServerClient();
  const { data: row } = await service
    .from("rankings")
    .select("*, ranking_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (!row) notFound();

  const meta = (row.metadata as Record<string, unknown>) ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const riRows: RankingItemRow[] = ((row.ranking_items as any[]) ?? [])
    .sort((a, b) => a.rank - b.rank)
    .map((ri) => ({
      rank: ri.rank,
      entryKind: ri.entry_kind === "manual" ? "manual" : "item",
      itemSlug: ri.item_slug,
      displayName: ri.display_name ?? "",
      description: ri.description ?? "",
      externalUrl: ri.external_url ?? "",
      imageUrl: ri.image_url ?? "",
      imageAlt: ri.image_alt ?? "",
      priceRange: ri.price_range ?? "",
      area: ri.area ?? "",
      tags: ((ri.tags as string[]) ?? []).join(", "),
      affiliateQuery: typeof ri.metadata?.affiliate_query === "string" ? ri.metadata.affiliate_query : "",
      score: ri.score === null || ri.score === undefined ? null : Number(ri.score),
      reason: ri.reason ?? "",
      isPr: ri.is_pr ?? false,
    }));

  const str = (v: unknown) => (v == null ? "" : String(v));
  const initial: RankingInitial = {
    id: row.id,
    schemaKey: `${row.major_category}:${row.section_slug}`,
    slug: row.slug,
    status: row.status ?? "published",
    region: str(row.region),
    target: str(meta.target),
    fields: {
      title: str(row.title),
      description: str(row.description),
      image_url: str(row.image_url),
      conclusion: str(row.conclusion),
      quick_table_label: str(row.quick_table_label),
      criteria: ((row.criteria as string[]) ?? []).join(", "),
      tags: ((row.tags as string[]) ?? []).join(", "),
      last_updated_at: row.last_updated_at ? String(row.last_updated_at).slice(0, 10) : "",
    },
    rows: riRows,
  };

  const [regionOptions, itemsBySection, targets] = await Promise.all([
    buildRegionOptions(),
    buildItemsBySection(),
    getProteinTargets(),
  ]);
  const targetOptions = targets.map((t) => ({ slug: t.slug, name: t.name }));

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-[min(1080px,calc(100%-24px))] py-5 sm:w-[min(1080px,calc(100%-32px))] sm:py-6">
          <p className="inline-flex items-center rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">Admin only</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{row.title} を編集</h1>
        </div>
      </header>
      <div className="mx-auto mt-6 w-[min(1080px,calc(100%-24px))] sm:w-[min(1080px,calc(100%-32px))]">
        <RankingEditor
          action={saveRanking}
          sections={RANKING_SECTIONS}
          regionOptions={regionOptions}
          itemsBySection={itemsBySection}
          targetOptions={targetOptions}
          initial={initial}
        />
      </div>
    </main>
  );
}
