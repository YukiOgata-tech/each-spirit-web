import type { Treatment } from "@/lib/types";

const TREATMENT_META: Record<Treatment, { label: string; className: string }> = {
  cut:          { label: "カット",     className: "bg-slate-100 text-slate-700 border-slate-200" },
  color:        { label: "カラー",     className: "bg-violet-50 text-violet-700 border-violet-200" },
  highlight:    { label: "ハイライト", className: "bg-amber-50 text-amber-700 border-amber-200" },
  perm:         { label: "パーマ",     className: "bg-rose-50 text-rose-700 border-rose-200" },
  straightening:{ label: "縮毛矯正",   className: "bg-sky-50 text-sky-700 border-sky-200" },
  treatment:    { label: "トリートメント", className: "bg-teal-50 text-teal-700 border-teal-200" },
  headSpa:      { label: "ヘッドスパ", className: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  hairQuality:  { label: "髪質改善",   className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
};

export function TreatmentBadge({ treatment, size = "sm" }: { treatment: Treatment; size?: "sm" | "xs" }) {
  const meta = TREATMENT_META[treatment];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 font-medium ${size === "xs" ? "py-0.5 text-[10px]" : "py-1 text-xs"} ${meta.className}`}>
      {meta.label}
    </span>
  );
}
