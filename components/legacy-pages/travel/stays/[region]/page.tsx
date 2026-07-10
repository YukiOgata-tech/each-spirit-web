import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Thermometer, Trophy } from "lucide-react";
import { HotelCard } from "@/components/travel/HotelCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getTravelRegion,
  getTravelRegions,
  getTravelHotels,
  getTravelRankings,
} from "@/lib/content";
import { breadcrumbSchema, pageMetadata, travelRegionItemListSchema } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";

type PageProps = { params: Promise<{ region: string }> };

export async function generateStaticParams() {
  return (await getTravelRegions()).map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { region } = await params;
  const regionData = await getTravelRegion(region);
  if (!regionData) return {};
  return pageMetadata({
    title: regionData.seoTitle,
    description: regionData.seoDescription,
    path: routes.travelRegion(region),
    keywords: regionData.seoKeywords,
  });
}

export default async function TravelRegionPage({ params }: PageProps) {
  const { region } = await params;
  const regionData = await getTravelRegion(region);
  if (!regionData) notFound();

  const [hotels, rankings] = await Promise.all([getTravelHotels(region), getTravelRankings(region)]);

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行ガイド", href: routes.travel },
    { name: regionData.name + "旅行", href: routes.travelRegion(region) },
  ];

  return (
    <div className="travel-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={travelRegionItemListSchema(region, regionData.name, hotels)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {regionData.images?.[0]?.url && (
          <Image
            src={regionData.images[0].url}
            alt={regionData.images[0].alt}
            fill
            unoptimized={shouldUnoptimizeImage(regionData.images[0].url)}
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(28,56,41,0.96)_0%,rgba(45,90,61,0.92)_40%,rgba(74,140,96,0.80)_75%,rgba(245,237,224,0.30)_100%)]" />
        <div className="relative z-10 mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
                        <Badge className="mt-4 border-white/20 bg-white/12 text-white">{regionData.heroBadge}</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-normal text-white sm:text-5xl">
              {regionData.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">{regionData.subtext}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-[var(--accent)] text-white hover:bg-amber-600 border-0">
                <Link href={routes.travelRanking(region, regionData.heroCtaSlug)}>
                  {regionData.heroCtaLabel}<ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                <Link href="#hotels">宿一覧</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/10 p-5 backdrop-blur-sm animate-rise">
            <Thermometer className="h-10 w-10 text-[var(--accent)]" />
            <h2 className="mt-4 text-xl font-semibold text-white">{regionData.shortName}の温泉・旅館</h2>
            <div className="mt-5 grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-md bg-white/10 p-3">
                <strong className="block text-lg text-white">{hotels.length}</strong>
                <span className="text-white/70">掲載宿</span>
              </div>
              <div className="rounded-md bg-white/10 p-3">
                <strong className="block text-lg text-white">{rankings.length}</strong>
                <span className="text-white/70">ランキング</span>
              </div>
            </div>
            <div className="mt-5 rounded-md bg-black/20 p-4 text-sm leading-6 text-white/80">
              {regionData.statsNote}
            </div>
          </div>
        </div>
      </section>

      {/* Onsen areas */}
      {regionData.onsenAreas.length > 0 && (
        <section className="section-shell">
          <h2 className="section-heading">{regionData.shortName}の温泉地</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {regionData.onsenAreas.map((onsen) => (
              <div key={onsen.name} className="rounded-lg border border-[var(--border)] bg-white p-4">
                <Badge className="bg-[var(--muted)] text-[var(--primary)]">{onsen.name}</Badge>
                <p className="mt-3 text-sm leading-6 text-slate-600">{onsen.feature}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Areas */}
      <section className="section-shell">
        <div className="flex flex-wrap items-center gap-3">
          <MapPin className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="section-heading">エリア別に探す</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {regionData.areas.map((area) => (
            <Badge key={area} className="bg-white border-[var(--border)]">
              <MapPin className="mr-1 h-3 w-3" />{area}
            </Badge>
          ))}
        </div>
      </section>

      {/* Rankings */}
      {rankings.length > 0 && (
        <section className="section-shell">
          <div className="mb-5 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="section-heading">目的別ランキング</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {rankings.map((ranking) => (
              <RankingCard
                key={ranking.slug}
                ranking={ranking}
                href={routes.travelRanking(region, ranking.slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All hotels */}
      <section id="hotels" className="section-shell">
        <h2 className="section-heading">{regionData.name} 掲載宿一覧</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          価格・チェックイン時間・設備は変更される可能性があります。各宿のページの参照ソースと確認日を見たうえで、訪問前に公式情報を確認してください。
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.slug} region={region} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* Cross-links */}
      <section className="section-shell border-t border-[var(--border)]">
        <h2 className="section-heading">この地域の関連ガイド</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Link href={routes.ramenRegion(region)} className="rounded-lg border border-orange-200 bg-orange-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange-500">Ramen</p>
            <p className="mt-2 font-bold text-orange-950">{regionData.shortName}のラーメン店</p>
            <p className="mt-1 text-xs text-slate-500">旅先で食べたいラーメンをランキングと店舗カードで。</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-orange-800">見る <ArrowRight className="h-3 w-3" /></div>
          </Link>
          <Link href={routes.leisureRegion(region)} className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">Leisure</p>
            <p className="mt-2 font-bold text-cyan-950">{regionData.shortName}のレジャー</p>
            <p className="mt-1 text-xs text-slate-500">温泉と組み合わせたいおでかけスポット。</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-cyan-800">見る <ArrowRight className="h-3 w-3" /></div>
          </Link>
          <Link href={routes.beautyRegion(region)} className="rounded-lg border border-pink-200 bg-pink-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-[11px] font-bold uppercase tracking-wider text-pink-500">Beauty</p>
            <p className="mt-2 font-bold text-pink-950">{regionData.shortName}の美容室</p>
            <p className="mt-1 text-xs text-slate-500">旅の前後に立ち寄れる美容室をエリア別に。</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-pink-800">見る <ArrowRight className="h-3 w-3" /></div>
          </Link>
        </div>
      </section>

      {/* Back */}
      <section className="section-shell pt-0">
        <Button asChild variant="outline" size="sm">
          <Link href={routes.travel}>← 旅行ガイドに戻る</Link>
        </Button>
      </section>
    </div>
  );
}
