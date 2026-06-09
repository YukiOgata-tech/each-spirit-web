import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqSchema, pageMetadata, restaurantSchema } from "@/lib/seo";
import { getRamenItem, getRamenItems } from "@/lib/content";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getRamenItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = getRamenItem(slug);
  if (!item) return {};
  return pageMetadata({
    title: item.name,
    description: item.description,
    path: routes.ramenItem(item.slug),
  });
}

export default async function ItemPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getRamenItem(slug);
  if (!item) notFound();
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "ラーメン", href: routes.ramen },
    { name: item.name, href: routes.ramenItem(item.slug) },
  ];
  return (
    <div className="ramen-theme section-shell">
      <JsonLd data={restaurantSchema(item)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(item.faqs)} />
      <Breadcrumbs items={breadcrumbs.map((value, index) => ({ label: value.name, href: index === breadcrumbs.length - 1 ? undefined : value.href }))} />
      <section className="overflow-hidden rounded-lg border border-orange-200 bg-white shadow-soft">
        {item.imageUrl && (
          <div className="relative h-[260px] w-full sm:h-[320px]">
            <AttributedImage
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              credit={resolveCredit(item.imageUrl, item.name, item.officialUrl)}
              variant="hover"
              wrapperClassName="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}
        <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{item.area}</Badge><Badge>{item.genre}</Badge>{item.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-normal sm:text-5xl">{item.name}</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{item.description}</p>
          <div className="mt-5 grid gap-3 rounded-lg bg-orange-50 p-4 text-sm leading-7 text-orange-950">
            <p><strong>編集部コメント:</strong> {item.editorComment}</p>
            <p><strong>おすすめメニュー:</strong> {item.recommendedMenu}</p>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <h2 className="font-semibold">店舗基本情報</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div><dt className="text-slate-500">住所</dt><dd className="font-semibold">{item.address}</dd></div>
            {item.phone ? <div><dt className="text-slate-500">電話</dt><dd className="font-semibold"><Phone className="mr-1 inline h-3.5 w-3.5" />{item.phone}</dd></div> : null}
            <div><dt className="text-slate-500">価格帯</dt><dd className="font-semibold">{item.priceRange}</dd></div>
            <div><dt className="text-slate-500">駐車場</dt><dd className="font-semibold">{item.parking ? "あり" : "要確認"}{item.parkingNote ? " / " + item.parkingNote : ""}</dd></div>
            <div><dt className="text-slate-500">営業時間</dt><dd className="font-semibold">{item.businessHours}</dd></div>
            <div><dt className="text-slate-500">定休日</dt><dd className="font-semibold">{item.closedDays}</dd></div>
            <div><dt className="text-slate-500">最終確認日</dt><dd className="font-semibold">{item.lastVerifiedAt}</dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.officialLinks.map((link) => (
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
          {item.relatedRankingSlugs.map((rankingSlug) => <Button key={rankingSlug} asChild variant="outline"><Link href={routes.ramenRanking(rankingSlug)}>ランキングを見る</Link></Button>)}
        </div>
      </section>
      <div className="mt-8 grid gap-6">
        <FaqSection faqs={item.faqs} />
        <SourceList sources={item.sources} />
      </div>
    </div>
  );
}
