import type { Metadata } from "next";
import Image from "next/image";
import { Fingerprint, Radio, ShieldCheck } from "lucide-react";
import { MysteryPuzzleCard } from "@/components/mystery/MysteryPuzzleCard";
import { getMysteryPuzzles } from "@/lib/mystery";
import { absoluteUrl, routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "謎解き局",
  description: "Each Spiritの謎解き・暗号コンテンツ。公開中の問題を解き、正解者記録へ名前を残せます。",
  alternates: { canonical: routes.mystery },
  openGraph: {
    title: "謎解き局 | Each Spirit",
    description: "未解決の事件ファイルを開き、暗号に挑戦。",
    url: absoluteUrl(routes.mystery),
    images: [{ url: absoluteUrl("/mystery/mystery-hero.webp"), width: 1728, height: 920 }],
  },
};

export default async function MysteryIndexPage() {
  const puzzles = await getMysteryPuzzles();
  const openCount = puzzles.filter((puzzle) => puzzle.status === "published").length;
  const solvedCount = puzzles.reduce((total, puzzle) => total + puzzle.solveCount, 0);

  return (
    <div className="mystery-theme min-h-screen bg-[#151514] text-stone-100">
      <section className="relative min-h-[390px] overflow-hidden border-b border-stone-700" aria-labelledby="mystery-title">
        <Image src="/mystery/mystery-hero.webp" alt="暗号盤と日本地図が置かれた調査机" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[390px] w-[min(1180px,calc(100%-40px))] items-center py-12 max-sm:w-[calc(100%-24px)]">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-red-400">
              <Fingerprint className="h-6 w-6" />
              <span className="mystery-label">EACH SPIRIT / CIPHER DESK</span>
            </div>
            <h1 id="mystery-title" className="mystery-display mt-5 text-5xl font-black leading-none text-stone-50 sm:text-7xl">謎解き局</h1>
            <p className="mt-5 max-w-lg border-l-2 border-red-600 pl-4 text-sm font-semibold leading-7 text-stone-200 sm:text-base">
              未解決の事件ファイルを開く。答えに辿り着いた者の名だけが、ここに残る。
            </p>
            <div className="mt-7 flex flex-wrap gap-6 font-mono text-xs text-stone-300">
              <span className="flex items-center gap-2"><Radio className="h-4 w-4 text-red-500" /> OPEN CASES {String(openCount).padStart(2, "0")}</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> DECODED {String(solvedCount).padStart(3, "0")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-40px))] py-12 max-sm:w-[calc(100%-24px)] sm:py-16" aria-labelledby="case-files-heading">
        <div className="flex items-end justify-between gap-6 border-b border-stone-700 pb-5">
          <div>
            <p className="mystery-label text-red-400">ACTIVE ARCHIVE</p>
            <h2 id="case-files-heading" className="mystery-display mt-2 text-2xl font-black text-stone-50 sm:text-3xl">公開事件簿</h2>
          </div>
          <p className="hidden font-mono text-xs text-stone-500 sm:block">UPDATED / {new Date().toLocaleDateString("ja-JP")}</p>
        </div>

        {puzzles.length > 0 ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {puzzles.map((puzzle, index) => <MysteryPuzzleCard key={puzzle.id} puzzle={puzzle} priority={index < 2} />)}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-stone-600 bg-stone-950 px-6 py-16 text-center">
            <Radio className="mx-auto h-7 w-7 text-stone-500" />
            <h2 className="mt-4 text-lg font-bold text-stone-200">現在、公開中の問題はありません</h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">新しい問題は、完成したものから不定期に公開します。</p>
          </div>
        )}
      </section>
    </div>
  );
}
