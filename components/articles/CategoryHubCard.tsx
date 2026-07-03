import Link from "next/link";
import Image from "next/image";
import { ogArticleImage, routes } from "@/lib/routes";
import { isAllowedImageSrc, shouldUnoptimizeImage } from "@/lib/image-hosts";

/**
 * /articles のカテゴリハブ用の画像主体カード。
 * カバー画像があれば背景に敷き、無ければカテゴリ名から自動生成するサムネにフォールバック。
 */
export function CategoryHubCard({
  category,
  count,
  latestUpdatedAt,
  coverImageUrl,
}: {
  category: string;
  count: number;
  latestUpdatedAt: string;
  coverImageUrl?: string;
}) {
  const imageSrc = isAllowedImageSrc(coverImageUrl) ? coverImageUrl! : ogArticleImage(category);

  return (
    <Link
      href={routes.articleCategory(category)}
      className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageSrc}
          alt={category}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          unoptimized={shouldUnoptimizeImage(imageSrc)}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(15,23,42,0.78)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h2 className="line-clamp-1 text-base font-bold tracking-normal text-white sm:text-lg">{category}</h2>
          <p className="mt-0.5 text-[11px] font-medium text-white/80">{count}記事 ・ 更新 {latestUpdatedAt}</p>
        </div>
      </div>
    </Link>
  );
}
