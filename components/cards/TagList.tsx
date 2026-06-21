import { cn } from "@/lib/utils";

/** タイトル下に置く軽量タグ表示（#tag の淡いテキスト）。ピルではなく主役=タイトルを引き立てる。 */
export function TagList({ tags, max = 3, className }: { tags: string[]; max?: number; className?: string }) {
  if (!tags?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] font-medium text-slate-400 sm:text-xs", className)}>
      {tags.slice(0, max).map((tag) => (
        <span key={tag} className="transition-colors group-hover:text-[var(--primary)]/70">#{tag}</span>
      ))}
    </div>
  );
}
