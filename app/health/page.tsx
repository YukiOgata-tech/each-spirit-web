import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { MajorCategoryHero } from "@/components/category/MajorCategoryHero";
import { MajorSectionDirectory } from "@/components/generic/SectionNavigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleHref, getArticlesByMajorCategory, getContentSections, getProteinProducts, getProteinRankings } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { majorMetaImage } from "@/lib/category-media";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "健康・プロテイン比較ガイド｜目的別の成分とコスパでおすすめを選ぶ",
  description: "プロテインを中心に、目的別・成分別・価格帯別で健康関連の商品や記事を比較できるカテゴリです。",
  path: routes.health,
  image: majorMetaImage("health"),
});

export default async function HealthPage() {
  const [sections, articles, rankings, products] = await Promise.all([
    getContentSections("health"),
    getArticlesByMajorCategory("health"),
    getProteinRankings(),
    getProteinProducts(),
  ]);
  const breadcrumbs = [{ name: "トップ", href: routes.home }, { name: "健康", href: routes.health }];

  return (
    <main className="protein-theme">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <MajorCategoryHero
        major="health"
        variant="panel"
        surfaceClass="bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_50%,#fff7ed_100%)]"
        eyebrow="Health Guide"
        title={<>体づくりを、<span className="text-[var(--primary)]">目的・成分・続けやすさ</span>で選ぶ。</>}
        description="プロテインを中心に、増量・減量・補食などの目的から成分とコスパを比較。続けやすさまで踏まえて整理します。"
        actions={sections.map((section) => ({ label: `${section.label}を見る`, href: section.href, primary: section.sectionSlug === "protein" }))}
        stats={[
          { label: "掲載商品", value: products.length },
          { label: "ランキング", value: rankings.length },
          { label: "記事", value: articles.length },
        ]}
      />

      <div className="section-shell">
        <MajorSectionDirectory
          title="健康カテゴリ"
          description="プロテインなど、健康内の公開中カテゴリを横断できます。"
          sections={sections}
        />

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
              {articles.slice(0, 6).map((article) => <ArticleCard key={article.slug} article={article} href={articleHref(article)} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
