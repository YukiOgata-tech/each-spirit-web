/**
 * entertainment（anime / drama）の item ポスター画像を、許諾の明確な無料メタデータAPIから取得して
 * es.items.image（{ url, alt, credit }）に投入するワンショットツール。
 *
 *   anime → AniList（APIキー不要・無料） … CDN: s4.anilist.co
 *   drama → TMDB（無料・APIキー必須）     … CDN: image.tmdb.org
 *
 * いずれも帰属表示つきで利用（credit に出典名・URLを格納）。公式サイトの直リンクはしない。
 *
 * 準備（.env.local）:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *   TMDB_API_KEY=...            # drama を対象にする場合のみ必須（https://www.themoviedb.org/ で無料取得）
 *
 * 実行:
 *   npx tsx --tsconfig scripts/tsconfig.json scripts/fetch-media-posters.ts            # dry-run（全 anime/drama、既定）
 *   npx tsx --tsconfig scripts/tsconfig.json scripts/fetch-media-posters.ts --section anime
 *   npx tsx --tsconfig scripts/tsconfig.json scripts/fetch-media-posters.ts --apply    # DB へ書き込み
 *   ... --all      # 既に画像がある item も対象（既定は image 未設定のみ）
 *
 * 既定は dry-run（提案を表示するだけ）。マッチ結果を目視確認してから --apply を付けて反映する。
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const APPLY = process.argv.includes("--apply");
const INCLUDE_WITH_IMAGE = process.argv.includes("--all");
const sectionArg = (() => {
  const i = process.argv.indexOf("--section");
  return i >= 0 ? process.argv[i + 1] : undefined;
})();
const SECTIONS = sectionArg ? [sectionArg] : ["anime", "drama"];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。");
  process.exit(1);
}
const tmdbKey = process.env.TMDB_API_KEY;

const es = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws as unknown as typeof WebSocket },
}).schema("es");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ItemRow = { id: string; slug: string; name: string; section_slug: string; image: Record<string, unknown> };
type Poster = { url: string; matchedTitle: string; year?: number; credit: { name: string; url: string } };

/** 検索クエリ候補（日本語名 → 括弧等を除去、slug をスペース区切りにした保険）。 */
function queryVariants(name: string, slug: string): string[] {
  const cleaned = name.replace(/[【】「」『』（）()[\]]/g, " ").replace(/\s+/g, " ").trim();
  const fromSlug = slug.replace(/-/g, " ").trim();
  return Array.from(new Set([cleaned, name, fromSlug].filter(Boolean)));
}

// ── AniList（anime）────────────────────────────────────────────────
const ANILIST_QUERY = `
query ($q: String) {
  Media(search: $q, type: ANIME, sort: SEARCH_MATCH) {
    id
    title { romaji native english }
    startDate { year }
    coverImage { extraLarge large }
  }
}`;

// AniList はレート制限が厳しめ（現状~30req/分程度に絞られることがある）。
// 全リクエストを最小間隔で間引き、429 は Retry-After に従って同一クエリを再試行する。
let lastAniAt = 0;
const ANI_MIN_GAP = 1600;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function anilistRequest(q: string): Promise<any | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const wait = ANI_MIN_GAP - (Date.now() - lastAniAt);
    if (wait > 0) await sleep(wait);
    lastAniAt = Date.now();
    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: ANILIST_QUERY, variables: { q } }),
      });
      if (res.status === 429) {
        const ra = Number(res.headers.get("retry-after")) || 5;
        console.warn(`      (429: ${ra}s 待機して再試行)`);
        await sleep((ra + 1) * 1000);
        continue;
      }
      return await res.json();
    } catch {
      await sleep(1000);
    }
  }
  return null;
}

async function fetchAniList(name: string, slug: string): Promise<Poster | null> {
  for (const q of queryVariants(name, slug)) {
    const json = await anilistRequest(q);
    const m = json?.data?.Media;
    const img = m?.coverImage?.extraLarge ?? m?.coverImage?.large;
    if (m && img) {
      const matchedTitle = m.title?.native || m.title?.romaji || m.title?.english || "";
      return { url: img, matchedTitle, year: m.startDate?.year ?? undefined, credit: { name: "AniList", url: `https://anilist.co/anime/${m.id}` } };
    }
  }
  return null;
}

// ── TMDB（drama）───────────────────────────────────────────────────
async function fetchTmdb(name: string, slug: string): Promise<Poster | null> {
  if (!tmdbKey) return null;
  for (const [i, q] of queryVariants(name, slug).entries()) {
    try {
      const lang = i === 0 ? "ja-JP" : "en-US";
      const u = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbKey}&language=${lang}&include_adult=false&query=${encodeURIComponent(q)}`;
      const res = await fetch(u);
      const json = await res.json();
      const r = json?.results?.[0];
      if (r?.poster_path) {
        return {
          url: `https://image.tmdb.org/t/p/w500${r.poster_path}`,
          matchedTitle: r.name || r.original_name || "",
          year: r.first_air_date ? Number(String(r.first_air_date).slice(0, 4)) : undefined,
          credit: { name: "TMDB", url: `https://www.themoviedb.org/tv/${r.id}` },
        };
      }
    } catch { /* 次の候補へ */ }
    await sleep(250);
  }
  return null;
}

async function main() {
  console.log(`mode: ${APPLY ? "APPLY (DBへ書き込み)" : "DRY-RUN（提案のみ）"} / sections: ${SECTIONS.join(",")} / 対象: ${INCLUDE_WITH_IMAGE ? "全件" : "画像未設定のみ"}`);
  if (SECTIONS.includes("drama") && !tmdbKey) {
    console.warn("⚠ TMDB_API_KEY 未設定のため drama はスキップします（anime は処理します）。");
  }

  const { data, error } = await es
    .from("items")
    .select("id, slug, name, section_slug, image")
    .eq("major_category", "entertainment")
    .in("section_slug", SECTIONS);
  if (error) { console.error("❌ items 取得失敗:", error.message); process.exit(1); }

  const items = (data as ItemRow[]).filter((it) => INCLUDE_WITH_IMAGE || !(it.image && typeof it.image.url === "string" && it.image.url));
  console.log(`対象 item: ${items.length} 件\n`);

  let matched = 0, unmatched = 0, applied = 0;
  for (const it of items) {
    const poster = it.section_slug === "anime"
      ? await fetchAniList(it.name, it.slug)
      : it.section_slug === "drama"
        ? await fetchTmdb(it.name, it.slug)
        : null;

    if (!poster) {
      unmatched++;
      console.log(`  ✗ [${it.section_slug}] ${it.name}  → 一致なし`);
      continue;
    }
    matched++;
    const yr = poster.year ? `(${poster.year})` : "";
    console.log(`  ✓ [${it.section_slug}] ${it.name}  → ${poster.matchedTitle}${yr} [${poster.credit.name}]\n      ${poster.url}`);

    if (APPLY) {
      const image = { url: poster.url, alt: `${it.name} ポスター`, credit: poster.credit };
      const { error: upErr } = await es.from("items").update({ image }).eq("id", it.id);
      if (upErr) console.error(`      ⚠ 更新失敗: ${upErr.message}`);
      else applied++;
    }
  }

  console.log(`\n--- 完了 --- 一致: ${matched} / 不一致: ${unmatched}${APPLY ? ` / 書き込み: ${applied}` : "（dry-run）"}`);
  if (!APPLY && matched > 0) console.log("提案を確認後、--apply を付けて再実行すると反映されます。");
}

main().catch((e) => { console.error(e); process.exit(1); });
