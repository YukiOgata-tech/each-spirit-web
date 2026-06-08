import Link from "next/link";
import { ArrowRight, Beef, MapPin, Soup, Trophy } from "lucide-react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ItemCard } from "@/components/cards/ItemCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategory, getRamenArticles, getRamenItemsByRegion, getRamenRankingsByRegion } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "新潟ラーメン",
  description: "新潟県内のラーメン店を、新潟5大ラーメン、エリア、駐車場、営業時間、公式情報の確認元付きで比較するカテゴリページです。",
  path: routes.ramen,
});

const areas = ["新潟市中央区", "古町", "沼垂", "江南区", "西区", "南区", "西蒲区", "燕市"];
const genres = ["新潟あっさり醤油", "新潟濃厚味噌", "燕背脂", "煮干し", "貝だし", "つけ麺", "夜営業", "個店"];
const featuredSlugs = ["ishiguro-bentenbashi", "hanasaki-nuttari", "ippongi-konan", "kaisei-kobari"];
const fiveStyles = [
  { name: "新潟あっさり醤油", text: "細麺と淡麗スープ。古町の老舗を入口にしやすい。" },
  { name: "新潟濃厚味噌", text: "濃い味噌と太麺。割りスープ文化も分かりやすい。" },
  { name: "燕背脂", text: "煮干し醤油、背脂、極太麺、玉ねぎの県央スタイル。" },
  { name: "長岡生姜醤油", text: "今後、長岡市の代表店を追加予定。" },
  { name: "三条カレー", text: "今後、三条市の店舗情報を調査して追加予定。" },
];

export default function RamenPage() {
  const articles = getRamenArticles().filter((a) => a.tags.includes("新潟"));
  const rankings = getRamenRankingsByRegion("niigata");
  const items = getRamenItemsByRegion("niigata");
  const yamagataItems = getRamenItemsByRegion("yamagata");
  const yamagataRankings = getRamenRankingsByRegion("yamagata");
  const category = getCategory("ramen");
  const featured = featuredSlugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  return (
    <div className="ramen-theme">
      <section className="border-b border-orange-100 bg-[linear-gradient(135deg,#fff7eb_0%,#fff_55%,#f8e1c2_100%)]">
        <div className="mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <Badge className="border-orange-200 bg-white text-orange-800">Niigata Ramen Guide</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-normal text-slate-950 sm:text-5xl">
              新潟県内のラーメンを、地域・味・移動手段で選ぶ。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
              新潟5大ラーメン、実在店舗、営業時間、駐車場、参照ソースを整理。観光でも地元利用でも、条件を絞って比較しやすいカテゴリに育てます。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild><Link href={routes.ramenRanking("niigata-independent-selection")}>個店8店ランキング<ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline"><Link href="#items">店舗一覧</Link></Button>
            </div>
          </div>
          <div className="rounded-lg border border-orange-200 bg-white/84 p-5 shadow-soft animate-rise">
            <Soup className="h-10 w-10 text-[var(--primary)]" />
            <h2 className="mt-4 text-xl font-semibold">カテゴリ設計</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {category?.searchFacets.map((facet) => <Badge key={facet} className="bg-orange-50 text-orange-900">{facet}</Badge>)}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">{items.length}</strong>店舗</div>
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">{rankings.length}</strong>ランキング</div>
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">{articles.length}</strong>記事</div>
            </div>
            <div className="mt-5 rounded-md bg-slate-950 p-4 text-sm leading-6 text-white">
              今後: {category?.plannedTopics.join(" / ")}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-4 lg:grid-cols-5">
          {fiveStyles.map((style) => (
            <div key={style.name} className="rounded-lg border border-orange-200 bg-white p-4">
              <h2 className="font-semibold text-orange-950">{style.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{style.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="section-heading">エリア別に探す</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {areas.map((area) => <Badge key={area} className="bg-white"><MapPin className="mr-1 h-3 w-3" />{area}</Badge>)}
          </div>
        </div>
        <div>
          <h2 className="section-heading">ジャンル別に探す</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {genres.map((genre) => <Badge key={genre} className="bg-white"><Beef className="mr-1 h-3 w-3" />{genre}</Badge>)}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-5 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="section-heading">目的別ランキング</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rankings.map((ranking) => <RankingCard key={ranking.slug} ranking={ranking} />)}
        </div>
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="section-heading">非チェーンの注目店舗</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {featured.map((item) => <ItemCard key={item.slug} item={item} />)}
          </div>
        </div>
        <div>
          <h2 className="section-heading">最新ラーメン記事</h2>
          <div className="mt-5 grid gap-4">
            {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </div>
      </section>

      <section id="items" className="section-shell">
        <h2 className="section-heading">新潟県 店舗カード一覧</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          営業時間・定休日・駐車場は変更される可能性があります。各店舗ページの参照ソースと確認日を見たうえで、訪問前に公式情報を確認してください。
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {items.map((item) => <ItemCard key={item.slug} item={item} />)}
        </div>
      </section>

      <section className="section-shell border-t border-orange-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge className="border-orange-200 bg-white text-orange-800">Yamagata</Badge>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">山形県ラーメン</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              消費量日本一の山形は、からみそ（龍上海）・冷やしラーメン（栄屋本店）・酒田ラーメン（満月）・冬季限定の手揉み麺（琴平荘）など地域ごとにスタイルが異なります。
            </p>
          </div>
          <Button asChild>
            <Link href={routes.ramenRegion("yamagata")}>山形ラーメンを見る<ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {yamagataRankings.map((ranking) => <RankingCard key={ranking.slug} ranking={ranking} />)}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {yamagataItems.map((item) => <ItemCard key={item.slug} item={item} />)}
        </div>
      </section>
    </div>
  );
}
