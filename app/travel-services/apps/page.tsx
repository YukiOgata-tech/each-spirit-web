import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Smartphone } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FaqSection } from "@/components/cards/FaqSection";
import { SourceList } from "@/components/cards/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { AttributedImage, resolveCredit } from "@/components/ui/AttributedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, pageMetadata, travelAppItemListSchema } from "@/lib/seo";
import { getTravelApps } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "旅行アプリおすすめ比較ランキング｜予約・乗換・地図・翻訳アプリの選び方",
  description: "旅行計画に使えるアプリを、移動計画・乗換検索・旅程管理など用途別に整理。都道府県ではなく使う場面で比較します。",
  path: routes.travelApps,
  keywords: ["旅行アプリ", "乗換アプリ", "旅行計画アプリ", "NAVITIME", "ジョルダン"],
});

export default async function TravelAppsPage() {
  const apps = await getTravelApps();
  const breadcrumbs = [
    { name: "トップ", href: routes.home },
    { name: "旅行アプリ・旅行会社", href: routes.travelServices },
    { name: "旅行アプリ", href: routes.travelApps },
  ];

  return (
    <div className="travel-services-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={travelAppItemListSchema(apps)} />

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <Image
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff"
          alt="地図と旅行計画"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(18,53,69,0.96)_0%,rgba(40,90,111,0.88)_55%,rgba(224,143,62,0.45)_100%)]" />
        <div className="relative z-10 mx-auto w-[min(1120px,calc(100%-40px))] py-10 max-sm:w-[min(1120px,calc(100%-24px))] sm:py-14">
          <Breadcrumbs
            items={breadcrumbs.map((b, i) => ({ label: b.name, href: i < breadcrumbs.length - 1 ? b.href : undefined }))}
            className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white"
          />
          <Badge className="mt-4 border-white/20 bg-white/12 text-white">Travel Apps</Badge>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-normal text-white sm:text-5xl">おすすめ旅行アプリを用途別に選ぶ。</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
            旅行アプリは都道府県ではなく、移動計画・乗換検索・旅程管理・予約などの使う場面で整理します。初回は移動計画系の基礎アプリから掲載しています。
          </p>
        </div>
      </section>

      <section className="section-shell mx-auto max-w-5xl">
        <div className="grid gap-5 md:grid-cols-2">
          {apps.map((app) => (
            <article key={app.slug} className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-soft">
              <div className="relative h-44">
                <AttributedImage
                  src={app.imageUrl}
                  alt={app.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  credit={resolveCredit(app.imageUrl, app.name, app.officialUrl)}
                  variant="hover"
                  wrapperClassName="absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <Badge className="absolute bottom-3 left-3 bg-white/92 text-[var(--primary)]">{app.useCase}</Badge>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {app.platforms.map((platform) => <Badge key={platform} className="bg-[var(--muted)] text-[var(--primary)]">{platform}</Badge>)}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-950">{app.name}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--primary)]">{app.brand}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{app.description}</p>
                <div className="mt-4 rounded-lg bg-[var(--muted)] p-4 text-sm leading-7 text-slate-800">
                  <strong>編集部コメント:</strong> {app.editorComment}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {app.features.map((feature) => <Badge key={feature} className="border-sky-200 bg-sky-50 text-sky-800">{feature}</Badge>)}
                </div>
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
                  {app.bestFor.map((item) => (
                    <li key={item} className="rounded-md bg-slate-50 px-3 py-2"><Smartphone className="mr-1 inline h-3.5 w-3.5" />{item}</li>
                  ))}
                </ul>
                <Button asChild size="sm" className="mt-5">
                  <a href={app.officialUrl} target="_blank" rel="noreferrer">公式サイトを見る<ExternalLink className="h-4 w-4" /></a>
                </Button>
                <div className="mt-5 grid gap-5">
                  <FaqSection faqs={app.faqs} />
                  <SourceList sources={app.sources} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Button asChild variant="outline" size="sm">
            <Link href={routes.travelServices}>← 旅行アプリ・旅行会社トップに戻る</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
