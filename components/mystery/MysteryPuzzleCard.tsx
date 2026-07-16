import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Fingerprint, Radio, Users } from "lucide-react";
import { mysteryAnswerMethodLabel, type MysteryPuzzleSummary } from "@/lib/mystery";
import { routes } from "@/lib/routes";

export function MysteryDifficulty({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`難易度 ${value} / 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={`h-1.5 w-5 border ${index < value ? "border-red-500 bg-red-500" : "border-stone-600 bg-transparent"}`} />
      ))}
    </span>
  );
}

export function MysteryPuzzleCard({ puzzle, priority = false }: { puzzle: MysteryPuzzleSummary; priority?: boolean }) {
  return (
    <article className="mystery-case-card group">
      <Link href={routes.mysteryPuzzle(puzzle.slug)} className="grid h-full md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative min-h-52 overflow-hidden bg-stone-900">
          <Image
            src={puzzle.heroImageUrl || "/mystery/mystery-hero.webp"}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 768px) 32vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/20" />
          <span className="absolute left-4 top-4 border border-stone-300/50 bg-stone-950/85 px-2.5 py-1 font-mono text-[11px] font-bold text-stone-100 backdrop-blur-sm">
            CASE {String(puzzle.caseNumber).padStart(3, "0")}
          </span>
          {puzzle.status === "closed" && <span className="absolute bottom-4 left-4 bg-stone-100 px-2.5 py-1 font-mono text-[11px] font-black text-stone-950">CLOSED</span>}
        </div>
        <div className="flex min-w-0 flex-col border-t border-stone-700 bg-stone-950 p-5 md:border-l md:border-t-0 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="mystery-label text-red-400">{mysteryAnswerMethodLabel[puzzle.answerMethod]}</span>
            <MysteryDifficulty value={puzzle.difficulty} />
          </div>
          <h2 className="mt-4 text-xl font-black leading-tight text-stone-50 sm:text-2xl">{puzzle.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-400">{puzzle.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-800 pt-4 font-mono text-[11px] text-stone-500">
            {puzzle.estimatedMinutes && <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> 約{puzzle.estimatedMinutes}分</span>}
            {puzzle.answerPolicy === "official" ? (
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 解読 {puzzle.solveCount}名</span>
            ) : (
              <span className="flex items-center gap-1.5"><Fingerprint className="h-3.5 w-3.5" /> 記録なし</span>
            )}
          </div>
          <span className="mt-auto flex items-center justify-between pt-6 text-sm font-bold text-stone-100">
            <span className="flex items-center gap-2"><Radio className="h-4 w-4 text-red-500" /> 事件ファイルを開く</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
