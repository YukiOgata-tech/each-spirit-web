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
  // 固定サイズカードのレイアウト維持のため長文は要約表示
  const overallText =
    result.overall.text.length > 78 ? `${result.overall.text.slice(0, 77)}…` : result.overall.text;

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
        padding: 72,
        boxSizing: "border-box",
        background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #0f172a 100%)",
        color: "#ffffff",
        fontFamily: FONT,
      }}
    >
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: 6, color: "#c4b5fd" }}>EACH SPIRIT</span>
        <span style={{ fontSize: 24, color: "rgba(255,255,255,0.5)" }}>{result.date}</span>
      </div>

      {/* overall */}
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4, color: "#c4b5fd" }}>今日の運勢</span>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize: 52, color: i < stars ? ov.color : "rgba(255,255,255,0.18)" }}>★</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", marginTop: 12 }}>
          <span style={{ fontSize: 130, fontWeight: 900, lineHeight: 1, color: ov.color }}>
            {result.overall.score.toFixed(1)}
          </span>
          <span style={{ fontSize: 40, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}> / 5.0</span>
        </div>
        <span style={{ fontSize: 34, fontWeight: 800, color: ov.color, marginTop: 4 }}>{ov.label}</span>
        <p style={{ fontSize: 26, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", textAlign: "center", marginTop: 20, maxWidth: 820 }}>
          {overallText}
        </p>
      </div>

      {/* categories */}
      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
        {result.categories.map((c) => {
          const lv = LEVEL[c.band];
          return (
            <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ width: 200, fontSize: 24, fontWeight: 700 }}>{c.label}</span>
              <div style={{ flex: 1, height: 16, background: "rgba(255,255,255,0.12)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${(c.score / 5) * 100}%`, height: "100%", background: lv.color, borderRadius: 999 }} />
              </div>
              <span style={{ width: 70, fontSize: 24, fontWeight: 800, color: lv.color, textAlign: "right" }}>
                {c.score.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
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
