"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Flame, Zap, Dumbbell, Leaf } from "lucide-react";
import { routes } from "@/lib/routes";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const rise = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };

const FLOAT_PILLS = [
  { icon: Zap,      label: "タンパク質 21g",  delay: 0,    x: "6%",  y: "20%" },
  { icon: Flame,    label: "111 kcal",        delay: 0.6,  x: "72%", y: "10%" },
  { icon: Dumbbell, label: "筋肉維持・増強",  delay: 1.2,  x: "78%", y: "68%" },
  { icon: Leaf,     label: "植物性オプションあり", delay: 0.3, x: "8%", y: "78%" },
];

const TARGETS = [
  { slug: "women",   label: "女性向け",     color: "#ec4899" },
  { slug: "men",     label: "男性向け",     color: "#1d4ed8" },
  { slug: "trainer", label: "トレーナー",   color: "#f97316" },
  { slug: "student", label: "大学生",       color: "#059669" },
  { slug: "diet",    label: "ダイエット",   color: "#7c3aed" },
  { slug: "beginner",label: "初心者",       color: "#0891b2" },
];

export function ProteinHero({ productCount, rankingCount }: { productCount: number; rankingCount: number }) {
  return (
    <section className="protein-hero-bg relative overflow-hidden border-b border-blue-900">
      {/* bg blobs */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      {/* floating pills */}
      {FLOAT_PILLS.map(({ icon: Icon, label, delay, x, y }) => (
        <motion.div
          key={label}
          className="absolute hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 lg:flex"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay, duration: 0.5, ease: "backOut" }}
        >
          <motion.span
            className="flex items-center gap-1.5"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-[11px] font-bold text-white/80">{label}</span>
          </motion.span>
        </motion.div>
      ))}

      <div className="mx-auto w-[min(1360px,calc(100%-40px))] py-14 max-sm:w-[min(1360px,calc(100%-24px))]">
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.span
            variants={rise}
            className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-200"
          >
            Protein Guide Japan
          </motion.span>

          <motion.h1 variants={rise} className="mt-5 text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            目的別に選ぶ、<br />
            <span className="protein-shimmer-text">プロテイン完全ガイド。</span>
          </motion.h1>

          <motion.p variants={rise} className="mt-5 max-w-xl text-base leading-8 text-blue-200">
            女性・男性・ダイエット・初心者まで目的別に、タンパク質量・カロリー・価格の実データで比較。
            あなたに合った1本を見つける。
          </motion.p>

          <motion.div variants={rise} className="mt-6 flex flex-wrap gap-2">
            {TARGETS.map(({ slug, label, color }) => (
              <Link
                key={slug}
                href={routes.proteinTarget(slug)}
                className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-white/10"
                style={{ borderColor: color + "60" }}
              >
                {label}
              </Link>
            ))}
          </motion.div>

          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
            <Link
              href={routes.proteinTarget("beginner")}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-400"
            >
              初心者ガイドを読む <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/20"
            >
              商品一覧を見る
            </Link>
          </motion.div>

          <motion.div variants={rise} className="mt-8 flex gap-8">
            {[
              { num: productCount,  label: "比較商品数" },
              { num: rankingCount,  label: "目的別ランキング" },
              { num: 6,             label: "ターゲット" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-orange-400">{num}</p>
                <p className="text-[11px] font-semibold text-blue-300">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
