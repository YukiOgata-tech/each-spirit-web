import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { ogArticleImage, routes } from "@/lib/routes";
import { isAllowedImageSrc } from "@/lib/image-hosts";

/**
 * 記事一覧用のニュースアプリ型の行（左にタイトル＋メタ、右にサムネイル）。
 * モバイルは divide-y の密なリスト、デスクトップ（lg）は2カラムのカード grid を想定。
 * 画像は coverImageUrl → タイトルから自動生成するサムネ（/api/og/article）の順でフォールバック。
 */
export function ArticleListItem({ article, href }: { article: Article; href?: string }) {
  const link = href ?? routes.articleByCategory(article.category || "general", article.slug);
  const cover = isAllowedImageSrc(article.coverImageUrl) ? article.coverImageUrl! : undefined;
  const imageSrc = cover ?? ogArticleImage(article.title);

  return (
    <Link
      href={link}
      className="group flex items-start gap-2 py-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 sm:gap-4 lg:rounded-xl lg:border lg:border-slate-200 lg:bg-white lg:p-3 lg:py-3 lg:hover:-translate-y-0.5 lg:hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug tracking-normal text-slate-900 transition-colors group-hover:text-[var(--primary)] sm:text-base">
          {article.title}
        </h3>
        <p className="mt-1.5 hidden line-clamp-2 text-sm leading-6 text-slate-500 sm:block">
          {article.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">{article.category || "general"}</span>
          <span>更新 {article.updatedAt}</span>
        </div>
      </div>

      <div className="relative aspect-16/10 w-28 shrink-0 overflow-hidden rounded-none bg-slate-100 sm:w-40">
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          sizes="(min-width: 640px) 160px, 112px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
