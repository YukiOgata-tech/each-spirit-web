import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentAdminUser } from "@/lib/admin";
import { getProteinTargets } from "@/lib/content";
import { RANKING_SECTIONS } from "@/lib/admin-ranking-schema";
import { RankingEditor } from "@/components/admin/RankingEditor";
import { routes } from "@/lib/routes";
import { saveRanking } from "../actions";
import { buildRegionOptions } from "../../items/region-options";
import { buildItemsBySection } from "../options";

export const metadata: Metadata = { title: "ランキングの作成", robots: { index: false } };

export default async function NewRankingPage() {
  const admin = await getCurrentAdminUser();
  if (!admin) redirect(`${routes.authLogin}?next=/account/rankings/new`);

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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">Admin editor</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">ランキングの作成</h1>
          <p className="mt-2 text-sm text-slate-500">カテゴリ(section)を選び、項目に登録済みの店舗・商品を順位付けします。</p>
        </div>
      </header>
      <div className="mx-auto mt-6 w-[min(1080px,calc(100%-24px))] sm:w-[min(1080px,calc(100%-32px))]">
        <RankingEditor
          action={saveRanking}
          sections={RANKING_SECTIONS}
          regionOptions={regionOptions}
          itemsBySection={itemsBySection}
          targetOptions={targetOptions}
        />
      </div>
    </main>
  );
}
