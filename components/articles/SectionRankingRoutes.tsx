import { RankingCard } from "@/components/cards/RankingCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRankingsBySection, rankingHref } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/seo";
import { routes } from "@/lib/routes";

export type SectionConfig = {
  majorCategory: string;
  sectionSlug: string;
  majorLabel: string;
  sectionLabel: string;
  sectionHref: string;
};

export async function SectionRankingsIndex({ config }: { config: SectionConfig }) {
  const rankings = await getRankingsBySection(config.majorCategory, config.sectionSlug);
  const path = routes.sectionRankings(config.majorCategory, config.sectionSlug);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: config.majorLabel, href: routes.majorCategory(config.majorCategory) },
    { name: config.sectionLabel, href: config.sectionHref },
    { name: "ランキング一覧", href: path },
  ];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <div className="mb-6">
        <p className="text-sm font-semibold text-[var(--primary)]">{config.majorLabel} / {config.sectionLabel}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">{config.sectionLabel}のランキング一覧</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">公開済みランキングを更新順に表示しています。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rankings.map((ranking) => (
          <RankingCard key={`${ranking.majorCategory}-${ranking.sectionSlug}-${ranking.slug}`} ranking={ranking} href={rankingHref(ranking)} />
        ))}
      </div>
    </main>
  );
}
