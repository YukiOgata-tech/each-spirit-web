import type { ProteinType } from "@/lib/types";

const TYPE_META: Record<ProteinType, { label: string; className: string }> = {
  "whey-wpc":    { label: "ホエイ WPC",    className: "bg-blue-50 text-blue-700 border-blue-200" },
  "whey-wpi":    { label: "ホエイ WPI",    className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  casein:        { label: "カゼイン",       className: "bg-slate-50 text-slate-700 border-slate-200" },
  soy:           { label: "ソイ",           className: "bg-green-50 text-green-700 border-green-200" },
  pea:           { label: "ピー",           className: "bg-lime-50 text-lime-700 border-lime-200" },
  "plant-blend": { label: "植物性ブレンド", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export function NutritionTypeBadge({ type }: { type: ProteinType }) {
  const meta = TYPE_META[type];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${meta.className}`}>
      {meta.label}
    </span>
  );
}

export function MacroChip({ label, value, unit = "g", color }: { label: string; value: number; unit?: string; color: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center">
      <span className="text-lg font-black" style={{ color }}>{value}</span>
      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">{unit}</span>
      <span className="text-[10px] font-semibold text-slate-600">{label}</span>
    </div>
  );
}
