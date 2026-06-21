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
        "each-spirit-loader isolate flex flex-col items-center justify-center gap-3",
        fullScreen ? "fixed inset-0 z-[90] bg-white/70 p-4 backdrop-blur-sm" : "min-h-[52vh] px-4 py-16",
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <LottieLoader size={compact ? 150 : 208} />
      <p className="text-center text-sm font-semibold text-slate-700">{label}</p>
    </div>
  );
}
