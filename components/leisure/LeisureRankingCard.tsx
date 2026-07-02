import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ListChecks, Trophy } from "lucide-react";
import type { LeisureRanking } from "@/lib/types";
import { ogRankingImage, routes } from "@/lib/routes";
import { safeImageSrc } from "@/lib/image-hosts";
import { Badge } from "@/components/ui/badge";

export function LeisureRankingCard({
  region,
  ranking,
}: {
  region: string;
  ranking: LeisureRanking;
}) {
  // ランキング専用画像が無ければ thumbnail-og.jpg にタイトルを合成した自動画像へフォールバック。
  const hero = safeImageSrc(ranking.imageUrl, ogRankingImage(ranking.title));
  const criteria = ranking.criteria.slice(0, 3);

  return (
    <Link
      href={routes.leisureRanking(region, ranking.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={hero}
          alt={ranking.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/12 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white/92 px-2.5 py-1 text-xs font-bold text-[var(--primary)] shadow-sm backdrop-blur">
          <Trophy className="h-3.5 w-3.5" />
          ランキング
        </div>
        {ranking.items.length > 0 && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-slate-950/55 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
            <ListChecks className="h-3.5 w-3.5" />
            {ranking.items.length}スポット
          </div>
        )}
        <h3 className="absolute bottom-3 left-3 right-3 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
          {ranking.title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{ranking.description}</p>

        {criteria.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {criteria.map((c) => (
              <Badge key={c} className="bg-cyan-50 text-cyan-900">{c}</Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-1">
          {ranking.lastUpdatedAt && (
            <span className="text-xs text-slate-400">更新 {ranking.lastUpdatedAt}</span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] sm:text-sm">
            ランキングを見る
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
