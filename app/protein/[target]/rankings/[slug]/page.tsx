import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { ProteinRankingEntriesClient } from "@/components/protein/ProteinRankingEntriesClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import {
  getProteinRanking, getProteinRankingEntries,
  getProteinRankings, getProteinTargets,
} from "@/lib/content";

type PageProps = { params: Promise<{ target: string; slug: string }> };

export function generateStaticParams() {
  return getProteinTargets().flatMap((t) =>
    getProteinRankings()
      .filter((r) => r.target === t.slug)
      .map((r) => ({ target: t.slug, slug: r.slug }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ranking = getProteinRanking(slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.proteinRanking(ranking.target, slug),
  });
}

const TARGET_LABEL: Record<string, string> = {
  women: "女性向け", men: "男性向け", trainer: "トレーナー",
  student: "大学生", diet: "ダイエット", beginner: "初心者",
};

const MEDAL = ["🥇", "🥈", "🥉"];

export default async function ProteinRankingPage({ params }: PageProps) {
  const { target, slug } = await params;
  const ranking = getProteinRanking(slug);
  if (!ranking) notFound();

  const entries = getProteinRankingEntries(slug);
  const targetLabel = TARGET_LABEL[target] ?? target;

  const breadcrumbs = [
    { name: "トップ",             href: routes.home },
    { name: "プロテイン",          href: routes.protein },
    { name: `${targetLabel}`,     href: routes.proteinTarget(target) },
    { name: ranking.title,        href: routes.proteinRanking(target, slug) },
  ];

  return (
    <div className="protein-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(ranking.faqs)} />

      {/* hero */}
      <div className="protein-hero-bg border-b border-blue-900 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs
            items={breadcrumbs.map((item, i) => ({
              label: item.name,
              href: i === breadcrumbs.length - 1 ? undefined : item.href,
            }))}
          />
          <div className="mt-6 animate-rise">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-200">
              Ranking
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">{ranking.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-blue-200">{ranking.description}</p>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/10 p-4 text-sm font-semibold leading-7 text-orange-200">
              編集部結論: {ranking.conclusion}
            </div>
            <p className="mt-3 text-xs text-blue-400">最終更新日: {ranking.lastUpdatedAt}</p>
          </div>
        </div>
      </div>

      <div className="section-shell mx-auto max-w-4xl">
        {/* Quick table */}
        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">{ranking.quickTableLabel}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-blue-100 text-xs font-bold uppercase tracking-wide text-[#1e3a5f]">
                  <th className="pb-3 pr-4">順位</th>
                  <th className="pb-3 pr-4">商品名</th>
                  <th className="pb-3 pr-4 text-center">タンパク質</th>
                  <th className="pb-3 pr-4 text-center">カロリー</th>
                  <th className="pb-3 pr-4 text-center">脂質</th>
                  <th className="pb-3 text-center">1kg換算</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(({ entry, product }) => (
                  <tr key={product.slug} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 pr-4 text-xl">{MEDAL[entry.rank - 1] ?? entry.rank}</td>
                    <td className="py-3 pr-4">
                      <Link href={routes.proteinProduct(product.slug)} className="font-bold text-slate-900 underline underline-offset-4 hover:text-[#1e3a5f]">
                        {product.brand}
                      </Link>
                      <p className="text-[11px] text-slate-400">{product.name.split("（")[0].slice(0, 24)}</p>
                    </td>
                    <td className="py-3 pr-4 text-center font-black text-[#1e3a5f]">{product.protein}g</td>
                    <td className="py-3 pr-4 text-center text-orange-600">{product.calories}kcal</td>
                    <td className="py-3 pr-4 text-center text-slate-600">{product.fat}g</td>
                    <td className="py-3 text-center font-bold text-emerald-700">¥{product.pricePerKg.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Animated entry cards */}
        <ProteinRankingEntriesClient entries={entries} />

        {/* Criteria */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-800">評価基準</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ranking.criteria.map((c) => (
              <li key={c} className="flex items-start gap-2 rounded-xl bg-[#eff6ff] p-3 text-sm leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1e3a5f]" />{c}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 grid gap-6">
          <FaqSection faqs={ranking.faqs} />
          <SourceList sources={ranking.sources} />
        </div>

        <div className="mt-8 text-center">
          <Link href={routes.proteinTarget(target)} className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-5 py-2.5 text-sm font-bold text-[#1e3a5f] hover:bg-blue-50 transition-colors">
            ← {targetLabel}ガイドに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
