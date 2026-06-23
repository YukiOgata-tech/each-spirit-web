import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TagList } from "@/components/cards/TagList";
import { LikeButton } from "@/components/content/LikeButton";
import { isAllowedImageSrc } from "@/lib/image-hosts";
import { isLocationRelevant } from "@/lib/content-models";
import type { MajorTheme } from "@/lib/major-theme";
import type { GenericItem } from "@/lib/types";
import { metaStr } from "./shared";

type HeroProps = { item: GenericItem; majorLabel: string; sectionLabel: string; theme: MajorTheme };

function heroSrc(item: GenericItem): string | null {
  return item.imageUrl && isAllowedImageSrc(item.imageUrl) ? item.imageUrl : null;
}

/** 画像（出典クレジット付き）。画像なしはテーマ別フォールバック。 */
export function HeroImage({ item, className, sizes, theme }: { item: GenericItem; className: string; sizes: string; theme: MajorTheme }) {
  const src = heroSrc(item);
  if (!src) {
    return (
      <div className={`flex items-center justify-center ${className} ${theme.imageFallback}`}>
        <Sparkles className="h-10 w-10 text-[var(--primary)]/45" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={item.imageAlt || item.name} fill priority sizes={sizes} className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_0%,rgba(15,23,42,0.42)_100%)]" />
      {item.imageCredit?.url && (
        <a href={item.imageCredit.url} target="_blank" rel="noreferrer"
           className="absolute bottom-2 right-2 rounded-sm bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm hover:bg-black/65">
          出典: {item.imageCredit.name || "公式"} <ExternalLink className="ml-0.5 inline h-2.5 w-2.5" />
        </a>
      )}
    </div>
  );
}

function HeroBadges({ item, majorLabel, sectionLabel }: { item: GenericItem; majorLabel: string; sectionLabel: string }) {
  const loc = isLocationRelevant(item.itemClass);
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>{majorLabel}</Badge>
      <Badge>{sectionLabel}</Badge>
      {loc && item.area ? <Badge>{item.area}</Badge> : null}
    </div>
  );
}

function HeroText({ item, majorLabel, sectionLabel, tagMax }: HeroProps & { tagMax: number }) {
  return (
    <>
      <HeroBadges item={item} majorLabel={majorLabel} sectionLabel={sectionLabel} />
      <h1 data-speakable="title" className="mt-4 text-[1.75rem] font-black leading-[1.12] tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">{item.name}</h1>
      <p data-speakable="description" className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">{item.description}</p>
      <TagList tags={item.tags} max={tagMax} className="mt-4" />
    </>
  );
}

const heroShell = (theme: MajorTheme) =>
  `overflow-hidden rounded-2xl border border-[var(--border)] ${theme.heroSurface} shadow-soft`;

/** 既定（来店型・サービス）: テキスト左 × 画像右 */
export function SplitHero(props: HeroProps) {
  const { item, theme } = props;
  return (
    <section className={heroShell(theme)}>
      <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex min-h-[300px] flex-col justify-between p-5 sm:p-8 lg:p-10">
          <div><HeroText {...props} tagMax={6} /></div>
          <LikeButton contentKind="item" targetId={item.id} className="mt-6" />
        </div>
        <HeroImage item={item} className="min-h-[260px] lg:min-h-[440px]" sizes="(min-width:1024px) 50vw, 100vw" theme={theme} />
      </div>
    </section>
  );
}

/** media: 縦ポスター × テキスト */
export function PosterHero(props: HeroProps) {
  const { item, theme } = props;
  const genres = item.genres.slice(0, 6);
  return (
    <section className={heroShell(theme)}>
      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[300px_1fr] lg:items-start">
        <HeroImage item={item} className="aspect-[3/4] w-full max-w-[300px] rounded-xl border border-[var(--border)]" sizes="(min-width:1024px) 300px, 70vw" theme={theme} />
        <div>
          <HeroText {...props} tagMax={8} />
          {genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {genres.map((g) => <span key={g} className="rounded-full border border-[var(--border)] bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">{g}</span>)}
            </div>
          )}
          <LikeButton contentKind="item" targetId={item.id} className="mt-5" />
        </div>
      </div>
    </section>
  );
}

/** product: 画像 × 価格ハイライト */
export function ProductHero(props: HeroProps) {
  const { item, theme } = props;
  return (
    <section className={heroShell(theme)}>
      <div className="grid lg:grid-cols-[0.96fr_1.04fr]">
        <HeroImage item={item} className="min-h-[260px] lg:min-h-[420px]" sizes="(min-width:1024px) 50vw, 100vw" theme={theme} />
        <div className="flex min-h-[300px] flex-col justify-between p-5 sm:p-8 lg:p-10">
          <div>
            <HeroText {...props} tagMax={6} />
            {item.priceRange && (
              <p className="mt-5 inline-block rounded-lg bg-[var(--primary)]/10 px-4 py-2 text-lg font-black text-[var(--primary)]">{item.priceRange}</p>
            )}
          </div>
          <LikeButton contentKind="item" targetId={item.id} className="mt-6" />
        </div>
      </div>
    </section>
  );
}

/** person: 丸アバター × プロフィール */
export function ProfileHero(props: HeroProps) {
  const { item, theme, majorLabel, sectionLabel } = props;
  const role = metaStr(item, "role") ?? sectionLabel;
  return (
    <section className={heroShell(theme)}>
      <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:gap-7 sm:p-10 sm:text-left">
        <HeroImage item={item} className="h-32 w-32 shrink-0 rounded-full border border-[var(--border)] sm:h-40 sm:w-40" sizes="160px" theme={theme} />
        <div>
          <HeroBadges item={item} majorLabel={majorLabel} sectionLabel={sectionLabel} />
          <h1 data-speakable="title" className="mt-3 text-2xl font-black tracking-normal text-slate-950 sm:text-4xl">{item.name}</h1>
          <p className="mt-1 text-sm font-semibold text-[var(--primary)]">{role}</p>
          <p data-speakable="description" className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">{item.description}</p>
          <LikeButton contentKind="item" targetId={item.id} className="mt-4" />
        </div>
      </div>
    </section>
  );
}

/** other: テキストのみ */
export function PlainHero(props: HeroProps) {
  const { item, theme } = props;
  return (
    <section className={heroShell(theme)}>
      <div className="p-6 sm:p-10">
        <HeroText {...props} tagMax={8} />
        <LikeButton contentKind="item" targetId={item.id} className="mt-5" />
      </div>
    </section>
  );
}
