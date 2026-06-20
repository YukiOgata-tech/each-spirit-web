import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { majorCategoryMedia } from "@/lib/category-media";

type HeroAction = { label: string; href: string; primary?: boolean };
type HeroStat = { label: string; value: string | number };

type Variant = "collage" | "panel" | "overlap" | "fullbleed" | "scatter";

type MajorCategoryHeroProps = {
  major: keyof typeof majorCategoryMedia | string;
  variant: Variant;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  actions?: HeroAction[];
  stats?: HeroStat[];
  /** hero 見出しに使うテーマ別グラデーション（section 背景） */
  surfaceClass: string;
};

/** theme var(--muted) を背景にした fill 画像。画像未配置でもレイアウトが崩れない。 */
function HeroImage({ src, alt, sizes, priority, className }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[var(--muted)] ${className ?? ""}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
  );
}

function Actions({ actions }: { actions?: HeroAction[] }) {
  if (!actions?.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
      {actions.map((action) => (
        <Button key={action.href + action.label} asChild variant={action.primary ? "default" : "outline"} className="max-sm:h-10">
          <Link href={action.href}>{action.label}<ArrowRight className="h-4 w-4" /></Link>
        </Button>
      ))}
    </div>
  );
}

function Stats({ stats }: { stats?: HeroStat[] }) {
  if (!stats?.length) return null;
  return (
    <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-white/70 bg-white/80 p-3 text-center shadow-sm backdrop-blur sm:p-4">
          <p className="text-xl font-black text-slate-950 sm:text-2xl">{stat.value}</p>
          <p className="mt-0.5 text-[10px] font-bold text-slate-500 sm:text-[11px]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

const eyebrowClass = "inline-block rounded-full border border-[var(--primary)]/25 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--primary)]";
const titleClass = "mt-4 text-[1.75rem] font-black leading-[1.12] tracking-normal text-slate-950 sm:mt-5 sm:text-4xl lg:text-5xl";
const descClass = "mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8";
const containerClass = "mx-auto w-[min(1360px,calc(100%-40px))] max-sm:w-[calc(100%-24px)]";

export function MajorCategoryHero({ major, variant, eyebrow, title, description, actions, stats, surfaceClass }: MajorCategoryHeroProps) {
  const media = majorCategoryMedia[major];
  const themeClass = media?.themeClass ?? "";
  const [h1, h2, h3] = media?.heroes ?? ["", "", ""];

  // ── fullbleed: hero-1 を全面背景、hero-2/3 を下部の覗きカードに（travel）
  if (variant === "fullbleed") {
    return (
      <section className={`${themeClass} relative overflow-hidden border-b border-[var(--border)] ${surfaceClass}`}>
        <div className="absolute inset-0">
          <HeroImage src={h1} alt="" sizes="100vw" priority className="h-full w-full" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.45)_0%,rgba(15,23,42,0.72)_100%)]" />
        </div>
        <div className={`relative ${containerClass} py-12 sm:py-20 lg:py-[72px]`}>
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90">{eyebrow}</span>
            <h1 className="mt-4 text-[1.75rem] font-black leading-[1.12] tracking-normal text-white sm:mt-5 sm:text-4xl lg:text-5xl">{title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:mt-5 sm:text-base sm:leading-8">{description}</p>
            <Actions actions={actions} />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md sm:gap-4">
            {[h2, h3].map((src, i) => (
              <div key={i} className="group">
                <HeroImage src={src} alt="" sizes="(min-width:640px) 240px, 45vw" className="aspect-[4/3] rounded-lg border border-white/25 shadow-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── overlap: 重なり合うトリオ（beauty）
  if (variant === "overlap") {
    return (
      <section className={`${themeClass} overflow-hidden border-b border-[var(--border)] ${surfaceClass}`}>
        <div className={`grid ${containerClass} gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-[72px]`}>
          <div>
            <span className={eyebrowClass}>{eyebrow}</span>
            <h1 className={titleClass}>{title}</h1>
            <p className={descClass}>{description}</p>
            <Actions actions={actions} />
            <Stats stats={stats} />
          </div>
          <div className="group relative mx-auto h-[300px] w-full max-w-md sm:h-[380px] lg:h-[440px]">
            <HeroImage src={h1} alt="" sizes="(min-width:1024px) 460px, 90vw" priority className="absolute left-0 top-0 h-[72%] w-[72%] rounded-2xl shadow-xl" />
            <HeroImage src={h2} alt="" sizes="(min-width:1024px) 240px, 45vw" className="absolute bottom-0 right-0 h-[60%] w-[56%] rounded-2xl border-4 border-white shadow-2xl" />
            <HeroImage src={h3} alt="" sizes="120px" className="absolute bottom-6 left-2 hidden h-[34%] w-[34%] rounded-xl border-4 border-white shadow-xl sm:block" />
          </div>
        </div>
      </section>
    );
  }

  // ── scatter: 傾けた散らしコラージュ（leisure）
  if (variant === "scatter") {
    const tilts = ["rotate-[-4deg]", "rotate-[3deg]", "rotate-[-2deg]"];
    return (
      <section className={`${themeClass} overflow-hidden border-b border-[var(--border)] ${surfaceClass}`}>
        <div className={`grid ${containerClass} gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-[72px]`}>
          <div>
            <span className={eyebrowClass}>{eyebrow}</span>
            <h1 className={titleClass}>{title}</h1>
            <p className={descClass}>{description}</p>
            <Actions actions={actions} />
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {[h1, h2, h3].map((src, i) => (
              <div key={i} className={`group ${tilts[i]} ${i === 1 ? "z-10 -mt-6" : "mt-2"}`}>
                <HeroImage src={src} alt="" sizes="(min-width:640px) 180px, 30vw" priority={i === 1} className={`rounded-xl border-4 border-white shadow-xl ${i === 1 ? "aspect-[3/4] w-28 sm:w-40" : "aspect-[3/4] w-24 sm:w-32"}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── panel: 大きな1枚 + 2サムネ（health）
  if (variant === "panel") {
    return (
      <section className={`${themeClass} overflow-hidden border-b border-[var(--border)] ${surfaceClass}`}>
        <div className={`grid ${containerClass} gap-8 py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:py-[72px]`}>
          <div className="flex flex-col justify-center">
            <span className={eyebrowClass}>{eyebrow}</span>
            <h1 className={titleClass}>{title}</h1>
            <p className={descClass}>{description}</p>
            <Actions actions={actions} />
            <Stats stats={stats} />
          </div>
          <div className="grid grid-rows-[1.6fr_1fr] gap-3 sm:gap-4">
            <div className="group">
              <HeroImage src={h1} alt="" sizes="(min-width:1024px) 600px, 90vw" priority className="h-full min-h-[180px] rounded-2xl shadow-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="group"><HeroImage src={h2} alt="" sizes="(min-width:1024px) 300px, 45vw" className="aspect-[4/3] rounded-2xl shadow-md" /></div>
              <div className="group"><HeroImage src={h3} alt="" sizes="(min-width:1024px) 300px, 45vw" className="aspect-[4/3] rounded-2xl shadow-md" /></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── collage（既定）: メイン横長 + 2枚（food）
  return (
    <section className={`${themeClass} overflow-hidden border-b border-[var(--border)] ${surfaceClass}`}>
      <div className={`grid ${containerClass} gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-[72px]`}>
        <div>
          <span className={eyebrowClass}>{eyebrow}</span>
          <h1 className={titleClass}>{title}</h1>
          <p className={descClass}>{description}</p>
          <Actions actions={actions} />
          <Stats stats={stats} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="group col-span-2"><HeroImage src={h1} alt="" sizes="(min-width:1024px) 600px, 90vw" priority className="aspect-[16/10] rounded-2xl shadow-lg sm:aspect-[16/9]" /></div>
          <div className="group"><HeroImage src={h2} alt="" sizes="(min-width:1024px) 300px, 45vw" className="aspect-[4/3] rounded-2xl shadow-md" /></div>
          <div className="group"><HeroImage src={h3} alt="" sizes="(min-width:1024px) 300px, 45vw" className="aspect-[4/3] rounded-2xl shadow-md" /></div>
        </div>
      </div>
    </section>
  );
}

export { type HeroAction };
