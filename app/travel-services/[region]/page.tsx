import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bus, MapPin, Trophy } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RankingCard } from "@/components/cards/RankingCard";
import { TravelAgencyCard } from "@/components/travel-services/TravelAgencyCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, pageMetadata, travelAgencyRegionItemListSchema } from "@/lib/seo";
import { getTravelAgencies, getTravelServiceRegion, getTravelServiceRegions, getTravelServiceRankings } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string }> };

export function generateStaticParams() {
  return getTravelServiceRegions().map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { region } = await params;
  const regionData = getTravelServiceRegion(region);
  if (!regionData) return {};
  return pageMetadata({
    title: regionData.seoTitle,
    description: regionData.seoDescription,
    path: routes.travelServicesRegion(region),
    keywords: regionData.seoKeywords,
  });
}

export default async function TravelServicesRegionPage({ params }: PageProps) {
  const { region } = await params;
  const regionData = getTravelServiceRegion(region);
  if (!regionData) notFound();

  const [agencies, rankings] = await Promise.all([getTravelAgencies(region), getTravelServiceRankings(region)]);
  const featured = regionData.featuredSlugs
    .map((slug) => agencies.find((agency) => agency.slug === slug))
    .filter(Boolean) as typeof agencies;

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行アプリ・旅行会社", href: routes.travelServices },
    { name: regionData.name + "の旅行会社", href: routes.travelServicesRegion(region) },
  ];

  return (
    <div className="travel-services-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={travelAgencyRegionItemListSchema(region, regionData.name, agencies)} />

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {regionData.images?.[0]?.url && (
          <Image src={regionData.images[0].url} alt={regionData.images[0].alt} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(18,53,69,0.96)_0%,rgba(40,90,111,0.88)_52%,rgba(224,143,62,0.50)_100%)]" />
        <div className="relative z-10 mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <Breadcrumbs
              items={breadcrumbs.map((b, i) => ({ label: b.name, href: i < breadcrumbs.length - 1 ? b.href : undefined }))}
              className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white"
            />
            <Badge className="mt-4 border-white/20 bg-white/12 text-white">{regionData.heroBadge}</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-normal text-white sm:text-5xl">{regionData.headline}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">{regionData.subtext}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="border-0 bg-[var(--accent)] text-white hover:bg-orange-500">
                <Link href={routes.travelServicesRanking(region, regionData.heroCtaSlug)}>
                  {regionData.heroCtaLabel}<ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="#agencies">旅行会社一覧</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/12 p-5 backdrop-blur-sm">
            <Bus className="h-10 w-10 text-[var(--accent)]" />
            <h2 className="mt-4 text-xl font-semibold text-white">{regionData.shortName}の旅行相談先</h2>
            <div className="mt-5 grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-md bg-white/10 p-3">
                <strong className="block text-lg text-white">{agencies.length}</strong>
                <span className="text-white/70">掲載会社</span>
              </div>
              <div className="rounded-md bg-white/10 p-3">
                <strong className="block text-lg text-white">{rankings.length}</strong>
                <span className="text-white/70">ランキング</span>
              </div>
            </div>
            <p className="mt-5 rounded-md bg-black/20 p-4 text-sm leading-6 text-white/80">{regionData.statsNote}</p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-wrap items-center gap-3">
          <MapPin className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="section-heading">エリア別に探す</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {regionData.areas.map((area) => (
            <Badge key={area} className="border-[var(--border)] bg-white">
              {area}
            </Badge>
          ))}
        </div>
      </section>

      {rankings.length > 0 && (
        <section className="section-shell">
          <div className="mb-5 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="section-heading">ランキングから選ぶ</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rankings.map((ranking) => (
              <RankingCard key={ranking.slug} ranking={ranking} href={routes.travelServicesRanking(region, ranking.slug)} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="section-shell">
          <p className="section-kicker">FEATURED</p>
          <h2 className="section-heading mt-2">編集部が先に見る旅行会社</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((agency) => (
              <TravelAgencyCard key={agency.slug} region={region} agency={agency} />
            ))}
          </div>
        </section>
      )}

      <section id="agencies" className="section-shell">
        <p className="section-kicker">ALL AGENCIES</p>
        <h2 className="section-heading mt-2">{regionData.name} 掲載旅行会社一覧</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          旅行商品、受付時間、見積もり条件は変更される可能性があります。申し込み前に公式サイト・電話で最新情報を確認してください。
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {agencies.map((agency) => (
            <TravelAgencyCard key={agency.slug} region={region} agency={agency} />
          ))}
        </div>
      </section>

      <section className="section-shell pt-0">
        <Button asChild variant="outline" size="sm">
          <Link href={routes.travelServices}>← 旅行アプリ・旅行会社トップに戻る</Link>
        </Button>
      </section>
    </div>
  );
}
