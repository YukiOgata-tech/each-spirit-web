import Link from "next/link";
import { CalendarDays, Newspaper } from "lucide-react";
import type { Article } from "@/lib/types";

// 記事カバーは任意ドメインのURLが入りうるため next/image の host 許可リストを避け、
// プレーン <img> + グラデーション背景で「読み込めない場合も崩れない」ようにする。

const majorLabels: Record<string, string> = {
  food: "グルメ",
  health: "健康",
  beauty: "美容",
  travel: "旅行",
  leisure: "レジャー",
};

const majorChip: Record<string, string> = {
  food: "bg-orange-100 text-orange-800",
  health: "bg-blue-100 text-blue-800",
  beauty: "bg-pink-100 text-pink-800",
  travel: "bg-emerald-100 text-emerald-800",
  leisure: "bg-cyan-100 text-cyan-900",
};

const majorGradient: Record<string, string> = {
  food: "from-orange-100 to-amber-50",
  health: "from-blue-100 to-sky-50",
  beauty: "from-pink-100 to-fuchsia-50",
  travel: "from-emerald-100 to-teal-50",
  leisure: "from-cyan-100 to-sky-50",
};

function labelOf(article: Article) {
  return majorLabels[article.majorCategory ?? ""] ?? article.category;
}
function chipOf(article: Article) {
  return majorChip[article.majorCategory ?? ""] ?? "bg-slate-100 text-slate-700";
}
function gradientOf(article: Article) {
  return majorGradient[article.majorCategory ?? ""] ?? "from-slate-100 to-slate-50";
}

function Cover({ article, className }: { article: Article; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradientOf(article)} ${className ?? ""}`}>
      {article.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverImageUrl}
          alt={article.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Newspaper className="h-7 w-7 text-slate-400/70" />
        </div>
      )}
    </div>
  );
}

/** ニュースアプリ風のトップ記事（画像の上に見出しを重ねる大カード） */
export function NewsFeatureCard({ article, href }: { article: Article; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">
      <div className="relative">
        <Cover article={article} className="aspect-[16/9] w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(15,23,42,0.78)_100%)]" />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${chipOf(article)}`}>{labelOf(article)}</span>
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">{article.title}</h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-white/80">
            <CalendarDays className="h-3.5 w-3.5" />{article.updatedAt}
          </div>
        </div>
      </div>
    </Link>
  );
}

/** ニュースアプリ風のリスト行（左に見出し・右にサムネ）。divide-y のリスト内で使う想定。 */
export function NewsArticleRow({ article, href }: { article: Article; href: string }) {
  return (
    <Link href={href} className="group flex items-start gap-3 py-3 transition focus-visible:outline-none sm:gap-4">
      <div className="min-w-0 flex-1">
        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${chipOf(article)}`}>{labelOf(article)}</span>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-slate-950 transition-colors group-hover:text-[var(--primary)] sm:text-base">{article.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <CalendarDays className="h-3 w-3" />{article.updatedAt}
        </div>
      </div>
      <Cover article={article} className="h-[68px] w-[92px] shrink-0 rounded-md sm:h-[76px] sm:w-28" />
    </Link>
  );
}
