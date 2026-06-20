import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy } from "lucide-react";
import type { Ranking } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Card, CardContent } from "@/components/ui/card";

export function RankingCard({ ranking, href }: { ranking: Ranking; href?: string }) {
  return (
    <Link
      href={href ?? routes.ramenRanking(ranking.slug)}
      className="group block h-full rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      <Card className="h-full overflow-hidden border-[var(--border)] p-0 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[var(--primary)]/40 group-hover:shadow-md">
        <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,var(--muted),#ffffff)]">
          {ranking.imageUrl ? (
            <Image
              src={ranking.imageUrl}
              alt={ranking.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Trophy className="h-10 w-10 text-[var(--primary)]/45" />
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,23,42,0.55)_100%)]" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)] shadow-sm">
            <Trophy className="h-3.5 w-3.5" />Ranking
          </span>
          {ranking.region && (
            <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white">{ranking.region}</span>
          )}
        </div>
        <CardContent className="space-y-2 p-4 sm:space-y-3 sm:p-5">
          <h3 className="text-lg font-bold leading-snug tracking-normal text-slate-950 transition-colors duration-200 group-hover:text-[var(--primary)]">
            {ranking.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{ranking.description}</p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] sm:text-sm">
            ランキングを見る
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 sm:h-4 sm:w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
