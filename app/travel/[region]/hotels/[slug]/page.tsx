import { notFound } from "next/navigation";
import Link from "next/link";
import { Car, Clock, Droplets, ExternalLink, MapPin, Phone, UtensilsCrossed } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqSchema, lodgingBusinessSchema, pageMetadata, speakableWebPageSchema } from "@/lib/seo";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { getTravelHotel, getTravelHotels, getTravelRankings, getTravelRegions } from "@/lib/content";
import { LikeButton } from "@/components/content/LikeButton";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  return await Promise.all(
    getTravelRegions().map(async (r) => {
      const hotels = await getTravelHotels(r.slug);
      return hotels.map((h) => ({ region: r.slug, slug: h.slug }));
    })
  ).then((arr) => arr.flat());
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const hotel = await getTravelHotel(region, slug);
  if (!hotel) return {};
  return pageMetadata({
    title: hotel.name,
    description: hotel.description,
    path: routes.travelHotel(region, slug),
    image: hotel.imageUrl,
    keywords: hotel.tags,
  });
}

const mealLabel: Record<import("@/lib/types").MealPlan, string> = {
  両食: "2食付き",
  朝食のみ: "朝食付き",
  素泊まり: "素泊まり",
  選択可: "食事プラン選択可",
};

export default async function HotelPage({ params }: PageProps) {
  const { region, slug } = await params;
  const [hotel, rankings] = await Promise.all([getTravelHotel(region, slug), getTravelRankings(region)]);
  if (!hotel) notFound();

  const editorialScore = rankings
    .flatMap((r) => r.items)
    .find((entry) => entry.itemSlug === hotel.slug)
    ?.score;

  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行ガイド", href: routes.travel },
    { name: region === "niigata" ? "新潟県" : region === "yamagata" ? "山形県" : region, href: routes.travelRegion(region) },
    { name: hotel.name, href: routes.travelHotel(region, slug) },
  ];

  return (
    <div className="travel-theme section-shell">
      <JsonLd data={lodgingBusinessSchema(region, hotel, editorialScore)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(hotel.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.travelHotel(region, slug), hotel.name)} />

      <Breadcrumbs
        items={breadcrumbs.map((b, i) => ({ label: b.name, href: i < breadcrumbs.length - 1 ? b.href : undefined }))}
      />

      <section className="mt-4 grid gap-6 rounded-xl border border-[var(--border)] bg-white shadow-soft overflow-hidden lg:grid-cols-[1.2fr_0.8fr]">
        {/* Image */}
        {hotel.imageUrl ? (
          <div className="relative min-h-[280px] lg:min-h-[360px]">
            <AttributedImage
              src={hotel.imageUrl}
              alt={hotel.name}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              credit={resolveCredit(hotel.imageUrl, hotel.name, hotel.officialUrl)}
              variant="hover"
              wrapperClassName="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="pointer-events-none absolute bottom-5 left-5">
              <Badge className="bg-white/90 text-[var(--primary)] font-bold">{hotel.style}</Badge>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center bg-gradient-to-br from-[var(--muted)] to-[#e8dcc8] lg:min-h-[360px]">
            <div className="text-center">
              <Badge className="bg-white text-[var(--primary)] font-bold text-sm px-4 py-1.5">{hotel.style}</Badge>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{hotel.area}</Badge>
            {hotel.tags.slice(0, 3).map((tag) => <Badge key={tag} className="bg-[var(--muted)] text-[var(--primary)]">{tag}</Badge>)}
          </div>
          <h1 data-speakable="title" className="mt-4 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{hotel.name}</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{hotel.description}</p>

          <div className="mt-5 rounded-lg bg-[var(--muted)] p-4 text-sm leading-7 text-slate-800">
            <p><strong>編集部コメント:</strong> {hotel.editorComment}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {hotel.officialLinks.map((link) => (
              <Button key={link.url} asChild variant={link.type === "map" ? "outline" : "default"} size="sm">
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.type === "map" ? <MapPin className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                  {link.label}
                </a>
              </Button>
            ))}
          </div>

          <LikeButton contentType="hotel" contentId={hotel.slug} regionSlug={region} className="mt-5" />
        </div>
      </section>

      {/* Details */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-bold text-[var(--primary)]">宿泊基本情報</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">住所</dt>
              <dd className="font-semibold">{hotel.address}</dd>
            </div>
            {hotel.phone && (
              <div className="flex gap-3">
                <dt className="min-w-[7rem] text-slate-500">電話</dt>
                <dd className="font-semibold"><Phone className="mr-1 inline h-3.5 w-3.5" />{hotel.phone}</dd>
              </div>
            )}
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">料金目安</dt>
              <dd className="font-semibold">{hotel.pricePerPerson}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">食事</dt>
              <dd className="font-semibold"><UtensilsCrossed className="mr-1 inline h-3.5 w-3.5" />{mealLabel[hotel.meals]}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">チェックイン</dt>
              <dd className="font-semibold"><Clock className="mr-1 inline h-3.5 w-3.5" />{hotel.checkIn}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">チェックアウト</dt>
              <dd className="font-semibold"><Clock className="mr-1 inline h-3.5 w-3.5" />{hotel.checkOut}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">駐車場</dt>
              <dd className="font-semibold">
                <Car className="mr-1 inline h-3.5 w-3.5" />
                {hotel.parking ? "あり" : "要確認"}
                {hotel.parkingNote ? ` / ${hotel.parkingNote}` : ""}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">最終確認日</dt>
              <dd className="font-semibold text-slate-500">{hotel.lastVerifiedAt}</dd>
            </div>
          </dl>
        </div>

        {hotel.onsen && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 text-emerald-800">
              <Droplets className="h-5 w-5" />
              <h2 className="font-bold">温泉・泉質</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-emerald-900">{hotel.onsenNote}</p>
            <div className="mt-4 rounded-md bg-white/70 p-3 text-xs leading-6 text-emerald-700">
              ※ 泉質・湧出量は季節・天候により変化する場合があります。訪問前に宿へ確認してください。
            </div>
          </div>
        )}
      </section>

      {/* Related rankings */}
      {hotel.relatedRankingSlugs.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-bold">関連ランキング</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {hotel.relatedRankingSlugs.map((rankingSlug) => (
              <Button key={rankingSlug} asChild variant="outline" size="sm">
                <Link href={routes.travelRanking(region, rankingSlug)}>ランキングを見る</Link>
              </Button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6">
        <FaqSection faqs={hotel.faqs} />
        <SourceList sources={hotel.sources} />
      </div>

      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href={routes.travelRegion(region)}>← {region === "niigata" ? "新潟県" : region}の宿一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
