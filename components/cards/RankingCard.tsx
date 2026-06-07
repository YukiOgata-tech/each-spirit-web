import Link from "next/link";
import { Trophy } from "lucide-react";
import type { Ranking } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RankingCard({ ranking }: { ranking: Ranking }) {
  return (
    <Card className="h-full border-[var(--border)]">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
          <Trophy className="h-4 w-4" />
          Ranking
        </div>
        <CardTitle>{ranking.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-slate-600">{ranking.description}</p>
        <Button asChild size="sm">
          <Link href={routes.ramenRanking(ranking.slug)}>ランキングを見る</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
