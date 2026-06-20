import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLeisureRanking, getLeisureRankingEntries, getLeisureRankings } from "@/lib/content";
import { breadcrumbSchema, faqSchema, leisureItemListSchema, pageMetadata, speakableWebPageSchema } from "@/lib/seo";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ slug: string }> };

const region = "niigata";
const kindLabel = { outdoor: "アウトドア", indoor: "インドア", hybrid: "複合型" };

export async function generateStaticParams() {
  const rankings = await getLeisureRankings(region);
  return rankings.map((ranking) => ({ slug: ranking.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ranking = await getLeisureRanking(region, slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.leisureRanking(region, ranking.slug),
  });
}

export default async function LeisureRankingPage({ params }: PageProps) {
  const { slug } = await params;
  const ranking = await getLeisureRanking(region, slug);
  if (!ranking) notFound();
  const entries = await getLeisureRankingEntries(region, ranking.slug);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "レジャー", href: routes.leisure },
    { name: "新潟", href: routes.leisureRegion(region) },
    { name: ranking.title, href: routes.leisureRanking(region, ranking.slug) },
  ];

  return (
    <div className="leisure-theme section-shell">
      <JsonLd data={leisureItemListSchema(ranking, region, entries)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(ranking.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.leisureRanking(region, ranking.slug), ranking.title)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />
      <section className="rounded-lg border border-cyan-200 bg-white p-5 shadow-soft sm:p-8">
        <Badge>Ranking</Badge>
        <h1 data-speakable="title" className="mt-5 text-3xl font-bold leading-tight tracking-normal sm:text-5xl">{ranking.title}</h1>
        <p data-speakable="description" className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{ranking.description}</p>
        <p className="mt-5 rounded-lg bg-cyan-50 p-4 text-sm font-semibold leading-7 text-cyan-950">結論: {ranking.conclusion}</p>
        <p className="mt-4 text-sm text-slate-500">最終更新日: {ranking.lastUpdatedAt}</p>
      </section>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">{ranking.quickTableLabel}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr><th className="p-3">順位</th><th className="p-3">スポット</th><th className="p-3">分類</th><th className="p-3">エリア</th><th className="p-3">評価</th><th className="p-3">PR</th></tr>
            </thead>
            <tbody>
              {entries.map(({ entry, spot }) => (
                <tr key={spot.slug} className="border-t border-slate-200">
                  <td className="p-3 font-bold">{entry.rank}</td>
                  <td className="p-3"><Link href={routes.leisureSpot(region, spot.slug)} className="font-semibold underline underline-offset-4">{spot.name}</Link></td>
                  <td className="p-3">{kindLabel[spot.kind]} / {spot.genre}</td>
                  <td className="p-3">{spot.area}</td>
                  <td className="p-3">{entry.score}/100</td>
                  <td className="p-3">{entry.isPr ? "PR" : "なし"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-8 grid gap-4">
        {entries.map(({ entry, spot }) => (
          <div key={spot.slug} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-cyan-200 bg-cyan-50 text-cyan-800">No.{entry.rank}</Badge>
              <h2 className="text-2xl font-semibold">{spot.name}</h2>
              <Badge>{entry.isPr ? "PR掲載" : "PR掲載なし"}</Badge>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{entry.reason}</p>
            <p className="mt-3 text-sm text-slate-500">分類: {kindLabel[spot.kind]} / 料金目安: {spot.priceRange} / 駐車場: {spot.parking ? "あり" : "要確認"}</p>
            <Button asChild className="mt-4" size="sm"><Link href={routes.leisureSpot(region, spot.slug)}>スポット詳細</Link></Button>
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
