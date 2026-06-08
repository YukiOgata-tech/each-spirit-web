import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import type { ProteinRanking } from "@/lib/types";
import { routes } from "@/lib/routes";

export function ProteinRankingCard({ ranking, index }: { ranking: ProteinRanking; index: number }) {
  const accentColors = [
    "from-amber-400 to-orange-500",
    "from-slate-300 to-slate-400",
    "from-orange-300 to-amber-400",
  ];
  return (
    <Link
      href={routes.proteinRanking(ranking.target, ranking.slug)}
      className="protein-card group flex flex-col"
    >
      <div className="protein-hero-bg p-5">
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentColors[index] ?? "from-[#1e3a5f] to-[#1d4ed8]"}`}>
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Ranking</p>
            <h3 className="mt-0.5 text-sm font-bold leading-snug text-white">{ranking.title}</h3>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-6 text-blue-200">{ranking.description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-blue-100 bg-white px-5 py-3">
        <div className="flex gap-1.5">
          {ranking.items.slice(0, 3).map((item) => (
            <span key={item.productSlug} className="protein-badge flex h-6 w-6 items-center justify-center text-[10px]">
              {item.rank}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-[#1e3a5f]">
          詳しく見る <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
