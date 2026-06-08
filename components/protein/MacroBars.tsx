"use client";

import { motion } from "framer-motion";

type Props = { protein: number; carbs: number; fat: number; calories: number };

const bars = (p: number, c: number, f: number) => {
  const max = Math.max(p + c + f, 30);
  return [
    { label: "タンパク質", value: p, color: "#1e3a5f", pct: (p / max) * 100 },
    { label: "炭水化物",   value: c, color: "#f97316", pct: (c / max) * 100 },
    { label: "脂質",       value: f, color: "#64748b", pct: (f / max) * 100 },
  ];
};

export function MacroBars({ protein, carbs, fat, calories }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
        <span>1食あたりのマクロ栄養素</span>
        <span className="text-[#f97316] font-black">{calories} kcal</span>
      </div>
      {bars(protein, carbs, fat).map(({ label, value, color, pct }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-20 text-xs font-semibold text-slate-600 shrink-0">{label}</span>
          <div className="macro-bar-track flex-1">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="w-10 text-right text-xs font-black" style={{ color }}>{value}g</span>
        </div>
      ))}
    </div>
  );
}
