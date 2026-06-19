import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Thermometer } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { getTravelRegions, getTravelHotels, getTravelRankings } from "@/lib/content";

export const metadata = pageMetadata({
  title: "旅行おすすめ比較ガイド｜温泉宿・ホテルのランキングと予約・選び方",
  description: "新潟・山形など各県の温泉旅館・宿泊施設を泉質・景観・旅スタイルで比較。ランキングと宿カードで整理しています。",
  path: routes.travel,
});

export default async function TravelIndexPage() {
  const regions = getTravelRegions();
  const regionStats = await Promise.all(
    regions.map(async (region) => ({
      region,
      hotels: await getTravelHotels(region.slug),
      rankings: await getTravelRankings(region.slug),
    }))
  );

  return (
    <div className="travel-theme">
      <JsonLd data={breadcrumbSchema([{ name: "旅行ガイド", href: routes.travel }])} />

      <section className="border-b border-[var(--border)] bg-[linear-gradient(135deg,#1c3829_0%,#2d5a3d_40%,#4a8c60_75%,#f5ede0_100%)]">
        <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-14 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-20 text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/80">
            Travel Guide
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
            温泉・旅館を、<span className="text-[var(--accent)]">泉質・景観・旅スタイル</span>で選ぶ。
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/80">
            ラジウム泉・日本三大薬湯・日本海夕日の絶景。チェーンホテルではなく、その土地にしかない宿を参照ソース付きで整理します。
          </p>
        </div>
      </section>

      <section className="section-shell mx-auto max-w-4xl">
        <p className="section-kicker" style={{ color: "var(--primary)" }}>REGIONS</p>
        <h2 className="section-heading mt-2">エリアを選ぶ</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {regionStats.map(({ region, hotels, rankings }) => {
            return (
              <Link
                key={region.slug}
                href={routes.travelRegion(region.slug)}
                className={`travel-card group ${region.status !== "live" ? "pointer-events-none opacity-60" : ""}`}
              >
                <div className="relative flex h-44 items-end overflow-hidden bg-[linear-gradient(135deg,#1c3829,#2d5a3d,#4a8c60)]">
                  {region.images?.[0]?.url ? (
                    <Image
                      src={region.images[0].url}
                      alt={region.images[0].alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <Thermometer className="absolute right-5 top-5 h-16 w-16 text-white/10 transition-transform duration-500 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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
                      { num: hotels.length, label: "掲載宿" },
                      { num: rankings.length, label: "ランキング" },
                    ].map(({ num, label }) => (
                      <div key={label} className="flex-1 rounded-xl bg-[var(--muted)] py-2">
                        <p className="text-lg font-black text-[var(--primary)]">{num}</p>
                        <p className="text-[10px] font-semibold text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>
                  {region.status === "live" && (
                    <div className="mt-4 flex items-center justify-end gap-1 text-xs font-bold text-[var(--primary)]">
                      詳しく見る <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--border)] bg-white p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-[var(--accent)]" />
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
