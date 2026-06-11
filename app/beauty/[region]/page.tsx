import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BeautyHero } from "@/components/beauty/BeautyHero";
import { SalonCard } from "@/components/beauty/SalonCard";
import { BeautyRankingCard } from "@/components/beauty/BeautyRankingCard";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import {
  getBeautyArticles,
  getBeautyRankings,
  getBeautySalons,
  getBeautyRegion,
  getBeautyRegions,
  getCategory,
} from "@/lib/content";

type PageProps = { params: Promise<{ region: string }> };

export async function generateStaticParams() {
  return getBeautyRegions().map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { region } = await params;
  const regionData = getBeautyRegion(region);
  if (!regionData) return {};
  return pageMetadata({
    title: `${regionData.name}おすすめ美容室`,
    description: regionData.description,
    path: routes.beautyRegion(region),
  });
}

const AGE_GROUPS = [
  { range: "10代", color: "bg-pink-50 border-pink-200 text-pink-800",        desc: "インナーカラー・ハイライト中心" },
  { range: "20代", color: "bg-violet-50 border-violet-200 text-violet-800",  desc: "トレンドカラー・髪質改善" },
  { range: "30代", color: "bg-rose-50 border-rose-200 text-rose-800",        desc: "カラー品質・維持コスト重視" },
  { range: "40代", color: "bg-amber-50 border-amber-200 text-amber-800",     desc: "白髪ケア・カウンセリング重視" },
  { range: "50代〜", color: "bg-teal-50 border-teal-200 text-teal-800",      desc: "ヘッドスパ・育毛・扱いやすさ" },
];

export default async function BeautyRegionPage({ params }: PageProps) {
  const { region } = await params;
  const regionData = getBeautyRegion(region);
  if (!regionData) notFound();

  const [salons, rankings, articles] = await Promise.all([
    getBeautySalons(region),
    getBeautyRankings(region),
    getBeautyArticles(region),
  ]);
  const category = getCategory("beauty");
  const firstRankingSlug = rankings[0]?.slug ?? "";

  const areas = [...new Set(salons.map((s) => s.area))];

  return (
    <div className="beauty-theme">
      <BeautyHero
        salonCount={salons.length}
        rankingCount={rankings.length}
        region={region}
        firstRankingSlug={firstRankingSlug}
      />

      {/* Rankings */}
      <section className="section-shell">
        <p className="section-kicker" style={{ color: "#8b3a7e" }}>RANKING</p>
        <h2 className="section-heading mt-2">目的別ランキング</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          年代・施術・ヘッドスパの3軸でランキングを整理。複数ランキングの交点を使って候補を絞れます。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {rankings.map((ranking, i) => (
            <BeautyRankingCard key={ranking.slug} ranking={ranking} index={i} region={region} />
          ))}
        </div>
      </section>

      {/* Age groups */}
      <section className="section-shell">
        <p className="section-kicker" style={{ color: "#8b3a7e" }}>BY AGE</p>
        <h2 className="section-heading mt-2">年代別おすすめポイント</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {AGE_GROUPS.map(({ range, color, desc }) => (
            <div key={range} className={`rounded-xl border p-4 ${color}`}>
              <p className="text-lg font-black">{range}</p>
              <p className="mt-1 text-xs leading-5">{desc}</p>
              <Link
                href={routes.beautyRanking(region, rankings[0]?.slug ?? "")}
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold underline underline-offset-2"
              >
                ランキングへ <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Salons */}
      <section id="salons" className="section-shell">
        <p className="section-kicker" style={{ color: "#8b3a7e" }}>SALONS</p>
        <h2 className="section-heading mt-2">{regionData.shortName}の掲載サロン</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          営業時間・価格は変更される場合があります。各サロンカードの参照ソースと確認日を確認のうえ、訪問前に公式情報をご確認ください。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {areas.map((area) => (
            <span key={area} className="inline-flex items-center gap-1 rounded-full border border-[#f2d5e8] bg-white px-3 py-1 text-xs font-semibold text-[#8b3a7e]">
              <MapPin className="h-3 w-3" />{area}
            </span>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((salon) => (
            <SalonCard key={salon.slug} salon={salon} region={region} />
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="section-shell">
        <p className="section-kicker" style={{ color: "#8b3a7e" }}>GUIDE</p>
        <h2 className="section-heading mt-2">ガイド記事</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={routes.beautyArticle(region, article.slug)}
              className="beauty-card group flex flex-col gap-4 p-6"
            >
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#fef0f6] px-2.5 py-0.5 text-[10px] font-semibold text-[#8b3a7e]">
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <h3 className="text-base font-bold leading-snug text-slate-900 group-hover:text-[#8b3a7e] transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{article.description}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-[#8b3a7e]">
                記事を読む <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      {category && (
        <section className="section-shell">
          <div className="rounded-2xl border border-[#f2d5e8] bg-white p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="section-kicker" style={{ color: "#8b3a7e" }}>CATEGORY INFO</p>
                <h2 className="mt-1 text-lg font-bold">{regionData.name} {category.tagline}</h2>
              </div>
              <Link href={routes.beauty} className="text-xs font-bold text-[#8b3a7e] underline underline-offset-4">
                ← 全エリア一覧に戻る
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { num: salons.length,   label: "掲載サロン" },
                { num: rankings.length, label: "ランキング" },
                { num: articles.length, label: "ガイド記事" },
              ].map(({ num, label }) => (
                <div key={label} className="rounded-xl bg-[#fef0f6] p-4 text-center">
                  <p className="text-2xl font-black text-[#8b3a7e]">{num}</p>
                  <p className="text-xs font-semibold text-slate-600">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.plannedTopics.map((topic) => (
                <span key={topic} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                  {topic}（予定）
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
