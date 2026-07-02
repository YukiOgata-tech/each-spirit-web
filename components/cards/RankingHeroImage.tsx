import Image from "next/image";
import { ogRankingImage } from "@/lib/routes";
import { safeImageSrc } from "@/lib/image-hosts";

/**
 * ランキング詳細ページの上部に置くヒーロー画像。
 * `imageUrl` 未設定（または許可外ホスト）のときは、タイトルから自動生成した画像
 * （/api/og/ranking, 1200×630）へフォールバックする。自動画像を欠けさせないよう
 * aspect を 1200/630 に固定し、呼び出し側で max-width を与えて配置する。
 */
export function RankingHeroImage({
  imageUrl,
  title,
  className = "",
}: {
  imageUrl?: string;
  title: string;
  className?: string;
}) {
  const src = safeImageSrc(imageUrl, ogRankingImage(title));
  return (
    <div className={`relative mx-auto aspect-[1200/630] w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] shadow-sm ${className}`}>
      <Image src={src} alt={title} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
    </div>
  );
}
