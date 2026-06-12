"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Sparkles, Star, Copy, Check, ArrowRight, MapPin, RefreshCw, Download, Coins } from "lucide-react";
import { siteUrl, routes } from "@/lib/routes";
import type { FortuneResult, FortuneScore } from "@/lib/fortune";
import { ShareCard } from "./ShareCard";

const LEVEL: Record<number, { label: string; color: string }> = {
  1: { label: "絶不調", color: "#f87171" },
  2: { label: "低調", color: "#fbbf24" },
  3: { label: "平穏", color: "#94a3b8" },
  4: { label: "好調", color: "#60a5fa" },
  5: { label: "絶好調", color: "#4ade80" },
};

type Phase = "idle" | "loading" | "result";
type RenderMode = "2d" | "3d";

export function FortuneReveal({
  result,
  isGuest,
  renderMode = "2d",
  awardedPoints = null,
}: {
  result: FortuneResult;
  isGuest: boolean;
  renderMode?: RenderMode;
  awardedPoints?: number | null;
}) {
  const [phase, setPhase] = useState<Phase>("idle");

  function start() {
    setPhase("loading");
    window.setTimeout(() => setPhase("result"), 2200);
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#0f172a] text-white">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto w-[min(720px,calc(100%-32px))] py-10 sm:py-14">
        <AnimatePresence mode="wait">
          {phase === "idle" && <IdleView key="idle" onStart={start} date={result.date} mode={renderMode} />}
          {phase === "loading" && (renderMode === "3d" ? <Loading3D key="l3" /> : <Loading2D key="l2" />)}
          {phase === "result" && (
            <ResultView key="result" result={result} isGuest={isGuest} awardedPoints={awardedPoints} onReplay={start} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── 占う前 ────────────────────────────────────────────────────────────────────
function IdleView({ onStart, date, mode }: { onStart: () => void; date: string; mode: RenderMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex flex-col items-center pt-10 text-center sm:pt-16"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="grid h-24 w-24 place-items-center rounded-full border border-white/20 bg-white/5"
      >
        <Sparkles className="h-10 w-10 text-violet-300" />
      </motion.div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-violet-300">Daily Fortune</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">今日の運勢</h1>
      <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
        総合運・恋愛運・金運・仕事運・健康運・対人運・おでかけ運。<br />
        今日のあなたの運勢を 7 つの軸で占います。
      </p>
      <p className="mt-2 text-xs text-white/40">{date} ・ 演出 {mode.toUpperCase()}</p>
      <button
        onClick={onStart}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-8 py-3.5 text-base font-bold shadow-lg shadow-violet-900/40 transition hover:scale-[1.03] active:scale-95"
      >
        <Sparkles className="h-5 w-5" /> 今日の運勢を占う
      </button>
    </motion.div>
  );
}

// ── 占い中: 2D ────────────────────────────────────────────────────────────────
function Loading2D() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center pt-20 text-center">
      <div className="relative h-40 w-40">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-violet-300/40"
            style={{ margin: i * 14 }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 6 - i, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-12 w-12 text-violet-200" />
        </motion.div>
      </div>
      <LoadingCaption />
    </motion.div>
  );
}

// ── 占い中: 3D（CSS 3D / perspective） ────────────────────────────────────────
function Loading3D() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center pt-16 text-center">
      <div style={{ perspective: 700 }} className="relative h-48 w-48">
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateX: 360, rotateY: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        >
          {/* 3D 空間で交差する3リング */}
          <span className="absolute inset-0 rounded-full border-2 border-violet-300/60" style={{ transform: "rotateY(0deg)" }} />
          <span className="absolute inset-0 rounded-full border-2 border-indigo-300/50" style={{ transform: "rotateY(60deg)" }} />
          <span className="absolute inset-0 rounded-full border-2 border-fuchsia-300/50" style={{ transform: "rotateX(60deg)" }} />
        </motion.div>
        {/* 中央のコア */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-16 w-16 rounded-full bg-violet-400/30 blur-md" />
          <Sparkles className="absolute h-12 w-12 text-violet-100" />
        </motion.div>
      </div>
      <LoadingCaption />
    </motion.div>
  );
}

function LoadingCaption() {
  return (
    <motion.p
      className="mt-8 text-sm font-semibold tracking-wide text-white/80"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity }}
    >
      星を読み解いています…
    </motion.p>
  );
}

