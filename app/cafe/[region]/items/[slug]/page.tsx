import { notFound } from "next/navigation";
import Link from "next/link";
import { Car, Clock, ExternalLink, Instagram, MapPin, Phone, Plug, Wifi } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, cafeSchema, faqSchema, pageMetadata, speakableWebPageSchema } from "@/lib/seo";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { getCafeItem, getCafeItemsByRegion, getCafeRankingsByRegion, getCafeRegions } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  return await Promise.all(
    getCafeRegions().map(async (r) => {
      const items = await getCafeItemsByRegion(r.slug);
      return items.map((c) => ({ region: r.slug, slug: c.slug }));
    })
  ).then((arr) => arr.flat());
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const cafe = await getCafeItem(region, slug);
  if (!cafe) return {};
  return pageMetadata({
    title: cafe.name,
    description: cafe.description,
    path: routes.cafeItem(region, slug),
    keywords: cafe.tags,
  });
}

const REGION_NAME: Record<string, string> = { niigata: "新潟県", yamagata: "山形県" };
const RESERVATION_LABEL: Record<string, string> = {
  required: "予約必須",
  recommended: "予約推奨",
  "not-needed": "予約不要",
};

export default async function CafeItemPage({ params }: PageProps) {
  const { region, slug } = await params;
  const [cafe, rankings] = await Promise.all([getCafeItem(region, slug), getCafeRankingsByRegion(region)]);
  if (!cafe) notFound();

  const editorialScore = rankings
    .flatMap((r) => r.items)
    .find((entry) => entry.cafeSlug === cafe.slug)
    ?.score;

  const regionName = REGION_NAME[region] ?? region;
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "カフェガイド", href: routes.cafe },
    { name: regionName + "のカフェ", href: routes.cafeRegion(region) },
    { name: cafe.name, href: routes.cafeItem(region, slug) },
  ];

  return (
    <div className="cafe-theme section-shell">
      <JsonLd data={cafeSchema(region, cafe, editorialScore)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(cafe.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.cafeItem(region, slug), cafe.name)} />

      <Breadcrumbs
        items={breadcrumbs.map((b, i) => ({ label: b.name, href: i < breadcrumbs.length - 1 ? b.href : undefined }))}
      />

      <section className="mt-4 grid gap-6 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-soft lg:grid-cols-[1.2fr_0.8fr]">
        {/* Image */}
        {cafe.imageUrl ? (
          <div className="relative min-h-[280px] lg:min-h-[360px]">
            <AttributedImage
              src={cafe.imageUrl}
              alt={cafe.name}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              credit={resolveCredit(cafe.imageUrl, cafe.name, cafe.officialUrl)}
              variant="hover"
              wrapperClassName="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="pointer-events-none absolute bottom-5 left-5">
              <Badge className="bg-white/90 text-[var(--primary)] font-bold">{cafe.style}</Badge>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center bg-gradient-to-br from-[var(--muted)] to-[#f0e4cc] lg:min-h-[360px]">
            <Badge className="bg-white text-[var(--primary)] font-bold text-sm px-4 py-1.5">{cafe.style}</Badge>
          </div>
        )}

        {/* Info */}
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{cafe.area}</Badge>
            {cafe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} className="bg-[var(--muted)] text-[var(--primary)]">{tag}</Badge>
            ))}
          </div>
          <h1 data-speakable="title" className="mt-4 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{cafe.name}</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{cafe.description}</p>

          <div className="mt-5 rounded-lg bg-[var(--muted)] p-4 text-sm leading-7 text-slate-800">
            <p><strong>編集部コメント:</strong> {cafe.editorComment}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {cafe.wifi && (
              <Badge className="border-sky-200 bg-sky-50 text-sky-700">
                <Wifi className="mr-1 h-3 w-3" />WiFi
              </Badge>
            )}
            {cafe.power && (
              <Badge className="border-amber-200 bg-amber-50 text-amber-800">
                <Plug className="mr-1 h-3 w-3" />電源あり
              </Badge>
            )}
            {cafe.parking && (
              <Badge className="border-slate-200 bg-slate-50 text-slate-600">
                <Car className="mr-1 h-3 w-3" />駐車場あり
              </Badge>
            )}
            {cafe.petFriendly && (
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                ペット可
              </Badge>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {cafe.officialLinks.map((link) => (
              <Button key={link.url} asChild variant={link.type === "map" ? "outline" : "default"} size="sm">
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.type === "map" ? <MapPin className="h-4 w-4" /> :
                   link.type === "instagram" ? <Instagram className="h-4 w-4" /> :
                   <ExternalLink className="h-4 w-4" />}
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-bold text-[var(--primary)]">店舗基本情報</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">住所</dt>
              <dd className="font-semibold">{cafe.address}</dd>
            </div>
            {cafe.phone && (
              <div className="flex gap-3">
                <dt className="min-w-[7rem] text-slate-500">電話</dt>
                <dd className="font-semibold"><Phone className="mr-1 inline h-3.5 w-3.5" />{cafe.phone}</dd>
              </div>
            )}
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">価格帯</dt>
              <dd className="font-semibold">{cafe.priceRange}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">看板メニュー</dt>
              <dd className="font-semibold">{cafe.signatureMenu}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">営業時間</dt>
              <dd className="font-semibold"><Clock className="mr-1 inline h-3.5 w-3.5" />{cafe.businessHours}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">定休日</dt>
              <dd className="font-semibold">{cafe.closedDays}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">駐車場</dt>
              <dd className="font-semibold">
                <Car className="mr-1 inline h-3.5 w-3.5" />
                {cafe.parking ? "あり" : "要確認"}
                {cafe.parkingNote ? ` / ${cafe.parkingNote}` : ""}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">予約</dt>
              <dd className="font-semibold">{RESERVATION_LABEL[cafe.reservation]}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="min-w-[7rem] text-slate-500">最終確認日</dt>
              <dd className="font-semibold text-slate-500">{cafe.lastVerifiedAt}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
          <h2 className="font-bold text-amber-900">このカフェの特徴</h2>
          <p className="mt-4 text-sm leading-7 text-amber-900">{cafe.highlight}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {cafe.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--primary)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related rankings */}
      {cafe.relatedRankingSlugs.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-bold">関連ランキング</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {cafe.relatedRankingSlugs.map((rankingSlug) => (
              <Button key={rankingSlug} asChild variant="outline" size="sm">
                <Link href={routes.cafeRanking(region, rankingSlug)}>ランキングを見る</Link>
              </Button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6">
        <FaqSection faqs={cafe.faqs} />
        <SourceList sources={cafe.sources} />
      </div>

      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href={routes.cafeRegion(region)}>← {regionName}のカフェ一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
