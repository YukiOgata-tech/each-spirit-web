import Link from "next/link";
import { ArrowRight, MapPin, Soup, Trophy } from "lucide-react";
import { ItemCard } from "@/components/cards/ItemCard";
import { RankingCard } from "@/components/cards/RankingCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRamenItemsByRegion, getRamenRankingsByRegion, getRamenArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "山形ラーメン",
  description: "消費量日本一の山形県のラーメンを、からみそ・冷やしラーメン・酒田ラーメン・エリア別に整理。龍上海・栄屋本店・満月・琴平荘など代表店を紹介します。",
  path: routes.ramenRegion("yamagata"),
});

const yamagataStyles = [
  { name: "赤湯からみそ", area: "南陽市", text: "スープ中央の辛みそを溶かして食べる独自スタイル。龍上海が1958年に発祥。" },
  { name: "冷やしラーメン", area: "山形市", text: "1952年に栄屋本店が考案した日本発祥の冷たいラーメン。夏期限定。" },
  { name: "酒田ラーメン", area: "酒田市", text: "魚介系の透明スープと極薄ワンタン・自家製麺が特徴。2023年ご当地総選挙1位。" },
  { name: "手揉み麺・魚介系", area: "鶴岡市", text: "100軒超が集まるラーメンの街。冬季限定の名店も多い。" },
];

const areas = ["南陽市・赤湯", "山形市", "酒田市", "鶴岡市・庄内"];

export default function YamagataRamenPage() {
  const items = getRamenItemsByRegion("yamagata");
  const rankings = getRamenRankingsByRegion("yamagata");
  const yamagataArticles = getRamenArticles().filter((a) => a.tags.includes("山形"));

  return (
    <div className="ramen-theme">
      <section className="border-b border-orange-100 bg-[linear-gradient(135deg,#fff7eb_0%,#fff_55%,#f8e1c2_100%)]">
        <div className="mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <Badge className="border-orange-200 bg-white text-orange-800">Yamagata Ramen Guide</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-normal text-slate-950 sm:text-5xl">
              山形県のラーメンを、エリア・ジャンル・季節で選ぶ。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
              ラーメン消費量日本一の山形は、からみそ・冷やしラーメン・酒田ラーメン・手揉み麺系と地域ごとにスタイルが異なります。参照ソースと確認日付きで代表店を整理します。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={routes.ramenRanking("yamagata-ramen-essential")}>
                  山形ラーメン必食選<ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#items">店舗一覧</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-orange-200 bg-white/84 p-5 shadow-soft animate-rise">
            <Soup className="h-10 w-10 text-[var(--primary)]" />
            <h2 className="mt-4 text-xl font-semibold">山形ラーメンの概要</h2>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">{items.length}</strong>店舗</div>
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">{rankings.length}</strong>ランキング</div>
              <div className="rounded-md bg-orange-50 p-3"><strong className="block text-lg">日本一</strong>消費量</div>
            </div>
            <div className="mt-5 rounded-md bg-slate-950 p-4 text-sm leading-6 text-white">
              総務省家計調査で山形市が中華そば外食消費額の全国1位を記録。人口10万人あたりのラーメン店数も全国トップクラス。
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <h2 className="section-heading">山形4エリアのラーメンスタイル</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {yamagataStyles.map((style) => (
            <div key={style.name} className="rounded-lg border border-orange-200 bg-white p-4">
              <Badge className="bg-orange-50 text-orange-900">{style.area}</Badge>
              <h3 className="mt-3 font-semibold text-orange-950">{style.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{style.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-wrap items-center gap-3">
          <MapPin className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="section-heading">エリア別に探す</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {areas.map((area) => (
            <Badge key={area} className="bg-white"><MapPin className="mr-1 h-3 w-3" />{area}</Badge>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-5 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="section-heading">目的別ランキング</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rankings.map((ranking) => (
            <RankingCard key={ranking.slug} ranking={ranking} />
          ))}
        </div>
      </section>

      {yamagataArticles.length > 0 && (
        <section className="section-shell">
          <h2 className="section-heading">山形ラーメン記事</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {yamagataArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      <section id="items" className="section-shell">
        <h2 className="section-heading">店舗カード一覧</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          営業時間・定休日・季節限定情報（琴平荘は10〜5月のみ）は変更される可能性があります。各店舗ページの参照ソースと確認日を見たうえで、訪問前に公式情報を確認してください。
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
          <p className="text-sm leading-7 text-orange-950">
            <strong>新潟ラーメンも見る:</strong> 新潟5大ラーメン（あっさり醤油・濃厚味噌・燕背脂など）はこちらで整理しています。
          </p>
          <Button asChild variant="outline" className="mt-3" size="sm">
            <Link href={routes.ramen}>新潟ラーメンガイドへ</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
