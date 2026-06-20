import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Coffee, MapPin } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { getCafeRegions, getCafeItemsByRegion, getCafeRankingsByRegion } from "@/lib/content";

export const metadata = pageMetadata({
  title: "カフェおすすめ比較ガイド｜人気カフェランキングと電源・WiFi・雰囲気の選び方",
  description: "新潟・山形のカフェをスタイル・エリア・こだわりで比較。スペシャルティコーヒー、古民家カフェ、フルーツスイーツカフェなど地域ごとの個性を整理。",
  path: routes.cafe,
  keywords: ["カフェ", "コーヒー", "新潟カフェ", "山形カフェ", "スペシャルティコーヒー"],
});

export default async function CafeIndexPage() {
  const regions = getCafeRegions();
  const regionStats = await Promise.all(
    regions.map(async (region) => ({
      region,
      items: await getCafeItemsByRegion(region.slug),
      rankings: await getCafeRankingsByRegion(region.slug),
    }))
  );

  return (
    <div className="cafe-theme">
      <JsonLd data={breadcrumbSchema([{ name: "カフェガイド", href: routes.cafe }])} />

      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-[linear-gradient(135deg,#fdf7ef_0%,#fff_55%,#f5e8d0_100%)]">
        <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-12 text-center max-sm:w-[min(1360px,calc(100%-24px))] sm:py-16">
          <span className="inline-block rounded-full border border-[var(--border)] bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)]">
            Cafe Guide
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            各エリアのカフェを、<span className="text-[var(--primary)]">こだわりとスタイル</span>で選ぶ。
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            スペシャルティコーヒーから古民家カフェ、地元フルーツスイーツまで。
            エリアごとの魅力とランキング、店舗情報を参照ソース付きで整理しています。
          </p>
        </div>
      </section>

      {/* Regions */}
      <section className="section-shell mx-auto max-w-4xl">
        <p className="section-kicker">REGIONS</p>
        <h2 className="section-heading mt-2">エリアを選ぶ</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {regionStats.map(({ region, items, rankings }) => {
            return (
              <Link
                key={region.slug}
                href={routes.cafeRegion(region.slug)}
                className="group block overflow-hidden rounded-[14px] border border-[var(--border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                <div className="relative flex h-44 items-end overflow-hidden bg-gradient-to-br from-[var(--muted)] to-[#f0e4cc]">
                  {region.images?.[0]?.url ? (
                    <Image
                      src={region.images[0].url}
                      alt={region.images[0].alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <Coffee className="absolute right-5 top-5 h-16 w-16 text-[var(--border)] transition-transform duration-500 group-hover:scale-110" />
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
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    {[
                      { num: items.length, label: "カフェ" },
                      { num: rankings.length, label: "ランキング" },
                    ].map(({ num, label }) => (
                      <div key={label} className="flex-1 rounded-xl bg-[var(--muted)] py-2">
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
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--border)] bg-white p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-[var(--border)]" />
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
