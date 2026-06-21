import { cn } from "@/lib/utils";
import { LottieLoader } from "@/components/layout/LottieLoader";

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
      <div className="loader-panel">
        <LottieLoader size={compact ? 132 : 168} />
        <div className="mt-3 text-center">
          <p className="text-sm font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-xs text-slate-500">おすすめ・比較・参照元を読み込み中</p>
        </div>
      </div>
    </div>
  );
}
