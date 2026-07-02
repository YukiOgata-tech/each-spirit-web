"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MoonStar, Orbit, Copy, Check, ArrowRight, RefreshCw, Download, Coins, BarChart3, Gauge, TrendingUp, Cake, Venus, Mars, CircleUser, Gem } from "lucide-react";
import { siteUrl, routes } from "@/lib/routes";
import {
  CATEGORY_LABEL,
  FORTUNE_GENDERS,
  FORTUNE_GENDER_LABEL,
  LEVEL,
  type FortuneResult,
  type FortuneScore,
  type FortuneInput,
  type FortuneGender,
} from "@/lib/fortune";
import { requestFortune } from "@/app/fortune/actions";
import { FortuneScoreVisual } from "@/components/fortune/FortuneScoreVisual";
import { MobileFortuneResult } from "@/components/fortune/MobileFortuneResult";
import { FortuneCategoryDetails } from "@/components/fortune/FortuneCategoryDetails";
import { FortuneExperience3D } from "@/components/fortune/FortuneExperience3D";
import { createFortuneExportPng } from "@/components/fortune/fortune-export-canvas";
import { trackEvent } from "@/lib/analytics";

const GENDER_ICON: Record<FortuneGender, typeof Venus> = {
  male: Mars,
  female: Venus,
  other: CircleUser,
};

const GUEST_STORAGE_KEY = "es_fortune_guest_v1";
const FORTUNE_LOADING_DURATION_MS = 4200;

// 占い中の 3D ローディング（three.js を初期バンドルから分離。読込中は CSS の光球）
const FortuneLoading3D = dynamic(() => import("@/components/fortune/FortuneLoading3D"), {
  ssr: false,
  loading: () => <LoadingOrbFallback />,
});

type Phase = "input" | "idle" | "loading" | "result";

function fortuneEventParams(result: FortuneResult, isGuest: boolean, source: string) {
  const sortedCategories = [...result.categories].sort((a, b) => b.score - a.score);
  return {
    date: result.date,
    source,
    user_status: isGuest ? "guest" : "member",
    overall_score: result.overall.score,
    overall_band: result.overall.band,
    strongest_category: sortedCategories[0]?.key,
    weakest_category: sortedCategories[sortedCategories.length - 1]?.key,
    lucky_item_type: result.lucky.item?.type,
  };
}

// 星の位置を決定論生成（SSR/CSRで一致させハイドレーション差異を防ぐ）
const STARS = (() => {
  let a = 20260613;
  const rnd = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: 72 }, () => ({
    top: +(rnd() * 100).toFixed(2),
    left: +(rnd() * 100).toFixed(2),
    size: +(1 + rnd() * 2.2).toFixed(2),
    dur: +(2.2 + rnd() * 3.6).toFixed(2),
    delay: +(rnd() * 4).toFixed(2),
    op: +(0.25 + rnd() * 0.6).toFixed(2),
  }));
})();

