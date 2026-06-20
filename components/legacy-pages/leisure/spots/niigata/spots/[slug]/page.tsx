import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { LeisureIcon } from "@/components/leisure/LeisureIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLeisureRankings, getLeisureSpot, getLeisureSpots } from "@/lib/content";
import { getLeisureVisual } from "@/lib/leisure-visuals";
import { breadcrumbSchema, faqSchema, pageMetadata, speakableWebPageSchema, touristAttractionSchema } from "@/lib/seo";
import { LikeButton } from "@/components/content/LikeButton";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ slug: string }> };

const region = "niigata";
const kindLabel = { outdoor: "アウトドア", indoor: "インドア", hybrid: "複合型" };

export async function generateStaticParams() {
  const spots = await getLeisureSpots(region);
  return spots.map((spot) => ({ slug: spot.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const spot = await getLeisureSpot(region, slug);
  if (!spot) return {};
  return pageMetadata({
    title: spot.name,
    description: spot.description,
    path: routes.leisureSpot(region, spot.slug),
  });
}

export default async function LeisureSpotPage({ params }: PageProps) {
  const { slug } = await params;
  const [spot, rankings] = await Promise.all([getLeisureSpot(region, slug), getLeisureRankings(region)]);
  if (!spot) notFound();

  const editorialScore = rankings
    .flatMap((r) => r.items)
    .find((entry) => entry.itemSlug === spot.slug)
    ?.score;

  const visual = getLeisureVisual(spot);
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "レジャー", href: routes.leisure },
    { name: "新潟", href: routes.leisureRegion(region) },
    { name: spot.name, href: routes.leisureSpot(region, spot.slug) },
  ];

  return (
    <div className="leisure-theme section-shell">
      <JsonLd data={touristAttractionSchema(region, spot, editorialScore)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(spot.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.leisureSpot(region, spot.slug), spot.name)} />
      <Breadcrumbs items={breadcrumbs.map((item, index) => ({ label: item.name, href: index === breadcrumbs.length - 1 ? undefined : item.href }))} />
      <section className="overflow-hidden rounded-lg border border-cyan-200 bg-white shadow-soft">
        <div className="relative min-h-[260px] sm:min-h-[360px]">
          <Image src={visual.imageUrl} alt={visual.imageAlt} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/76 via-slate-950/18 to-transparent" />
          <div className="absolute bottom-6 left-5 right-5 text-white sm:left-8 sm:right-8">
            <div className="mb-4 flex w-fit items-center gap-2 rounded-md bg-white/16 px-3 py-2 text-sm font-bold backdrop-blur">
              <LeisureIcon iconKey={visual.iconKey} className="h-5 w-5" />
              {spot.genre}
            </div>
            <h1 data-speakable="title" className="max-w-4xl text-3xl font-bold tracking-normal sm:text-5xl">{spot.name}</h1>
            <p data-speakable="description" className="mt-4 max-w-3xl text-base leading-8 text-white/88">{spot.description}</p>
          </div>
        </div>
        <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{spot.area}</Badge>
            <Badge>{kindLabel[spot.kind]}</Badge>
            <Badge>{spot.genre}</Badge>
            {spot.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <div className="mt-5 grid gap-3 rounded-lg bg-cyan-50 p-4 text-sm leading-7 text-cyan-950">
            <p><strong>見どころ:</strong> {spot.highlight}</p>
            <p><strong>編集部コメント:</strong> {spot.editorComment}</p>
            <p><strong>向いている人:</strong> {spot.bestFor.join(" / ")}</p>
          </div>
          <LikeButton contentType="leisure_spot" contentId={spot.slug} regionSlug={region} className="mt-5" />
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
          <h2 className="font-semibold">スポット基本情報</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div><dt className="text-slate-500">住所</dt><dd className="font-semibold">{spot.address}</dd></div>
            {spot.phone ? <div><dt className="text-slate-500">電話</dt><dd className="font-semibold"><Phone className="mr-1 inline h-3.5 w-3.5" />{spot.phone}</dd></div> : null}
            <div><dt className="text-slate-500">料金目安</dt><dd className="font-semibold">{spot.priceRange}</dd></div>
            <div><dt className="text-slate-500">駐車場</dt><dd className="font-semibold">{spot.parking ? "あり" : "要確認"}{spot.parkingNote ? " / " + spot.parkingNote : ""}</dd></div>
            <div><dt className="text-slate-500">営業時間</dt><dd className="font-semibold">{spot.businessHours}</dd></div>
            <div><dt className="text-slate-500">休業日</dt><dd className="font-semibold">{spot.closedDays}</dd></div>
            <div><dt className="text-slate-500">最終確認日</dt><dd className="font-semibold">{spot.lastVerifiedAt}</dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            {spot.officialLinks.map((link) => (
              <Button key={link.url} asChild variant={link.type === "map" ? "outline" : "default"} size="sm">
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.type === "map" ? <MapPin className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
          </div>
        </div>
      </section>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">関連ランキング</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {spot.relatedRankingSlugs.map((rankingSlug) => (
            <Button key={rankingSlug} asChild variant="outline">
              <Link href={routes.leisureRanking(region, rankingSlug)}>ランキングを見る</Link>
            </Button>
          ))}
        </div>
      </section>
      <div className="mt-8 grid gap-6">
        <FaqSection faqs={spot.faqs} />
        <SourceList sources={spot.sources} />
      </div>
    </div>
  );
}
