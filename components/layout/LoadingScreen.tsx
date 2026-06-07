import Image from "next/image";
import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  label?: string;
  fullScreen?: boolean;
  compact?: boolean;
};

export function LoadingScreen({
  label = "Each Spirit が情報を整理しています",
  fullScreen = false,
  compact = false,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "each-spirit-loader isolate flex items-center justify-center",
        fullScreen ? "fixed inset-0 z-[90] bg-slate-950/28 p-4 backdrop-blur-sm" : "min-h-[52vh] px-4 py-16",
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className={cn("loader-panel", compact ? "scale-90" : "")}>
        <div className="loader-orbit" aria-hidden="true">
          <span className="loader-ring loader-ring-one" />
          <span className="loader-ring loader-ring-two" />
          <Image src="/brand/each-spirit-mark.png" alt="" width={96} height={96} className="loader-logo" priority />
        </div>
        <div className="mt-5 text-center">
          <p className="text-sm font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-xs text-slate-500">おすすめ・比較・参照元を読み込み中</p>
        </div>
        <div className="loader-progress mt-5" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
