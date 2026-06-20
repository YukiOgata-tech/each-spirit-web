import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { articleHref, getArticlesByMajorCategory, getContentSections, getRamenRankings, rankingHref } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "グルメガイド",
  description: "ラーメン、カフェなどの外食情報を地域、目的、移動手段から探せるグルメカテゴリです。",
  path: routes.food,
});

export default async function FoodPage() {
  const [sections, articles, rankings] = await Promise.all([
    getContentSections("food"),
    getArticlesByMajorCategory("food"),
    getRamenRankings(),
  ]);
  const breadcrumbs = [{ name: "トップ", href: routes.home }, { name: "グルメ", href: routes.food }];

  return (
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="rounded-lg border border-orange-100 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold text-orange-700">Food</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">グルメガイド</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">地域、味、雰囲気、移動手段で飲食店を比較できるカテゴリです。</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {sections.map((section) => (
            <Button key={section.sectionSlug} asChild variant={section.sectionSlug === "ramen" ? "default" : "outline"}>
              <Link href={section.href}>{section.label}を見る<ArrowRight className="h-4 w-4" /></Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold tracking-normal text-slate-950">ランキング</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rankings.map((ranking) => <RankingCard key={`${ranking.contentType}-${ranking.slug}`} ranking={ranking} href={rankingHref(ranking)} />)}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold tracking-normal text-slate-950">最新記事</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((article) => <ArticleCard key={article.slug} article={article} href={articleHref(article)} />)}
        </div>
      </section>
    </main>
  );
}
