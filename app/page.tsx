import Link from "next/link";
import { ArrowRight, CheckCircle2, Newspaper, TrendingUp } from "lucide-react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { HomeVisualStory } from "@/components/home/HomeVisualStory";
import { DiscoverySearch } from "@/components/search/DiscoverySearch";
import { SearchForm } from "@/components/search/SearchForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { articleHref, getCategories, getLatestArticles, getPopularRankings, getSearchResults, rankingHref } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";

export const metadata = pageMetadata({
  title: site.title,
  description: "Each Spiritは、グルメ・旅行・ガジェット・暮らし・業務ツールを横断し、比較、ランキング、検索軸、参照元つきの情報で選ぶ前の判断を助けるメディアです。",
  path: routes.home,
});

const editorialPillars = [
  "比較と詳細をフラットに",
  "参照元と確認日を確認してください",
  "カテゴリ横断で探しましょう",
  "楽しく、迷わず、選べる情報を",
];

export default async function HomePage() {
  const categories = getCategories();
  const [articles, rankings, searchResults] = await Promise.all([
    getLatestArticles(4),
    getPopularRankings(4),
    getSearchResults(),
  ]);
  const liveCategories = categories.filter((category) => category.status === "live");

  return (
    <>
      <section className="hero-surface border-b border-slate-200">
        <div className="mx-auto grid w-[min(1360px,calc(100%-40px))] gap-5 py-6 max-sm:w-[min(1360px,calc(100%-20px))] sm:gap-8 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div className="animate-rise flex flex-col justify-center max-sm:items-center max-sm:text-center">
            <Badge className="w-fit border-slate-300 bg-white text-slate-700">Each Spirit 情報部</Badge>
            <h1 className="mt-4 max-w-3xl text-[2rem] font-bold leading-[1.1] tracking-normal text-slate-950 sm:text-5xl sm:leading-[1.05] lg:text-6xl">
              必要<span className="text-xl sm:text-3xl lg:text-4xl">な</span>情報
              <span className="text-xl sm:text-3xl lg:text-4xl">を、<br/>
              </span>比較<span className="text-xl sm:text-3xl lg:text-4xl">と</span>
              検索<span className="text-xl sm:text-3xl lg:text-4xl">で</span>迷<span className="text-xl sm:text-3xl lg:text-4xl">わず</span><br className="hidden sm:block"/>
              選<span className="text-xl sm:text-3xl lg:text-4xl">べる</span><br className="block sm:hidden"/>情報メディア
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 max-sm:px-1 sm:text-lg sm:leading-8">
              グルメから、旅行、暮らし、AIツールなどなど。記事とランキングによる情報提供で、読者の判断材料を提供します。
            </p>
            <div className="mt-5 grid w-full grid-cols-2 gap-2.5 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
              <Button asChild size="lg" className="max-sm:h-11 max-sm:px-3 max-sm:text-sm">
                <Link href={routes.search}>検索ページを開く<SearchArrow /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="max-sm:h-11 max-sm:px-3 max-sm:text-sm">
                <Link href={routes.ramen}>公開中カテゴリへ</Link>
              </Button>
            </div>
            <SearchForm className="mt-4 w-full max-w-2xl rounded-xl border border-slate-200 bg-white/95 p-2 shadow-sm sm:mt-5" placeholder="店名・地域・ジャンル・記事テーマで検索" />
          </div>

          <HomeVisualStory categories={liveCategories} />
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-6">
          <div>
            <div className="mb-4 grid gap-2 sm:mb-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-3">
              <div>
                <p className="section-kicker">Search</p>
                <h2 className="section-heading mt-1.5">カテゴリ横断で探す</h2>
              </div>
              <p className="text-sm leading-5 text-slate-600 sm:leading-7">
                カテゴリから毎回6件をランダムに表示しています。キーワード、カテゴリ、コンテンツ種別で絞り込み、記事・ランキング・店舗カードを横断できます。
              </p>
            </div>
            <DiscoverySearch categories={liveCategories} results={searchResults} />
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-6 sm:gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        <div>
          <div className="mb-4 flex items-center gap-2.5 sm:mb-6">
            <Newspaper className="h-6 w-6 shrink-0 text-[var(--primary)]" />
            <h2 className="section-heading">最新記事</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {articles.map((article) => <ArticleCard key={article.category + article.slug} article={article} href={articleHref(article)} />)}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2.5 sm:mb-6">
            <TrendingUp className="h-6 w-6 shrink-0 text-[var(--accent)]" />
            <h2 className="section-heading">ランキング</h2>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {rankings.map((ranking) => <RankingCard key={`${ranking.majorCategory ?? ""}-${ranking.sectionSlug ?? ""}-${ranking.slug}`} ranking={ranking} href={rankingHref(ranking)} />)}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-5 rounded-lg bg-slate-950 p-5 text-white sm:gap-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-sm">Editorial System</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal sm:mt-3 sm:text-3xl">情報を、判断できる形へ</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:mt-4 sm:leading-7">
              各カテゴリは、記事だけでなく比較軸、検索項目を明確に拡張していきます。
            </p>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
            {editorialPillars.map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-lg bg-white/8 px-3 py-1 sm:px-4 sm:py-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-200" />
                <span className="text-xs sm:text-sm font-semibold leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SearchArrow() {
  return <ArrowRight className="h-4 w-4" />;
}
