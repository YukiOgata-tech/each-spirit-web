import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/admin";

// アップロード可能なバケット（public・画像専用）。コンテンツ画像は each-spirit-images が正。
const ALLOWED_BUCKETS = new Set(["each-spirit-images", "article-assets"]);
const maxBytes = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/**
 * パス正規化: バックスラッシュ→スラッシュ、連続スラッシュを1つに圧縮、前後/先頭/末尾の
 * スラッシュ除去。「// と二重に書いても吸収する」ための処理。MD 側に書かれる URL と
 * 食い違わないよう、ここで一意な形に整える。
 */
function normalizePath(input: string): string {
  return input
    .trim()
    .replace(/\\/g, "/")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+|\/+$/g, "");
}

/** パストラバーサル・不正文字・拡張子なしを拒否（大文字小文字は変えず厳密一致を保つ） */
function isSafePath(path: string): boolean {
  if (!path || path.length > 300) return false;
  if (/[^A-Za-z0-9._/-]/.test(path)) return false; // 許可: 英数字 . _ - /
  if (path.split("/").some((seg) => seg === "" || seg === "." || seg === "..")) return false;
  if (!/\.[A-Za-z0-9]+$/.test(path)) return false; // 拡張子必須
  return true;
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();

    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = String(formData.get("bucket") ?? "");
    const rawPath = String(formData.get("path") ?? "");
    const upsert = String(formData.get("upsert") ?? "") === "true";

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ ok: false, message: "bucket が不正です" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "file is required" }, { status: 400 });
    }
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ ok: false, message: "対応していない画像形式です（jpeg/png/webp/gif）" }, { status: 400 });
    }
    if (file.size > maxBytes) {
      return NextResponse.json({ ok: false, message: "ファイルが大きすぎます（上限5MB）" }, { status: 400 });
    }

    const path = normalizePath(rawPath);
    if (!isSafePath(path)) {
      return NextResponse.json(
        { ok: false, message: "path が不正です（使用可: 英数字 . _ - / 、拡張子必須、.. や先頭/ は不可）" },
        { status: 400 },
      );
    }

    const service = createServerClient();
    const bytes = await file.arrayBuffer();
    const { error } = await service.storage.from(bucket).upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert,
    });
    if (error) {
      // upsert=false で既存があると 409。分かりやすいメッセージに。
      const message = /exists|duplicate/i.test(error.message)
        ? "同じパスに既にファイルがあります（上書きするには上書きを有効にしてください）"
        : error.message;
      return NextResponse.json({ ok: false, message }, { status: 409 });
    }

    const { data } = service.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ ok: true, bucket, path, publicUrl: data.publicUrl });
  } catch {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
}
