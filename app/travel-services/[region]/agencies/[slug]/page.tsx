import { notFound } from "next/navigation";
import Link from "next/link";
import { Bus, ExternalLink, MapPin, Phone, ShieldCheck, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/content/LikeButton";
import { breadcrumbSchema, faqSchema, pageMetadata, speakableWebPageSchema, travelAgencySchema } from "@/lib/seo";
import { getTravelAgencies, getTravelAgency, getTravelServiceRankings, getTravelServiceRegions } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ region: string; slug: string }> };

export async function generateStaticParams() {
  return await Promise.all(
    getTravelServiceRegions().map(async (r) => {
      const agencies = await getTravelAgencies(r.slug);
      return agencies.map((agency) => ({ region: r.slug, slug: agency.slug }));
    })
  ).then((arr) => arr.flat());
}

export async function generateMetadata({ params }: PageProps) {
  const { region, slug } = await params;
  const agency = await getTravelAgency(region, slug);
  if (!agency) return {};
  return pageMetadata({
    title: agency.name,
    description: agency.description,
    path: routes.travelAgency(region, slug),
    keywords: agency.tags,
  });
}

const REGION_NAME: Record<string, string> = { niigata: "新潟県", shizuoka: "静岡県", yamagata: "山形県" };

export default async function TravelAgencyPage({ params }: PageProps) {
  const { region, slug } = await params;
  const [agency, rankings] = await Promise.all([getTravelAgency(region, slug), getTravelServiceRankings(region)]);
  if (!agency) notFound();

  const editorialScore = rankings
    .flatMap((r) => r.items)
    .find((entry) => entry.itemSlug === agency.slug)
    ?.score;

  const regionName = REGION_NAME[region] ?? region;
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行アプリ・旅行会社", href: routes.travelServices },
    { name: regionName + "の旅行会社", href: routes.travelServicesRegion(region) },
    { name: agency.name, href: routes.travelAgency(region, slug) },
  ];

  return (
    <div className="travel-services-theme section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(agency.faqs)} />
      <JsonLd data={speakableWebPageSchema(routes.travelAgency(region, slug), agency.name)} />
      <JsonLd data={travelAgencySchema(region, agency, editorialScore)} />

      <Breadcrumbs items={breadcrumbs.map((b, i) => ({ label: b.name, href: i < breadcrumbs.length - 1 ? b.href : undefined }))} />

      <section className="mt-4 grid gap-6 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-soft lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[280px] lg:min-h-[380px]">
          <AttributedImage
            src={agency.imageUrl}
            alt={agency.name}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            credit={resolveCredit(agency.imageUrl, agency.name, agency.officialUrl)}
            variant="hover"
            wrapperClassName="absolute inset-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-5 left-5 flex flex-wrap gap-2">
            <Badge className="bg-white/92 font-bold text-[var(--primary)]">{agency.area}</Badge>
            {typeof editorialScore === "number" && <Badge className="bg-[var(--accent)] text-white">編集部スコア {editorialScore}</Badge>}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {agency.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} className="bg-[var(--muted)] text-[var(--primary)]">{tag}</Badge>
            ))}
          </div>
          <h1 data-speakable="title" className="mt-4 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{agency.name}</h1>
          <p className="mt-3 text-sm font-semibold text-[var(--primary)]">{agency.tagline}</p>
          <p data-speakable="description" className="mt-4 text-base leading-8 text-slate-600">{agency.description}</p>

          <div className="mt-5 rounded-lg bg-[var(--muted)] p-4 text-sm leading-7 text-slate-800">
            <p><strong>編集部コメント:</strong> {agency.editorComment}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {agency.officialLinks.map((link) => (
              <Button key={link.url} asChild variant={link.type === "map" ? "outline" : "default"} size="sm">
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.type === "map" ? <MapPin className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                  {link.label}
                </a>
              </Button>
            ))}
          </div>

          <LikeButton contentType="travel_agency" contentId={agency.slug} regionSlug={region} className="mt-5" />
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-bold text-[var(--primary)]">会社・相談情報</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex gap-3"><dt className="min-w-[7rem] text-slate-500">所在地</dt><dd className="font-semibold">{agency.address}</dd></div>
            {agency.phone && <div className="flex gap-3"><dt className="min-w-[7rem] text-slate-500">電話</dt><dd className="font-semibold"><Phone className="mr-1 inline h-3.5 w-3.5" />{agency.phone}</dd></div>}
            <div className="flex gap-3"><dt className="min-w-[7rem] text-slate-500">料金</dt><dd className="font-semibold">{agency.priceRange}</dd></div>
            <div className="flex gap-3"><dt className="min-w-[7rem] text-slate-500">相談方法</dt><dd className="font-semibold">{agency.consultationStyle}</dd></div>
            <div className="flex gap-3"><dt className="min-w-[7rem] text-slate-500">営業時間</dt><dd className="font-semibold">{agency.businessHours}</dd></div>
            <div className="flex gap-3"><dt className="min-w-[7rem] text-slate-500">定休日</dt><dd className="font-semibold">{agency.closedDays}</dd></div>
            <div className="flex gap-3"><dt className="min-w-[7rem] text-slate-500">旅行業登録</dt><dd className="font-semibold"><ShieldCheck className="mr-1 inline h-3.5 w-3.5" />{agency.registeredTravelAgency}</dd></div>
            <div className="flex gap-3"><dt className="min-w-[7rem] text-slate-500">最終確認日</dt><dd className="font-semibold text-slate-500">{agency.lastVerifiedAt}</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50 p-5">
          <h2 className="font-bold text-sky-950">相談できること</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {agency.services.map((service) => (
              <Badge key={service} className="border-sky-200 bg-white text-sky-800">
                <Bus className="mr-1 h-3 w-3" />{service}
              </Badge>
            ))}
          </div>
          <h3 className="mt-5 text-sm font-bold text-sky-950">向いている人</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-sky-900">
            {agency.bestFor.map((item) => (
              <li key={item} className="rounded-md bg-white/70 px-3 py-2"><Users className="mr-1 inline h-3.5 w-3.5" />{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {agency.relatedRankingSlugs.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-bold">関連ランキング</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {agency.relatedRankingSlugs.map((rankingSlug) => (
              <Button key={rankingSlug} asChild variant="outline" size="sm">
                <Link href={routes.travelServicesRanking(region, rankingSlug)}>ランキングを見る</Link>
              </Button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6">
        <FaqSection faqs={agency.faqs} />
        <SourceList sources={agency.sources} />
      </div>

      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href={routes.travelServicesRegion(region)}>← {regionName}の旅行会社一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
