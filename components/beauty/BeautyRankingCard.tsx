import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import type { Ranking } from "@/lib/types";
import { routes } from "@/lib/routes";

const RANK_COLORS = [
  "from-amber-400 to-amber-500",
  "from-slate-300 to-slate-400",
  "from-orange-300 to-orange-400",
];

export function BeautyRankingCard({ ranking, index, region }: { ranking: Ranking; index: number; region: string }) {
  return (
    <Link
      href={routes.beautyRanking(region, ranking.slug)}
      className="beauty-card group flex flex-col gap-0 overflow-hidden"
    >
      <div className="beauty-hero-bg p-5">
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${RANK_COLORS[index] ?? "from-[#8b3a7e] to-[#d4819e]"}`}>
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b3a7e]">Ranking</p>
            <h3 className="mt-0.5 text-base font-bold leading-snug text-slate-900">{ranking.title}</h3>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-6 text-slate-600">{ranking.description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-[#f2d5e8] bg-white px-5 py-3">
        <div className="flex gap-1.5">
          {ranking.items.slice(0, 3).map((item) => (
            <span key={item.itemSlug} className="beauty-rank-badge flex h-6 w-6 items-center justify-center text-[10px]">
              {item.rank}
            </span>
          ))}
          {ranking.items.length > 3 && (
            <span className="flex h-6 items-center rounded-full bg-[#fef0f6] px-2 text-[10px] font-semibold text-[#8b3a7e]">
              +{ranking.items.length - 3}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-[#8b3a7e] transition-gap group-hover:gap-2">
          詳しく見る <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
