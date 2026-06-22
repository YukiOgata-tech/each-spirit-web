import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { HotelCard } from "@/components/travel/HotelCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqSchema, pageMetadata, speakableWebPageSchema, travelRankingItemListSchema } from "@/lib/seo";
import { getTravelRanking, getTravelRankingEntries, getTravelRankings, getTravelRegions } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  return await Promise.all(
    (await getTravelRegions()).map(async (r) => {
      const rankings = await getTravelRankings(r.slug);
      return rankings.map((ranking) => ({ region: r.slug, slug: ranking.slug }));
    })
  ).then((arr) => arr.flat());
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const ranking = await getTravelRanking(region, slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.travelRanking(region, slug),
    image: ranking.imageUrl,
  });
}

export default async function TravelRankingPage({ params }: PageProps) {
  const { region, slug } = await params;
  const ranking = await getTravelRanking(region, slug);
  if (!ranking) notFound();

  const entries = await getTravelRankingEntries(region, slug);
  const regionLabel = region === "niigata" ? "新潟県" : region === "yamagata" ? "山形県" : region;

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行ガイド", href: routes.travel },
    { name: regionLabel, href: routes.travelRegion(region) },
    { name: ranking.title, href: routes.travelRanking(region, slug) },
  ];

  return (
    <div className="travel-theme section-shell">
      <JsonLd data={travelRankingItemListSchema(region, ranking, entries)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(ranking.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.travelRanking(region, slug), ranking.title)} />

      <Breadcrumbs
        items={breadcrumbs.map((b, i) => ({ label: b.name, href: i < breadcrumbs.length - 1 ? b.href : undefined }))}
      />

      <section className="mt-4 rounded-xl border border-[var(--border)] bg-white p-6 shadow-soft sm:p-8">
        <Badge className="bg-[var(--muted)] text-[var(--primary)]">Ranking</Badge>
        <h1 data-speakable="title" className="mt-5 text-3xl font-bold leading-tight tracking-normal sm:text-4xl">{ranking.title}</h1>
        <p data-speakable="description" className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{ranking.description}</p>
        <p className="mt-5 rounded-lg bg-[var(--muted)] p-4 text-sm font-semibold leading-7 text-slate-800">
          <strong>結論:</strong> {ranking.conclusion}
        </p>
        <p className="mt-4 text-sm text-slate-400">最終更新: {ranking.lastUpdatedAt}</p>
      </section>

      {/* Quick table */}
      <section className="mt-6 rounded-xl border border-[var(--border)] bg-white p-5">
        <h2 className="font-bold">{ranking.quickTableLabel}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead className="bg-[var(--muted)] text-slate-600">
              <tr>
                <th className="p-3">順位</th>
                <th className="p-3">宿名</th>
                <th className="p-3">エリア</th>
                <th className="p-3">スタイル</th>
                <th className="p-3">評価</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(({ entry, hotel }) => (
                <tr key={hotel.slug} className="border-t border-[var(--border)]">
                  <td className="p-3">
                    <span className="travel-rank-badge inline-flex h-7 w-7 items-center justify-center text-xs">
                      {entry.rank}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link href={routes.travelHotel(region, hotel.slug)} className="font-semibold underline underline-offset-4 hover:text-[var(--primary)]">
                      {hotel.name}
                    </Link>
                  </td>
                  <td className="p-3 text-slate-500">{hotel.area}</td>
                  <td className="p-3 text-slate-500">{hotel.style}</td>
                  <td className="p-3 font-semibold text-[var(--primary)]">{entry.score}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ranked entries detail */}
      <section className="mt-6 grid gap-4">
        {entries.map(({ entry, hotel }) => (
          <div key={hotel.slug} className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="travel-rank-badge inline-flex h-8 w-8 items-center justify-center text-sm">
                {entry.rank}
              </span>
              <h2 className="text-xl font-bold">{hotel.name}</h2>
              <Badge className="bg-[var(--muted)] text-[var(--primary)]">{hotel.style}</Badge>
              <Badge>{hotel.area}</Badge>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{entry.reason}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>{hotel.pricePerPerson}</span>
              {hotel.onsen && <span className="text-emerald-600">温泉あり</span>}
              <span>{hotel.meals}</span>
            </div>
            <Button asChild size="sm" className="mt-4">
              <Link href={routes.travelHotel(region, hotel.slug)}>宿の詳細を見る</Link>
            </Button>
          </div>
        ))}
      </section>

      {/* Hotel cards */}
      <section className="mt-8">
        <h2 className="section-heading">掲載宿カード</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map(({ hotel }) => (
            <HotelCard key={hotel.slug} region={region} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* Criteria */}
      <section className="mt-8 rounded-xl border border-[var(--border)] bg-white p-5">
        <h2 className="font-bold">評価基準</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ranking.criteria.map((criterion) => (
            <li key={criterion} className="rounded-md bg-[var(--muted)] p-3 text-sm leading-6">{criterion}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 grid gap-6">
        <FaqSection faqs={ranking.faqs} />
        <SourceList sources={ranking.sources} />
      </div>

      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href={routes.travelRegion(region)}>← {regionLabel}旅行ガイドに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
