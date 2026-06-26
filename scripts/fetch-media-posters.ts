/**
 * entertainment（anime / drama）の item ポスター画像を、無料で利用できるメタデータ提供元から取得して
 * es.items.image（{ url, alt, credit }）に投入するワンショットツール。
 *
 *   anime → AniList（APIキー不要・無料）             … CDN: s4.anilist.co
 *   drama → theTVDB（無料枠・APIキー必須）            … CDN: artworks.thetvdb.com
 *           取れなければ Wikidata/Wikimedia Commons   … CDN: commons.wikimedia.org
 *
 * いずれも帰属表示つきで利用（credit に出典名・URLを格納）。公式サイトの直リンクはしない。
 *
 * 準備（.env.local）:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *   THETVDB_API_KEY=...         # drama を対象にする場合に必要（https://thetvdb.com/dashboard/account/apikey で無料取得）
 *   THETVDB_PIN=...             # user-supported（無料サブスク）キーの場合のみ。プロジェクトキーなら不要
 *
 * 実行:
 *   npx tsx --tsconfig scripts/tsconfig.json scripts/fetch-media-posters.ts            # dry-run（全 anime/drama、既定）
 *   npx tsx --tsconfig scripts/tsconfig.json scripts/fetch-media-posters.ts --section drama
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
const tvdbKey = process.env.THETVDB_API_KEY;
const tvdbPin = process.env.THETVDB_PIN;

// Wikidata はリクエストに説明的な User-Agent を求める。
const UA = "each-spirit-poster-fetch/1.0 (https://each-spirit.com)";

const es = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws as unknown as typeof WebSocket },
}).schema("es");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ItemRow = { id: string; slug: string; name: string; section_slug: string; image: Record<string, unknown> };
type Poster = { url: string; matchedTitle: string; year?: number; country?: string; credit: { name: string; url: string } };

/** 検索クエリ候補（日本語名 → 括弧等を除去、slug をスペース区切りにした保険）。 */
function queryVariants(name: string, slug: string): string[] {
  const cleaned = name.replace(/[【】「」『』（）()[\]]/g, " ").replace(/\s+/g, " ").trim();
  const fromSlug = slug.replace(/-/g, " ").trim();
  return Array.from(new Set([cleaned, name, fromSlug].filter(Boolean)));
}

/** タイトル比較用の正規化（全半角・記号・空白差を吸収）。 */
function norm(s: string): string {
  return (s || "").normalize("NFKC").replace(/[\s　【】「」『』（）()[\]〜~・,.、。!！?？:：;\-—―/]/g, "").toLowerCase();
}

/** 末尾の (YYYY) / （YYYY） から制作年を取り出す（一覧名に付与されている前提）。 */
function yearFromName(name: string): number | undefined {
  const m = name.match(/[(（]\s*(\d{4})\s*[)）]\s*$/);
  return m ? Number(m[1]) : undefined;
}

/** drama 検索クエリ候補。年号を除き、長い副題は先頭部も試す。 */
function dramaQueries(name: string, slug: string): string[] {
  const noYear = name.replace(/[(（]\s*\d{4}\s*[)）]\s*$/, "").trim();
  const cleaned = noYear.replace(/[【】「」『』（）()[\]]/g, " ").replace(/\s+/g, " ").trim();
  const head = cleaned.split(/[〜~―—]/)[0].trim();
  const fromSlug = slug.replace(/-/g, " ").trim();
  return Array.from(new Set([cleaned, head, fromSlug].filter((x) => x && x.length >= 2)));
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

// ── theTVDB（drama）────────────────────────────────────────────────
// v4 API。apikey（＋ user-supported キーなら pin）でログインしてトークンを得る。
let tvdbToken: string | null = null;
let tvdbLoginFailed = false;
async function tvdbLogin(): Promise<string | null> {
  if (tvdbToken) return tvdbToken;
  if (tvdbLoginFailed || !tvdbKey) return null;
  try {
    const res = await fetch("https://api4.thetvdb.com/v4/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(tvdbPin ? { apikey: tvdbKey, pin: tvdbPin } : { apikey: tvdbKey }),
    });
    const json = await res.json();
    tvdbToken = json?.data?.token ?? null;
    if (!tvdbToken) {
      tvdbLoginFailed = true;
      console.warn(`⚠ theTVDB ログイン失敗（${res.status}）: ${json?.message ?? "token なし"}`);
    }
    return tvdbToken;
  } catch (e) {
    tvdbLoginFailed = true;
    console.warn("⚠ theTVDB ログイン例外:", e instanceof Error ? e.message : e);
    return null;
  }
}

