import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { MajorCategoryHero } from "@/components/category/MajorCategoryHero";
import { MajorSectionDirectory } from "@/components/generic/SectionNavigation";
import { pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { routes } from "@/lib/routes";
import { getBeautyRegions, getBeautySalons, getBeautyRankings, getBeautyArticles, getContentSections } from "@/lib/content";

export const metadata = pageMetadata({
  title: "美容を自分らしく選ぶガイド｜商品・ケア方法・施術・サロン",
  description: "スキンケアやヘアケア商品、美容メソッド、サロン施術まで、美容にまつわる選択肢を目的や悩みに合わせて整理する総合ガイドです。",
  path: routes.beauty,
  image: majorMetaImage("beauty"),
});

export default async function BeautyIndexPage() {
  const [regions, sections] = await Promise.all([getBeautyRegions(), getContentSections("beauty")]);
  const regionData = await Promise.all(
    regions.map(async (region) => ({
      ...region,
      salons: await getBeautySalons(region.slug),
      rankings: await getBeautyRankings(region.slug),
      articles: await getBeautyArticles(region.slug),
    }))
  );
  const totalSalons = regionData.reduce((sum, region) => sum + region.salons.length, 0);
  const totalRankings = regionData.reduce((sum, region) => sum + region.rankings.length, 0);

  return (
    <div className="beauty-theme">
      <MajorCategoryHero
        major="beauty"
        variant="slideshow"
        surfaceClass="bg-[#241522]"
        eyebrow="Beauty Guide"
        title={<>美容を、もっと<br />自分らしく選ぶ。</>}
        description="スキンケアやヘアケア商品、毎日の美容メソッド、プロによる施術やサロン選びまで。目的や悩みに合う美容情報を、わかりやすく整理して届けます。"
        stats={[
          { label: "エリア", value: regionData.length },
          { label: "サロン", value: totalSalons },
          { label: "ランキング", value: totalRankings },
        ]}
      />

      <section id="regions" className="section-shell mx-auto max-w-5xl">
        <MajorSectionDirectory
          title="美容カテゴリ"
          description="商品・ケア方法・施術・サロンなど、美容に関する公開中カテゴリを横断できます。"
          sections={sections}
        />

        <p className="section-kicker" style={{ color: "#8b3a7e" }}>REGIONS</p>
        <h2 className="section-heading mt-2">エリアを選ぶ</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {regionData.map((region) => (
            <Link
              key={region.slug}
              href={routes.beautyRegion(region.slug)}
              className="beauty-card group overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden sm:h-52 sm:aspect-auto">
                <Image
                  src={region.imageUrl}
                  alt={region.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                    {region.status === "live" ? "公開中" : "準備中"}
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-white">{region.name}</p>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-sm font-semibold text-[#8b3a7e]">{region.tagline}</p>
                <p className="mt-2 text-xs leading-6 text-slate-500">{region.description}</p>
                <div className="mt-4 flex gap-3 text-center sm:gap-4">
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
