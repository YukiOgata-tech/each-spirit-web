import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR 再検証エンドポイント。
 *
 * 用途: `npm run db:seed` などでコンテンツを更新した直後に叩くと、
 * ISR の時間待ち（revalidate=2592000）を待たずに該当ページを即再生成できる。
 *
 * 認証: `Authorization: Bearer <REVALIDATE_SECRET>` または `?secret=<...>`。
 *       `REVALIDATE_SECRET` を .env.local / Vercel の環境変数に設定すること。
 *
 * 使い方:
 *   # サイト全体を再検証
 *   curl -X POST https://each-spirit.com/api/revalidate \
 *     -H "Authorization: Bearer $REVALIDATE_SECRET"
 *
 *   # 特定パスだけ再検証
 *   curl -X POST https://each-spirit.com/api/revalidate \
 *     -H "Authorization: Bearer $REVALIDATE_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"path":"/ramen/articles/niigata-ramen-first-guide"}'
 */
export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(request.url).searchParams.get("secret") ??
    "";

  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { path?: string } | null;
  const path = body?.path;

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ ok: true, revalidated: path, now: Date.now() });
  }

  // path 未指定: root layout 配下（=コンテンツ全ページ）をまとめて再検証
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: "all", now: Date.now() });
}