/** 占い画面のコズミック背景（星空＋漂うネビュラ＋ビネット） */
function FortuneBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10rem] top-24 h-[26rem] w-[26rem] rounded-full bg-purple-400/20 blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8rem] left-1/3 h-[24rem] w-[24rem] rounded-full bg-amber-300/12 blur-[110px]"
        animate={{ x: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          animate={{ opacity: [s.op * 0.3, s.op, s.op * 0.3] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* 流れ星（周期的に斜めへ走る） */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`shoot-${i}`}
          className="absolute h-px w-28 bg-linear-to-r from-white/0 via-white/90 to-white/0"
          style={{ top: `${8 + i * 20}%`, left: "-12%", rotate: "20deg" }}
          animate={{ x: ["0vw", "126vw"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 8 + i * 5, delay: i * 3.5, ease: "easeIn" }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 42%, rgba(7,7,25,0.55) 100%)" }}
      />
    </div>
  );
}

export function FortuneReveal({
  result,
  isGuest,
  awardedPoints = null,
  needsInput = false,
  date,
}: {
  result: FortuneResult | null;
  isGuest: boolean;
  awardedPoints?: number | null;
  needsInput?: boolean;
  date: string;
}) {
  const [phase, setPhase] = useState<Phase>(needsInput ? "input" : "idle");
  const [resultMode, setResultMode] = useState<"3d" | "simple">("3d");
  const [liveResult, setLiveResult] = useState<FortuneResult | null>(result);
  const [liveAwarded, setLiveAwarded] = useState<number | null>(awardedPoints);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 入力が必要なゲストは localStorage 確認まで描画を保留（フォームのちらつき防止）
  const [ready, setReady] = useState(!needsInput);

  // 3D チャンク（ローディング演出・結晶シーン）を先読みしてフェーズ切替を即座にする
  useEffect(() => {
    void import("@/components/fortune/FortuneLoading3D");
    void import("@/components/fortune/crystal/FateCrystalScene");
  }, []);

  // ゲストは当日分の選択・結果を localStorage に保持し、再訪・再実行で固定する
  useEffect(() => {
    if (!needsInput) return;
    if (isGuest) {
      try {
        const raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as { result?: FortuneResult } | null;
          if (saved?.result && saved.result.date === date) {
            setLiveResult(saved.result);
            setPhase("idle");
          }
        }
      } catch {
        /* noop */
      }
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    trackEvent("fortune_start", {
      source: liveResult ? "saved_result" : "unknown",
      user_status: isGuest ? "guest" : "member",
      has_result: !!liveResult,
    });
    setPhase("loading");
    window.setTimeout(() => {
      setPhase("result");
      if (liveResult) {
        trackEvent("fortune_result_view", fortuneEventParams(liveResult, isGuest, "saved_result"));
      }
    }, FORTUNE_LOADING_DURATION_MS);
  }

  async function handleSubmit(input: FortuneInput) {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    trackEvent("fortune_generate_start", {
      user_status: isGuest ? "guest" : "member",
      date,
    });
    try {
      const res = await requestFortune(input);
      setLiveResult(res.result);
      setLiveAwarded(res.awardedPoints);
      trackEvent("fortune_generate", {
        ...fortuneEventParams(res.result, isGuest, "input_submit"),
        awarded_points: res.awardedPoints ?? 0,
      });
      if (isGuest) {
        try {
          window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify({ input, result: res.result }));
        } catch {
          /* noop */
        }
      }
      setPhase("loading");
      window.setTimeout(() => {
        setPhase("result");
        trackEvent("fortune_result_view", fortuneEventParams(res.result, isGuest, "generated_result"));
      }, FORTUNE_LOADING_DURATION_MS);
    } catch {
      trackEvent("fortune_generate_error", {
        user_status: isGuest ? "guest" : "member",
        date,
      });
      setError("運勢の生成に失敗しました。入力内容を確認して、もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="font-jp-serif relative min-h-[calc(100vh-4rem)] overflow-x-hidden text-white"
      style={{
        background:
          "radial-gradient(1200px 720px at 72% -10%, rgba(124,58,237,0.42) 0%, transparent 60%)," +
          "radial-gradient(900px 600px at 8% 16%, rgba(99,102,241,0.30) 0%, transparent 55%)," +
          "radial-gradient(700px 500px at 88% 82%, rgba(244,194,91,0.16) 0%, transparent 58%)," +
          "linear-gradient(180deg, rgba(22,14,48,0.72) 0%, rgba(34,22,62,0.60) 42%, rgba(14,11,32,0.86) 100%)," +
          "url('/images/fortune/meta.jpg') center / cover no-repeat",
      }}
    >
      <FortuneBackdrop />

      <div
        className={
          phase === "result"
            ? resultMode === "3d"
              ? "relative w-full"
              : "relative mx-auto w-[min(1480px,calc(100%-28px))] py-6 sm:w-[min(1480px,calc(100%-40px))] sm:py-8"
            : "relative mx-auto w-[min(720px,calc(100%-28px))] py-7 sm:w-[min(720px,calc(100%-32px))] sm:py-14"
        }
      >
        <AnimatePresence mode="wait">
          {!ready && <FortuneLoading key="hydrate" />}
          {ready && phase === "input" && (
            <InputGate
              key="input"
              date={date}
              isGuest={isGuest}
              submitting={submitting}
              error={error}
              onSubmit={handleSubmit}
            />
          )}
          {ready && phase === "idle" && (
            <IdleView key="idle" onStart={start} date={date} />
          )}
          {ready && phase === "loading" && <FortuneLoading key="loading" />}
          {ready && phase === "result" && liveResult && (
            <ResultView
              key="result"
              result={liveResult}
              isGuest={isGuest}
              awardedPoints={liveAwarded}
              onReplay={start}
              mode={resultMode}
              onToggleMode={() => setResultMode((m) => (m === "3d" ? "simple" : "3d"))}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── 占う前: 誕生日・性別入力ゲート ───────────────────────────────────────────────
function InputGate({
  date,
  isGuest,
  submitting,
  error,
  onSubmit,
}: {
  date: string;
  isGuest: boolean;
  submitting: boolean;
  error: string | null;
  onSubmit: (input: FortuneInput) => void;
}) {
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<FortuneGender | null>(null);
  const canSubmit = !!birthday && !!gender && !submitting;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthday || !gender) return;
    onSubmit({ birthday, gender });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex flex-col items-center pt-2 text-center sm:pt-10"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-white/10 sm:h-20 sm:w-20"
      >
        <Orbit className="h-8 w-8 text-violet-200 sm:h-9 sm:w-9" />
      </motion.div>
      <p className="font-cinzel mt-4 text-xs font-bold uppercase tracking-[0.3em] text-violet-200 sm:mt-5">Daily Fortune</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">今日の運勢</h1>
      <p className="mt-3 max-w-sm text-sm leading-7 text-white/85">
        あなただけの運勢を占うために、<br />
        誕生日と性別を選んでください。
      </p>

      <form onSubmit={submit} className="mt-6 w-full max-w-sm space-y-4 text-left sm:mt-7 sm:space-y-5">
        <div>
          <label htmlFor="fortune-birthday" className="mb-2 flex items-center gap-1.5 text-xs font-bold text-white/90">
            <Cake className="h-4 w-4 text-violet-200" /> 誕生日
          </label>
          <input
            id="fortune-birthday"
            type="date"
            value={birthday}
            max={date}
            min="1900-01-01"
            onChange={(e) => setBirthday(e.target.value)}
            className="block min-w-0 w-full appearance-none rounded-xl border border-white/30 bg-white/16 px-4 py-3 text-base font-semibold text-white outline-none transition focus:border-violet-200 focus:bg-white/[0.22] focus:ring-2 focus:ring-violet-300/35 [color-scheme:dark]"
            required
          />
        </div>

        <div>
          <span className="mb-2 flex items-center gap-1.5 text-xs font-bold text-white/90">
            <CircleUser className="h-4 w-4 text-violet-200" /> 性別
          </span>
          <div className="grid grid-cols-3 gap-2">
            {FORTUNE_GENDERS.map((g) => {
              const Icon = GENDER_ICON[g];
              const active = gender === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-bold transition ${
                    active
                      ? "border-violet-200 bg-violet-500/45 text-white shadow-lg shadow-violet-950/25"
                      : "border-white/25 bg-white/10 text-white/82 hover:border-white/40 hover:bg-white/16 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {FORTUNE_GENDER_LABEL[g]}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-sm font-semibold text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-900/40 transition hover:scale-[1.02] hover:from-violet-400 hover:to-indigo-400 active:scale-95 disabled:cursor-not-allowed disabled:from-slate-500/70 disabled:to-slate-600/70 disabled:text-white/[0.88] disabled:shadow-none disabled:hover:scale-100"
        >
          <MoonStar className="h-5 w-5" /> {submitting ? "占っています…" : "この内容で占う"}
        </button>
      </form>

      <p className="mt-4 max-w-xs text-xs leading-5 text-white/65">
        {isGuest
          ? "今日の結果はこの内容で確定します。何度開いても変わりません。"
          : "プロフィールに保存され、次回からは入力を省略できます。"}
      </p>
    </motion.div>
  );
}

// ── 占う前 ────────────────────────────────────────────────────────────────────
function IdleView({ onStart, date }: { onStart: () => void; date: string }) {
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
        <Orbit className="h-10 w-10 text-violet-300" />
      </motion.div>
      <p className="font-cinzel mt-6 text-xs font-bold uppercase tracking-[0.3em] text-violet-300">Daily Fortune</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">今日の運勢</h1>
      <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
        総合運・恋愛運・金運・仕事運・健康運・対人運・おでかけ運。<br />
        今日のあなたの運勢を 7 つの軸で占います。
      </p>
      <p className="mt-2 text-xs text-white/40">{date}</p>
      <button
        onClick={onStart}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 px-8 py-3.5 text-base font-bold shadow-lg shadow-violet-900/40 transition hover:scale-[1.03] active:scale-95"
      >
        <MoonStar className="h-5 w-5" /> 今日の運勢を占う
      </button>
    </motion.div>
  );
}

// ── 占い中 ────────────────────────────────────────────────────────────────────

/** 3D チャンク読込中のつなぎ（CSS のみの脈動する光球） */
function LoadingOrbFallback() {
  return (
    <div className="grid h-full w-full place-items-center">
      <motion.div
        className="h-24 w-24 rounded-full bg-violet-300/60 blur-xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function FortuneLoading() {
  // ディスプレイ全体を占う空間で満たすテイクオーバー（ヘッダー z-40 の上、ルートローダー z-90 の下）
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-70 bg-[#0b0722]"
    >
      <FortuneLoading3D />
      <div className="pointer-events-none absolute inset-x-0 bottom-[13%] flex justify-center">
        <LoadingCaption />
      </div>
    </motion.div>
  );
}

const LOADING_MESSAGES = [
  "星の巡りを読んでいます…",
  "運命の糸を手繰っています…",
  "結晶の芽を探しています…",
];

function LoadingCaption() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % LOADING_MESSAGES.length), 1400);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="h-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          className="text-sm font-semibold tracking-wide text-white/80"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
        >
          {LOADING_MESSAGES[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ── 結果 ──────────────────────────────────────────────────────────────────────
function ResultView({
  result,
  isGuest,
  awardedPoints,
  onReplay,
  mode,
  onToggleMode,
}: {
  result: FortuneResult;
  isGuest: boolean;
  awardedPoints: number | null;
  onReplay: () => void;
  mode: "3d" | "simple";
  onToggleMode: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const ov = LEVEL[result.overall.band];
  const sortedCategories = [...result.categories].sort((a, b) => b.score - a.score);
  const strongest = sortedCategories[0];
  const focus = sortedCategories[sortedCategories.length - 1];

  const shareUrl = `${siteUrl}${routes.fortune}`;
  const shareText =
    `【今日の運勢】総合運 ${result.overall.score.toFixed(1)}/5.0 ${ov.label}\n` +
    `${result.overall.text}\n` +
    `あなたの今日の運勢は？ → ${shareUrl} #EachSpirit`;

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareText);
      trackEvent("fortune_share_copy", fortuneEventParams(result, isGuest, "text_copy"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  async function saveImage() {
    if (saving) return;
    setSaving(true);
    try {
      const dataUrl = await createFortuneExportPng(result, strongest, focus);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `each-spirit-fortune-${result.date}.png`;
      a.click();
      trackEvent("fortune_image_download", fortuneEventParams(result, isGuest, "result_card"));
    } catch {
      /* noop */
    } finally {
      setSaving(false);
    }
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
  const fullStars = Math.round(result.overall.score);

  if (mode === "3d") {
    return (
      <FortuneExperience3D
        result={result}
        isGuest={isGuest}
        awardedPoints={awardedPoints}
        onReplay={onReplay}
        onSwitchMode={onToggleMode}
        share={{ onSaveImage: saveImage, saving, onCopy: copyShare, copied, xUrl, lineUrl }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* ポイント獲得 */}
      {awardedPoints ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 sm:mb-4 flex items-center justify-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/15 py-2 text-sm font-bold text-amber-200"
        >
          <Coins className="h-4 w-4" /> 今日の占いボーナス +{awardedPoints}pt 獲得！
        </motion.div>
      ) : null}

      <MobileFortuneResult
        result={result}
        overallLevel={ov}
        strongest={strongest}
        focus={focus}
        fullStars={fullStars}
      />

      <div className="hidden xl:block">
        <DesktopResultDashboard
          result={result}
          ov={ov}
          strongest={strongest}
          focus={focus}
          fullStars={fullStars}
        />
      </div>

      {/* シェア */}
      <div className="mt-5 rounded-2xl border border-white/15 bg-slate-950/34 px-2 py-2 sm:p-4 text-center backdrop-blur">
        <p className="text-xs font-semibold text-white/70">- 結果をシェア -</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={saveImage}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
           >
            <Download className="h-4 w-4" /> {saving ? "生成中…" : "画像を保存"}
          </button>
          <a
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("fortune_share_click", fortuneEventParams(result, isGuest, "x"))}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-white/90"
          >
            X でシェア
          </a>
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("fortune_share_click", fortuneEventParams(result, isGuest, "line"))}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#06c755] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          >
            LINE
          </a>
          <button onClick={copyShare} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "コピー済み" : "テキスト"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-white/40">「画像を保存」でSNS向けの結果カードをダウンロードできます</p>
      </div>

      <FortuneCategoryDetails categories={result.categories} />

      {/* フッター操作 */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          onClick={onToggleMode}
          className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition hover:scale-[1.03] active:scale-95"
        >
          <Gem className="h-4 w-4" /> 3Dクリスタルで見る
        </button>
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

function DesktopResultDashboard({
  result,
  ov,
  strongest,
  focus,
  fullStars,
}: {
  result: FortuneResult;
  ov: { label: string; color: string };
  strongest?: FortuneScore;
  focus?: FortuneScore;
  fullStars: number;
}) {
  return (
    <div className="grid w-full gap-5 xl:grid-cols-[minmax(410px,0.9fr)_minmax(0,1.55fr)] 2xl:grid-cols-[minmax(460px,0.85fr)_minmax(0,1.65fr)]">
      <section className="relative min-h-180 overflow-hidden rounded-3xl border border-white/15 bg-slate-950/38 p-6 shadow-2xl shadow-violet-950/35 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(216,180,254,0.24),transparent_42%),radial-gradient(circle_at_16%_80%,rgba(96,165,250,0.18),transparent_36%)]" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-200">Fortune Analytics</p>
              <h1 className="mt-1 text-3xl font-black tracking-normal text-white">今日の運勢レポート</h1>
            </div>
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">{result.date}</div>
          </div>

          <FortuneScoreVisual score={result.overall.score} label={ov.label} color={ov.color} fullStars={fullStars} />

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-center gap-2 text-violet-200">
              <Gauge className="h-4 w-4" />
              <p className="text-xs font-black uppercase tracking-[0.18em]">Reading</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/80">{result.overall.text}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-rows-[auto_1fr_auto]">
        <section className="grid gap-3 lg:grid-cols-2">
          {strongest && (
            <AnalysisTile
              icon={<TrendingUp className="h-4 w-4" />}
              label="今日の強み"
              title={CATEGORY_LABEL[strongest.key]}
              value={strongest.score.toFixed(1)}
              color={LEVEL[strongest.band].color}
              expanded
            />
          )}
          {focus && (
            <AnalysisTile
              icon={<BarChart3 className="h-4 w-4" />}
              label="整えるポイント"
              title={CATEGORY_LABEL[focus.key]}
              value={focus.score.toFixed(1)}
              color={LEVEL[focus.band].color}
              expanded
            />
          )}
        </section>

        <section className="rounded-3xl border border-white/15 bg-slate-950/36 p-6 shadow-xl shadow-violet-950/20 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-200">6 Signals</p>
              <h2 className="text-xl font-black text-white">運勢シグナル分析</h2>
            </div>
            <BarChart3 className="h-5 w-5 text-white/45" />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {result.categories.map((c, i) => (
              <ScoreMeter key={c.key} c={c} delay={0.05 * i} />
            ))}
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <LuckyPanel label="ラッキーカラー">
            <span className="mx-auto mt-2 block h-9 w-9 rounded-full border-2 border-white/30" style={{ backgroundColor: result.lucky.color.hex }} />
            <p className="mt-2 text-xs font-semibold">{result.lucky.color.name}</p>
          </LuckyPanel>
          <LuckyPanel label="ラッキーナンバー">
            <p className="mt-2 text-4xl font-black text-violet-200">{result.lucky.number}</p>
          </LuckyPanel>
          <LuckyPanel label="キーアイテム">
            {result.lucky.item ? (
              <Link href={result.lucky.item.href} className="group mt-2 block">
                {result.lucky.item.image ? (
                  <Image
                    src={result.lucky.item.image}
                    alt={result.lucky.item.name}
                    width={72}
                    height={72}
                    className="mx-auto h-12 w-12 rounded-xl object-cover ring-1 ring-white/20 transition group-hover:ring-white/50"
                  />
                ) : (
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/10">
                    <Gem className="h-5 w-5 text-violet-200" />
                  </span>
                )}
                <span className="mt-1.5 block truncate text-xs font-bold text-violet-200 group-hover:underline">{result.lucky.item.name}</span>
              </Link>
            ) : (
              <p className="mt-2 text-xs text-white/40">—</p>
            )}
          </LuckyPanel>
        </section>
      </div>
    </div>
  );
}

function AnalysisTile({
  icon,
  label,
  title,
  value,
  color,
  expanded = false,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  value: string;
  color: string;
  expanded?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 ${expanded ? "min-h-32 sm:p-5" : ""}`}>
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-2 text-white/50">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.18em]">{label}</p>
      </div>
      <div className="relative mt-3 flex items-end justify-between gap-3">
        <p className={expanded ? "text-lg font-black text-white sm:text-xl" : "text-sm font-black text-white"}>{title}</p>
        <p className={expanded ? "text-4xl font-black tabular-nums" : "text-2xl font-black tabular-nums"} style={{ color }}>{value}</p>
      </div>
    </div>
  );
}

function LuckyPanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center shadow-lg shadow-violet-950/10 backdrop-blur">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
      {children}
    </div>
  );
}

function ScoreMeter({ c, delay }: { c: FortuneScore; delay: number }) {
  const lv = LEVEL[c.band];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-white/10 bg-white/5 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-sm font-black">{CATEGORY_LABEL[c.key]}</span>
          <p className="mt-1 text-xs leading-5 text-white/60">{c.text}</p>
        </div>
        <span className="shrink-0 text-right text-sm">
          <b className="text-lg tabular-nums" style={{ color: lv.color }}>{c.score.toFixed(1)}</b>
          <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: lv.color }}>{lv.label}</span>
        </span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${lv.color}, rgba(255,255,255,0.82))` }}
          initial={{ width: 0 }}
          animate={{ width: `${(c.score / 5) * 100}%` }}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
