import Link from "next/link";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import { articleHref, getArticlesBySection, getLeisureRankings, getLeisureRegions, getLeisureSpots } from "@/lib/content";
import { leisureRankingImage } from "@/lib/leisure-visuals";
import { RegionlessItems } from "@/components/generic/RegionlessItems";
import { LeisureRankingCard } from "@/components/leisure/LeisureRankingCard";
import { NewsFeatureCard } from "@/components/cards/NewsArticleCard";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "レジャースポットガイド",
  description: "屋外、屋内、雨の日、子連れなどの目的別にレジャースポットを探せるガイドです。",
  path: routes.leisureSpots,
});

export default async function LeisureSpotsPage() {
  const [regions, rankings, articles, spots] = await Promise.all([
    getLeisureRegions(),
    getLeisureRankings("niigata"),
    getArticlesBySection("leisure", "spots"),
    getLeisureSpots("niigata"),
  ]);
  return (
    <main className="section-shell">
      <section className="rounded-lg border border-cyan-100 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold text-cyan-700">Leisure / Spots</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">レジャースポットガイド</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">天候、同行者、移動手段でレジャースポットを比較します。</p>
      </section>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <Link key={region} href={routes.leisureRegion(region)} className="rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 className="text-xl font-bold text-slate-950">{region === "niigata" ? "新潟" : region}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">地域別のスポットとランキングを確認できます。</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cyan-700">見る<ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>

      {rankings.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="section-heading">目的別ランキング</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rankings.slice(0, 4).map((ranking) => (
              <LeisureRankingCard key={ranking.slug} region="niigata" ranking={ranking} imageUrl={leisureRankingImage(ranking, spots)} />
            ))}
          </div>
        </section>
      )}

      <RegionlessItems majorCategory="leisure" sectionSlug="spots" itemPathSegment="spots" className="mt-12" heading="エリアを問わず掲載のスポット" />

      {articles.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="section-heading">読みもの・選び方ガイド</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <NewsFeatureCard key={article.slug} article={article} href={articleHref(article)} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
