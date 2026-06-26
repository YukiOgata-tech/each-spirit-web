import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { TagList } from "@/components/cards/TagList";
import { getGenericItemsBySection } from "@/lib/content";
import { isAllowedImageSrc } from "@/lib/image-hosts";
import { routes } from "@/lib/routes";

/**
 * region を持たない item（region 列が空）の受け皿一覧。
 * region_mode を required → optional にした section で、エリア未設定の item を
 * 専用 index 上に表示するための汎用ブロック。該当が 0 件なら何も描画しない。
 *
 * region 有りの item は従来どおりエリアカード／region ランディングで扱われるため、
 * このブロックには出さない（重複表示を避ける）。
 */
export async function RegionlessItems({
  majorCategory,
  sectionSlug,
  itemPathSegment,
  itemClass,
  heading = "エリアを問わず掲載",
  kicker = "OTHERS",
  className = "section-shell mx-auto max-w-5xl",
}: {
  majorCategory: string;
  sectionSlug: string;
  itemPathSegment: string;
  /** 指定時はこの item_class のみ表示（旅行アプリなど別ルートの item を除外するため） */
  itemClass?: string;
  heading?: string;
  kicker?: string;
  className?: string;
}) {
  const items = (await getGenericItemsBySection(majorCategory, sectionSlug)).filter(
    (item) => !item.region && (!itemClass || item.itemClass === itemClass)
  );
  if (items.length === 0) return null;

  return (
    <section className={className}>
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-heading mt-2">{heading}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-500">エリアの指定がない掲載先です。</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const href = item.canonicalPath ?? routes.sectionItem(majorCategory, sectionSlug, itemPathSegment, item.slug);
          return (
            <Link
              key={item.slug}
              href={href}
              className="group block h-full overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {isAllowedImageSrc(item.imageUrl) ? (
                  <Image
                    src={item.imageUrl as string}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--muted)]">
                    <Sparkles className="h-8 w-8 text-[var(--primary)]/55" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold tracking-normal text-slate-950 transition group-hover:text-[var(--primary)]">{item.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <TagList tags={item.tags} className="mt-2.5" />
                </div>
                <div className="mt-auto space-y-2 text-sm text-slate-500">
                  {(item.area || item.address) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                      <span>{item.area || item.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
                    詳しく見る
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
