import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Download,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  Fingerprint,
  Radio,
  Trophy,
  Users,
} from "lucide-react";
import { MysteryAnswerPanel } from "@/components/mystery/MysteryAnswerPanel";
import { MysteryContentRenderer } from "@/components/mystery/MysteryContentRenderer";
import { MysteryDifficulty } from "@/components/mystery/MysteryPuzzleCard";
import {
  getMysteryPuzzle,
  getMysteryPuzzles,
  mysteryAnswerMethodLabel,
  type MysteryAttachment,
} from "@/lib/mystery";
import { absoluteUrl, routes } from "@/lib/routes";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const puzzles = await getMysteryPuzzles();
  return puzzles.map((puzzle) => ({ slug: puzzle.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const puzzle = await getMysteryPuzzle(slug);
  if (!puzzle) return { title: "問題が見つかりません" };
  const path = routes.mysteryPuzzle(puzzle.slug);

  return {
    title: `${puzzle.title} | 謎解き局`,
    description: puzzle.excerpt,
    alternates: { canonical: path },
    openGraph: {
      title: `${puzzle.title} | 謎解き局`,
      description: puzzle.excerpt,
      url: absoluteUrl(path),
      images: [{ url: absoluteUrl(puzzle.heroImageUrl || "/mystery/mystery-hero.webp"), width: 1728, height: 920 }],
    },
  };
}

function attachmentIcon(type: MysteryAttachment["fileType"]) {
  if (type === "image") return FileImage;
  if (type === "audio") return FileAudio;
  if (type === "archive") return FileArchive;
  return FileText;
}

function formatSolvedAt(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default async function MysteryPuzzlePage({ params }: PageProps) {
  const { slug } = await params;
  const puzzle = await getMysteryPuzzle(slug);
  if (!puzzle) notFound();

  const closed = puzzle.status === "closed" || Boolean(puzzle.closesAt && new Date(puzzle.closesAt).getTime() <= Date.now());

  return (
    <div className="mystery-theme min-h-screen bg-[#151514] text-stone-100">
      <section className="relative min-h-[430px] overflow-hidden border-b border-stone-700" aria-labelledby="case-title">
        <Image
          src={puzzle.heroImageUrl || "/mystery/mystery-hero.webp"}
          alt="暗号盤と調査資料が置かれた机"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-[430px] w-[min(1180px,calc(100%-40px))] items-end pb-12 pt-16 max-sm:w-[calc(100%-24px)] sm:pb-16">
          <div className="max-w-3xl">
            <Link href={routes.mystery} className="inline-flex items-center gap-2 text-xs font-bold text-stone-300 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              事件簿へ戻る
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="border border-red-500 bg-red-950/70 px-3 py-1.5 font-mono text-xs font-black text-red-100 backdrop-blur-sm">
                CASE {String(puzzle.caseNumber).padStart(3, "0")}
              </span>
              <MysteryDifficulty value={puzzle.difficulty} />
              {closed && <span className="bg-stone-100 px-3 py-1.5 font-mono text-xs font-black text-stone-950">CLOSED</span>}
            </div>
            <h1 id="case-title" className="mystery-display mt-5 text-4xl font-black leading-tight text-stone-50 sm:text-6xl">{puzzle.title}</h1>
            <p className="mt-4 max-w-2xl border-l-2 border-red-600 pl-4 text-sm font-semibold leading-7 text-stone-200 sm:text-base">{puzzle.excerpt}</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-stone-300">
              {puzzle.estimatedMinutes && <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-amber-400" /> 約{puzzle.estimatedMinutes}分</span>}
              <span className="flex items-center gap-2"><Radio className="h-4 w-4 text-red-400" /> {mysteryAnswerMethodLabel[puzzle.answerMethod]}</span>
              {puzzle.answerPolicy === "official" ? (
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-emerald-400" /> 解読者 {puzzle.solveCount}名</span>
              ) : (
                <span className="flex items-center gap-2"><Fingerprint className="h-4 w-4 text-amber-400" /> 判定のみ・記録なし</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-8 py-10 max-sm:w-[calc(100%-24px)] lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:py-16">
        <article className="min-w-0">
          <div className="mystery-dossier">
            <header className="flex items-center justify-between gap-4 border-b border-stone-300 pb-4">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-red-800" />
                <div>
                  <p className="font-mono text-[10px] font-bold text-stone-500">EVIDENCE DOCUMENT</p>
                  <h2 className="mt-0.5 text-lg font-black text-stone-950">問題文</h2>
                </div>
              </div>
              <span className="font-mono text-[10px] text-stone-400">ES-C{String(puzzle.caseNumber).padStart(4, "0")}</span>
            </header>

            <MysteryContentRenderer puzzle={puzzle} closed={closed} />

            {puzzle.attachments.length > 0 && (
              <section className="mt-10 border-t border-stone-300 pt-6" aria-labelledby="attachments-heading">
                <p className="font-mono text-[10px] font-bold text-red-800">ATTACHED EVIDENCE</p>
                <h2 id="attachments-heading" className="mt-1 text-lg font-black text-stone-950">添付資料</h2>
                <div className="mt-4 divide-y divide-stone-300 border-y border-stone-300">
                  {puzzle.attachments.map((attachment) => {
                    const Icon = attachmentIcon(attachment.fileType);
                    return (
                      <a key={attachment.id} href={attachment.fileUrl} target="_blank" rel="noreferrer" className="group flex min-h-16 items-center gap-3 py-3 text-stone-800 transition hover:text-red-800">
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold">{attachment.label}</span>
                          {attachment.description && <span className="mt-0.5 block text-xs leading-5 text-stone-500">{attachment.description}</span>}
                        </span>
                        <Download className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5" />
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </article>

        <aside className="lg:sticky lg:top-32">
          <MysteryAnswerPanel
            slug={puzzle.slug}
            contentModel={puzzle.contentModel}
            answerMethod={puzzle.answerMethod}
            answerPolicy={puzzle.answerPolicy}
            answerConfig={puzzle.answerConfig}
            hints={puzzle.hints}
            closed={closed}
          />
        </aside>
      </div>

      {puzzle.answerPolicy === "official" && <section className="border-t border-stone-700 bg-stone-950 py-12 sm:py-16" aria-labelledby="solver-board-heading">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-sm:w-[calc(100%-24px)]">
          <div className="flex items-end justify-between gap-6 border-b border-stone-700 pb-5">
            <div>
              <p className="mystery-label text-amber-400">SOLVER RECORD</p>
              <h2 id="solver-board-heading" className="mystery-display mt-2 text-2xl font-black text-stone-50">解読者記録</h2>
            </div>
            <Trophy className="h-6 w-6 text-amber-400" />
          </div>

          {puzzle.recentSolves.length > 0 ? (
            <ol className="mt-6 grid gap-px overflow-hidden border border-stone-700 bg-stone-700 sm:grid-cols-2 lg:grid-cols-3">
              {puzzle.recentSolves.map((solve, index) => (
                <li key={solve.id} className="flex min-h-20 items-center gap-4 bg-stone-950 px-4 py-3">
                  <span className="font-mono text-lg font-black text-stone-600">{String(index + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-stone-100">{solve.displayName}</span>
                    <span className="mt-1 block font-mono text-[10px] text-stone-500">{formatSolvedAt(solve.solvedAt)} / HINT {solve.hintCountUsed}</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6 border border-dashed border-stone-700 px-5 py-10 text-center">
              <p className="text-sm font-bold text-stone-300">最初の解読者を待っています</p>
              <p className="mt-2 font-mono text-[11px] text-stone-600">NO VERIFIED SIGNALS</p>
            </div>
          )}
        </div>
      </section>}
    </div>
  );
}