// ── 結果 ──────────────────────────────────────────────────────────────────────
function ResultView({
  result,
  isGuest,
  awardedPoints,
  onReplay,
}: {
  result: FortuneResult;
  isGuest: boolean;
  awardedPoints: number | null;
  onReplay: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const ov = LEVEL[result.overall.band];

  const shareUrl = `${siteUrl}${routes.fortune}`;
  const shareText =
    `【今日の運勢】総合運 ${result.overall.score.toFixed(1)}/5.0 ${ov.label}\n` +
    `${result.overall.text}\n` +
    `あなたの今日の運勢は？ → ${shareUrl} #EachSpirit`;

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  async function saveImage() {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, width: 1080, height: 1350 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `each-spirit-fortune-${result.date}.png`;
      a.click();
    } catch {
      /* noop */
    } finally {
      setSaving(false);
    }
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
  const fullStars = Math.round(result.overall.score);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* 画像化用カード（画面外） */}
      <ShareCard ref={cardRef} result={result} />

      {/* ポイント獲得 */}
      {awardedPoints ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/15 py-2 text-sm font-bold text-amber-200"
        >
          <Coins className="h-4 w-4" /> 今日の占いボーナス +{awardedPoints}pt 獲得！
        </motion.div>
      ) : null}

      {/* 総合運ヒーロー */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur sm:p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-300">総合運</p>
        <div className="mt-2 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-7 w-7" style={{ color: ov.color, fill: i < fullStars ? ov.color : "transparent" }} />
          ))}
        </div>
        <p className="mt-3 text-5xl font-black tabular-nums" style={{ color: ov.color }}>
          {result.overall.score.toFixed(1)}
          <span className="text-xl font-bold text-white/40"> / 5.0</span>
        </p>
        <p className="mt-1 text-sm font-bold" style={{ color: ov.color }}>{ov.label}</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/80">{result.overall.text}</p>
      </motion.div>

      {/* 各カテゴリ メーター */}
      <div className="mt-5 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-7">
        {result.categories.map((c, i) => (
          <ScoreMeter key={c.key} c={c} delay={0.05 * i} />
        ))}
      </div>

      {/* ラッキー */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">ラッキーカラー</p>
          <span className="mx-auto mt-2 block h-8 w-8 rounded-full border-2 border-white/30" style={{ backgroundColor: result.lucky.color.hex }} />
          <p className="mt-2 text-xs font-semibold">{result.lucky.color.name}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">ラッキーナンバー</p>
          <p className="mt-2 text-3xl font-black text-violet-200">{result.lucky.number}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">ラッキースポット</p>
          {result.lucky.item ? (
            <Link href={result.lucky.item.href} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-200 hover:underline">
              <MapPin className="h-3.5 w-3.5" />
              {result.lucky.item.name.slice(0, 12)}
            </Link>
          ) : (
            <p className="mt-2 text-xs text-white/40">—</p>
          )}
        </div>
      </div>

      {/* シェア */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
        <p className="text-xs font-semibold text-white/70">結果をシェア</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={saveImage}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            <Download className="h-4 w-4" /> {saving ? "生成中…" : "画像を保存"}
          </button>
          <a href={xUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-white/90">
            X でシェア
          </a>
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#06c755] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
            LINE
          </a>
          <button onClick={copyShare} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "コピー済み" : "テキスト"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-white/40">「画像を保存」でQRコード付きの結果カードをダウンロードできます</p>
      </div>

      {/* フッター操作 */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button onClick={onReplay} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-white">
          <RefreshCw className="h-4 w-4" /> もう一度見る
        </button>
        {isGuest && (
          <Link href={`${routes.authLogin}?next=${routes.fortune}`} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">
            ログインで結果を保存・ポイント獲得 <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function ScoreMeter({ c, delay }: { c: FortuneScore; delay: number }) {
  const lv = LEVEL[c.band];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold">{c.label}</span>
        <span className="text-sm">
          <b className="tabular-nums" style={{ color: lv.color }}>{c.score.toFixed(1)}</b>
          <span className="text-white/40"> / 5.0</span>
          <span className="ml-1.5 text-xs font-semibold" style={{ color: lv.color }}>{lv.label}</span>
        </span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: lv.color }}
          initial={{ width: 0 }}
          animate={{ width: `${(c.score / 5) * 100}%` }}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="mt-1.5 text-xs leading-6 text-white/70">{c.text}</p>
    </motion.div>
  );
}
