"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import type { ProteinProduct, ProteinRankingEntry } from "@/lib/types";
import { routes } from "@/lib/routes";
import { NutritionTypeBadge, MacroChip } from "@/components/protein/NutritionBadge";

const MEDAL = ["🥇", "🥈", "🥉"];

export function ProteinRankingEntriesClient({
  entries,
}: {
  entries: { entry: ProteinRankingEntry; product: ProteinProduct }[];
}) {
  return (
    <section className="mt-8 grid gap-5">
      {entries.map(({ entry, product }, i) => (
        <motion.div
          key={product.slug}
          className="protein-card overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
        >
          <div className="grid sm:grid-cols-[220px_1fr]">
            <div className="relative h-48 sm:h-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="220px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent sm:bg-gradient-to-t" />
              <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-sm font-black text-white backdrop-blur-sm">
                {MEDAL[entry.rank - 1] ?? `No.${entry.rank}`}
              </span>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <NutritionTypeBadge type={product.proteinType} />
                <h2 className="text-base font-black text-slate-900">{product.brand}</h2>
              </div>
              <p className="mt-1 text-sm font-bold text-[#1e3a5f]">{product.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{entry.reason}</p>

              <div className="mt-3 grid grid-cols-4 gap-2">
                <MacroChip label="タンパク質" value={product.protein} color="#1e3a5f" />
                <MacroChip label="カロリー" value={product.calories} unit="kcal" color="#f97316" />
                <MacroChip label="炭水化物" value={product.carbs} color="#64748b" />
                <MacroChip label="脂質" value={product.fat} color="#94a3b8" />
              </div>

              <div className="mt-3 grid gap-1 sm:grid-cols-2">
                {product.pros.slice(0, 2).map((p) => (
                  <p key={p} className="flex items-start gap-1 text-[11px] text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />{p}
                  </p>
                ))}
                {product.cons.slice(0, 1).map((c) => (
                  <p key={c} className="flex items-start gap-1 text-[11px] text-slate-500">
                    <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />{c}
                  </p>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div>
                  <p className="text-[10px] text-slate-400">1kg換算</p>
                  <p className="text-lg font-black text-[#1e3a5f]">¥{product.pricePerKg.toLocaleString()}</p>
                </div>
                <Link
                  href={routes.proteinProduct(product.slug)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f] px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
                >
                  商品詳細 <ArrowRight className="h-3 w-3" />
                </Link>
                <a
                  href={product.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700 transition-all hover:bg-orange-100"
                >
                  公式で買う
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
