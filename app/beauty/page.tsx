import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { getBeautyRegions, getBeautySalons, getBeautyRankings, getBeautyArticles } from "@/lib/content";

export const metadata = pageMetadata({
  title: "美容室・美容院おすすめ比較ガイド｜人気サロンランキングと失敗しない選び方",
  description: "新潟・山形など各県の美容室を年代・施術・エリアで比較。カラー・髪質改善・ヘッドスパ・パーマを得意とするサロンをランキングと店舗カードで整理しています。",
  path: routes.beauty,
});

export default async function BeautyIndexPage() {
  const regions = getBeautyRegions();
  const regionData = await Promise.all(
    regions.map(async (region) => ({
      ...region,
      salons: await getBeautySalons(region.slug),
      rankings: await getBeautyRankings(region.slug),
      articles: await getBeautyArticles(region.slug),
    }))
  );

  return (
    <div className="beauty-theme">
      <section className="border-b border-[#f2d5e8] beauty-hero-bg px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-[#f2d5e8] bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8b3a7e]">
            Beauty Guide
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            美容室を、<span className="beauty-shimmer-text">地域・年代・施術</span>で選ぶ。
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            カラー・髪質改善・ヘッドスパ・パーマを得意とするサロンを、都道府県ごとに整理。
            年代に合った提案力とエリアの利便性を軸にランキングとサロンカードで比較できます。
          </p>
        </div>
      </section>

      <section className="section-shell mx-auto max-w-4xl">
        <p className="section-kicker" style={{ color: "#8b3a7e" }}>REGIONS</p>
        <h2 className="section-heading mt-2">エリアを選ぶ</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {regionData.map((region) => (
            <Link
              key={region.slug}
              href={routes.beautyRegion(region.slug)}
              className="beauty-card group overflow-hidden"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={region.imageUrl}
                  alt={region.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                    {region.status === "live" ? "公開中" : "準備中"}
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-white">{region.name}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-[#8b3a7e]">{region.tagline}</p>
                <p className="mt-2 text-xs leading-6 text-slate-500">{region.description}</p>
                <div className="mt-4 flex gap-4 text-center">
                  {[
                    { num: region.salons.length,   label: "サロン" },
                    { num: region.rankings.length, label: "ランキング" },
                    { num: region.articles.length, label: "記事" },
                  ].map(({ num, label }) => (
                    <div key={label} className="flex-1 rounded-xl bg-[#fef0f6] py-2">
                      <p className="text-lg font-black text-[#8b3a7e]">{num}</p>
                      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-end gap-1 text-xs font-bold text-[#8b3a7e]">
                  詳しく見る <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#f2d5e8] bg-white p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-[#d4819e]" />
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
