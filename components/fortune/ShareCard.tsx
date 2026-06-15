import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { siteUrl, routes } from "@/lib/routes";
import type { FortuneResult } from "@/lib/fortune";

const LEVEL: Record<number, { label: string; color: string }> = {
  1: { label: "絶不調", color: "#f87171" },
  2: { label: "低調", color: "#fbbf24" },
  3: { label: "平穏", color: "#94a3b8" },
  4: { label: "好調", color: "#60a5fa" },
  5: { label: "絶好調", color: "#4ade80" },
};

const FONT = '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Noto Sans JP", "Yu Gothic", Meiryo, sans-serif';

/**
 * SNS シェア用の画像化カード（html-to-image で PNG キャプチャする対象）。
 * 画面外にレンダリングして固定サイズ(1080x1350)で撮影する。
 * フォント埋め込み問題を避けるためインラインスタイル＋システムフォントで構成。
 */
export const ShareCard = forwardRef<HTMLDivElement, { result: FortuneResult }>(function ShareCard(
  { result },
  ref,
) {
  const ov = LEVEL[result.overall.band];
  const shareUrl = `${siteUrl}${routes.fortune}`;
  const stars = Math.round(result.overall.score);
  const sortedCategories = [...result.categories].sort((a, b) => b.score - a.score);
  const strongest = sortedCategories[0];
  const focus = sortedCategories[sortedCategories.length - 1];
  // 固定サイズカードのレイアウト維持のため長文は要約表示
  const overallText =
    result.overall.text.length > 70 ? `${result.overall.text.slice(0, 69)}…` : result.overall.text;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: "-99999px",
        top: 0,
        width: 1080,
        height: 1350,
        display: "flex",
        flexDirection: "column",
        padding: 58,
        boxSizing: "border-box",
        background:
          "radial-gradient(640px 520px at 78% 8%, rgba(168,85,247,0.36), transparent 62%)," +
          "radial-gradient(720px 520px at 4% 20%, rgba(96,165,250,0.22), transparent 58%)," +
          "linear-gradient(160deg, #17122f 0%, #261952 48%, #10172f 100%)",
        color: "#ffffff",
        fontFamily: FONT,
      }}
    >
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: 7, color: "#c4b5fd" }}>EACH SPIRIT</span>
          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800, letterSpacing: 5, color: "rgba(255,255,255,0.48)" }}>
            FORTUNE ANALYTICS
          </div>
        </div>
        <span style={{ border: "1px solid rgba(255,255,255,0.16)", borderRadius: 999, padding: "14px 22px", fontSize: 22, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)" }}>{result.date}</span>
      </div>

      {/* overall */}
      <div style={{ marginTop: 30, border: "1px solid rgba(255,255,255,0.14)", borderRadius: 42, background: "rgba(15,23,42,0.36)", padding: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 42% 34%, rgba(216,180,254,0.24), transparent 42%)" }} />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "410px 1fr", gap: 34, alignItems: "center" }}>
          <CaptureArcaneScore score={result.overall.score} color={ov.color} label={ov.label} stars={stars} />
          <div>
            <span style={{ fontSize: 22, fontWeight: 950, letterSpacing: 5, color: "#c4b5fd" }}>MAGIC SCORE MATRIX</span>
            <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 16 }}>
              <span style={{ fontSize: 112, fontWeight: 950, lineHeight: 0.9, color: ov.color }}>{result.overall.score.toFixed(1)}</span>
              <span style={{ fontSize: 32, fontWeight: 850, color: "rgba(255,255,255,0.38)" }}>/ 5.0</span>
            </div>
            <span style={{ display: "inline-block", marginTop: 16, borderRadius: 999, padding: "11px 20px", background: `${ov.color}22`, border: `2px solid ${ov.color}55`, fontSize: 28, fontWeight: 950, color: ov.color }}>{ov.label}</span>
            <p style={{ fontSize: 25, lineHeight: 1.62, color: "rgba(255,255,255,0.86)", marginTop: 20, marginBottom: 0 }}>
              {overallText}
            </p>
          </div>
        </div>
      </div>

      {/* insight cards */}
      <div style={{ marginTop: 22, display: "flex", gap: 18 }}>
        {strongest && (
          <MiniInsight label="今日の強み" title={strongest.label} value={strongest.score.toFixed(1)} color={LEVEL[strongest.band].color} />
        )}
        {focus && (
          <MiniInsight label="整えるポイント" title={focus.label} value={focus.score.toFixed(1)} color={LEVEL[focus.band].color} />
        )}
      </div>

      {/* categories */}
      <div style={{ marginTop: 24, border: "1px solid rgba(255,255,255,0.13)", borderRadius: 32, background: "rgba(255,255,255,0.07)", padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 25, fontWeight: 950 }}>6 Signals</span>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: 4, color: "rgba(255,255,255,0.42)" }}>SCORE / 5.0</span>
        </div>
        {result.categories.map((c) => {
          const lv = LEVEL[c.band];
          return (
            <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ width: 210, fontSize: 23, fontWeight: 850 }}>{c.label}</span>
              <div style={{ flex: 1, height: 16, background: "rgba(255,255,255,0.12)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${(c.score / 5) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${lv.color}, rgba(255,255,255,0.82))`, borderRadius: 999 }} />
              </div>
              <span style={{ width: 74, fontSize: 25, fontWeight: 950, color: lv.color, textAlign: "right" }}>
                {c.score.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 34, height: 34, borderRadius: 999, background: result.lucky.color.hex, border: "3px solid rgba(255,255,255,0.4)" }} />
            <span style={{ fontSize: 24 }}>{result.lucky.color.name}</span>
          </div>
          <span style={{ fontSize: 24, color: "rgba(255,255,255,0.7)" }}>
            ラッキーナンバー <b style={{ color: "#c4b5fd", fontSize: 30 }}>{result.lucky.number}</b>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#ffffff", padding: 12, borderRadius: 16 }}>
            <QRCodeSVG value={shareUrl} size={132} level="M" />
          </div>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.6)" }}>each-spirit.com/fortune</span>
        </div>
      </div>
    </div>
  );
});

