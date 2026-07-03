import Link from "next/link";
import Image from "next/image";
import { Clapperboard } from "lucide-react";
import { isAllowedImageSrc, shouldUnoptimizeImage } from "@/lib/image-hosts";
import { originLabel, type CatalogTitle } from "@/components/entertainment/labels";

/** 作品カード。画像があれば表示、無ければ原作タイプ別のグラフィックプレースホルダー。 */
export function TitleCard({ title }: { title: CatalogTitle }) {
  const src = title.imageUrl && isAllowedImageSrc(title.imageUrl) ? title.imageUrl : null;

  return (
    <Link
      href={title.href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]">
        {src ? (
          <Image
            src={src}
            alt={title.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
            unoptimized={shouldUnoptimizeImage(src)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--muted),#ffffff)]">
            <Clapperboard className="h-9 w-9 text-[var(--primary)]/40" />
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-white/92 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] shadow-sm">
          {originLabel(title.itemKind)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-950 transition-colors group-hover:text-[var(--primary)]">
          {title.name}
        </h3>
        {title.genres.length > 0 && (
          <p className="line-clamp-1 text-[11px] font-semibold text-slate-500">{title.genres.slice(0, 3).join(" / ")}</p>
        )}
        <p className="line-clamp-2 text-xs leading-5 text-slate-600">{title.description}</p>
      </div>
    </Link>
  );
}
