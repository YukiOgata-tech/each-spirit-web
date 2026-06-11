import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, Layers3, Newspaper, Sparkles, TrendingUp } from "lucide-react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { HomeVisualStory } from "@/components/home/HomeVisualStory";
import { DiscoverySearch } from "@/components/search/DiscoverySearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategories, getLatestArticles, getPopularRankings, getSearchResults } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

export const metadata = pageMetadata({
  title: site.title,
  description: "Each Spiritは、ラーメン・旅行・ガジェット・暮らし・業務ツールを横断し、比較、ランキング、検索軸、参照元つきの情報で選ぶ前の判断を助けるメディアです。",
  path: routes.home,
});

const editorialPillars = [
  "比較軸を先に定義",
  "参照元と確認日を残す",
  "カテゴリ横断で探せる",
  "公開前カテゴリも設計に含める",
];

export default async function HomePage() {
  const categories = getCategories();
  const [articles, rankings, searchResults] = await Promise.all([
    getLatestArticles(3),
    getPopularRankings(3),
    getSearchResults(),
  ]);
  const liveCategories = categories.filter((category) => category.status === "live");
  const plannedCategories = categories.filter((category) => category.status === "planned");

  return (
    <>
      <section className="hero-surface border-b border-slate-200">
        <div className="mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div className="animate-rise flex flex-col justify-center">
            <Badge className="w-fit border-slate-300 bg-white text-slate-700">Each Spirit 編集部</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              無限に増えるカテゴリを、比較と検索で迷わず選べるメディアへ。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              ラーメンから始め、旅行、ガジェット、暮らし、業務ツールへ拡張します。記事、ランキング、店舗・商品カードを同じ検索体験に集約し、選ぶ前の判断材料を整理します。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="#search">横断検索を使う<SearchArrow /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={routes.ramen}>公開中カテゴリへ</Link>
              </Button>
            </div>
          </div>

          <HomeVisualStory categories={categories} />
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-6 grid gap-3 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="section-kicker">Search</p>
                <h2 className="section-heading mt-2">カテゴリ横断で探す</h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                今後カテゴリが増えても、検索対象は同じUIへ追加します。キーワード、カテゴリ、コンテンツ種別で絞り込み、記事・ランキング・店舗カード・準備中カテゴリを横断できます。
              </p>
            </div>
            <DiscoverySearch categories={categories} results={searchResults} />
          </div>
          <aside className="hidden xl:block">
            <div className="sticky top-24 grid gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Side Rail</p>
                <h3 className="mt-2 text-lg font-bold text-slate-950">将来の導線枠</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  広告、特集、人気タグ、メルマガ、カテゴリ横断キャンペーンを置ける余白として確保しています。
                </p>
              </div>
              {plannedCategories.slice(0, 3).map((category) => (
                <Link key={category.slug} href={category.href} className="rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="h-1.5 w-14 rounded-full" style={{ background: category.theme.primary }} />
                  <p className="mt-3 text-sm font-bold text-slate-950">{category.name} 準備中</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{category.plannedTopics.slice(0, 3).join(" / ")}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="categories" className="section-shell">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Categories</p>
            <h2 className="section-heading mt-2">公開中と拡張予定</h2>
          </div>
          <Compass className="hidden h-9 w-9 text-slate-400 sm:block" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <CategoryLane title="公開中" categories={liveCategories} />
          <CategoryLane title="拡張予定" categories={plannedCategories} />
        </div>
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-[var(--primary)]" />
            <h2 className="section-heading">最新記事</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </div>
        <div>
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[var(--accent)]" />
            <h2 className="section-heading">ランキング</h2>
          </div>
          <div className="grid gap-4">
            {rankings.map((ranking) => <RankingCard key={ranking.slug} ranking={ranking} />)}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-6 rounded-lg bg-slate-950 p-6 text-white sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Editorial System</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal sm:text-3xl">薄い情報を増やさず、判断できる形にする</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              各カテゴリは、記事だけでなく比較軸、検索項目、カード型データ、更新ルールを先に決めてから拡張します。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {editorialPillars.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg bg-white/8 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-200" />
                <span className="text-sm font-semibold leading-6">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryLane({ title, categories }: { title: string; categories: ReturnType<typeof getCategories> }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <Layers3 className="h-5 w-5 text-[var(--primary)]" />
        <h3 className="font-bold text-slate-950">{title}</h3>
      </div>
      <div className="grid gap-3">
        {categories.map((category) => (
          <Link key={category.slug} href={category.href} className="rounded-md border border-slate-200 p-4 transition hover:bg-slate-50">
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: category.theme.primary }} />
              <span className="font-bold text-slate-950">{category.name}</span>
              {category.contentTypes.map((type) => (
                <Badge key={type} className="bg-slate-50">{type}</Badge>
              ))}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {category.searchFacets.map((facet) => (
                <span key={facet} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                  {facet}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchArrow() {
  return <ArrowRight className="h-4 w-4" />;
}
