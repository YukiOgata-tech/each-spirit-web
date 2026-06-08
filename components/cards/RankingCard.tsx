import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import type { Ranking } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RankingCard({ ranking }: { ranking: Ranking }) {
  return (
    <Link
      href={routes.ramenRanking(ranking.slug)}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-[var(--radius)]"
    >
      <Card className="h-full border-[var(--border)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-orange-300">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
            <Trophy className="h-4 w-4" />
            Ranking
          </div>
          <CardTitle className="transition-colors duration-200 group-hover:text-[var(--primary)]">
            {ranking.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-7 text-slate-600">{ranking.description}</p>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]">
            ランキングを見る
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
