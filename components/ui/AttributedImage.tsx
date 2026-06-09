import Image from "next/image";
import { ExternalLink } from "lucide-react";

export type ImageCredit = { name: string; url: string };

/** Unsplash・ローカル画像は attribution 不要。それ以外は公式サイトとして扱う */
export function resolveCredit(src: string, name: string, officialUrl: string): ImageCredit | undefined {
  if (!src) return undefined;
  if (src.includes("unsplash.com") || src.startsWith("/")) return undefined;
  return { name, url: officialUrl };
}

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  credit?: ImageCredit;
  /** hover: 画像ホバー時にオーバーレイ表示 / below: 画像下に小テキスト */
  variant?: "hover" | "below";
  wrapperClassName?: string;
};

export function AttributedImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  priority,
  className,
  credit,
  variant = "below",
  wrapperClassName,
}: Props) {
  const img = fill ? (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
  ) : (
    <Image src={src} alt={alt} width={width!} height={height!} sizes={sizes} priority={priority} className={className} />
  );

  if (!credit) return <>{img}</>;

  if (variant === "hover") {
    return (
      <div className={`group/attr relative ${fill ? "h-full w-full" : ""} ${wrapperClassName ?? ""}`}>
        {img}
        <a
          href={credit.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-black/60 to-transparent px-2.5 py-2 opacity-0 transition-opacity duration-200 group-hover/attr:pointer-events-auto group-hover/attr:opacity-100"
        >
          <span className="flex items-center gap-0.5 rounded-sm bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            出典: {credit.name}
            <ExternalLink className="ml-0.5 h-2.5 w-2.5" />
          </span>
        </a>
      </div>
    );
  }

  // below variant
  return (
    <div className={wrapperClassName}>
      {img}
      <p className="mt-1 text-right text-[10px] leading-relaxed text-slate-400">
        出典:{" "}
        <a
          href={credit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-slate-600 hover:underline"
        >
          {credit.name} 公式サイト
        </a>
      </p>
    </div>
  );
}