function CaptureArcaneScore({ score, color, label, stars }: { score: number; color: string; label: string; stars: number }) {
  const progress = Math.max(0, Math.min(100, (score / 5) * 100));
  const signs = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

  return (
    <div style={{ position: "relative", width: 390, height: 390 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: `conic-gradient(from -42deg, ${color} ${progress}%, rgba(255,255,255,0.09) 0)`, filter: `drop-shadow(0 0 30px ${color}70)` }} />
      <div style={{ position: "absolute", inset: 26, borderRadius: 999, border: "1px solid rgba(255,255,255,0.32)", background: "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.3) 0deg 1deg, transparent 1deg 15deg), radial-gradient(circle, transparent 57%, rgba(255,255,255,0.16) 58%, transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 64, borderRadius: 999, border: "1px solid rgba(216,180,254,0.3)", background: "repeating-conic-gradient(from 10deg, rgba(216,180,254,0.24) 0deg 2deg, transparent 2deg 30deg)" }} />
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 42, width: 306, height: 306, color: "rgba(255,255,255,0.66)" }}>
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
      {signs.map((sign, index) => {
        const rad = ((index * 30 - 90) * Math.PI) / 180;
        const x = 195 + Math.cos(rad) * 166;
        const y = 195 + Math.sin(rad) * 166;
        return (
          <span key={sign} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", fontSize: 22, fontWeight: 900, color: "rgba(237,233,254,0.62)" }}>
            {sign}
          </span>
        );
      })}
      <div style={{ position: "absolute", inset: 108, borderRadius: 999, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(15,23,42,0.72)", boxShadow: "inset 0 0 52px rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 950, letterSpacing: 4, color: "rgba(255,255,255,0.42)" }}>OVERALL</span>
        <span style={{ marginTop: 8, fontSize: 64, fontWeight: 950, lineHeight: 1, color }}>{score.toFixed(1)}</span>
        <span style={{ marginTop: 8, fontSize: 19, fontWeight: 950, color }}>{label}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 36, display: "flex", justifyContent: "center", gap: 5 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ fontSize: 26, color: i < stars ? color : "rgba(255,255,255,0.18)" }}>★</span>
        ))}
      </div>
    </div>
  );
}

function MiniInsight({ label, title, value, color }: { label: string; title: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.13)", borderRadius: 28, background: "rgba(255,255,255,0.075)", padding: 22 }}>
      <div style={{ fontSize: 15, fontWeight: 950, letterSpacing: 4, color: "rgba(255,255,255,0.46)" }}>{label.toUpperCase()}</div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 18 }}>
        <span style={{ fontSize: 25, fontWeight: 950 }}>{title}</span>
        <span style={{ fontSize: 44, fontWeight: 950, lineHeight: 1, color }}>{value}</span>
      </div>
    </div>
  );
}
