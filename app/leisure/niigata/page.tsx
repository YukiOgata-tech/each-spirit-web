import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, CloudRain, Mountain, TentTree, Trophy } from "lucide-react";
import { LeisureRankingCard } from "@/components/leisure/LeisureRankingCard";
import { LeisureIcon } from "@/components/leisure/LeisureIcon";
import { LeisureSpotCard } from "@/components/leisure/LeisureSpotCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLeisureRankings, getLeisureSpots } from "@/lib/content";
import { getLeisureVisual } from "@/lib/leisure-visuals";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

const region = "niigata";

export const metadata = pageMetadata({
  title: "新潟のおすすめレジャースポット",
  description: "新潟県内のおすすめレジャースポットを、アウトドア、インドア、雨の日、子連れ、車なしで選べるように整理した地域ページです。",
  path: routes.leisureRegion(region),
});

const areaFacets = ["新潟市", "北区", "秋葉区", "十日町", "湯沢", "弥彦", "長岡", "寺泊", "柏崎", "上越"];
const purposeFacets = ["アウトドア", "インドア", "雨の日", "子連れ", "公共系", "車なし", "写真目的", "半日観光"];

export default async function NiigataLeisurePage() {
  const [spots, rankings] = await Promise.all([getLeisureSpots(region), getLeisureRankings(region)]);
  const outdoorSpots = spots.filter((spot) => spot.kind === "outdoor");
  const indoorSpots = spots.filter((spot) => spot.kind === "indoor");
  const hybridSpots = spots.filter((spot) => spot.kind === "hybrid");
  const heroSpots = ["kiyotsu-gorge-tunnel", "marinepia-nihonkai", "echigo-hillside-park"]
    .map((slug) => spots.find((spot) => spot.slug === slug))
    .filter((spot): spot is NonNullable<typeof spot> => Boolean(spot));

  return (
    <div className="leisure-theme">
      <section className="relative overflow-hidden border-b border-cyan-100 bg-[linear-gradient(135deg,#e6fbff_0%,#fff_54%,#fff0d8_100%)]">
        <div className="mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-10 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge className="border-cyan-200 bg-white text-cyan-800">Niigata Leisure</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-normal text-slate-950 sm:text-5xl">
              新潟のレジャーを、屋外・屋内・雨の日で選ぶ。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
              清津峡や湯沢高原のアウトドアから、水族館・科学館のインドア、子連れや雨の日に使いやすい複合施設まで、公式情報をもとに比較します。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild><Link href={routes.leisureRanking(region, "niigata-leisure-best")}>おすすめランキング<ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline"><Link href="#spots">スポット一覧</Link></Button>
            </div>
          </div>
          <div className="animate-rise">
            <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
              {heroSpots.map((spot, index) => {
                const visual = getLeisureVisual(spot);
                return (
                  <Link
                    key={spot.slug}
                    href={routes.leisureSpot(region, spot.slug)}
                    className={index === 0 ? "group relative min-h-[280px] overflow-hidden rounded-lg shadow-soft sm:row-span-2" : "group relative min-h-[134px] overflow-hidden rounded-lg shadow-soft"}
                  >
                    <Image src={visual.imageUrl} alt={visual.imageAlt} fill priority={index === 0} className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 40vw, 100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/16 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="mb-2 flex w-fit items-center gap-2 rounded-md bg-white/16 px-3 py-1.5 text-xs font-bold backdrop-blur">
                        <LeisureIcon iconKey={visual.iconKey} className="h-4 w-4" />
                        {spot.genre}
                      </div>
                      <p className="text-lg font-bold leading-tight">{spot.name}</p>
                      {index === 0 ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/86">{spot.highlight}</p> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-md border border-cyan-200 bg-white/88 p-3"><strong className="block text-lg">{spots.length}</strong>スポット</div>
              <div className="rounded-md border border-cyan-200 bg-white/88 p-3"><strong className="block text-lg">{outdoorSpots.length}</strong>屋外</div>
              <div className="rounded-md border border-cyan-200 bg-white/88 p-3"><strong className="block text-lg">{indoorSpots.length}</strong>屋内</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="section-heading">エリア別に探す</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {areaFacets.map((facet) => <Badge key={facet} className="bg-white">{facet}</Badge>)}
          </div>
        </div>
        <div>
          <h2 className="section-heading">目的別に探す</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {purposeFacets.map((facet) => <Badge key={facet} className="bg-white">{facet}</Badge>)}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-5 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="section-heading">目的別ランキング</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rankings.map((ranking) => <LeisureRankingCard key={ranking.slug} region={region} ranking={ranking} />)}
        </div>
      </section>

      <section id="spots" className="section-shell">
        <div className="mb-5 flex items-center gap-3">
          <Mountain className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="section-heading">アウトドアレジャー</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {outdoorSpots.map((spot) => <LeisureSpotCard key={spot.slug} region={region} spot={spot} />)}
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-5 flex items-center gap-3">
          <Building2 className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="section-heading">インドア・雨の日レジャー</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {indoorSpots.map((spot) => <LeisureSpotCard key={spot.slug} region={region} spot={spot} />)}
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-5 flex items-center gap-3">
          <TentTree className="h-6 w-6 text-[var(--primary)]" />
          <h2 className="section-heading">複合型・子連れ向け</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {hybridSpots.map((spot) => <LeisureSpotCard key={spot.slug} region={region} spot={spot} />)}
        </div>
      </section>

      <section className="section-shell">
        <div className="rounded-lg border border-cyan-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <CloudRain className="mt-1 h-6 w-6 text-[var(--primary)]" />
            <div>
              <h2 className="text-xl font-semibold">編集方針</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                営業時間、料金、休館日、運行状況は変更される可能性があります。各スポットには確認日と参照ソースを残し、季節営業や予約が必要な施設は詳細ページで注意点を明記します。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
