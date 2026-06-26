"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gem, Palette, Scissors, Wind } from "lucide-react";
import { routes } from "@/lib/routes";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

const FLOAT_PILLS = [
  { icon: Scissors, label: "カット",     delay: 0,    x: "8%",  y: "22%", rotate: -8  },
  { icon: Palette,  label: "カラー",     delay: 0.7,  x: "72%", y: "8%",  rotate: 6   },
  { icon: Wind,     label: "ヘッドスパ", delay: 1.4,  x: "80%", y: "68%", rotate: -4  },
  { icon: Gem,      label: "髪質改善",   delay: 0.4,  x: "12%", y: "76%", rotate: 10  },
];

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", alt: "サロン内装" },
  { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", alt: "カラー施術" },
  { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", alt: "ヘッドスパ" },
  { src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80", alt: "バレイヤージュ" },
];

export function BeautyHero({ salonCount, rankingCount, region, firstRankingSlug }: { salonCount: number; rankingCount: number; region: string; firstRankingSlug: string }) {
  return (
    <section className="beauty-theme relative overflow-hidden border-b border-[#f2d5e8] beauty-hero-bg">
      {/* floating decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#f8c8df]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#e8d0f0]/30 blur-3xl" />

      {/* floating pills */}
      {FLOAT_PILLS.map(({ icon: Icon, label, delay, x, y, rotate }) => (
        <motion.div
          key={label}
          className="beauty-glass absolute hidden rounded-full px-3 py-1.5 shadow-md lg:flex items-center gap-1.5"
          style={{ left: x, top: y, rotate }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay, duration: 0.5, ease: "backOut" }}
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1.5"
          >
            <Icon className="h-3.5 w-3.5 text-[#8b3a7e]" />
            <span className="text-[11px] font-bold text-[#8b3a7e]">{label}</span>
          </motion.span>
        </motion.div>
      ))}

      <div className="mx-auto grid w-[min(1360px,calc(100%-40px))] gap-10 py-6 max-sm:w-[min(1360px,calc(100%-24px))] sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

        {/* ── left: text ── */}
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.span
            variants={rise}
            className="inline-block rounded-full border border-[#f2d5e8] bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8b3a7e]"
          >
            Niigata Beauty Guide
          </motion.span>

          <motion.h1
            variants={rise}
            className="mt-5 text-4xl font-black leading-[1.06] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.2rem]"
          >
            新潟の美容室を、<br />
            <span className="beauty-shimmer-text">年代・施術・エリア</span><br />
            で選ぶ。
          </motion.h1>

          <motion.p variants={rise} className="mt-5 max-w-xl text-base leading-8 text-slate-600">
            カラー・髪質改善・ヘッドスパ・パーマ——施術ごとの得意なサロンを、
            年代とエリアを軸に整理。読者の迷いを減らすガイドに育てます。
          </motion.p>

          <motion.div variants={rise} className="mt-7 flex flex-wrap gap-3">
            <Link
              href={routes.beautyRanking(region, firstRankingSlug)}
              className="inline-flex items-center gap-2 rounded-full bg-[#8b3a7e] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#8b3a7e]/25 transition-all hover:-translate-y-0.5 hover:bg-[#7a3370] hover:shadow-xl"
            >
              年代別ランキングを見る <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`#salons`}
              className="inline-flex items-center gap-2 rounded-full border border-[#f2d5e8] bg-white px-5 py-2.5 text-sm font-bold text-[#8b3a7e] transition-all hover:-translate-y-0.5 hover:border-[#d4819e] hover:shadow-md"
            >
              サロン一覧を見る
            </Link>
          </motion.div>

          <motion.div variants={rise} className="mt-8 flex gap-6">
            {[
              { num: salonCount,   label: "掲載サロン" },
              { num: rankingCount, label: "ランキング" },
              { num: 2,            label: "ガイド記事" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-[#8b3a7e]">{num}</p>
                <p className="text-[11px] font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── right: image mosaic ── */}
        <motion.div
          className="relative hidden lg:grid"
          style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "200px 200px", gap: "10px" }}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              className="relative overflow-hidden rounded-2xl shadow-xl"
              style={{ gridRow: i === 0 ? "1 / 3" : "auto", gridColumn: i === 0 ? "1" : "2" }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="240px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          ))}
          {/* glass overlay card */}
          <motion.div
            className="beauty-glass absolute -bottom-4 -left-6 rounded-xl px-4 py-3 shadow-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="text-[11px] font-semibold text-slate-500">参照元付きで掲載</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">ソース確認日を明記</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