// 日本のドラマ一覧に対して theTVDB を検索し、誤マッチ（同名の海外作品・プレースホルダー画像）を排除して
// 最も確からしい1件を選ぶ。採用条件は「日本作品（country=jpn か lang=jpn）かつタイトル一致」。
// 制作年は採否ではなくスコア加点に使う（年だけ一致の別作品を拾わないため）。
async function fetchTheTvdb(name: string, slug: string): Promise<Poster | null> {
  const token = await tvdbLogin();
  if (!token) return null;
  const wantYear = yearFromName(name);
  const target = norm(name.replace(/[(（]\s*\d{4}\s*[)）]\s*$/, ""));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seen = new Set<string>();
  const candidates: { r: any; score: number }[] = [];
  for (const q of dramaQueries(name, slug)) {
    try {
      const u = `https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(q)}&type=series&limit=8`;
      const res = await fetch(u, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      const json = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any[] = Array.isArray(json?.data) ? json.data : [];
      results.forEach((r, idx) => {
        const id = String(r?.tvdb_id ?? r?.id ?? "");
        if (id && seen.has(id)) return;
        if (id) seen.add(id);
        const img = typeof r?.image_url === "string" ? r.image_url : "";
        if (!img || img.includes("missing/series")) return;
        const isJp = r?.country === "jpn" || r?.primary_language === "jpn";
        if (!isJp) return;
        const titles = [r?.translations?.jpn, r?.name].filter(Boolean).map((t: string) => norm(t));
        const titleExact = titles.some((t: string) => t === target && t.length >= 2);
        const titleIncl = titles.some((t: string) => t.length >= 3 && target.length >= 3 && (t.includes(target) || target.includes(t)));
        if (!titleExact && !titleIncl) return; // タイトル根拠なしは不採用（誤マッチ防止）
        const yr = r?.year ? Number(r.year) : undefined;
        const yearOk = !!(wantYear && yr && Math.abs(yr - wantYear) <= 1);
        let score = titleExact ? 5 : 3;
        if (yearOk) score += 3;
        score += Math.max(0, 2 - idx * 0.25); // 検索上位を優先
        candidates.push({ r, score });
      });
    } catch { /* 次の候補へ */ }
    await sleep(250);
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.score - a.score);
  const r = candidates[0].r;
  return {
    url: r.image_url,
    matchedTitle: r.translations?.jpn || r.name || r.extended_title || "",
    year: r.year ? Number(r.year) : undefined,
    country: r.country,
    credit: { name: "TheTVDB", url: r.slug ? `https://thetvdb.com/series/${r.slug}` : "https://thetvdb.com" },
  };
}

// ── Wikidata / Wikimedia Commons（drama フォールバック）──────────────
// P31（分類）が TV シリーズ系、または P449（放送局）を持つ entity の P18（画像）だけを採用し、
// 自由ライセンスの Commons ファイルのみを使う。ポスターは著作物のため Commons には少なく、取りこぼし前提。
const TV_SERIES_QIDS = new Set([
  "Q5398426", // television series
  "Q1259759", // miniseries
  "Q63952888", // anime television series
  "Q506240", // television film
  "Q21191270", // television series season（保険）
  "Q1366112", // Japanese television drama
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function wikidataEntity(id: string): Promise<any | null> {
  try {
    const u = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&props=claims&format=json`;
    const res = await fetch(u, { headers: { "User-Agent": UA, Accept: "application/json" } });
    const json = await res.json();
    return json?.entities?.[id]?.claims ?? null;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTvSeries(claims: any): boolean {
  if (claims?.P449?.length) return true; // 放送局（original broadcaster）を持つ＝TV作品の強い指標
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p31: any[] = claims?.P31 ?? [];
  return p31.some((c) => TV_SERIES_QIDS.has(c?.mainsnak?.datavalue?.value?.id));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function p18Filename(claims: any): string | null {
  const v = claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  return typeof v === "string" && v ? v : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wikidataYear(claims: any): number | undefined {
  // P577 publication date → P580 start time の順で拾う。
  const t = claims?.P577?.[0]?.mainsnak?.datavalue?.value?.time
    ?? claims?.P580?.[0]?.mainsnak?.datavalue?.value?.time;
  if (typeof t === "string") {
    const y = Number(t.slice(1, 5));
    if (Number.isFinite(y) && y > 0) return y;
  }
  return undefined;
}

async function fetchWikidata(name: string, slug: string): Promise<Poster | null> {
  for (const q of queryVariants(name, slug)) {
    try {
      const su = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=ja&uselang=ja&type=item&limit=5&format=json`;
      const sres = await fetch(su, { headers: { "User-Agent": UA, Accept: "application/json" } });
      const sjson = await sres.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const candidates: any[] = Array.isArray(sjson?.search) ? sjson.search : [];
      for (const c of candidates) {
        const claims = await wikidataEntity(c.id);
        if (!claims || !isTvSeries(claims)) continue;
        const file = p18Filename(claims);
        if (!file) continue;
        return {
          url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=600`,
          matchedTitle: c.label || name,
          year: wikidataYear(claims),
          credit: { name: "Wikimedia Commons", url: `https://www.wikidata.org/wiki/${c.id}` },
        };
      }
    } catch { /* 次の候補へ */ }
    await sleep(200);
  }
  return null;
}

async function fetchDrama(name: string, slug: string): Promise<Poster | null> {
  return (await fetchTheTvdb(name, slug)) ?? (await fetchWikidata(name, slug));
}

async function main() {
  console.log(`mode: ${APPLY ? "APPLY (DBへ書き込み)" : "DRY-RUN（提案のみ）"} / sections: ${SECTIONS.join(",")} / 対象: ${INCLUDE_WITH_IMAGE ? "全件" : "画像未設定のみ"}`);
  if (SECTIONS.includes("drama") && !tvdbKey) {
    console.warn("⚠ THETVDB_API_KEY 未設定のため drama は Wikidata/Commons のみで処理します（取りこぼしが増えます）。");
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
        ? await fetchDrama(it.name, it.slug)
        : null;

    if (!poster) {
      unmatched++;
      console.log(`  ✗ [${it.section_slug}] ${it.name}  → 一致なし`);
      continue;
    }
    matched++;
    const yr = poster.year ? `(${poster.year})` : "";
    const ctry = poster.country ? `/${poster.country}` : "";
    console.log(`  ✓ [${it.section_slug}] ${it.name}  → ${poster.matchedTitle}${yr} [${poster.credit.name}${ctry}]\n      ${poster.url}`);

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
