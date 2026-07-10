"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, ArrowRight } from "lucide-react";
import type { RankingItem, Salon } from "@/lib/types";
import { routes } from "@/lib/routes";
import { shouldUnoptimizeImage } from "@/lib/image-hosts";
import { TreatmentBadge } from "@/components/beauty/TreatmentBadge";

const MEDAL = ["🥇", "🥈", "🥉"];

export function BeautyRankingEntriesClient({
  entries,
  region,
}: {
  entries: { entry: RankingItem; salon: Salon }[];
  region: string;
}) {
  return (
    <section className="mt-8 grid gap-5">
      {entries.map(({ entry, salon }, i) => (
        <motion.div
          key={salon.slug}
          className="beauty-card overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
        >
          <div className="grid sm:grid-cols-[220px_1fr]">
            <div className="relative h-48 sm:h-full">
              <Image
                src={salon.imageUrl}
                alt={salon.name}
                fill
                unoptimized={shouldUnoptimizeImage(salon.imageUrl)}
                className="object-cover"
                sizes="220px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent sm:bg-gradient-to-t" />
              <span className="beauty-glass absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-black text-[#8b3a7e]">
                {MEDAL[entry.rank - 1] ?? `No.${entry.rank}`}
              </span>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Award className="h-4 w-4 text-[#d4819e]" />
                <h2 className="text-xl font-black text-slate-900">{salon.name}</h2>
                {entry.isPr && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">PR掲載</span>
                )}
              </div>
              <p className="mt-1 text-xs font-semibold text-[#8b3a7e]">{salon.tagline}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{entry.reason}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {salon.treatments.map((t) => (
                  <TreatmentBadge key={t} treatment={t} size="xs" />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-3">
                <span>📍 {salon.area}</span>
                <span>✂️ カット {salon.cutPrice}</span>
                {salon.colorPrice && <span>🎨 カラー {salon.colorPrice}</span>}
                <span>{salon.parking ? "🅿️ 駐車場あり" : "🚃 公共交通"}</span>
                {salon.childrenWelcome && <span>👶 子連れOK</span>}
              </div>
              <Link
                href={routes.beautySalon(region, salon.slug)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#8b3a7e] px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#7a3370]"
              >
                サロン詳細 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
