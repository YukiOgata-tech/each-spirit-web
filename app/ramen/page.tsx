import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Soup } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { getRamenRegions, getRamenItemsByRegion, getRamenRankingsByRegion, getRamenArticles } from "@/lib/content";

export const metadata = pageMetadata({
  title: "ラーメンおすすめ比較ガイド｜人気の名店ランキングと選び方・地域別まとめ",
  description: "新潟・山形など各県のラーメン店を地域・ジャンル・エリアで比較。エリアごとのスタイル、ランキング、店舗カードで整理しています。",
  path: routes.ramen,
});

export default async function RamenIndexPage() {
  const regions = getRamenRegions();
  const allArticles = await getRamenArticles();
  const regionData = await Promise.all(
    regions.map(async (region) => ({
      ...region,
      items: await getRamenItemsByRegion(region.slug),
      rankings: await getRamenRankingsByRegion(region.slug),
      articles: allArticles.filter((a) => a.tags.includes(region.articleTag)),
    }))
  );

  return (
    <div className="ramen-theme">
      <JsonLd data={breadcrumbSchema([{ name: "ラーメンガイド", href: routes.ramen }])} />

      <section className="border-b border-orange-100 bg-[linear-gradient(135deg,#fff7eb_0%,#fff_55%,#f8e1c2_100%)]">
        <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-12 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-16 text-center">
          <span className="inline-block rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-800">
            Ramen Guide
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            各県のラーメンを、<span className="text-[var(--primary)]">エリア・ジャンル・営業条件</span>で選ぶ。
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            新潟5大ラーメンから山形の消費量日本一まで。エリアごとのスタイル、ランキング、店舗情報を参照ソース付きで整理しています。
          </p>
        </div>
      </section>

      <section className="section-shell mx-auto max-w-4xl">
        <p className="section-kicker">REGIONS</p>
        <h2 className="section-heading mt-2">エリアを選ぶ</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {regionData.map((region) => (
            <Link
              key={region.slug}
              href={routes.ramenRegion(region.slug)}
              className="group block overflow-hidden rounded-[14px] border border-orange-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <div className="relative flex h-44 items-end overflow-hidden bg-[linear-gradient(135deg,#fff7eb,#fde9c9)]">
                {region.images?.[0]?.url ? (
                  <Image
                    src={region.images[0].url}
                    alt={region.images[0].alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <Soup className="absolute right-5 top-5 h-16 w-16 text-orange-200 transition-transform duration-500 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="relative z-10 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                    {region.status === "live" ? "公開中" : "準備中"}
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-white">{region.name}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-[var(--primary)]">{region.tagline}</p>
                <p className="mt-2 text-xs leading-6 text-slate-500">{region.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { num: region.items.length, label: "店舗" },
                    { num: region.rankings.length, label: "ランキング" },
                    { num: region.articles.length, label: "記事" },
                  ].map(({ num, label }) => (
                    <div key={label} className="flex-1 rounded-xl bg-orange-50 py-2">
                      <p className="text-lg font-black text-[var(--primary)]">{num}</p>
                      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-end gap-1 text-xs font-bold text-[var(--primary)]">
                  詳しく見る <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-orange-100 bg-white p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-orange-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">今後追加予定のエリア</h3>
          <p className="mt-2 text-sm text-slate-500">宮城県・秋田県・福島県など東北各県を順次追加していきます。</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["宮城県", "秋田県", "福島県", "岩手県", "青森県"].map((pref) => (
              <span key={pref} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
                {pref}（準備中）
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
