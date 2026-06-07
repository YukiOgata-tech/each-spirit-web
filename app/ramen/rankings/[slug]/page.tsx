import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { getRankingEntries, getRamenRanking, getRamenRankings } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getRamenRankings().map((ranking) => ({ slug: ranking.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ranking = getRamenRanking(slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.ramenRanking(ranking.slug),
  });
}

export default async function RankingPage({ params }: PageProps) {
  const { slug } = await params;
  const ranking = getRamenRanking(slug);
  if (!ranking) notFound();
  const entries = getRankingEntries(ranking.slug);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "ラーメン", href: routes.ramen },
    { name: ranking.title, href: routes.ramenRanking(ranking.slug) },
  ];
  return (
    <div className="ramen-theme section-shell">
      <JsonLd data={itemListSchema(ranking, entries)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(ranking.faqs)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />
      <section className="rounded-lg border border-orange-200 bg-white p-5 shadow-soft sm:p-8">
        <Badge>Ranking</Badge>
        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-normal sm:text-5xl">{ranking.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{ranking.description}</p>
        <p className="mt-5 rounded-lg bg-orange-50 p-4 text-sm font-semibold leading-7 text-orange-950">結論: {ranking.conclusion}</p>
        <p className="mt-4 text-sm text-slate-500">最終更新日: {ranking.lastUpdatedAt}</p>
      </section>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">{ranking.quickTableLabel}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr><th className="p-3">順位</th><th className="p-3">店舗</th><th className="p-3">ジャンル</th><th className="p-3">評価</th><th className="p-3">PR</th></tr>
            </thead>
            <tbody>
              {entries.map(({ entry, item }) => (
                <tr key={item.slug} className="border-t border-slate-200">
                  <td className="p-3 font-bold">{entry.rank}</td>
                  <td className="p-3"><Link href={routes.ramenItem(item.slug)} className="font-semibold underline underline-offset-4">{item.name}</Link></td>
                  <td className="p-3">{item.genre}</td>
                  <td className="p-3">{entry.score}/100</td>
                  <td className="p-3">{entry.isPr ? "PR" : "なし"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-8 grid gap-4">
        {entries.map(({ entry, item }) => (
          <div key={item.slug} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-orange-200 bg-orange-50 text-orange-800">No.{entry.rank}</Badge>
              <h2 className="text-2xl font-semibold">{item.name}</h2>
              <Badge>{entry.isPr ? "PR掲載" : "PR掲載なし"}</Badge>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{entry.reason}</p>
            <p className="mt-3 text-sm text-slate-500">価格帯: {item.priceRange} / 駐車場: {item.parking ? "あり" : "なし"}</p>
            <Button asChild className="mt-4" size="sm"><Link href={routes.ramenItem(item.slug)}>店舗詳細</Link></Button>
          </div>
        ))}
      </section>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">評価基準</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ranking.criteria.map((criterion) => <li key={criterion} className="rounded-md bg-slate-50 p-3 text-sm leading-6">{criterion}</li>)}
        </ul>
      </section>
      <div className="mt-8 grid gap-6">
        <FaqSection faqs={ranking.faqs} />
        <SourceList sources={ranking.sources} />
      </div>
    </div>
  );
}
