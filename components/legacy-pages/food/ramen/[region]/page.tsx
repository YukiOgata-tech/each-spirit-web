import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Soup, Trophy } from "lucide-react";
import { NewsFeatureCard } from "@/components/cards/NewsArticleCard";
import { ItemCard } from "@/components/cards/ItemCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  articleHref,
  getRamenRegion,
  getRamenRegions,
  getRamenItemsByRegion,
  getRamenRankingsByRegion,
  getRamenArticles,
} from "@/lib/content";
import { breadcrumbSchema, pageMetadata, ramenRegionItemListSchema } from "@/lib/seo";
import { routes } from "@/lib/routes";
import type { Item } from "@/lib/types";

type PageProps = { params: Promise<{ region: string }> };

export async function generateStaticParams() {
  return (await getRamenRegions()).map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { region } = await params;
  const regionData = await getRamenRegion(region);
  if (!regionData) return {};
  return pageMetadata({
    title: regionData.seoTitle,
    description: regionData.seoDescription,
    path: routes.ramenRegion(region),
    keywords: regionData.seoKeywords,
  });
}

export default async function RamenRegionPage({ params }: PageProps) {
  const { region } = await params;
  const regionData = await getRamenRegion(region);
  if (!regionData) notFound();

  const [items, rankings, allArticles] = await Promise.all([
    getRamenItemsByRegion(region),
    getRamenRankingsByRegion(region),
    getRamenArticles(),
  ]);
  const articles = allArticles.filter((a) => a.tags.includes(regionData.articleTag));

  const featured = regionData.featuredSlugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is Item => Boolean(item));

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "ラーメンガイド", href: routes.ramen },
    { name: regionData.name + "ラーメン", href: routes.ramenRegion(region) },
  ];

  return (
    <div className="ramen-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={ramenRegionItemListSchema(regionData.name, items)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-orange-100">
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
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,247,235,0.94)_0%,rgba(255,255,255,0.9)_55%,rgba(248,225,194,0.88)_100%)]" />
          </>
        )}
        {!regionData.images?.[0]?.url && (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff7eb_0%,#fff_55%,#f8e1c2_100%)]" />
        )}
        <div className="relative z-10 mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
                        <Badge className="mt-4 border-orange-200 bg-white text-orange-800">{regionData.heroBadge}</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-normal text-slate-950 sm:text-5xl">
              {regionData.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">{regionData.subtext}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={routes.ramenRanking(regionData.heroCtaSlug)}>
                  {regionData.heroCtaLabel}<ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#items">店舗一覧</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-orange-200 bg-white/84 p-5 shadow-soft animate-rise">
            <Soup className="h-10 w-10 text-[var(--primary)]" />
            <h2 className="mt-4 text-xl font-semibold">{regionData.shortName}ラーメンの概要</h2>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">{items.length}</strong>店舗</div>
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">{rankings.length}</strong>ランキング</div>
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">{articles.length || "―"}</strong>記事</div>
            </div>
            <div className="mt-5 rounded-md bg-slate-950 p-4 text-sm leading-6 text-white">
              {regionData.statsNote}
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="section-shell">
        <h2 className="section-heading">{regionData.shortName}のラーメンスタイル</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regionData.styles.map((style) => (
            <div key={style.name} className="rounded-lg border border-orange-200 bg-white p-4">
              <Badge className="bg-orange-50 text-orange-900">{style.area}</Badge>
              <h3 className="mt-3 font-semibold text-orange-950">{style.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{style.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Areas */}
      <section className="section-shell">
        <div className="flex flex-wrap items-center gap-3">
          <MapPin className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="section-heading">エリア別に探す</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {regionData.areas.map((area) => (
            <Badge key={area} className="bg-white">
              <MapPin className="mr-1 h-3 w-3" />{area}
            </Badge>
          ))}
        </div>
      </section>

      {/* Rankings */}
      <section className="section-shell">
        <div className="mb-5 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="section-heading">目的別ランキング</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rankings.map((ranking) => (
            <RankingCard key={ranking.slug} ranking={ranking} />
          ))}
        </div>
      </section>

      {/* Featured items */}
      {featured.length > 0 && (
        <section className="section-shell">
          <h2 className="section-heading">非チェーンの注目店舗</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <ItemCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <section className="section-shell">
          <h2 className="section-heading">{regionData.shortName}ラーメン記事</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsFeatureCard key={article.slug} article={article} href={articleHref(article)} />
            ))}
          </div>
        </section>
      )}

      {/* All items */}
      <section id="items" className="section-shell">
        <h2 className="section-heading">{regionData.name} 店舗カード一覧</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          営業時間・定休日・駐車場は変更される可能性があります。各店舗ページの参照ソースと確認日を見たうえで、訪問前に公式情報を確認してください。
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* Back to hub */}
      <section className="section-shell border-t border-orange-100">
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
          <p className="text-sm leading-7 text-orange-950">
            <strong>他の地域のラーメンも見る:</strong> 新潟・山形以外のエリアも順次追加していきます。
          </p>
          <Button asChild variant="outline" className="mt-3" size="sm">
            <Link href={routes.ramen}>
              ← ラーメンガイドに戻る
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
