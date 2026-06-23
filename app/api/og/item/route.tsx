import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getGenericItemBySection } from "@/lib/content";
import { isItemClass, type ItemClass } from "@/lib/content-models";

export const runtime = "nodejs";

const W = 1200, H = 630;

const fontOptions = {
  sans: {
    name: "Noto Sans JP",
    file: "noto-sans-jp-700.woff",
    weight: 700,
  },
  mincho: {
    name: "Yu Mincho",
    file: "yu-mincho.ttf",
    weight: 400,
  },
  "mincho-db": {
    name: "Yu Mincho Demibold",
    file: "yu-mincho-demibold.ttf",
    weight: 600,
  },
} as const;

type OgFontKey = keyof typeof fontOptions;

function ogFontKey(value: string | null): OgFontKey {
  if (value === "sans" || value === "mincho") return value;
  return "mincho-db";
}

/** 日本語フォント。Satori は ttf/otf/woff 対応（woff2 不可）。 */
function loadJaFont(key: OgFontKey): Promise<Buffer> {
  return readFile(path.join(process.cwd(), "assets", "fonts", fontOptions[key].file));
}

async function bgDataUri(itemClass: ItemClass): Promise<string | null> {
  for (const cls of [itemClass, "other" as ItemClass]) {
    try {
      const buf = await readFile(path.join(process.cwd(), "public", "og", `${cls}-class.jpg`));
      return `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`;
    } catch {
      // 次のフォールバックへ
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const major = sp.get("major") ?? "";
  const section = sp.get("section") ?? "";
  const slug = sp.get("slug") ?? "";
  const fontKey = ogFontKey(sp.get("font"));
  const fontOption = fontOptions[fontKey];

  const item = major && section && slug ? await getGenericItemBySection(major, section, slug) : undefined;
  const rawName = item?.name ?? "Each Spirit";
  const chars = Array.from(rawName);
  const name = chars.length > 56 ? chars.slice(0, 55).join("") + "…" : rawName;
  const fontSize = chars.length > 44 ? 50 : chars.length > 32 ? 58 : chars.length > 22 ? 64 : 72;
  const titleWidth = chars.length > 32 ? 1080 : 1060;
  const parenIndex = chars.length > 32 ? name.indexOf("（") : -1;
  const titleLines = parenIndex > 0 ? [name.slice(0, parenIndex).trim(), name.slice(parenIndex)] : [name];
  const itemClass: ItemClass = isItemClass(item?.itemClass) ? (item!.itemClass as ItemClass) : "other";

  const [bg, font] = await Promise.all([bgDataUri(itemClass), loadJaFont(fontKey)]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#0f172a" }}>
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} width={W} height={H} alt="" style={{ position: "absolute", top: 0, left: 0, width: W, height: H, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute", left: "45%", top: "54%", transform: "translate(-50%, -50%)",
            display: "flex", maxWidth: titleWidth, textAlign: "center", alignItems: "center",
            fontFamily: fontOption.name, fontSize, fontWeight: fontOption.weight, lineHeight: 1.22, color: "#ffffff",
            textShadow: "0 3px 16px rgba(0,0,0,0.82), 0 1px 2px rgba(0,0,0,0.9)", letterSpacing: 0,
            flexDirection: "column",
          }}
        >
          {titleLines.map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                padding: "2px 24px 8px",
                justifyContent: "center",
                alignSelf: "center",
                backgroundColor: "rgba(2, 6, 23, 0.54)",
                borderRadius: 8,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [{ name: fontOption.name, data: font, weight: fontOption.weight, style: "normal" }],
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400",
      },
    },
  );
}
