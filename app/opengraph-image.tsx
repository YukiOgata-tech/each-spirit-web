import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f7f5ef",
          color: "#101827",
          fontFamily: "sans-serif",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "2px solid #dfe5e8",
            borderRadius: 28,
            background: "linear-gradient(135deg,#ffffff 0%,#eef4f1 56%,#fff6ea 100%)",
            padding: 56,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "#1d4f8f",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 800,
                }}
              >
                ES
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 30, fontWeight: 800 }}>{site.name}</div>
                <div style={{ fontSize: 20, color: "#5f6876" }}>{site.tagline}</div>
              </div>
            </div>
            <div style={{ fontSize: 20, color: "#1d4f8f", fontWeight: 800 }}>Comparison / Ranking / Guide</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 68, lineHeight: 1.08, fontWeight: 900, letterSpacing: -1 }}>
              <div>選ぶ前の判断材料を、</div>
              <div>比較と検索で整理する。</div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["ラーメン", "旅行", "ガジェット", "暮らし", "ツール比較"].map((label) => (
                <div
                  key={label}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.78)",
                    border: "1px solid #dfe5e8",
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#5f6876" }}>
            <div>{site.shortDescription}</div>
            <div>{site.domain}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
