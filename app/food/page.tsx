import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsFeatureCard } from "@/components/cards/NewsArticleCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { MajorCategoryHero } from "@/components/category/MajorCategoryHero";
import { MajorSectionDirectory } from "@/components/generic/SectionNavigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleHref, getArticlesByMajorCategory, getContentSections, getRamenRankings, rankingHref } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "グルメおすすめ比較ガイド｜ラーメン・カフェの人気店とランキング",
  description: "ラーメン、カフェなどの外食情報を地域・味・雰囲気・移動手段から比較できるグルメカテゴリです。",
  path: routes.food,
  image: majorMetaImage("food"),
});

export default async function FoodPage() {
  const [sections, articles, rankings] = await Promise.all([
    getContentSections("food"),
    getArticlesByMajorCategory("food"),
    getRamenRankings(),
  ]);
  const breadcrumbs = [{ name: "トップ", href: routes.home }, { name: "グルメ", href: routes.food }];

  return (
    <main className="ramen-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <MajorCategoryHero
        major="food"
        variant="collage"
        surfaceClass="bg-[linear-gradient(135deg,#fff7eb_0%,#ffffff_46%,#f8e1c2_100%)]"
        eyebrow="Food Guide"
        title={<>食の「どれにする？」を、<span className="text-[var(--primary)]">味・価格・エリア</span>で解く。</>}
        description="ラーメン・カフェなど、地域と目的で外食を比較。参照ソース付きで、移動手段や雰囲気まで踏まえて選べるように整理します。"
        actions={sections.map((section) => ({ label: `${section.label}を見る`, href: section.href, primary: section.sectionSlug === "ramen" }))}
        stats={[
          { label: "カテゴリ", value: sections.length },
          { label: "ランキング", value: rankings.length },
          { label: "記事", value: articles.length },
        ]}
      />

      <div className="section-shell">
        <MajorSectionDirectory
          title="グルメカテゴリ"
          description="ラーメン・カフェなど、グルメ内の公開中カテゴリを横断できます。"
          sections={sections}
        />

        {rankings.length > 0 && (
          <section className="mt-10 sm:mt-12">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--primary)]">Rankings</p>
                <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 sm:text-[1.75rem]">ランキング</h2>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {rankings.map((ranking) => <RankingCard key={`${ranking.majorCategory ?? ""}-${ranking.sectionSlug ?? ""}-${ranking.slug}`} ranking={ranking} href={rankingHref(ranking)} />)}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="mt-10 sm:mt-12">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--primary)]">Articles</p>
                <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 sm:text-[1.75rem]">最新記事</h2>
              </div>
              <Link href={routes.articles} className="flex items-center gap-1 text-xs font-bold text-[var(--primary)] sm:text-sm">記事一覧<ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 6).map((article) => <NewsFeatureCard key={article.slug} article={article} href={articleHref(article)} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
