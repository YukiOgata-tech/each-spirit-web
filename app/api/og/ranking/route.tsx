import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

// ランキングのサムネ/OG画像を「表彰台の背景＋タイトル」で動的生成する。
// 画像未設定のランキングに対し、一覧カード・詳細ヒーロー・OG画像のフォールバックで使う。
// 記事の /api/og/article と同じ方針（satori/resvg は webp 非対応なので背景は jpg）。

export const runtime = "nodejs";

const W = 1200,
  H = 630;

/** タイトル文字数に応じたフォントサイズ（白地に収まるよう調整） */
function fontSizeFor(len: number): number {
  if (len > 40) return 44;
  if (len > 28) return 50;
  if (len > 18) return 58;
  return 66;
}

function loadFont(): Promise<Buffer> {
  return readFile(path.join(process.cwd(), "assets", "fonts", "noto-sans-jp-700.woff"));
}

async function bgDataUri(): Promise<string | null> {
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "images", "rankings", "thumbnail-og.jpg"));
    return `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const rawTitle = (req.nextUrl.searchParams.get("title") ?? "Each Spirit").trim() || "Each Spirit";
  const chars = Array.from(rawTitle);
  const title = chars.length > 54 ? chars.slice(0, 53).join("") + "…" : rawTitle;
  const fontSize = fontSizeFor(chars.length);

  const [bg, font] = await Promise.all([bgDataUri(), loadFont()]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#eef2f9" }}>
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} width={W} height={H} alt="" style={{ position: "absolute", top: 0, left: 0, width: W, height: H, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute",
            left: 180,
            top: 130,
            width: 840,
            height: 250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              textAlign: "center",
              maxWidth: 760,
              fontFamily: "Noto Sans JP",
              fontSize,
              fontWeight: 700,
              lineHeight: 1.32,
              color: "#22314f",
              letterSpacing: 0,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [{ name: "Noto Sans JP", data: font, weight: 700, style: "normal" }],
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400",
      },
    },
  );
}
