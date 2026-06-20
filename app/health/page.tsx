import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { MajorSectionDirectory } from "@/components/generic/SectionNavigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { articleHref, getArticlesByMajorCategory, getContentSections, getProteinProducts, getProteinRankings } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "健康・プロテインガイド",
  description: "プロテインを中心に、目的別・成分別・価格帯別で健康関連の商品や記事を探せるカテゴリです。",
  path: routes.health,
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
    <main className="section-shell">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold text-blue-700">Health</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl">健康・プロテインガイド</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">目的、栄養成分、価格帯で健康関連コンテンツを比較します。</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {sections.map((section) => (
            <Button key={section.sectionSlug} asChild>
              <Link href={section.href}>{section.label}を見る<ArrowRight className="h-4 w-4" /></Link>
            </Button>
          ))}
        </div>
      </section>

      <MajorSectionDirectory
        title="健康カテゴリ"
        description="プロテインなど、健康内の公開中カテゴリを横断できます。"
        sections={sections}
      />

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold tracking-normal text-slate-950">公開中ランキング</h2>
          <p className="mt-2 text-sm text-slate-600">{rankings.length}件のランキングを公開中です。</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold tracking-normal text-slate-950">掲載商品</h2>
          <p className="mt-2 text-sm text-slate-600">{products.length}件の商品データを掲載しています。</p>
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
