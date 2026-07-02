import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Coffee, Trophy } from "lucide-react";
import { NewsFeatureCard } from "@/components/cards/NewsArticleCard";
import { CafeCard } from "@/components/cafe/CafeCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, cafeRegionItemListSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { articleHref, getCafeRegion, getCafeRegions, getCafeItemsByRegion, getCafeRankingsByRegion, getCafeArticles } from "@/lib/content";
import type { CafeRanking } from "@/lib/types";

type PageProps = { params: Promise<{ region: string }> };

export async function generateStaticParams() {
  return (await getCafeRegions()).map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { region } = await params;
  const regionData = await getCafeRegion(region);
  if (!regionData) return {};
  return pageMetadata({
    title: regionData.seoTitle,
    description: regionData.seoDescription,
    path: routes.cafeRegion(region),
    keywords: regionData.seoKeywords,
  });
}

export default async function CafeRegionPage({ params }: PageProps) {
  const { region } = await params;
  const regionData = await getCafeRegion(region);
  if (!regionData) notFound();

  const [items, rankings, articles] = await Promise.all([getCafeItemsByRegion(region), getCafeRankingsByRegion(region), getCafeArticles(region)]);
  const featured = regionData.featuredSlugs
    .map((slug) => items.find((c) => c.slug === slug))
    .filter(Boolean) as typeof items;

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "カフェガイド", href: routes.cafe },
    { name: regionData.name + "のカフェ", href: routes.cafeRegion(region) },
  ];

  return (
    <div className="cafe-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={cafeRegionItemListSchema(region, regionData.name, items)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {regionData.images?.[0]?.url && (
          <>
            <Image
              src={regionData.images[0].url}
              alt={regionData.images[0].alt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(92,51,23,0.88)_0%,rgba(92,51,23,0.72)_50%,rgba(212,168,83,0.55)_100%)]" />
          </>
        )}
        {!regionData.images?.[0]?.url && (
          <div className="absolute inset-0 cafe-hero-bg" />
        )}
        <div className="relative z-10 mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
                        <Badge className="mt-4 border-[var(--border)] bg-white/10 text-amber-100 backdrop-blur-sm">{regionData.heroBadge}</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-normal text-white sm:text-5xl">
              {regionData.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">{regionData.subtext}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-[var(--accent)] text-white hover:bg-amber-500">
                <Link href={routes.cafeRanking(region, regionData.heroCtaSlug)}>
                  {regionData.heroCtaLabel}<ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="#items">カフェ一覧</Link>
              </Button>
            </div>
            <p className="mt-4 text-[11px] text-white/50">{regionData.statsNote}</p>
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="cafe-glass rounded-2xl p-6 text-center">
              <Coffee className="mx-auto h-10 w-10 text-[var(--primary)]" />
              <p className="mt-3 text-sm font-bold text-slate-700">{regionData.tagline}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[var(--muted)] py-3">
                  <p className="text-xl font-black text-[var(--primary)]">{items.length}</p>
                  <p className="text-[11px] font-semibold text-slate-500">カフェ</p>
                </div>
                <div className="rounded-xl bg-[var(--muted)] py-3">
                  <p className="text-xl font-black text-[var(--primary)]">{rankings.length}</p>
                  <p className="text-[11px] font-semibold text-slate-500">ランキング</p>
                </div>
                <div className="rounded-xl bg-[var(--muted)] py-3">
                  <p className="text-xl font-black text-[var(--primary)]">{articles.length}</p>
                  <p className="text-[11px] font-semibold text-slate-500">記事</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-shell mx-auto max-w-5xl">

        {/* Rankings */}
        {rankings.length > 0 && (
          <section className="mt-0">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[var(--accent)]" />
              <p className="section-kicker">RANKINGS</p>
            </div>
            <h2 className="section-heading mt-2">ランキングから選ぶ</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {rankings.map((ranking: CafeRanking) => (
                <RankingCard
                  key={ranking.slug}
                  ranking={{ ...ranking, items: ranking.items.map((item) => ({ rank: item.rank, entryKind: "item", itemSlug: item.cafeSlug, score: item.score, reason: item.reason, isPr: item.isPr, tags: [] })) }}
                  href={routes.cafeRanking(region, ranking.slug)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Articles */}
        {articles.length > 0 && (
          <section className="mt-12">
            <p className="section-kicker">ARTICLES</p>
            <h2 className="section-heading mt-2">カフェ選びのガイド記事</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {articles.map((article) => (
                <NewsFeatureCard key={article.slug} article={article} href={articleHref(article)} />
              ))}
            </div>
          </section>
        )}

        {/* Featured cafes */}
        {featured.length > 0 && (
          <section className="mt-12">
            <p className="section-kicker">FEATURED</p>
            <h2 className="section-heading mt-2">編集部おすすめのカフェ</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((cafe) => (
                <CafeCard key={cafe.slug} region={region} cafe={cafe} />
              ))}
            </div>
          </section>
        )}

        {/* All cafes */}
        <section id="items" className="mt-12">
          <p className="section-kicker">ALL CAFES</p>
          <h2 className="section-heading mt-2">全カフェ一覧</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((cafe) => (
              <CafeCard key={cafe.slug} region={region} cafe={cafe} />
            ))}
          </div>
        </section>

        {/* Back */}
        <div className="mt-10">
          <Button asChild variant="outline" size="sm">
            <Link href={routes.cafe}>← カフェガイドトップに戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
