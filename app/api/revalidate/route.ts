import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { ES_CONTENT_CACHE_TAG, createUncachedServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RevalidateBody = {
  path?: string;
  scope?: string;
};

/**
 * On-demand ISR 再検証エンドポイント。
 *
 * 認証: `Authorization: Bearer <REVALIDATE_SECRET>` または `?secret=<...>`。
 *
 * 挙動（POST body で分岐）:
 *   - `{"path":"/foo"}`   … そのパスだけ再検証（従来どおりのピンポイント）
 *   - `{"scope":"all"}`   … 全ルート再検証（es-content タグ + layout）。大規模一括更新時のみ。
 *   - `{}`（省略含む）     … ★差分モード★ 前回実行以降に changed_at が動いた
 *                            articles/items/rankings の canonical_path と、影響する
 *                            一覧ページだけを再検証する（iPhone ショートカット等の既定）。
 *
 * 差分モードのポイント:
 *   Next.js は各キャッシュにパスの暗黙タグを自動付与するため、`revalidatePath(具体パス)`
 *   はそのページ配下の Supabase フェッチ（データキャッシュ）も新鮮化する。よって
 *   es-content の全体タグを切らずに「変わったページだけ」を正しく更新できる。
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

  const body = (await request.json().catch(() => null)) as RevalidateBody | null;

  // ── ピンポイント: 指定パスだけ ───────────────────────────────────────────────
  if (body?.path) {
    revalidatePath(body.path);
    return NextResponse.json({ ok: true, mode: "path", revalidated: body.path });
  }

  // ── 全体: 従来の全ルート再検証（明示時のみ） ──────────────────────────────────
  if (body?.scope === "all") {
    const sb = createUncachedServerClient();
    const runAt = new Date().toISOString();

    revalidateTag(ES_CONTENT_CACHE_TAG);
    revalidatePath("/", "layout");

    const stateError = await updateLastRunAt(sb, runAt);
    if (stateError) {
      return NextResponse.json(
        { ok: false, mode: "all", message: "Failed to update revalidation state", error: stateError },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, mode: "all", revalidatedTag: ES_CONTENT_CACHE_TAG, lastRunAt: runAt });
  }

  // ── 差分: 前回以降に changed_at が動いた分だけ ────────────────────────────────
  return revalidateChanged();
}

async function revalidateChanged() {
  const sb = createUncachedServerClient();

  const { data: state, error: stateSelectError } = await sb
    .from("revalidation_state")
    .select("last_run_at")
    .eq("id", 1)
    .maybeSingle();
  if (stateSelectError) {
    return NextResponse.json(
      { ok: false, mode: "changed", message: "Failed to read revalidation state", error: stateSelectError.message },
      { status: 500 },
    );
  }

  const since = state?.last_run_at ?? "1970-01-01T00:00:00Z";
  const runAt = new Date().toISOString();

  const [articleResult, itemResult, rankingResult] = await Promise.all([
    sb.from("articles").select("canonical_path, category, tags, major_category, section_slug").gt("changed_at", since),
    sb.from("items").select("canonical_path, major_category, section_slug").gt("changed_at", since),
    sb.from("rankings").select("canonical_path, major_category, section_slug").gt("changed_at", since),
  ]);

  const readError = articleResult.error ?? itemResult.error ?? rankingResult.error;
  if (readError) {
    return NextResponse.json(
      { ok: false, mode: "changed", since, message: "Failed to read changed content", error: readError.message },
      { status: 500 },
    );
  }

  const articles = articleResult.data;
  const items = itemResult.data;
  const rankings = rankingResult.data;

  const paths = new Set<string>();
  const add = (p?: string | null) => {
    if (p) paths.add(p);
  };

  for (const a of articles ?? []) {
    add(a.canonical_path);
    if (a.category) add(`/articles/${a.category}`);
    for (const tag of (a.tags ?? []) as string[]) add(`/articles/tags/${encodeURIComponent(tag)}`);
    if (a.major_category && a.section_slug) add(`/${a.major_category}/${a.section_slug}`);
    if (a.major_category) add(`/${a.major_category}`);
  }
  if ((articles?.length ?? 0) > 0) {
    add("/articles");
    add("/articles/tags");
  }

  for (const it of items ?? []) {
    add(it.canonical_path);
    if (it.major_category && it.section_slug) add(`/${it.major_category}/${it.section_slug}`);
    if (it.major_category) add(`/${it.major_category}`);
  }

  for (const r of rankings ?? []) {
    add(r.canonical_path);
    if (r.major_category && r.section_slug) {
      add(`/${r.major_category}/${r.section_slug}/rankings`);
      add(`/${r.major_category}/${r.section_slug}`);
    }
    if (r.major_category) add(`/${r.major_category}`);
  }

  const changedCount = (articles?.length ?? 0) + (items?.length ?? 0) + (rankings?.length ?? 0);

  if (changedCount > 0) {
    add("/");
    add("/sitemap.xml");
  }

  for (const p of paths) revalidatePath(p);

  // 次回の差分基準を更新（読み取り開始時刻を採用し、実行中の変更は次回に回す）
  const stateError = await updateLastRunAt(sb, runAt);
  if (stateError) {
    return NextResponse.json(
      { ok: false, mode: "changed", since, message: "Failed to update revalidation state", error: stateError },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "changed",
    since,
    changedCount,
    revalidatedCount: paths.size,
    revalidated: [...paths],
    lastRunAt: runAt,
  });
}

function updateLastRunAt(
  sb: ReturnType<typeof createUncachedServerClient>,
  runAt: string,
) {
  return sb
    .from("revalidation_state")
    .update({ last_run_at: runAt })
    .eq("id", 1)
    .then(({ error }) => error?.message ?? null);
}
