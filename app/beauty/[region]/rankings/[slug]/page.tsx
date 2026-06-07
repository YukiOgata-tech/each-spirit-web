import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { TreatmentBadge } from "@/components/beauty/TreatmentBadge";
import { BeautyRankingEntriesClient } from "@/components/beauty/BeautyRankingEntriesClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { getBeautyRanking, getBeautyRankingEntries, getBeautyRegions, getBeautyRankings } from "@/lib/content";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export function generateStaticParams() {
  return getBeautyRegions().flatMap((r) =>
    getBeautyRankings(r.slug).map((ranking) => ({ region: r.slug, slug: ranking.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const ranking = getBeautyRanking(region, slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.beautyRanking(region, slug),
  });
}

const MEDAL = ["🥇", "🥈", "🥉"];

export default async function BeautyRankingPage({ params }: PageProps) {
  const { region, slug } = await params;
  const ranking = getBeautyRanking(region, slug);
  if (!ranking) notFound();

  const entries = getBeautyRankingEntries(region, slug);
  const breadcrumbs = [
    { name: "トップ",   href: routes.home },
    { name: "美容室",   href: routes.beauty },
    { name: region === "niigata" ? "新潟" : region === "yamagata" ? "山形" : region, href: routes.beautyRegion(region) },
    { name: ranking.title, href: routes.beautyRanking(region, slug) },
  ];

  return (
    <div className="beauty-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(ranking.faqs)} />

      <div className="border-b border-[#f2d5e8] beauty-hero-bg px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs
            items={breadcrumbs.map((item, i) => ({
              label: item.name,
              href: i === breadcrumbs.length - 1 ? undefined : item.href,
            }))}
          />
          <div className="mt-6 animate-rise">
            <span className="inline-block rounded-full border border-[#f2d5e8] bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8b3a7e]">
              Ranking
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">{ranking.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">{ranking.description}</p>
            <div className="mt-5 rounded-xl border border-[#f2d5e8] bg-white/80 p-4 text-sm font-semibold leading-7 text-[#8b3a7e]">
              編集部結論: {ranking.conclusion}
            </div>
            <p className="mt-3 text-xs text-slate-400">最終更新日: {ranking.lastUpdatedAt}</p>
          </div>
        </div>
      </div>

      <div className="section-shell mx-auto max-w-4xl">
        <section className="rounded-2xl border border-[#f2d5e8] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">{ranking.quickTableLabel}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#f2d5e8] text-xs font-bold uppercase tracking-wide text-[#8b3a7e]">
                  <th className="pb-3 pr-4">順位</th>
                  <th className="pb-3 pr-4">サロン名</th>
                  <th className="pb-3 pr-4">施術</th>
                  <th className="pb-3 pr-4">スコア</th>
                  <th className="pb-3">PR</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(({ entry, salon }) => (
                  <tr key={salon.slug} className="border-b border-[#f2d5e8]/60 hover:bg-[#fef0f6]/40 transition-colors">
                    <td className="py-3 pr-4 text-xl">{MEDAL[entry.rank - 1] ?? entry.rank}</td>
                    <td className="py-3 pr-4">
                      <Link href={routes.beautySalon(region, salon.slug)} className="font-bold text-slate-900 underline underline-offset-4 hover:text-[#8b3a7e]">
                        {salon.name}
                      </Link>
                      <p className="text-[11px] text-slate-400">{salon.area}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {salon.treatments.slice(0, 3).map((t) => (
                          <TreatmentBadge key={t} treatment={t} size="xs" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#f2d5e8]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#8b3a7e] to-[#d4819e]" style={{ width: `${entry.score}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#8b3a7e]">{entry.score}</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-slate-400">{entry.isPr ? "PR" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <BeautyRankingEntriesClient entries={entries} region={region} />

        <section className="mt-8 rounded-2xl border border-[#f2d5e8] bg-white p-6">
          <h2 className="text-lg font-bold text-slate-800">評価基準</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ranking.criteria.map((c) => (
              <li key={c} className="flex items-start gap-2 rounded-xl bg-[#fef0f6] p-3 text-sm leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8b3a7e]" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 grid gap-6">
          <FaqSection faqs={ranking.faqs} />
          <SourceList sources={ranking.sources} />
        </div>
      </div>
    </div>
  );
}
