"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, RefreshCw, Download, Copy, Check, LayoutDashboard, Coins, Gem } from "lucide-react";
import { CATEGORY_LABEL, LEVEL, type FortuneResult } from "@/lib/fortune";
import { classifyCrystal, CRYSTAL_FORMATION_MS } from "@/lib/crystal-form";
import { FortuneDataReport } from "@/components/fortune/FortuneDataReport";

/** 3D チャンク読込中のつなぎ: 回転するリング＋脈動するダイヤ（CSS/motion のみ） */
function CrystalForgePlaceholder() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative grid h-40 w-40 place-items-center">
        <motion.div
          className="absolute inset-0 rounded-full border border-violet-300/40"
          style={{ borderTopColor: "rgba(221,214,254,0.95)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-amber-200/25"
          style={{ borderBottomColor: "rgba(244,194,91,0.8)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="h-12 w-12 rotate-45 rounded-[6px] bg-gradient-to-br from-violet-300/80 to-indigo-400/60 shadow-lg shadow-violet-500/40"
          animate={{ scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// 3D シーンはクライアント専用・遅延ロード（three.js を初期バンドルから分離）
const FateCrystalScene = dynamic(() => import("@/components/fortune/crystal/FateCrystalScene"), {
  ssr: false,
  loading: () => <CrystalForgePlaceholder />,
});

/** 練成中オーバーレイ: 結晶が組み上がる間のキャプション＋プログレスシマー */
function FormingOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[16%] z-20 flex flex-col items-center gap-3 px-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45 }}
        >
          <motion.p
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-5 py-2 text-sm font-bold tracking-wide text-violet-100 backdrop-blur"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Gem className="h-4 w-4 text-violet-300" /> あなたの運命の結晶を練成しています…
          </motion.p>
          <div className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-violet-400 to-amber-200"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: CRYSTAL_FORMATION_MS / 1000, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type ShareControls = {
  onSaveImage: () => void;
  saving: boolean;
  onCopy: () => void;
  copied: boolean;
  xUrl: string;
  lineUrl: string;
};

export function FortuneExperience3D({
  result,
  isGuest,
  awardedPoints,
  onReplay,
  onSwitchMode,
  share,
}: {
  result: FortuneResult;
  isGuest: boolean;
  awardedPoints: number | null;
  onReplay: () => void;
  onSwitchMode: () => void;
  share: ShareControls;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  // モバイルは pin した WebGL 背景が iOS でスクロール固着するため、
  // 別レイアウト（その場回転ヒーロー）に切り替える。
  const [isMobile, setIsMobile] = useState(false);
  const ov = LEVEL[result.overall.band];
  const form = useMemo(() => classifyCrystal(result), [result]);

  // 練成中: シーン内の形成アニメーションと同期して、完成までスコア表示を控える
  const [forming, setForming] = useState(true);
  useEffect(() => {
    setForming(true);
    const id = window.setTimeout(() => setForming(false), CRYSTAL_FORMATION_MS + 300);
    return () => window.clearTimeout(id);
  }, [result]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const hoveredCategory = result.categories.find((c) => c.key === hovered);

  // データレポート＋シェアはモバイル/PC 共通
  const contentSections = (
    <>
      {/* 読みやすい大判データレポート（画面幅に追従） */}
      <section className="pointer-events-auto py-12 sm:py-24">
        <FortuneDataReport result={result} hovered={hovered} onHover={setHovered} />
      </section>

      {/* シェア / 操作 */}
      <section className="pointer-events-auto flex flex-col items-center px-5 pb-24 text-center">
        <p className="text-base font-black tracking-wide text-white/85">この結晶をシェア</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={share.onSaveImage}
            disabled={share.saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            <Download className="h-4 w-4" /> {share.saving ? "生成中…" : "画像を保存"}
          </button>
          <a href={share.xUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-white/90">
            X でシェア
          </a>
          <a href={share.lineUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#06c755] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90">
            LINE
          </a>
          <button onClick={share.onCopy} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
            {share.copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {share.copied ? "コピー済み" : "テキスト"}
          </button>
        </div>
        <p className="mt-3 text-xs text-white/40">画面録画して Reels / ストーリーにも</p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button onClick={onReplay} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-white">
            <RefreshCw className="h-4 w-4" /> もう一度見る
          </button>
          {isGuest && (
            <Link href="/auth/login?next=/fortune" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">
              ログインで結果を保存・ポイント獲得
            </Link>
          )}
        </div>
      </section>
    </>
  );

  // ── モバイル: pin しない「その場回転」ヒーロー（iOS のスクロール固着を回避） ──
  if (isMobile) {
    return (
      <div className="relative">
        <section className="relative h-[60svh] min-h-100 w-full overflow-hidden">
          {/* 回転クリスタル。タッチはスクロールに透過させる */}
          <div className="pointer-events-none absolute inset-0">
            <FateCrystalScene result={result} hovered={null} />
          </div>

          {/* 中央スクリム（文字の可読性） */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[min(640px,96%)] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(58% 50% at 50% 50%, rgba(9,7,24,0.8) 0%, rgba(9,7,24,0.5) 52%, rgba(9,7,24,0) 80%)",
            }}
          />

          {/* 練成中の表示 */}
          <FormingOverlay visible={forming} />

          {/* スコアオーバーレイ（結晶が組み上がってからフェードイン） */}
          <motion.div
            className="text-legible pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center"
            initial={false}
            animate={{ opacity: forming ? 0 : 1, y: forming ? 12 : 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {awardedPoints ? (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/15 px-4 py-1.5 text-sm font-bold text-amber-200">
                <Coins className="h-4 w-4" /> 占いボーナス +{awardedPoints}pt
              </div>
            ) : null}
            <p className="fortune-shimmer-text font-cinzel text-[11px] font-black uppercase tracking-[0.4em]">Fate Crystal</p>
            <h1
              className="font-cinzel mt-2 font-black leading-none tabular-nums text-white"
              style={{
                fontSize: "clamp(3.5rem, 26vw, 6rem)",
                textShadow: `0 0 24px ${ov.color}, 0 0 56px ${ov.color}99, 0 3px 12px rgba(0,0,0,0.6)`,
              }}
            >
              {result.overall.score.toFixed(1)}
            </h1>
            <p className="font-cinzel -mt-1 text-sm font-semibold tracking-widest text-white/70">/ 5.0</p>
            <p
              className="mt-3 inline-block rounded-full border bg-slate-950/55 px-5 py-2 text-base font-bold backdrop-blur-sm"
              style={{ color: ov.color, borderColor: `${ov.color}80` }}
            >
              {ov.label}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/45 px-4 py-1.5 text-xs font-bold text-violet-200 backdrop-blur-sm">
              <Gem className="h-3.5 w-3.5" /> 今日の結晶「{form.label}」
            </p>
          </motion.div>

          {/* モード切替 */}
          <button
            onClick={onSwitchMode}
            className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/55 px-3 py-2 text-xs font-bold text-white/85 backdrop-blur transition hover:bg-slate-950/80"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> シンプル表示
          </button>

          {/* スクロール誘導 */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-1 text-white/70"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <span className="font-cinzel text-[10px] font-bold tracking-[0.3em]">SCROLL</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </section>

        {/* 通常フローのコンテンツ（pin しないので固着しない） */}
        <div className="relative z-10">{contentSections}</div>
      </div>
    );
  }

  // ── PC: ピン留め3Dステージ（結晶は自律的に不規則回転） ──
  return (
    <div className="relative">
      {/* ── ピン留めされた3Dステージ（スクロール中ずっと背後に居る） ── */}
      <div className="pointer-events-none sticky top-0 z-0 -mb-[100svh] h-[100svh] w-full">
        <div className="pointer-events-auto absolute inset-0">
          <FateCrystalScene result={result} hovered={hovered} onHover={setHovered} />
        </div>

        {/* 練成中の表示 */}
        <FormingOverlay visible={forming} />

        {/* ホバー中カテゴリのフローティングラベル */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[12%] -translate-x-1/2 text-center"
          initial={false}
          animate={{ opacity: hoveredCategory ? 1 : 0, y: hoveredCategory ? 0 : 6 }}
          transition={{ duration: 0.25 }}
        >
          {hoveredCategory && (
            <div className="rounded-full border border-white/20 bg-slate-950/60 px-4 py-1.5 backdrop-blur">
              <span className="text-sm font-bold sm:text-base" style={{ color: LEVEL[hoveredCategory.band].color }}>
                {CATEGORY_LABEL[hoveredCategory.key]} {hoveredCategory.score.toFixed(1)}
              </span>
            </div>
          )}
        </motion.div>

        {/* モード切替（フローティング） */}
        <button
          onClick={onSwitchMode}
          className="pointer-events-auto absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/55 px-3 py-2 text-xs font-bold text-white/85 backdrop-blur transition hover:bg-slate-950/80"
        >
          <LayoutDashboard className="h-3.5 w-3.5" /> シンプル表示
        </button>
      </div>

      {/* ── スクロールで重なるコンテンツ ── */}
      <div className="relative z-10">
        {/* ヒーロー（総合運・1画面）。中身以外はクリックを透過し 3D にポインタを届ける */}
        <section className="pointer-events-none relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
          {/* 中央スクリム: 結晶の上でも文字が読めるよう、中心だけ柔らかく暗くする */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[82%] w-[min(760px,96%)] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(58% 50% at 50% 50%, rgba(9,7,24,0.82) 0%, rgba(9,7,24,0.55) 50%, rgba(9,7,24,0) 80%)",
            }}
          />
          <motion.div
            className="text-legible relative z-10 flex flex-col items-center"
            initial={false}
            animate={{ opacity: forming ? 0 : 1, y: forming ? 14 : 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {awardedPoints ? (
              <div className="pointer-events-auto mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/15 px-4 py-1.5 text-sm font-bold text-amber-200">
                <Coins className="h-4 w-4" /> 占いボーナス +{awardedPoints}pt
              </div>
            ) : null}
            <p className="fortune-shimmer-text font-cinzel text-xs font-black uppercase tracking-[0.4em] sm:text-sm">Fate Crystal</p>
            <h1
              className="font-cinzel mt-3 font-black leading-none tabular-nums text-white"
              style={{
                fontSize: "clamp(4rem, 22vw, 8.5rem)",
                textShadow: `0 0 28px ${ov.color}, 0 0 64px ${ov.color}99, 0 3px 12px rgba(0,0,0,0.6)`,
              }}
            >
              {result.overall.score.toFixed(1)}
            </h1>
            <p className="font-cinzel -mt-1 text-base font-semibold tracking-widest text-white/70">/ 5.0</p>
            <p
              className="mt-4 inline-block rounded-full border bg-slate-950/55 px-5 py-2 text-lg font-bold backdrop-blur-sm"
              style={{ color: ov.color, borderColor: `${ov.color}80` }}
            >
              {ov.label}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-950/45 px-4 py-1.5 text-sm font-bold text-violet-200 backdrop-blur-sm">
              <Gem className="h-4 w-4" /> 今日の結晶「{form.label}」
            </p>
            <p className="mt-2 max-w-md text-xs leading-6 text-white/65">{form.description}</p>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-white/90 sm:text-lg sm:leading-9">{result.overall.text}</p>
            <motion.div
              className="mt-12 flex flex-col items-center gap-1 text-white/70"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <span className="font-cinzel text-[11px] font-bold tracking-[0.3em]">SCROLL</span>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </section>

        {contentSections}
      </div>
    </div>
  );
}
