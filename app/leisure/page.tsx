import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPinned } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategory, getLeisureRegions } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "レジャー・お出かけスポットおすすめ比較ガイド｜人気の遊び場ランキングと選び方",
  description: "新潟を中心に、アウトドア、インドア、雨の日、子連れ、車なしで選べるレジャースポットを整理するカテゴリページです。",
  path: routes.leisure,
});

const regionNames: Record<string, string> = {
  niigata: "新潟",
};

const regionImages: Record<string, { src: string; alt: string }> = {
  niigata: {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    alt: "新潟レジャーを想起させる山と自然の風景",
  },
};

export default async function LeisurePage() {
  const category = getCategory("leisure");
  const regions = await getLeisureRegions();

  return (
    <div className="leisure-theme">
      <section className="border-b border-cyan-100 bg-[linear-gradient(135deg,#ecfeff_0%,#fff_52%,#fff4e6_100%)]">
        <div className="mx-auto grid w-[min(1360px,calc(100%-40px))] gap-8 py-12 max-sm:w-[min(1360px,calc(100%-24px))] lg:grid-cols-[1fr_0.8fr]">
          <div>
            <Badge className="border-cyan-200 bg-white text-cyan-800">Leisure Guide</Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-normal text-slate-950 sm:text-5xl">
              天候と同行者で選ぶ、地域別レジャースポット。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700">
              アウトドア、インドア、雨の日、子連れ、車なしなど、実際の予定に合わせて選べるようにスポット情報とランキングを整理します。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild><Link href={routes.leisureRegion("niigata")}>新潟のレジャーを見る<ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline"><Link href="#regions">地域一覧</Link></Button>
            </div>
          </div>
          <div className="rounded-lg border border-cyan-200 bg-white/86 p-5 shadow-soft">
            <MapPinned className="h-10 w-10 text-[var(--primary)]" />
            <h2 className="mt-4 text-xl font-semibold">検索軸</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {category?.searchFacets.map((facet) => <Badge key={facet} className="bg-cyan-50 text-cyan-900">{facet}</Badge>)}
            </div>
            <div className="mt-5 rounded-md bg-slate-950 p-4 text-sm leading-6 text-white">
              今後: {category?.plannedTopics.join(" / ")}
            </div>
          </div>
        </div>
      </section>

      <section id="regions" className="section-shell">
        <div className="mb-5">
          <p className="section-kicker">Regions</p>
          <h2 className="section-heading mt-2">公開中の地域</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {regions.map((region) => (
            <Link key={region} href={routes.leisureRegion(region)} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative aspect-[16/9]">
                <Image
                  src={regionImages[region]?.src ?? regionImages.niigata.src}
                  alt={regionImages[region]?.alt ?? regionImages.niigata.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/58 to-transparent" />
                <Badge className="absolute bottom-3 left-3 bg-white text-cyan-900">{regionNames[region] ?? region}</Badge>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-950">{regionNames[region] ?? region}のおすすめレジャー</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">屋外・屋内・雨の日・子連れを分けて、公式情報ベースで比較します。</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
