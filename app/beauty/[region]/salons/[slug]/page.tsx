import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Car, CheckCircle2, Clock, ExternalLink, Instagram, MapPin, Phone, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { TreatmentBadge } from "@/components/beauty/TreatmentBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { beautySalonSchema, breadcrumbSchema, faqSchema, pageMetadata, speakableWebPageSchema } from "@/lib/seo";
import { LikeButton } from "@/components/content/LikeButton";
import { routes } from "@/lib/routes";
import { getBeautySalon, getBeautySalons, getBeautyRanking, getBeautyRankingEntries, getBeautyRegions } from "@/lib/content";
import type { AgeGroup } from "@/lib/types";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  const regions = getBeautyRegions();
  const pairs = await Promise.all(regions.map(async (r) => ({ region: r.slug, salons: await getBeautySalons(r.slug) })));
  return pairs.flatMap(({ region, salons }) => salons.map((salon) => ({ region, slug: salon.slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const salon = await getBeautySalon(region, slug);
  if (!salon) return {};
  return pageMetadata({
    title: salon.name,
    description: salon.description,
    path: routes.beautySalon(region, slug),
  });
}

const AGE_LABEL: Record<AgeGroup, string> = {
  teens: "10代", twenties: "20代", thirties: "30代", forties: "40代", fifties: "50代〜",
};

const REGION_NAME: Record<string, string> = {
  niigata: "新潟", yamagata: "山形",
};

export default async function BeautySalonPage({ params }: PageProps) {
  const { region, slug } = await params;
  const salon = await getBeautySalon(region, slug);
  if (!salon) notFound();

  const [relatedRankings, allRankingEntries] = await Promise.all([
    Promise.all(salon.relatedRankingSlugs.map((s) => getBeautyRanking(region, s))).then((r) => r.filter(Boolean)),
    Promise.all(salon.relatedRankingSlugs.map((rankingSlug) => getBeautyRankingEntries(region, rankingSlug))),
  ]);

  const editorialScore = allRankingEntries
    .flat()
    .find(({ salon: s }) => s.slug === slug)
    ?.entry.score;

  const regionName = REGION_NAME[region] ?? region;
  const breadcrumbs = [
    { name: "トップ",     href: routes.home },
    { name: "美容室",     href: routes.beauty },
    { name: `${regionName}の美容室`, href: routes.beautyRegion(region) },
    { name: salon.name,   href: routes.beautySalon(region, slug) },
  ];

  return (
    <div className="beauty-theme">
      <JsonLd data={beautySalonSchema(region, salon, editorialScore)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(salon.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.beautySalon(region, slug), salon.name)} />

      <div className="relative h-[340px] w-full sm:h-[420px]">
        <AttributedImage
          src={salon.imageUrl}
          alt={salon.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          credit={resolveCredit(salon.imageUrl, salon.name, salon.officialUrl)}
          variant="hover"
          wrapperClassName="absolute inset-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/60">{salon.area}</p>
          <h1 data-speakable="title" className="mt-1 text-3xl font-black text-white sm:text-5xl">{salon.name}</h1>
          <p data-speakable="description" className="mt-2 max-w-xl text-sm font-semibold text-white/80">{salon.tagline}</p>
        </div>
      </div>

      <div className="section-shell mx-auto max-w-4xl">
        <Breadcrumbs
          items={breadcrumbs.map((item, i) => ({
            label: item.name,
            href: i === breadcrumbs.length - 1 ? undefined : item.href,
          }))}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="animate-rise rounded-2xl border border-[#f2d5e8] bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">サロン紹介</h2>
              <p className="mt-3 text-sm leading-8 text-slate-600">{salon.description}</p>
              <p className="mt-4 rounded-xl bg-[#fef0f6] p-4 text-sm font-semibold leading-7 text-[#8b3a7e]">
                編集部コメント: {salon.editorComment}
              </p>
            </div>

            <div className="rounded-2xl border border-[#f2d5e8] bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">対応施術メニュー</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {salon.treatments.map((t) => <TreatmentBadge key={t} treatment={t} />)}
              </div>
            </div>

            <div className="rounded-2xl border border-[#f2d5e8] bg-white p-6">
              <h2 className="text-lg font-bold text-slate-800">おすすめ年代</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {salon.ageGroups.map((g) => (
                  <span key={g} className="rounded-full bg-[#fef0f6] px-4 py-1.5 text-sm font-bold text-[#8b3a7e]">
                    {AGE_LABEL[g]}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {salon.childrenWelcome && (
                  <span className="flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                    <Users className="h-3 w-3" />子連れ歓迎
                  </span>
                )}
                {salon.menWelcome && (
                  <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <CheckCircle2 className="h-3 w-3" />メンズ対応
                  </span>
                )}
              </div>
            </div>

            {relatedRankings.length > 0 && (
              <div className="rounded-2xl border border-[#f2d5e8] bg-white p-6">
                <h2 className="text-lg font-bold text-slate-800">掲載ランキング</h2>
                <div className="mt-4 grid gap-3">
                  {relatedRankings.map((r) => r && (
                    <Link
                      key={r.slug}
                      href={routes.beautyRanking(region, r.slug)}
                      className="flex items-center justify-between rounded-xl border border-[#f2d5e8] bg-[#fef0f6] p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">{r.title}</p>
                        <p className="text-[11px] text-slate-500">{r.description.slice(0, 50)}…</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#8b3a7e]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <FaqSection faqs={salon.faqs} />
            <SourceList sources={salon.sources} />
          </div>

          <div>
            <div className="sticky top-6 rounded-2xl border border-[#f2d5e8] bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-800">基本情報</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8b3a7e]" /><span>{salon.address}</span></li>
                <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4819e]" /><span>{salon.access}</span></li>
                {salon.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-[#8b3a7e]" /><span>{salon.phone}</span></li>}
                <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#8b3a7e]" /><span>{salon.businessHours}</span></li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-[#8b3a7e]">✕</span><span>定休日: {salon.closedDays}</span></li>
                <li className="flex items-start gap-2">
                  <Car className="mt-0.5 h-4 w-4 shrink-0 text-[#8b3a7e]" />
                  <span>{salon.parking ? "駐車場あり" : "駐車場なし"}{salon.parkingNote && " — " + salon.parkingNote}</span>
                </li>
              </ul>

              <div className="mt-5 rounded-xl bg-[#fef0f6] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b3a7e]">料金目安</p>
                <p className="mt-2 text-sm"><span className="font-bold text-slate-800">カット</span> {salon.cutPrice}</p>
                {salon.colorPrice && <p className="mt-1 text-sm"><span className="font-bold text-slate-800">カラー</span> {salon.colorPrice}</p>}
                <p className="mt-1 text-[11px] text-slate-400">※変更の可能性あり。訪問前に要確認</p>
              </div>

              <div className="mt-5 space-y-2">
                <a href={salon.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#f2d5e8] bg-white py-2.5 text-sm font-bold text-[#8b3a7e] transition-all hover:bg-[#fef0f6]">
                  <MapPin className="h-4 w-4" /> Google マップで見る
                </a>
                {salon.officialUrl && salon.officialUrl !== "#" && (
                  <a href={salon.officialUrl} target="_blank" rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8b3a7e] py-2.5 text-sm font-bold text-white transition-all hover:bg-[#7a3370]">
                    <ExternalLink className="h-4 w-4" /> 予約・公式情報
                  </a>
                )}
                {salon.instagram && salon.instagram !== "#" && (
                  <a href={salon.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-pink-200 bg-pink-50 py-2.5 text-sm font-bold text-pink-700 transition-all hover:bg-pink-100">
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                )}
              </div>

              <LikeButton contentType="beauty_salon" contentId={salon.slug} regionSlug={region} className="mt-5 justify-center" />

              <p className="mt-4 text-[10px] leading-5 text-slate-400">最終確認日: {salon.lastVerifiedAt}。情報は変更される場合があります。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
