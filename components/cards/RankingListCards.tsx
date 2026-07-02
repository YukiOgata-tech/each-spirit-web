import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";
import type { Ranking } from "@/lib/types";
import { ogRankingImage } from "@/lib/routes";
import { safeImageSrc } from "@/lib/image-hosts";

// 最新記事カラム（NewsArticleCard）と視覚言語を揃えたランキング用カード。
// トップページで「フィーチャー1件＋行リスト」の左右対称レイアウトを作るために使う。

const majorLabels: Record<string, string> = {
  food: "グルメ",
  health: "健康",
  beauty: "美容",
  travel: "旅行",
  entertainment: "エンタメ",
  leisure: "レジャー",
};

const majorChip: Record<string, string> = {
  food: "bg-orange-100 text-orange-800",
  health: "bg-blue-100 text-blue-800",
  beauty: "bg-pink-100 text-pink-800",
  travel: "bg-emerald-100 text-emerald-800",
  entertainment: "bg-violet-100 text-violet-800",
  leisure: "bg-cyan-100 text-cyan-900",
};

function labelOf(ranking: Ranking) {
  return majorLabels[ranking.majorCategory ?? ""] ?? "ランキング";
}
function chipOf(ranking: Ranking) {
  return majorChip[ranking.majorCategory ?? ""] ?? "bg-slate-100 text-slate-700";
}

/** ニュースアプリ風のトップランキング（画像の上に見出しを重ねる大カード） */
export function RankingFeatureCard({ ranking, href }: { ranking: Ranking; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[linear-gradient(135deg,var(--muted),#ffffff)]">
        <Image
          src={safeImageSrc(ranking.imageUrl, ogRankingImage(ranking.title))}
          alt={ranking.title}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(15,23,42,0.78)_100%)]" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[var(--accent)] shadow-sm">
          <Trophy className="h-3.5 w-3.5" />ランキング
        </span>
        {ranking.region && (
          <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white">{ranking.region}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${chipOf(ranking)}`}>{labelOf(ranking)}</span>
          <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">{ranking.title}</h3>
        </div>
      </div>
    </Link>
  );
}

/** ニュースアプリ風のリスト行（左に見出し・右にサムネ）。divide-y のリスト内で使う想定。 */
export function RankingRow({ ranking, href }: { ranking: Ranking; href: string }) {
  return (
    <Link href={href} className="group flex items-start gap-3 py-3 transition focus-visible:outline-none sm:gap-4">
      <div className="min-w-0 flex-1">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)]">
          <Trophy className="h-3 w-3" />{labelOf(ranking)}
        </span>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-slate-950 transition-colors group-hover:text-[var(--primary)] sm:text-base">{ranking.title}</h3>
        <p className="mt-1 line-clamp-1 text-[11px] font-medium text-slate-400">{ranking.region ?? ranking.description}</p>
      </div>
      <div className="relative h-[68px] w-[92px] shrink-0 overflow-hidden rounded-md bg-[linear-gradient(135deg,var(--muted),#ffffff)] sm:h-[76px] sm:w-28">
        <Image
          src={safeImageSrc(ranking.imageUrl, ogRankingImage(ranking.title))}
          alt={ranking.title}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
