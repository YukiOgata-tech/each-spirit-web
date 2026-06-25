"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function FortuneScoreVisual({
  score,
  label,
  color,
  fullStars,
  compact = false,
}: {
  score: number;
  label: string;
  color: string;
  fullStars: number;
  compact?: boolean;
}) {
  const progress = Math.max(0, Math.min(100, (score / 5) * 100));
  const zodiac = ["♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎"];

  return (
    <div className={`relative mx-auto grid aspect-square w-full place-items-center ${compact ? "my-1 max-w-[270px] sm:max-w-[300px]" : "my-8 max-w-[560px] sm:my-10 xl:my-auto"}`}>
      <motion.div
        aria-hidden
        className="absolute inset-[2%] rounded-full opacity-85"
        style={{
          background: `conic-gradient(from -42deg, ${color} ${progress}%, rgba(255,255,255,0.09) 0)`,
          filter: `drop-shadow(0 0 26px ${color}66)`,
        }}
        initial={{ rotate: -8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 0.85 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-[8%] rounded-full border border-white/28"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.28) 0deg 1deg, transparent 1deg 15deg)," +
            "radial-gradient(circle, transparent 57%, rgba(255,255,255,0.16) 58%, transparent 60%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-[17%] rounded-full border border-violet-200/25"
        style={{
          background:
            "repeating-conic-gradient(from 10deg, rgba(216,180,254,0.24) 0deg 2deg, transparent 2deg 30deg)," +
            "radial-gradient(circle, rgba(255,255,255,0.06), transparent 58%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 68, repeat: Infinity, ease: "linear" }}
      />
      <svg aria-hidden viewBox="0 0 100 100" className="absolute left-[12%] top-[12%] h-[76%] w-[76%] text-white/75">
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.25" />
        <circle cx="50" cy="50" r="31" fill="none" stroke="currentColor" strokeWidth="0.2" />
        <path d="M50 6 L61 39 L94 50 L61 61 L50 94 L39 61 L6 50 L39 39 Z" fill="none" stroke="currentColor" strokeWidth="0.24" />
        <path d="M22 28 L39 18 L55 30 L70 20 L82 38" fill="none" stroke="currentColor" strokeWidth="0.45" />
        <path d="M21 70 L36 58 L50 66 L65 54 L80 72" fill="none" stroke="currentColor" strokeWidth="0.45" />
        {[22, 39, 55, 70, 82, 21, 36, 50, 65, 80].map((x, index) => {
          const y = index < 5 ? [28, 18, 30, 20, 38][index] : [70, 58, 66, 54, 72][index - 5];
          return <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="currentColor" />;
        })}
      </svg>
      {zodiac.map((sign, index) => {
        const degree = index * 30 - 90;
        const radius = compact ? 43 : 45;
        const x = 50 + Math.cos((degree * Math.PI) / 180) * radius;
        const y = 50 + Math.sin((degree * Math.PI) / 180) * radius;
        return (
          <span
            key={sign}
            aria-hidden
            className="absolute text-[clamp(0.72rem,1.2vw,1.05rem)] font-bold leading-none text-violet-100/80"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              fontFamily: '"Apple Symbols", "Arial Unicode MS", "Times New Roman", serif',
            }}
          >
            {sign}
          </span>
        );
      })}
      <div className="absolute inset-[27%] rounded-full border border-white/15 bg-slate-950/62 shadow-[inset_0_0_56px_rgba(255,255,255,0.08)] backdrop-blur-md" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white">Overall Score</p>
        <p className={`${compact ? "mt-1 text-5xl" : "mt-2 text-6xl sm:text-7xl"} font-bold leading-none tabular-nums`} style={{ color }}>
          {score.toFixed(1)}
        </p>
        <p className="mt-0.5 sm:mt-1 text-sm font-semibold text-white/70">/ 5.0</p>
        <p className="mt-1 sm:mt-3 rounded-full border px-2 sm:px-4 py-0.5 sm:py-1.5 text-sm font-bold" style={{ color, borderColor: `${color}66`, backgroundColor: `${color}1f` }}>
          {label}
        </p>
        <div className={`${compact ? "mt-3" : "mt-4"} flex items-center justify-center gap-1`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={compact ? "h-4 w-4" : "h-5 w-5"}
              style={{
                color,
                fill: index < fullStars ? color : "transparent",
                opacity: index < fullStars ? 1 : 0.28,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
