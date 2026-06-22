import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Trophy } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { TravelAgencyCard } from "@/components/travel-services/TravelAgencyCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqSchema, pageMetadata, speakableWebPageSchema, travelAgencyRankingItemListSchema } from "@/lib/seo";
import { getTravelServiceRanking, getTravelServiceRankingEntries, getTravelServiceRankings, getTravelServiceRegions } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  return await Promise.all(
    (await getTravelServiceRegions()).map(async (r) => {
      const rankings = await getTravelServiceRankings(r.slug);
      return rankings.map((ranking) => ({ region: r.slug, slug: ranking.slug }));
    })
  ).then((arr) => arr.flat());
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const ranking = await getTravelServiceRanking(region, slug);
  if (!ranking) return {};
  return pageMetadata({
    title: ranking.title,
    description: ranking.description,
    path: routes.travelServicesRanking(region, slug),
    image: ranking.imageUrl,
    keywords: ranking.criteria,
  });
}

const REGION_NAME: Record<string, string> = { niigata: "新潟県", shizuoka: "静岡県", yamagata: "山形県" };

export default async function TravelServiceRankingPage({ params }: PageProps) {
  const { region, slug } = await params;
  const ranking = await getTravelServiceRanking(region, slug);
  if (!ranking) notFound();
  const entries = await getTravelServiceRankingEntries(region, slug);
  const regionName = REGION_NAME[region] ?? region;

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行アプリ・旅行会社", href: routes.travelServices },
    { name: regionName + "の旅行会社", href: routes.travelServicesRegion(region) },
    { name: ranking.title, href: routes.travelServicesRanking(region, slug) },
  ];

  return (
    <div className="travel-services-theme section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(ranking.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.travelServicesRanking(region, slug), ranking.title)} />
      <JsonLd data={travelAgencyRankingItemListSchema(region, ranking, entries)} />

      <Breadcrumbs items={breadcrumbs.map((b, i) => ({ label: b.name, href: i < breadcrumbs.length - 1 ? b.href : undefined }))} />

      <header className="mt-5 rounded-xl border border-[var(--border)] bg-white p-6 shadow-soft">
        <Badge className="bg-[var(--muted)] text-[var(--primary)]"><Trophy className="mr-1 h-3.5 w-3.5" />Ranking</Badge>
        <h1 data-speakable="title" className="mt-5 text-3xl font-bold leading-tight tracking-normal text-slate-950 sm:text-4xl">{ranking.title}</h1>
        <p data-speakable="description" className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{ranking.description}</p>
        <p className="mt-5 rounded-lg bg-[var(--muted)] p-4 text-sm leading-7 text-slate-800"><strong>結論:</strong> {ranking.conclusion}</p>
        <p className="mt-4 text-sm text-slate-400">最終更新: {ranking.lastUpdatedAt}</p>
      </header>

      <section className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--muted)] px-4 py-3">
          <Building2 className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="font-bold">{ranking.quickTableLabel}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white text-xs text-slate-500">
              <tr>
                <th className="p-3">順位</th>
                <th className="p-3">旅行会社</th>
                <th className="p-3">エリア</th>
                <th className="p-3">得意分野</th>
                <th className="p-3">スコア</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(({ entry, agency }) => (
                <tr key={agency.slug} className="border-t border-[var(--border)]">
                  <td className="p-3 font-black text-[var(--primary)]">#{entry.rank}</td>
                  <td className="p-3">
                    <Link href={routes.travelAgency(region, agency.slug)} className="font-semibold underline underline-offset-4 hover:text-[var(--primary)]">
                      {agency.name}
                    </Link>
                  </td>
                  <td className="p-3 text-slate-500">{agency.area}</td>
                  <td className="p-3 text-slate-500">{agency.services.slice(0, 3).join(" / ")}</td>
                  <td className="p-3 font-bold">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-5">
        {entries.map(({ entry, agency }) => (
          <div key={agency.slug} className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-[var(--primary)] text-white">#{entry.rank}</Badge>
              <h2 className="text-xl font-bold">{agency.name}</h2>
              <Badge className="bg-[var(--muted)] text-[var(--primary)]">{agency.area}</Badge>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{entry.reason}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {agency.services.slice(0, 5).map((service) => (
                <Badge key={service} className="border-sky-200 bg-sky-50 text-sky-800">{service}</Badge>
              ))}
            </div>
            <Button asChild size="sm" variant="outline" className="mt-4">
              <Link href={routes.travelAgency(region, agency.slug)}>詳細を見る<ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-white p-5">
        <h2 className="font-bold">評価基準</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ranking.criteria.map((criterion) => (
            <div key={criterion} className="flex gap-2 rounded-lg bg-[var(--muted)] p-3 text-sm leading-6 text-slate-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
              {criterion}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="section-heading">掲載旅行会社</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map(({ agency }) => (
            <TravelAgencyCard key={agency.slug} region={region} agency={agency} />
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6">
        <FaqSection faqs={ranking.faqs} />
        <SourceList sources={ranking.sources} />
      </div>

      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href={routes.travelServicesRegion(region)}>← {regionName}の旅行会社一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
